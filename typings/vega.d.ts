declare module 'vega' {
    export const version: string;
    export function parse(spec: any): any;
    export class View {
      constructor(runtime: any);
      public logLevel(level: number): View;
      public initialize(dom: Element | string): View;
      public renderer(renderer: string): View;
      public finalize(): void;
  
      public hover(): View;
      public run(): View;
      public change(name: string, changeset: any): View;
      public changeset(): any;
      public data(name: string): object[];
    }
    export const Warn: number;
    export const changeset: any;
    export const loader: any;
  }
  