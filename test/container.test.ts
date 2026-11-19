import {TopLevelSpec} from 'vega-lite';
import {expect, test, vi} from 'vitest';
import container from '../src/container.js';

const vlSpec: TopLevelSpec = {
  data: {values: [1, 2, 3]},
  encoding: {},
  mark: 'point',
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

test('finalizes the view and removes the action listener when the container is removed', async () => {
  const div = await container(vlSpec);
  const finalize = vi.spyOn(div.value, 'finalize');
  const menu = div.querySelector('details')!;

  await Promise.resolve();
  expect(finalize).not.toHaveBeenCalled();

  document.body.append(div);
  menu.open = true;
  document.body.click();
  expect(menu.open).toBe(false);

  div.remove();
  await Promise.resolve();
  expect(finalize).toHaveBeenCalledTimes(1);
  menu.open = true;
  document.body.click();
  expect(menu.open).toBe(true);
});

test('keeps the view alive when moved and finalizes it once after removal', async () => {
  const div = await container(vlSpec);
  const finalize = vi.spyOn(div.value, 'finalize');
  const host = document.createElement('div');
  const shadow = host.attachShadow({mode: 'open'});

  document.body.append(host, div);
  shadow.append(div);
  await Promise.resolve();
  expect(finalize).not.toHaveBeenCalled();

  host.remove();
  await Promise.resolve();
  expect(finalize).toHaveBeenCalledTimes(1);

  document.body.append(host);
  host.remove();
  await Promise.resolve();
  expect(finalize).toHaveBeenCalledTimes(1);
});
