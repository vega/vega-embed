import * as vega from 'vega-lib';
import * as vl from 'vega-lite';

import embed from './embed';

const embedModule: typeof embed & {
  default?: typeof embed;
  vega?;
  vl?;
} = embed;

embedModule.default = embed;

// expose Vega and Vega-Lite libs
embedModule.vega = vega;
embedModule.vl = vl;

export = embedModule;
