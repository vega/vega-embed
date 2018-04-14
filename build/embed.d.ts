import * as vegaImport from 'vega-lib';
import * as VegaLite from 'vega-lite';
import { Config as VgConfig, Loader, Spec as VgSpec, View } from 'vega-lib';
import { Config as VlConfig, TopLevelSpec as VlSpec } from 'vega-lite';
export declare const vega: typeof vegaImport;
export declare const vl: typeof VegaLite;
export declare type Mode = 'vega' | 'vega-lite';
export declare type Renderer = 'canvas' | 'svg';
export declare type Config = VlConfig | VgConfig;
export interface EmbedOptions {
    actions?: boolean | {
        export?: boolean;
        source?: boolean;
        editor?: boolean;
    };
    mode?: Mode;
    logLevel?: number;
    loader?: Loader;
    renderer?: Renderer;
    onBeforeParse?: (spec: VisualizationSpec) => VisualizationSpec;
    width?: number;
    height?: number;
    padding?: number | {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    config?: string | Config;
    sourceHeader?: string;
    sourceFooter?: string;
    editorUrl?: string;
    runAsync?: boolean;
}
export declare type VisualizationSpec = VlSpec | VgSpec;
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
export default function embed(el: HTMLElement | string, spec: string | VisualizationSpec, opt: EmbedOptions): Promise<Result>;
