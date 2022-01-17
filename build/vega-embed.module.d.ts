import { Operation } from 'fast-json-patch';
import * as vegaImport from 'vega';
import { EncodeEntryName, Loader, LoaderOptions, Renderers, TooltipHandler, View } from "vega";
import { Spec as VgSpec } from "vega";
import { Config as VgConfig } from "vega";
import { expressionInterpreter } from 'vega-interpreter';
import * as vegaLiteImport from 'vega-lite';
import { TopLevelSpec as VlSpec } from "vega-lite";
import { Config as VlConfig } from "vega-lite";
import { Options as TooltipOptions } from 'vega-tooltip';
type Mode = "vega" | "vega-lite";
type Config = VlConfig | VgConfig;
interface MessageData {
    spec: string;
    file?: unknown;
    config?: Config;
    mode: Mode;
    renderer?: Renderers;
}
declare const version: string;
declare const vega: typeof vegaImport;
declare let vegaLite: typeof vegaLiteImport;
interface Actions {
    export?: boolean | {
        svg?: boolean;
        png?: boolean;
    };
    source?: boolean;
    compiled?: boolean;
    editor?: boolean;
}
declare const DEFAULT_ACTIONS: {
    export: {
        svg: boolean;
        png: boolean;
    };
    source: boolean;
    compiled: boolean;
    editor: boolean;
};
interface Hover {
    hoverSet?: EncodeEntryName;
    updateSet?: EncodeEntryName;
}
type PatchFunc = (spec: VgSpec) => VgSpec;
declare const I18N: {
    CLICK_TO_VIEW_ACTIONS: string;
    COMPILED_ACTION: string;
    EDITOR_ACTION: string;
    PNG_ACTION: string;
    SOURCE_ACTION: string;
    SVG_ACTION: string;
};
interface EmbedOptions<S = string, R = Renderers> {
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
    padding?: number | {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
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
type VisualizationSpec = VlSpec | VgSpec;
interface Result {
    /** The Vega view. */
    view: View;
    /** The input specification. */
    spec: VisualizationSpec;
    /** The compiled and patched Vega specification. */
    vgSpec: VgSpec;
    /** Removes references to unwanted behaviors and memory leaks. Calls Vega's `view.finalize`.  */
    finalize: () => void;
}
/**
 * Try to guess the type of spec.
 *
 * @param spec Vega or Vega-Lite spec.
 */
declare function guessMode(spec: VisualizationSpec, providedMode?: Mode): Mode;
/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opts       A JavaScript object containing options for embedding.
 */
declare function embed(el: HTMLElement | string, spec: VisualizationSpec | string, opts?: EmbedOptions): Promise<Result>;
export { version, Mode, Config, MessageData, vega, vegaLite, Actions, DEFAULT_ACTIONS, Hover, PatchFunc, EmbedOptions, VisualizationSpec, Result, guessMode, embed as default };
//# sourceMappingURL=vega-embed.module.d.ts.map