import * as vegaImport from 'vega-lib';
import * as VegaLite from 'vega-lite';
import { Config as VgConfig, Loader, Spec as VgSpec, View } from 'vega-lib';
import { Config as VlConfig } from 'vega-lite/build/src/config';
import { TopLevelExtendedSpec as VlSpec } from 'vega-lite/build/src/spec';
export declare const vega: typeof vegaImport;
export declare const vl: typeof VegaLite;
export declare type Mode = 'vega' | 'vega-lite';
export interface EmbedOptions {
    actions?: boolean | {
        export?: boolean;
        source?: boolean;
        editor?: boolean;
    };
    mode?: Mode;
    logLevel?: number;
    loader?: Loader;
    renderer?: 'canvas' | 'svg';
    onBeforeParse?: (spec: VisualizationSpec) => VisualizationSpec;
    width?: number;
    height?: number;
    padding?: number | {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    config?: string | VlConfig | VgConfig;
    sourceHeader?: string;
    sourceFooter?: string;
    editorUrl?: string;
}
export declare type VisualizationSpec = VlSpec | VgSpec;
/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
export default function embed(el: HTMLBaseElement | string, spec: string | VisualizationSpec, opt: EmbedOptions): Promise<{} | {
    view: View;
    spec: VisualizationSpec;
}>;
