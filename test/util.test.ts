import { DEFAULT_ACTIONS, Actions } from './../src/embed';
import { isURL } from '../src/util';
import { mergeDeep } from '../src/util';

test('isURL detects URL', () => {
  expect(isURL('https://vega.github.io/vega/examples/global-development.vg.json'));
  expect(isURL('https://vega.github.io/vega/examples/global-development.vg.json'));
  expect(isURL('//vega.github.io/vega/examples/global-development.vg.json'));

  expect(!isURL('#vis'));
});

test('mergeDeep', () => {
  expect(mergeDeep({}, {})).toEqual({});
  expect(mergeDeep<object>({ a: 1, b: 2 }, { a: 3, c: 4 })).toEqual({
    a: 3,
    b: 2,
    c: 4
  });
  expect(mergeDeep({ a: { b: { c: 12 } } }, { a: { b: { c: 42 } } })).toEqual({ a: { b: { c: 42 } } });
  expect(mergeDeep<object>({ a: { b: 12 } }, { a: { b: { c: 42 } } })).toEqual({ a: { b: { c: 42 } } });
  expect(mergeDeep({}, DEFAULT_ACTIONS, {})).toEqual(DEFAULT_ACTIONS);
  expect(
    mergeDeep<Actions>({}, DEFAULT_ACTIONS, { export: { svg: false } })
  ).toEqual({
    export: { svg: false, png: true },
    source: true,
    compiled: true,
    editor: true
  });
});
