import {writeConfig, LoggerInterface} from 'vega';

export function isURL(s: string): boolean {
  return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//');
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

export function isValidLogger(obj: unknown): obj is LoggerInterface {
  if (typeof obj !== 'object' || obj === null) return false;

  const requiredMethods: (keyof LoggerInterface)[] = ['level', 'error', 'warn', 'info', 'debug'];

  return requiredMethods.every((method) => typeof (obj as Record<string, unknown>)[method] === 'function');
}
