import { isString } from 'vega';
import pkg from '../package.json';
import container from './container';
import embed, { vega, vegaLite } from './embed';
import { isURL } from './util';

/**
 * Returns true if the object is an HTML element.
 */
function isElement(obj: any): obj is HTMLElement {
  return obj instanceof HTMLElement;
}

export type Wrapper = typeof embed | typeof container;

const wrapper: Wrapper = (...args: any[]): any => {
  if (args.length > 1 && ((isString(args[0]) && !isURL(args[0])) || isElement(args[0]) || args.length === 3)) {
    return embed(args[0], args[1], args[2]);
  }

  return container(args[0], args[1]);
};

(wrapper as any).vegaLite = vegaLite;
(wrapper as any).vl = vegaLite; // backwards compatbility
(wrapper as any).container = container;
(wrapper as any).embed = embed;
(wrapper as any).vega = vega;
(wrapper as any).default = embed;
(wrapper as any).version = pkg.version;

export default wrapper;
