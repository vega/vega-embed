import * as d3 from 'd3-selection';
import { applyPatch, Operation } from 'fast-json-patch';
import stringify from 'json-stringify-pretty-compact';
import { satisfies } from 'semver';
import * as vegaImport from 'vega';
import { EncodeEntryName, Loader, LoaderOptions, Renderers, Spec as VgSpec, TooltipHandler, View } from 'vega';
import * as vegaLiteImport from 'vega-lite';
import { Config as VlConfig, TopLevelSpec as VlSpec } from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';
import * as themes from 'vega-themes';
import { Handler, Options as TooltipOptions } from 'vega-tooltip';
import { isBoolean, isString, mergeConfig, mergeDeep } from 'vega-util';
import post from './post';
import embedStyle from './style';
import { Config, Mode } from './types';

export * from './types';

export const vega = vegaImport;
export let vegaLite = vegaLiteImport;

// For backwards compatibility with Vega-Lite before v4.
const w = window as any;
if (vegaLite === undefined && w['vl'] && w['vl'].compile) {
  vegaLite = w['vl'];
}

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

export interface EmbedOptions<S = string> {
  actions?: boolean | Actions;
  mode?: Mode;
  theme?: 'excel' | 'ggplot2' | 'quartz' | 'vox' | 'dark';
  defaultStyle?: boolean | string;
  logLevel?: number;
  loader?: Loader | LoaderOptions;
  renderer?: Renderers;
  tooltip?: TooltipHandler | TooltipOptions | boolean;
  patch?: S | PatchFunc | Operation[];
  width?: number;
  height?: number;
  padding?: number | { left?: number; right?: number; top?: number; bottom?: number };
  scaleFactor?: number;
  config?: S | Config;
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
  'vega-lite': vegaLite ? vegaLite.version : 'not available'
};

const PREPROCESSOR: { [mode in Mode]: (spec: any, config?: Config) => VgSpec } = {
  vega: (vgSpec: VgSpec) => vgSpec,
  'vega-lite': (vlSpec, config) => vegaLite.compile(vlSpec as VlSpec, { config: config as VlConfig }).spec
};

const SVG_CIRCLES = `
<svg viewBox="0 0 16 16" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
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
 * @param opts       A JavaScript object containing options for embedding.
 */
export default async function embed(
  el: HTMLElement | string,
  spec: VisualizationSpec | string,
  opts: EmbedOptions = {}
): Promise<Result> {
  const loader: Loader = isLoader(opts.loader) ? opts.loader : vega.loader(opts.loader);

  // load spec, config, and patch that are references by URLs
  const parsedSpec = isString(spec) ? JSON.parse(await loader.load(spec)) : spec;

  const usermetaOpts = await loadOpts(
    (parsedSpec.usermeta && (parsedSpec.usermeta as any)['embedOptions']) || {},
    loader
  );
  const parsedOpts = await loadOpts(opts, loader);

  const mergedOpts = {
    ...mergeDeep(parsedOpts, usermetaOpts),
    config: mergeConfig(parsedOpts.config, usermetaOpts.config)
  };

  return await _embed(el, parsedSpec, mergedOpts, loader);
}

async function loadOpts(opt: EmbedOptions, loader: Loader): Promise<EmbedOptions<never>> {
  const config: Config = isString(opt.config) ? JSON.parse(await loader.load(opt.config)) : opt.config || {};
  const patch: PatchFunc | Operation[] = isString(opt.patch) ? JSON.parse(await loader.load(opt.patch)) : opt.patch;
  return {
    ...(opt as any),
    ...(patch ? { patch } : {}),
    ...(config ? { config } : {})
  };
}

async function _embed(
  el: HTMLElement | string,
  spec: VisualizationSpec,
  opts: EmbedOptions<never> = {},
  loader: Loader
): Promise<Result> {
  const config = opts.theme ? mergeConfig(themes[opts.theme], opts.config) : opts.config;

  const actions = isBoolean(opts.actions)
    ? opts.actions
    : mergeDeep<Actions>(
        { export: { svg: true, png: true }, source: true, compiled: true, editor: true },
        opts.actions || {}
      );
  const i18n = { ...I18N, ...opts.i18n };

  const renderer = opts.renderer || 'canvas';
  const logLevel = opts.logLevel || vega.Warn;
  const downloadFileName = opts.downloadFileName || 'visualization';

  if (opts.defaultStyle !== false) {
    // Add a default stylesheet to the head of the document.
    const ID = 'vega-embed-style';
    if (!document.getElementById(ID)) {
      const style = document.createElement('style');
      style.id = ID;
      style.innerText =
        opts.defaultStyle === undefined || opts.defaultStyle === true
          ? (embedStyle || '').toString()
          : opts.defaultStyle;

      document.head.appendChild(style);
    }
  }

  const mode = guessMode(spec, opts.mode);

  let vgSpec: VgSpec = PREPROCESSOR[mode](spec, config);

  if (mode === 'vega-lite') {
    if (vgSpec.$schema) {
      const parsed = schemaParser(vgSpec.$schema);

      if (!satisfies(VERSION.vega, `^${parsed.version.slice(1)}`)) {
        console.warn(`The compiled spec uses Vega ${parsed.version}, but current version is v${VERSION.vega}.`);
      }
    }
  }

  const div = d3
    .select(el as any) // d3.select supports elements and strings
    .classed('vega-embed', true)
    .classed('has-actions', actions !== false)
    .html(''); // clear container

  const patch = opts.patch;
  if (patch) {
    if (patch instanceof Function) {
      vgSpec = patch(vgSpec);
    } else {
      vgSpec = applyPatch(vgSpec, patch, true, false).newDocument;
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

  if (opts.tooltip !== false) {
    let handler: TooltipHandler;
    if (isTooltipHandler(opts.tooltip)) {
      handler = opts.tooltip;
    } else {
      // user provided boolean true or tooltip options
      handler = new Handler(opts.tooltip === true ? {} : opts.tooltip).call;
    }

    view.tooltip(handler);
  }

  let { hover } = opts;

  if (hover === undefined) {
    hover = mode === 'vega';
  }

  if (hover) {
    const { hoverSet, updateSet } = (typeof hover === 'boolean' ? {} : hover) as Hover;

    view.hover(hoverSet, updateSet);
  }

  if (opts) {
    if (opts.width) {
      view.width(opts.width);
    }
    if (opts.height) {
      view.height(opts.height);
    }
    if (opts.padding) {
      view.padding(opts.padding);
    }
  }

  await view.initialize(el).runAsync();

  if (actions !== false) {
    let wrapper = div;

    if (opts.defaultStyle !== false) {
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
                .toImageURL(ext, opts.scaleFactor)
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
          viewSource(stringify(spec), opts.sourceHeader || '', opts.sourceFooter || '', mode);
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
          viewSource(stringify(vgSpec), opts.sourceHeader || '', opts.sourceFooter || '', 'vega');
          d3.event.preventDefault();
        });
    }

    // add 'Open in Vega Editor' action
    if (actions === true || actions.editor !== false) {
      const editorUrl = opts.editorUrl || 'https://vega.github.io/editor/';
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
