import { TopLevelSpec } from 'vega-lite';
import container from '../src/container';

const vlSpec: TopLevelSpec = {
  data: { values: [1, 2, 3] },
  encoding: {},
  mark: 'point'
};

test('returns a promise', () => {
  const result = container(vlSpec);
  expect(result.then).toBeDefined();
});

test('view is added as value and added to div element', async () => {
  const div = await container(vlSpec);
  expect(div.value).toBeDefined();
  expect(div.value.run).toBeDefined();
});

test('element is div', async () => {
  const div = await container(vlSpec);
  expect(div.tagName).toBe('DIV');
});

test('element is wrapper', async () => {
  const div = await container(vlSpec);
  expect(div.classList).toContain('vega-embed-wrapper');
});
