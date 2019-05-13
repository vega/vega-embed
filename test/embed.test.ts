import { View } from 'vega';
import { compile, TopLevelSpec } from 'vega-lite';
import embed, { guessMode, Mode } from '../src/embed';

const vlSpec: TopLevelSpec = {
  data: { values: [1, 2, 3] },
  encoding: {},
  mark: 'point'
};

const vgSpec = compile(vlSpec).spec;

test('embed returns result', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec);
  expect(result).toBeDefined();
  expect(result.spec).toBeDefined();
  expect(result.view).toBeDefined();
});

test('can change renderer to SVG', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { renderer: 'svg' });
  expect(el.children[0].tagName).toBe('svg');
});

test('creates simple actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { defaultStyle: false });
  expect(el.children[2].classList[0]).toBe('vega-actions');
});

test('creates default actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec);
  expect(el.children[2].tagName).toBe('DETAILS');
  expect(el.children[2].children[1].classList[0]).toBe('vega-actions');
  expect(el.children[2].children[1].childElementCount).toBe(5);
});

test('creates all actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: true });
  expect(el.children[2].children[1].childElementCount).toBe(5);
});

test('can disable actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: false });
  expect(el.childElementCount).toBe(2);
});

test('can disable actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: { export: false } });
  expect(el.children[2].children[1].childElementCount).toBe(3);
});

test('can disable export actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: { export: { svg: false } } });
  expect(el.children[2].children[1].childElementCount).toBe(4);
});

test('creates default actions for Vega', async () => {
  const el = document.createElement('div');
  await embed(el, vgSpec);
  expect(el.children[2].children[1].classList[0]).toBe('vega-actions');
  expect(el.children[2].children[1].childElementCount).toBe(4);
});

test('can access compiled Vega', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec);
  expect(result.spec).toEqual(vlSpec);
  expect(result.vgSpec).toEqual(compile(vlSpec).spec);
});

test('can patch compiled Vega', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, { patch: { description: 'Hello World!' } });
  expect(result.spec).toEqual(vlSpec);
  expect(result.vgSpec).not.toEqual(compile(vlSpec).spec);
  expect(result.vgSpec.description).toBe('Hello World!');
});

test('can patch compiled Vega with a function', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    patch: spec => ({ ...spec, description: 'Hello World!' })
  });
  expect(result.spec).toEqual(vlSpec);
  expect(result.vgSpec).not.toEqual(compile(vlSpec).spec);
  expect(result.vgSpec.description).toBe('Hello World!');
});

test('can add additional link to actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: { customOptions: { 'Go to Google': 'http://www.google.com' } } });
  expect(el.children[2].children[1].childElementCount).toBe(6);
});

test('can add additional links to actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {
    actions: {
      customOptions: { 'Go to Google': 'http://www.google.com', 'Stack Overflow': 'https://stackoverflow.com/' }
    }
  });
  expect(el.children[2].children[1].childElementCount).toBe(7);
});

test('can manage all links in customOptions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {
    actions: {
      export: { svg: false, png: false },
      source: false,
      compiled: false,
      editor: false,
      customOptions: { 'Go to Google': 'http://www.google.com', 'Stack Overflow': 'https://stackoverflow.com/' }
    }
  });
  expect(el.children[2].children[1].childElementCount).toBe(2);
});

test('guessMode from Vega schema', () => {
  expect(guessMode({ $schema: 'https://vega.github.io/schema/vega/v5.json' }, 'invalid' as Mode)).toBe('vega');
});

test('guessMode from Vega-Lite schema', () => {
  expect(guessMode({ $schema: 'https://vega.github.io/schema/vega-lite/v3.json' }, 'invalid' as Mode)).toBe(
    'vega-lite'
  );
});

test('guessMode from Vega-Lite spec', () => {
  const unitSpec: TopLevelSpec = { data: { values: [] }, mark: 'bar', encoding: {} };
  const specs: TopLevelSpec[] = [
    unitSpec,
    { layer: [] },
    { repeat: {}, spec: unitSpec },
    { data: { values: [] }, facet: { row: { field: 'foo', type: 'nominal' } }, spec: { mark: 'bar', encoding: {} } },
    { vconcat: [] },
    { hconcat: [] }
  ];

  for (const spec of specs) {
    expect(guessMode(spec, 'invalid' as Mode)).toBe('vega-lite');
  }
});

test('guessMode from Vega spec', () => {
  expect(guessMode({ marks: [] }, 'invalid' as Mode)).toBe('vega');
});

test('can change i18n strings', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {
    actions: true,
    i18n: { COMPILED_ACTION: 'foo', EDITOR_ACTION: 'bar', PNG_ACTION: 'baz', SOURCE_ACTION: 'qux', SVG_ACTION: 'quux' }
  });

  const ctrl = el.children[2].children[1];
  const ctrlChildren = ctrl.children;

  expect(ctrl.childElementCount).toBe(5);
  expect(ctrlChildren[0].textContent).toBe('quux');
  expect(ctrlChildren[1].textContent).toBe('baz');
  expect(ctrlChildren[2].textContent).toBe('qux');
  expect(ctrlChildren[3].textContent).toBe('foo');
  expect(ctrlChildren[4].textContent).toBe('bar');
});

test('can set hover arguments', async () => {
  const hoverSpy = jest.spyOn(View.prototype, 'hover');

  const el = document.createElement('div');

  // Hover disabled by default
  await embed(el, vlSpec, {});
  expect(hoverSpy).not.toHaveBeenCalled();
  hoverSpy.mockReset();

  await embed(el, vlSpec, {
    hover: true
  });
  expect(hoverSpy).toHaveBeenCalledWith(undefined, undefined);
  hoverSpy.mockReset();

  // Hover enabled by default
  await embed(el, vgSpec, {});
  expect(hoverSpy).toHaveBeenCalledWith(undefined, undefined);
  hoverSpy.mockReset();

  await embed(el, vgSpec, {
    hover: false
  });
  expect(hoverSpy).not.toHaveBeenCalled();
  hoverSpy.mockReset();

  await embed(el, vgSpec, {
    hover: {
      hoverSet: 'enter'
    }
  });
  expect(hoverSpy).toHaveBeenCalledWith('enter', undefined);
  hoverSpy.mockReset();

  await embed(el, vgSpec, {
    hover: {
      updateSet: 'exit'
    }
  });
  expect(hoverSpy).toHaveBeenCalledWith(undefined, 'exit');
  hoverSpy.mockReset();

  hoverSpy.mockRestore();
});
