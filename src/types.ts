import {Config as VgConfig, Renderers} from 'vega';
import {Config as VlConfig} from 'vega-lite';

export type Mode = 'vega' | 'vega-lite';
export type Config = VlConfig | VgConfig;

export type ExpressionFunction = Record<string, Function | {fn: Function, visitor: Function}>;

export interface MessageData {
  spec: string;
  file?: unknown;
  config?: Config;
  mode: Mode;
  renderer?: Renderers;
}
