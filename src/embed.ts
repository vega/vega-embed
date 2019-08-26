import * as d3 from 'd3-selection';
import stringify from 'json-stringify-pretty-compact';
import { satisfies } from 'semver';
import * as vegaImport from 'vega';
import { EncodeEntryName, Loader, LoaderOptions, Renderers, Spec as VgSpec, TooltipHandler, View } from 'vega';
import * as vlImport from 'vega-lite';
import { Config as VlConfig, TopLevelSpec as VlSpec } from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';
import * as themes from 'vega-themes';
import { Handler, Options as TooltipOptions } from 'vega-tooltip';
import post from './post';
import embedStyle from './style';
import { Config, Mode } from './types';
import { DeepPartial, mergeDeep } from './util';

export * from './types';

export const vega = vegaImport;
export const vl = vlImport;

export interface Actions {
  export?: boolean | { svg?: boolean; png?: boolean };
  source?: boolean;
  compiled?: boolean;
  editor?: boolean;
}

export interface Hover {
  hoverSet?: EncodeEntryName;
  updateSet?: EncodeEntryName;
}

export type PatchFunc = (spec: VgSpec) => VgSpec;

const I18N = {
  CLICK_TO_VIEW_ACTIONS: 'Click to view actions',
  COMPILED_ACTION: 'View Compiled Vega',
  EDITOR_ACTION: 'Open in Vega Editor',
  PNG_ACTION: 'Save as PNG',
  SOURCE_ACTION: 'View Source',
  SVG_ACTION: 'Save as SVG'
};

export interface EmbedOptions {
  actions?: boolean | Actions;
  mode?: Mode;
  theme?: 'excel' | 'ggplot2' | 'quartz' | 'vox' | 'dark';
  defaultStyle?: boolean | string;
  logLevel?: number;
  loader?: Loader | LoaderOptions;
  renderer?: Renderers;
  tooltip?: TooltipHandler | TooltipOptions | boolean;
  patch?: string | PatchFunc | DeepPartial<VgSpec>;
  onBeforeParse?: PatchFunc; // for backwards compatibility
  width?: number;
  height?: number;
  padding?: number | { left?: number; right?: number; top?: number; bottom?: number };
  scaleFactor?: number;
  config?: string | Config;
  sourceHeader?: string;
  sourceFooter?: string;
  editorUrl?: string;
  hover?: boolean | Hover;
  i18n?: Partial<typeof I18N>;
  downloadFileName?: string;
}

const NAMES: { [key in Mode]: string } = {
  vega: 'Vega',
  'vega-lite': 'Vega-Lite'
};

const VERSION = {
  vega: vega.version,
  'vega-lite': vl ? vl.version : 'not available'
};

const PREPROCESSOR: { [mode in Mode]: (spec: VisualizationSpec, config: Config) => VgSpec } = {
  vega: vgjson => vgjson,
  'vega-lite': (vljson, config) => vl.compile(vljson as VlSpec, { config: config as VlConfig }).spec
};

const SVG_CIRCLES = `
<svg viewBox="0 0 16 16" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
  <circle r="2" cy="8" cx="2"></circle>
  <circle r="2" cy="8" cx="8"></circle>
  <circle r="2" cy="8" cx="14"></circle>
</svg>`;

export type VisualizationSpec = VlSpec | VgSpec;

export interface Result {
  /** The Vega view. */
  view: View;
  /** The inut specification. */
  spec: VisualizationSpec;
  /** The compiled and patched Vega specification. */
  vgSpec: VgSpec;
}

function isTooltipHandler(h?: boolean | TooltipOptions | TooltipHandler): h is TooltipHandler {
  return typeof h === 'function';
}

function viewSource(source: string, sourceHeader: string, sourceFooter: string, mode: Mode) {
  const header = `<html><head>${sourceHeader}</head><body><pre><code class="json">`;
  const footer = `</code></pre>${sourceFooter}</body></html>`;
  const win = window.open('')!;
  win.document.write(header + source + footer);
  win.document.title = `${NAMES[mode]} JSON Source`;
}

/**
 * Try to guess the type of spec.
 *
 * @param spec Vega or Vega-Lite spec.
 */
export function guessMode(spec: VisualizationSpec, providedMode?: Mode): Mode {
  // Decide mode
  if (spec.$schema) {
    const parsed = schemaParser(spec.$schema);
    if (providedMode && providedMode !== parsed.library) {
      console.warn(
        `The given visualization spec is written in ${NAMES[parsed.library]}, but mode argument sets ${NAMES[
          providedMode
        ] || providedMode}.`
      );
    }

    const mode = parsed.library as Mode;

    if (!satisfies(VERSION[mode], `^${parsed.version.slice(1)}`)) {
      console.warn(
        `The input spec uses ${NAMES[mode]} ${parsed.version}, but the current version of ${NAMES[mode]} is v${VERSION[mode]}.`
      );
    }

    return mode;
  }

  // try to guess from the provided spec
  if (
    'mark' in spec ||
    'encoding' in spec ||
    'layer' in spec ||
    'hconcat' in spec ||
    'vconcat' in spec ||
    'facet' in spec ||
    'repeat' in spec
  ) {
    return 'vega-lite';
  }

  if ('marks' in spec || 'signals' in spec || 'scales' in spec || 'axes' in spec) {
    return 'vega';
  }

  return providedMode || 'vega';
}

function isLoader(o?: LoaderOptions | Loader): o is Loader {
  return !!(o && 'load' in o);
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
  spec: VisualizationSpec | string,
  opt: EmbedOptions = {}
): Promise<Result> {
  const loader: Loader = isLoader(opt.loader) ? opt.loader : vega.loader(opt.loader);

  // Load the visualization specification.
  if (vega.isString(spec)) {
    const data = await loader.load(spec);
    return embed(el, JSON.parse(data), opt);
  }

  // eslint-disable-next-line no-param-reassign, dot-notation
  opt = mergeDeep(opt, spec.usermeta && (spec.usermeta as { [key: string]: any })['embedOptions']);

  const patch = opt.patch || opt.onBeforeParse;

  const actions =
    opt.actions === true || opt.actions === false
      ? opt.actions
      : mergeDeep<Actions>(
          {},
          { export: { svg: true, png: true }, source: true, compiled: true, editor: true },
          opt.actions || {}
        );
  const i18n = { ...I18N, ...opt.i18n };

  const renderer = opt.renderer || 'canvas';
  const logLevel = opt.logLevel || vega.Warn;
  const downloadFileName = opt.downloadFileName || 'visualization';

  // Load Vega theme/configuration.
  let config = opt.config || {};
  if (vega.isString(config)) {
    const data = await loader.load(config);
    return embed(el, spec, { ...opt, config: JSON.parse(data) });
  }

  if (opt.defaultStyle !== false) {
    // Add a default stylesheet to the head of the document.
    const ID = 'vega-embed-style';
    if (!document.getElementById(ID)) {
      const style = document.createElement('style');
      style.id = ID;
      style.innerText =
        opt.defaultStyle === undefined || opt.defaultStyle === true ? (embedStyle || '').toString() : opt.defaultStyle;

      document.head.appendChild(style);
    }
  }

  if (opt.theme) {
    config = mergeDeep<Config>({}, themes[opt.theme], config);
  }

  const mode = guessMode(spec, opt.mode);

  let vgSpec: VgSpec = PREPROCESSOR[mode](spec, config);

  if (mode === 'vega-lite') {
    if (vgSpec.$schema) {
      const parsed = schemaParser(vgSpec.$schema);

      if (!satisfies(VERSION.vega, `^${parsed.version.slice(1)}`)) {
        console.warn(`The compiled spec uses Vega ${parsed.version}, but current version is v${VERSION.vega}.`);
      }
    }
  }

  // ensure container div has class 'vega-embed'
  const div = d3
    .select(el as any) // d3.select supports elements and strings
    .classed('vega-embed', true)
    .html(''); // clear container

  if (patch) {
    if (patch instanceof Function) {
      vgSpec = patch(vgSpec);
    } else if (vega.isString(patch)) {
      const patchString = await loader.load(patch);
      // eslint-disable-next-line require-atomic-updates
      vgSpec = mergeDeep({}, vgSpec, JSON.parse(patchString));
    } else {
      vgSpec = mergeDeep({}, vgSpec, patch);
    }
  }

  // Do not apply the config to Vega when we have already applied it to Vega-Lite.
  // This call may throw an Error if parsing fails.
  const runtime = vega.parse(vgSpec, mode === 'vega-lite' ? {} : config);

  const view = new vega.View(runtime, {
    loader,
    logLevel,
    renderer
  });

  if (opt.tooltip !== false) {
    let handler: TooltipHandler;
    if (isTooltipHandler(opt.tooltip)) {
      handler = opt.tooltip;
    } else {
      // user provided boolean true or tooltip options
      handler = new Handler(opt.tooltip === true ? {} : opt.tooltip).call;
    }

    view.tooltip(handler);
  }

  let { hover } = opt;

  if (hover === undefined) {
    hover = mode === 'vega';
  }

  if (hover) {
    const { hoverSet, updateSet } = (typeof hover === 'boolean' ? {} : hover) as Hover;

    view.hover(hoverSet, updateSet);
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

  await view.initialize(el).runAsync();

  if (actions !== false) {
    let wrapper = div;

    if (opt.defaultStyle !== false) {
      const details = div.append('details').attr('title', i18n.CLICK_TO_VIEW_ACTIONS);
      wrapper = details;
      const summary = details.insert('summary');

      summary.html(SVG_CIRCLES);

      const dn = details.node() as HTMLDetailsElement;
      document.addEventListener('click', evt => {
        if (!dn.contains(evt.target as any)) {
          dn.removeAttribute('open');
        }
      });
    }

    const ctrl = wrapper.insert('div').attr('class', 'vega-actions');

    // add 'Export' action
    if (actions === true || actions.export !== false) {
      for (const ext of ['svg', 'png'] as const) {
        if (actions === true || actions.export === true || (actions.export as { svg?: boolean; png?: boolean })[ext]) {
          const i18nExportAction = (i18n as { [key: string]: string })[`${ext.toUpperCase()}_ACTION`];
          ctrl
            .append<HTMLLinkElement>('a')
            .text(i18nExportAction)
            .attr('href', '#')
            .attr('target', '_blank')
            .attr('download', `${downloadFileName}.${ext}`)
            // eslint-disable-next-line func-names
            .on('mousedown', function(this) {
              view
                .toImageURL(ext, opt.scaleFactor)
                .then(url => {
                  this.href = url;
                })
                .catch(error => {
                  throw error;
                });
              d3.event.preventDefault();
            });
        }
      }
    }

    // add 'View Source' action
    if (actions === true || actions.source !== false) {
      ctrl
        .append('a')
        .text(i18n.SOURCE_ACTION)
        .attr('href', '#')
        .on('mousedown', () => {
          viewSource(stringify(spec), opt.sourceHeader || '', opt.sourceFooter || '', mode);
          d3.event.preventDefault();
        });
    }

    // add 'View Compiled' action
    if (mode === 'vega-lite' && (actions === true || actions.compiled !== false)) {
      ctrl
        .append('a')
        .text(i18n.COMPILED_ACTION)
        .attr('href', '#')
        .on('mousedown', () => {
          viewSource(stringify(vgSpec), opt.sourceHeader || '', opt.sourceFooter || '', 'vega');
          d3.event.preventDefault();
        });
    }

    // add 'Open in Vega Editor' action
    if (actions === true || actions.editor !== false) {
      const editorUrl = opt.editorUrl || 'https://vega.github.io/editor/';
      ctrl
        .append('a')
        .text(i18n.EDITOR_ACTION)
        .attr('href', '#')
        .on('mousedown', () => {
          post(window, editorUrl, {
            config: config as Config,
            mode,
            renderer,
            spec: stringify(spec)
          });
          d3.event.preventDefault();
        });
    }
  }

  return { view, spec, vgSpec };
}
