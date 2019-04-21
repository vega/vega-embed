import { isArray } from 'vega';

/**
 * From Vega-Lite
 */
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/* eslint-disable */
function deepMerge_(dest: any, src: any) {
  if (typeof src !== 'object' || src === null) {
    return dest;
  }

  for (const p in src) {
    if (!src.hasOwnProperty(p)) {
      continue;
    }
    if (src[p] === undefined) {
      continue;
    }
    if (typeof src[p] !== 'object' || isArray(src[p]) || src[p] === null) {
      dest[p] = src[p];
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = mergeDeep(isArray(src[p].constructor) ? [] : {}, src[p]);
    } else {
      mergeDeep(dest[p], src[p]);
    }
  }
  return dest;
}
/* eslint-enable */

export function mergeDeep<T>(dest: T, ...src: DeepPartial<T>[]): T {
  for (const s of src) {
    // eslint-disable-next-line no-param-reassign
    dest = deepMerge_(dest, s);
  }
  return dest;
}

// polyfill for IE
if (!String.prototype.startsWith) {
  // eslint-disable-next-line no-extend-native,func-names
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

export function isURL(s: string): boolean {
  return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//');
}
