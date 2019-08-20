import { Config as VgConfig, Renderers } from 'vega';
import { Config as VlConfig } from 'vega-lite/build/src/config';

export type Mode = 'vega' | 'vega-lite';
export type Config = VlConfig | VgConfig;

export interface MessageData {
  spec: string;
  file?: unknown;
  config?: Config;
  mode: Mode;
  renderer?: Renderers;
}
