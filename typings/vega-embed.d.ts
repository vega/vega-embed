type Mode = 'vega' | 'vega-lite';

declare type Loader = {
  load: (url: string) => Promise<any>;
}

declare type Options = {
  renderer?: 'canvas' | 'svg',
  actions?: boolean | {export?: boolean, source?: boolean, editor?: boolean},
  loader?: Loader,
  config?: any,
  mode?: Mode,
  onBeforeParse?: (spec: any) => void,
  viewConfig?: any,
  width?: number,
  height?: number,
  padding?: number | {left?: number, right?: number, top?: number, bottom?: number},
  sourceHeader?: string,
  sourceFooter?: string,
  editorUrl?: string
}

declare type ExportFunction = (el: Element, spec: any, opt: Options) => Promise<{ view: any; spec: any; }>;
declare type Export = ExportFunction & {default?: ExportFunction, vega?, vl?};

declare module 'vega-embed' {
  export = Export;
}
