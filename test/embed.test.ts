import { TopLevelSpec } from 'vega-lite';
import { compile } from 'vega-lite';
import embed, { guessMode, Mode } from '../src/embed';

const vlSpec: TopLevelSpec = {
  data: { values: [1, 2, 3] },
  encoding: {},
  mark: 'point',
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

test('creates default actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec);
  expect(el.children[2].classList[0]).toBe('vega-actions-wrapper');
  expect(el.children[2].children[0].classList[0]).toBe('vega-actions');
  expect(el.children[2].children[0].childElementCount).toBe(4);
});

test('creates all actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: true });
  expect(el.children[2].children[0].childElementCount).toBe(5);
});

test('can disable actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: false });
  expect(el.childElementCount).toBe(2);
});

test('can disable actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: { export: false } });
  expect(el.children[2].children[0].childElementCount).toBe(2);
});

test('can disable export actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, { actions: { export: { svg: false } } });
  expect(el.children[2].children[0].childElementCount).toBe(3);
});

test('creates default actions for Vega', async () => {
  const el = document.createElement('div');
  await embed(el, vgSpec);
  expect(el.children[2].classList[0]).toBe('vega-actions-wrapper');
  expect(el.children[2].children[0].classList[0]).toBe('vega-actions');
  expect(el.children[2].children[0].childElementCount).toBe(4);
});

test('guessMode from Vega schema', () => {
  expect(guessMode({ $schema: 'https://vega.github.io/schema/vega/v4.json' }, 'invalid' as Mode)).toBe('vega');
});

test('guessMode from Vega-Lite schema', () => {
  expect(guessMode({ $schema: 'https://vega.github.io/schema/vega-lite/v2.json' }, 'invalid' as Mode)).toBe(
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
    { hconcat: [] },
  ];

  for (const spec of specs) {
    expect(guessMode(spec, 'invalid' as Mode)).toBe('vega-lite');
  }
});

test('guessMode from Vega spec', () => {
  expect(guessMode({ marks: [] }, 'invalid' as Mode)).toBe('vega');
});
