export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

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
