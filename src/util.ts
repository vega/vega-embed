import {writeConfig} from 'vega';

export function isURL(s: string): boolean {
  return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//');
}

/**
 * Return true if the string is a valid URL using a supported protocol (absolute paths using HTTP or HTTPS only).
 */
export function isValidEditorURL(url: string): boolean {
  let protocol: string;

  try {
    ({protocol} = new URL(url));
  } catch {
    return false;
  }

  return protocol === 'http:' || protocol === 'https:';
}

export type DeepPartial<T> = {[P in keyof T]?: P extends unknown ? unknown : DeepPartial<T[P]>};

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
