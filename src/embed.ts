import * as versionCompare from 'compare-versions';
import * as d3 from 'd3-selection';
import * as vegaImport from 'vega-lib';
import * as VegaLite from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';

import { Config as VgConfig, Loader, Spec as VgSpec, View } from 'vega-lib';
import { Config as VlConfig, TopLevelSpec as VlSpec } from 'vega-lite';
import { post } from './post';

export const vega = vegaImport;
export const vl = VegaLite;

export type Mode = 'vega' | 'vega-lite';
export type Renderer = 'canvas' | 'svg';
export type Config = VlConfig | VgConfig;

export interface EmbedOptions {
  actions?: boolean | { export?: boolean; source?: boolean; editor?: boolean };
  mode?: Mode;
  logLevel?: number;
  loader?: Loader;
  renderer?: Renderer;
  onBeforeParse?: (spec: VisualizationSpec) => VisualizationSpec;
  width?: number;
  height?: number;
  padding?: number | { left?: number; right?: number; top?: number; bottom?: number };
  config?: string | Config;
  sourceHeader?: string;
  sourceFooter?: string;
  editorUrl?: string;
  runAsync?: boolean;
}

const NAMES = {
  vega: 'Vega',
  'vega-lite': 'Vega-Lite',
};

const VERSION = {
  vega: vega.version,
  'vega-lite': vl ? vl.version : 'not available',
};

const PREPROCESSOR = {
  vega: (vgjson, _) => vgjson,
  'vega-lite': (vljson, config) => vl.compile(vljson, { config }).spec,
};

export type VisualizationSpec = VlSpec | VgSpec;

export interface Result {
  view: View;
  spec: VisualizationSpec;
}

/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
export default async function embed(
  el: HTMLElement | string,
  spec: string | VisualizationSpec,
  opt: EmbedOptions
): Promise<Result> {
  opt = opt || {};
  const actions = opt.actions !== undefined ? opt.actions : true;

  const loader: Loader = opt.loader || vega.loader();
  const renderer = opt.renderer || 'canvas';
  const logLevel = opt.logLevel || vega.Warn;

  // Load the visualization specification.
  if (vega.isString(spec)) {
    const data = await loader.load(spec);
    return embed(el, JSON.parse(data), opt);
  }

  // Load Vega theme/configuration.
  const config = opt.config;
  if (vega.isString(config)) {
    const data = await loader.load(config);
    return embed(el, spec, { ...opt, config: JSON.parse(data) });
  }

  // Decide mode
  let parsed: { library: string; version: string };
  let mode: Mode;

  if (spec.$schema) {
    parsed = schemaParser(spec.$schema);
    if (opt.mode && opt.mode !== parsed.library) {
      console.warn(
        `The given visualization spec is written in ${NAMES[parsed.library]}, but mode argument sets ${
          NAMES[opt.mode]
        }.`
      );
    }

    mode = parsed.library as Mode;

    if (versionCompare(parsed.version, VERSION[mode]) > 0) {
      console.warn(
        `The input spec uses ${mode} ${parsed.version}, but the current version of ${NAMES[mode]} is ${VERSION[mode]}.`
      );
    }
  } else {
    mode = opt.mode || 'vega';
  }

  let vgSpec: VgSpec = PREPROCESSOR[mode](spec, config);

  if (mode === 'vega-lite') {
    if (vgSpec.$schema) {
      parsed = schemaParser(vgSpec.$schema);

      if (versionCompare(parsed.version, VERSION.vega) > 0) {
        console.warn(`The compiled spec uses Vega ${parsed.version}, but current version is ${VERSION.vega}.`);
      }
    }
  }

  // ensure container div has class 'vega-embed'
  const div = d3
    .select(el as any) // d3.select supports elements and strings
    .classed('vega-embed', true)
    .html(''); // clear container

  if (opt.onBeforeParse) {
    // Allow Vega spec to be modified before being used
    vgSpec = opt.onBeforeParse(vgSpec);
  }

  // Do not apply the config to Vega when we have already applied it to Vega-Lite.
  // This call may throw an Error if parsing fails.
  const runtime = vega.parse(vgSpec, mode === 'vega-lite' ? {} : config);

  const view = new vega.View(runtime, {
    loader,
    logLevel,
    renderer,
  }).initialize(el);

  // Vega-Lite does not need hover so we can improve perf by not activating it
  if (mode !== 'vega-lite') {
    view.hover();
  }

  if (opt) {
    if (opt.width) {
      view.width(opt.width);
    }
    if (opt.height) {
      view.height(opt.height);
    }
    if (opt.padding) {
      view.padding(opt.padding);
    }
  }

  if (opt.runAsync) {
    await view.runAsync();
  } else {
    view.run();
  }

  if (actions !== false) {
    // add child div to house action links
    const ctrl = div.append('div').attr('class', 'vega-actions');

    // add 'Export' action
    if (actions === true || actions.export !== false) {
      const ext = renderer === 'canvas' ? 'png' : 'svg';
      ctrl
        .append('a')
        .text(`Export as ${ext.toUpperCase()}`)
        .attr('href', '#')
        .attr('target', '_blank')
        .attr('download', `visualization.${ext}`)
        .on('mousedown', function(this: HTMLLinkElement) {
          view
            .toImageURL(ext)
            .then(url => {
              this.href = url;
            })
            .catch(error => {
              throw error;
            });
          d3.event.preventDefault();
        });
    }

    // add 'View Source' action
    if (actions === true || actions.source !== false) {
      ctrl
        .append('a')
        .text('View Source')
        .attr('href', '#')
        .on('click', () => {
          viewSource(JSON.stringify(spec, null, 2), opt.sourceHeader || '', opt.sourceFooter || '');
          d3.event.preventDefault();
        });
    }

    // add 'Open in Vega Editor' action
    if (actions === true || actions.editor !== false) {
      const editorUrl = opt.editorUrl || 'https://vega.github.io/editor/';
      ctrl
        .append('a')
        .text('Open in Vega Editor')
        .attr('href', '#')
        .on('click', () => {
          post(window, editorUrl, {
            config: config || null,
            mode,
            renderer,
            spec: JSON.stringify(spec, null, 2),
          });
          d3.event.preventDefault();
        });
    }
  }

  return { view, spec };
}

function viewSource(source: string, sourceHeader: string, sourceFooter: string) {
  const header = `<html><head>${sourceHeader}</head><body><pre><code class="json">`;
  const footer = `</code></pre>${sourceFooter}</body></html>`;
  const win = window.open('');
  win.document.write(header + source + footer);
  win.document.title = 'Vega JSON Source';
}
