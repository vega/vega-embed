import { Config as VgConfig } from 'vega-lib';
import { Config as VlConfig } from 'vega-lite/build/src/config';

export type Mode = 'vega' | 'vega-lite';
export type Config = VlConfig | VgConfig;
