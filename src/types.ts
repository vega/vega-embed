import {Config as VgConfig, Renderers} from 'vega';
import {Config as VlConfig} from 'vega-lite';

export type Mode = 'vega' | 'vega-lite';
export type Config = VlConfig | VgConfig;

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type ExpressionFunction = Record<string, any | {fn: any; visitor?: any}>;

export interface MessageData {
  spec: string;
  file?: unknown;
  config?: Config;
  mode: Mode;
  renderer?: Renderers;
}
