import 'vitest-canvas-mock';
import {afterEach, beforeEach, vi} from 'vitest';

/**
 * A minimal constructable stylesheet, since jsdom does not support `adoptedStyleSheets`.
 */
export class FakeCSSStyleSheet {
  text = '';

  replaceSync(text: string) {
    this.text = text;
  }
}

beforeEach(() => {
  vi.stubGlobal('CSSStyleSheet', FakeCSSStyleSheet);
  for (const proto of [Document.prototype, ShadowRoot.prototype]) {
    Object.defineProperty(proto, 'adoptedStyleSheets', {
      configurable: true,
      get(this: {_adoptedStyleSheets?: CSSStyleSheet[]}) {
        return this._adoptedStyleSheets ?? [];
      },
      set(this: {_adoptedStyleSheets?: CSSStyleSheet[]}, sheets: CSSStyleSheet[]) {
        this._adoptedStyleSheets = sheets;
      },
    });
  }
  document.adoptedStyleSheets = [];
});

afterEach(() => {
  vi.unstubAllGlobals();
  for (const proto of [Document.prototype, ShadowRoot.prototype]) {
    delete (proto as {adoptedStyleSheets?: unknown}).adoptedStyleSheets;
  }
});
