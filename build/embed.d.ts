import * as vega from 'vega';
export declare type Mode = 'vega' | 'vega-lite';
export interface IEmbedOptions {
    actions?: boolean | {
        export?: boolean;
        source?: boolean;
        editor?: boolean;
    };
    mode?: Mode;
    logLevel?: number;
    loader?: vega.Loader;
    renderer?: 'canvas' | 'svg';
    onBeforeParse?: (spec: any) => void;
    width?: number;
    height?: number;
    padding?: number | {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    config?: string | any;
    sourceHeader?: string;
    sourceFooter?: string;
    editorUrl?: string;
}
/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
export default function embed(el: HTMLBaseElement | string, spec: any, opt: IEmbedOptions): Promise<{
    view: vega.View;
    spec: any;
}>;
