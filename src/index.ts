import * as d3 from 'd3-selection';
import { isString } from 'vega-util';
import pkg from '../package.json';
import { container } from './container';
import embed, { vega, vl } from './embed';
import { isURL } from './util';

/**
 * Returns true of the object is an HTML element.
 */
function isElement(obj: any): obj is HTMLElement {
  return obj instanceof d3.selection || typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement // DOM2
    : obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

export type Wrapper = typeof embed | typeof container;

const wrapper: Wrapper = (...args: any[]): any => {
  if (args.length > 1 && ((isString(args[0]) && !isURL(args[0])) || isElement(args[0]) || args.length === 3)) {
    return embed(args[0], args[1], args[2]);
  }

  return container(args[0], args[1]);
};

(wrapper as any).vl = vl;
(wrapper as any).container = container;
(wrapper as any).embed = embed;
(wrapper as any).vega = vega;
(wrapper as any).default = embed;
(wrapper as any).version = pkg.version;

export default wrapper;
