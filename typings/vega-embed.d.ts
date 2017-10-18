type Mode = 'vega' | 'vega-lite';

declare type Loader = {
  load: (uri: string, options?: any) => Promise<string>
  sanitize: (uri: string, options: any) => Promise<{href: string}>
  http: (uri: string, options: any) => Promise<string>
  file: (filename: string) => Promise<string>
}

declare type Options = {
  actions?: boolean | {export?: boolean, source?: boolean, editor?: boolean},
  mode?: Mode,
  logLevel?: number,
  loader?: Loader,
  renderer?: 'canvas' | 'svg',
  onBeforeParse?: (spec: any) => void,
  width?: number,
  height?: number,
  padding?: number | {left?: number, right?: number, top?: number, bottom?: number},
  config?: string | any,
  sourceHeader?: string,
  sourceFooter?: string,
  editorUrl?: string
}

declare type Result = { view: any; spec: any; }
declare type ExportFunction = (el: Element, spec: string | any, opt: Options) => Promise<Result>;
declare type Export = ExportFunction & {default?: ExportFunction, vega?, vl?};

declare module 'vega-embed' {
  export = Export;
}
