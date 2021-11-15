import {applyPatch, Operation} from 'fast-json-patch';
import stringify from 'json-stringify-pretty-compact';
// need this import because of https://github.com/npm/node-semver/issues/381
import satisfies from 'semver/functions/satisfies';
import * as vegaImport from 'vega';
import {
  AutoSize,
  Config as VgConfig,
  EncodeEntryName,
  isBoolean,
  isString,
  Loader,
  LoaderOptions,
  mergeConfig,
  Renderers,
  Spec as VgSpec,
  TooltipHandler,
  View,
} from 'vega';
import {expressionInterpreter} from 'vega-interpreter';
import * as vegaLiteImport from 'vega-lite';
import {Config as VlConfig, TopLevelSpec as VlSpec} from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';
import * as themes from 'vega-themes';
import {Handler, Options as TooltipOptions} from 'vega-tooltip';
import post from './post';
import embedStyle from './style';
import {Config, Mode} from './types';
import {mergeDeep} from './util';
import pkg from '../package.json';

export const version = pkg.version;

export * from './types';

export const vega = vegaImport;
export let vegaLite = vegaLiteImport;

// For backwards compatibility with Vega-Lite before v4.
const w = (typeof window !== 'undefined' ? window : undefined) as any;
if (vegaLite === undefined && w?.vl?.compile) {
  vegaLite = w.vl;
}

export interface Actions {
  export?: boolean | {svg?: boolean; png?: boolean};
  source?: boolean;
  compiled?: boolean;
  editor?: boolean;
}

export const DEFAULT_ACTIONS = {export: {svg: true, png: true}, source: true, compiled: true, editor: true};

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
  SVG_ACTION: 'Save as SVG',
};

export interface EmbedOptions<S = string, R = Renderers> {
  bind?: HTMLElement | string;
  actions?: boolean | Actions;
  mode?: Mode;
  theme?: 'excel' | 'ggplot2' | 'quartz' | 'vox' | 'dark';
  defaultStyle?: boolean | string;
  logLevel?: number;
  loader?: Loader | LoaderOptions;
  renderer?: R;
  tooltip?: TooltipHandler | TooltipOptions | boolean;
  patch?: S | PatchFunc | Operation[];
  width?: number;
  height?: number;
  padding?: number | {left?: number; right?: number; top?: number; bottom?: number};
  scaleFactor?: number;
  config?: S | Config;
  sourceHeader?: string;
  sourceFooter?: string;
  editorUrl?: string;
  hover?: boolean | Hover;
  i18n?: Partial<typeof I18N>;
  downloadFileName?: string;
  formatLocale?: Record<string, unknown>;
  timeFormatLocale?: Record<string, unknown>;
  ast?: boolean;
  expr?: typeof expressionInterpreter;
  viewClass?: typeof View;
}

const NAMES: {[key in Mode]: string} = {
  vega: 'Vega',
  'vega-lite': 'Vega-Lite',
};

const VERSION = {
  vega: vega.version,
  'vega-lite': vegaLite ? vegaLite.version : 'not available',
};

const PREPROCESSOR: {[mode in Mode]: (spec: any, config?: Config) => VgSpec} = {
  vega: (vgSpec: VgSpec) => vgSpec,
  'vega-lite': (vlSpec, config) => vegaLite.compile(vlSpec as VlSpec, {config: config as VlConfig}).spec,
};

const SVG_CIRCLES = `
<svg viewBox="0 0 16 16" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <circle r="2" cy="8" cx="2"></circle>
  <circle r="2" cy="8" cx="8"></circle>
  <circle r="2" cy="8" cx="14"></circle>
</svg>`;

const CHART_WRAPPER_CLASS = 'chart-wrapper';

export type VisualizationSpec = VlSpec | VgSpec;

export interface Result {
  /** The Vega view. */
  view: View;

  /** The input specification. */
  spec: VisualizationSpec;

  /** The compiled and patched Vega specification. */
  vgSpec: VgSpec;

  /** Removes references to unwanted behaviors and memory leaks. Calls Vega's `view.finalize`.  */
  finalize: () => void;
}

function isTooltipHandler(h?: boolean | TooltipOptions | TooltipHandler): h is TooltipHandler {
  return typeof h === 'function';
}

function viewSource(source: string, sourceHeader: string, sourceFooter: string, mode: Mode) {
  const header = `<html><head>${sourceHeader}</head><body><pre><code class="json">`;
  const footer = `</code></pre>${sourceFooter}</body></html>`;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        `The given visualization spec is written in ${NAMES[parsed.library]}, but mode argument sets ${
          NAMES[providedMode] ?? providedMode
        }.`
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

  return providedMode ?? 'vega';
}

function isLoader(o?: LoaderOptions | Loader): o is Loader {
  return !!(o && 'load' in o);
}

function createLoader(opts?: Loader | LoaderOptions) {
  return isLoader(opts) ? opts : vega.loader(opts);
}

function embedOptionsFromUsermeta(parsedSpec: VisualizationSpec) {
  return (parsedSpec.usermeta && (parsedSpec.usermeta as any).embedOptions) ?? {};
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
  let parsedSpec: VisualizationSpec;
  let loader: Loader | undefined;

  if (isString(spec)) {
    loader = createLoader(opts.loader);
    parsedSpec = JSON.parse(await loader.load(spec));
  } else {
    parsedSpec = spec;
  }

  const usermetaLoader = embedOptionsFromUsermeta(parsedSpec).loader;

  // either create the loader for the first time or create a new loader if the spec has new loader options
  if (!loader || usermetaLoader) {
    loader = createLoader(opts.loader ?? usermetaLoader);
  }

  const usermetaOpts = await loadOpts(embedOptionsFromUsermeta(parsedSpec), loader);
  const parsedOpts = await loadOpts(opts, loader);

  const mergedOpts = {
    ...mergeDeep(parsedOpts, usermetaOpts),
    config: mergeConfig(parsedOpts.config ?? {}, usermetaOpts.config ?? {}),
  };

  return await _embed(el, parsedSpec, mergedOpts, loader);
}

async function loadOpts(opt: EmbedOptions, loader: Loader): Promise<EmbedOptions<never>> {
  const config: Config = isString(opt.config) ? JSON.parse(await loader.load(opt.config)) : opt.config ?? {};
  const patch: PatchFunc | Operation[] = isString(opt.patch) ? JSON.parse(await loader.load(opt.patch)) : opt.patch;
  return {
    ...(opt as any),
    ...(patch ? {patch} : {}),
    ...(config ? {config} : {}),
  };
}

function getRoot(el: Element) {
  const possibleRoot = el.getRootNode ? el.getRootNode() : document;
  return possibleRoot instanceof ShadowRoot
    ? {root: possibleRoot, rootContainer: possibleRoot}
    : {root: document, rootContainer: document.head ?? document.body};
}

async function _embed(
  el: HTMLElement | string,
  spec: VisualizationSpec,
  opts: EmbedOptions<never> = {},
  loader: Loader
): Promise<Result> {
  const config = opts.theme ? mergeConfig(themes[opts.theme], opts.config ?? {}) : opts.config;

  const actions = isBoolean(opts.actions) ? opts.actions : mergeDeep<Actions>({}, DEFAULT_ACTIONS, opts.actions ?? {});
  const i18n = {...I18N, ...opts.i18n};

  const renderer = opts.renderer ?? 'canvas';
  const logLevel = opts.logLevel ?? vega.Warn;
  const downloadFileName = opts.downloadFileName ?? 'visualization';

  const element = typeof el === 'string' ? document.querySelector(el) : el;
  if (!element) {
    throw new Error(`${el} does not exist`);
  }

  if (opts.defaultStyle !== false) {
    // Add a default stylesheet to the head of the document.
    const ID = 'vega-embed-style';
    const {root, rootContainer} = getRoot(element);
    if (!root.getElementById(ID)) {
      const style = document.createElement('style');
      style.id = ID;
      style.innerText =
        opts.defaultStyle === undefined || opts.defaultStyle === true
          ? (embedStyle ?? '').toString()
          : opts.defaultStyle;
      rootContainer.appendChild(style);
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

  element.classList.add('vega-embed');
  if (actions) {
    element.classList.add('has-actions');
  }
  element.innerHTML = ''; // clear container

  let container = element;
  if (actions) {
    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add(CHART_WRAPPER_CLASS);
    element.appendChild(chartWrapper);
    container = chartWrapper;
  }

  const patch = opts.patch;
  if (patch) {
    vgSpec = patch instanceof Function ? patch(vgSpec) : applyPatch(vgSpec, patch, true, false).newDocument;
  }

  // Set locale. Note that this is a global setting.
  if (opts.formatLocale) {
    vega.formatLocale(opts.formatLocale);
  }

  if (opts.timeFormatLocale) {
    vega.timeFormatLocale(opts.timeFormatLocale);
  }

  const {ast} = opts;

  // Do not apply the config to Vega when we have already applied it to Vega-Lite.
  // This call may throw an Error if parsing fails.
  const runtime = vega.parse(vgSpec, mode === 'vega-lite' ? {} : (config as VgConfig), {ast});

  const view = new (opts.viewClass || vega.View)(runtime, {
    loader,
    logLevel,
    renderer,
    ...(ast ? {expr: (vega as any).expressionInterpreter ?? opts.expr ?? expressionInterpreter} : {}),
  });

  view.addSignalListener('autosize', (_, autosize: Exclude<AutoSize, string>) => {
    const {type} = autosize;
    if (type == 'fit-x') {
      container.classList.add('fit-x');
      container.classList.remove('fit-y');
    } else if (type == 'fit-y') {
      container.classList.remove('fit-x');
      container.classList.add('fit-y');
    } else if (type == 'fit') {
      container.classList.add('fit-x', 'fit-y');
    } else {
      container.classList.remove('fit-x', 'fit-y');
    }
  });

  if (opts.tooltip !== false) {
    const handler = isTooltipHandler(opts.tooltip)
      ? opts.tooltip
      : // user provided boolean true or tooltip options
        new Handler(opts.tooltip === true ? {} : opts.tooltip).call;

    view.tooltip(handler);
  }

  let {hover} = opts;

  if (hover === undefined) {
    hover = mode === 'vega';
  }

  if (hover) {
    const {hoverSet, updateSet} = (typeof hover === 'boolean' ? {} : hover) as Hover;

    view.hover(hoverSet, updateSet);
  }

  if (opts) {
    if (opts.width != null) {
      view.width(opts.width);
    }
    if (opts.height != null) {
      view.height(opts.height);
    }
    if (opts.padding != null) {
      view.padding(opts.padding);
    }
  }

  await view.initialize(container, opts.bind).runAsync();

  let documentClickHandler: ((this: Document, ev: MouseEvent) => void) | undefined;

  if (actions !== false) {
    let wrapper = element;

    if (opts.defaultStyle !== false) {
      const details = document.createElement('details');
      details.title = i18n.CLICK_TO_VIEW_ACTIONS;
      element.append(details);

      wrapper = details;
      const summary = document.createElement('summary');
      summary.innerHTML = SVG_CIRCLES;

      details.append(summary);

      documentClickHandler = (ev: MouseEvent) => {
        if (!details.contains(ev.target as any)) {
          details.removeAttribute('open');
        }
      };
      document.addEventListener('click', documentClickHandler);
    }

    const ctrl = document.createElement('div');
    wrapper.append(ctrl);
    ctrl.classList.add('vega-actions');

    // add 'Export' action
    if (actions === true || actions.export !== false) {
      for (const ext of ['svg', 'png'] as const) {
        if (actions === true || actions.export === true || (actions.export as {svg?: boolean; png?: boolean})[ext]) {
          const i18nExportAction = (i18n as {[key: string]: string})[`${ext.toUpperCase()}_ACTION`];
          const exportLink = document.createElement('a');

          exportLink.text = i18nExportAction;
          exportLink.href = '#';
          exportLink.target = '_blank';
          exportLink.download = `${downloadFileName}.${ext}`;
          // add link on mousedown so that it's correct when the click happens
          exportLink.addEventListener('mousedown', async function (this, e) {
            e.preventDefault();
            const url = await view.toImageURL(ext, opts.scaleFactor);
            this.href = url;
          });

          ctrl.append(exportLink);
        }
      }
    }

    // add 'View Source' action
    if (actions === true || actions.source !== false) {
      const viewSourceLink = document.createElement('a');

      viewSourceLink.text = i18n.SOURCE_ACTION;
      viewSourceLink.href = '#';
      viewSourceLink.addEventListener('click', function (this, e) {
        viewSource(stringify(spec), opts.sourceHeader ?? '', opts.sourceFooter ?? '', mode);
        e.preventDefault();
      });

      ctrl.append(viewSourceLink);
    }

    // add 'View Compiled' action
    if (mode === 'vega-lite' && (actions === true || actions.compiled !== false)) {
      const compileLink = document.createElement('a');

      compileLink.text = i18n.COMPILED_ACTION;
      compileLink.href = '#';
      compileLink.addEventListener('click', function (this, e) {
        viewSource(stringify(vgSpec), opts.sourceHeader ?? '', opts.sourceFooter ?? '', 'vega');
        e.preventDefault();
      });

      ctrl.append(compileLink);
    }

    // add 'Open in Vega Editor' action
    if (actions === true || actions.editor !== false) {
      const editorUrl = opts.editorUrl ?? 'https://vega.github.io/editor/';
      const editorLink = document.createElement('a');

      editorLink.text = i18n.EDITOR_ACTION;
      editorLink.href = '#';
      editorLink.addEventListener('click', function (this, e) {
        post(window, editorUrl, {
          config: config as Config,
          mode,
          renderer,
          spec: stringify(spec),
        });
        e.preventDefault();
      });

      ctrl.append(editorLink);
    }
  }

  function finalize() {
    if (documentClickHandler) {
      document.removeEventListener('click', documentClickHandler);
    }
    view.finalize();
  }

  return {view, spec, vgSpec, finalize};
}
