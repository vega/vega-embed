import { writeConfig } from 'vega';

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

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export function mergeDeep<T>(dest: T, ...src: readonly DeepPartial<T>[]): T {
  for (const s of src) {
    deepMerge_(dest, s);
  }
  return dest;
}

function deepMerge_(dest: any, src: any) {
  for (const property of Object.keys(src)) {
    writeConfig(dest, property, src[property], true);
  }
}
