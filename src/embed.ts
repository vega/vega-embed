import * as versionCompare from 'compare-versions';
import * as d3 from 'd3-selection';
import * as vegaImport from 'vega';
import * as VegaLite from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';

export const vega = vegaImport;
export const vl = VegaLite;

import { post } from './post';

export type Mode = 'vega' | 'vega-lite';

export interface Loader {
  load: (uri: string, options?: any) => Promise<string>;
  sanitize: (uri: string, options: any) => Promise<{href: string}>;
  http: (uri: string, options: any) => Promise<string>;
  file: (filename: string) => Promise<string>;
}

export interface EmbedOptions {
  actions?: boolean | {export?: boolean, source?: boolean, editor?: boolean};
  mode?: Mode;
  logLevel?: number;
  loader?: Loader;
  renderer?: 'canvas' | 'svg';
  onBeforeParse?: (spec: any) => void;
  width?: number;
  height?: number;
  padding?: number | {left?: number, right?: number, top?: number, bottom?: number};
  config?: string | any;
  sourceHeader?: string;
  sourceFooter?: string;
  editorUrl?: string;
}

const NAMES = {
  'vega':      'Vega',
  'vega-lite': 'Vega-Lite',
};

const VERSION = {
  'vega':      vega.version,
  'vega-lite': vl ? vl.version : 'not available',
};

const PREPROCESSOR = {
  'vega':      vgjson => vgjson,
  'vega-lite': vljson => vl.compile(vljson).spec,
};

/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
export default function embed(el: HTMLBaseElement | string, spec: any, opt: EmbedOptions): Promise<{ view: any; spec: any; }> {
  try {
    opt = opt || {};
    const actions  = opt.actions !== undefined ? opt.actions : true;

    const loader: Loader = opt.loader || vega.loader();
    const renderer = opt.renderer || 'canvas';
    const logLevel = opt.logLevel || vega.Warn;

    // Load the visualization specification.
    if (vega.isString(spec)) {
      return loader.load(spec).then(
        data => embed(el, JSON.parse(data), opt),
      ).catch(Promise.reject);
    }

    // Load Vega theme/configuration.
    const config = opt.config;
    if (vega.isString(config)) {
      return loader.load(config).then(data => {
        opt.config = JSON.parse(data);
        return embed(el, spec, opt);
      }).catch(Promise.reject);
    }

    // Decide mode
    let parsed: {library: string, version: string};
    let mode: Mode;

    if (spec.$schema) {
      parsed = schemaParser(spec.$schema);
      if (opt.mode && opt.mode !== parsed.library) {
        console.warn(`The given visualization spec is written in ${NAMES[parsed.library]}, but mode argument sets ${NAMES[opt.mode]}.`);
      }

      mode = parsed.library as Mode;

      if (versionCompare(parsed.version, VERSION[mode]) > 0) {
        console.warn(`The input spec uses ${mode} ${parsed.version}, but the current version of ${NAMES[mode]} is ${VERSION[mode]}.`);
      }
    } else {
      mode = opt.mode || 'vega';
    }

    let vgSpec = PREPROCESSOR[mode](spec);

    if (mode === 'vega-lite') {
      if (vgSpec.$schema) {
        parsed = schemaParser(vgSpec.$schema);

        if (versionCompare(parsed.version, VERSION.vega) > 0) {
          console.warn(`The compiled spec uses Vega ${parsed.version}, but current version is ${VERSION.vega}.`);
        }
      }
    }

    // ensure container div has class 'vega-embed'
    const div = d3.select(el as any)  // d3.select supports elements and strings
      .classed('vega-embed', true)
      .html(''); // clear container

    if (opt.onBeforeParse) {
      // Allow Vega spec to be modified before being used
      vgSpec = opt.onBeforeParse(vgSpec);
    }

    const runtime = vega.parse(vgSpec, opt.config);  // may throw an Error if parsing fails

    const view = new vega.View(runtime, {loader, logLevel, renderer})
      .initialize(el);

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

    view.run();

    if (actions !== false) {
      // add child div to house action links
      const ctrl = div.append('div')
        .attr('class', 'vega-actions');

      // add 'Export' action
      if (actions === true || actions.export !== false) {
        const ext = renderer === 'canvas' ? 'png' : 'svg';
        ctrl.append('a')
          .text(`Export as ${ext.toUpperCase()}`)
          .attr('href', '#')
          .attr('target', '_blank')
          .attr('download', (spec.name || 'vega') + '.' + ext)
          .on('mousedown', function(this: HTMLLinkElement) {
            view.toImageURL(ext).then(url => {
              this.href =  url;
            }).catch(error => { throw error; });
            d3.event.preventDefault();
          });
      }

      // add 'View Source' action
      if (actions === true || actions.source !== false) {
        ctrl.append('a')
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
        ctrl.append('a')
          .text('Open in Vega Editor')
          .attr('href', '#')
          .on('click', () => {
            post(window, editorUrl, {
              mode,
              spec: JSON.stringify(spec, null, 2),
            });
            d3.event.preventDefault();
          });
      }
    }

    return Promise.resolve({view, spec});
  } catch (err) {
    return Promise.reject(err);
  }
}

function viewSource(source: string, sourceHeader: string, sourceFooter: string) {
  const header = `<html><head>${sourceHeader}</head>' + '<body><pre><code class="json">`;
  const footer = `</code></pre>${sourceFooter}</body></html>`;
  const win = window.open('');
  win.document.write(header + source + footer);
  win.document.title = 'Vega JSON Source';
}
