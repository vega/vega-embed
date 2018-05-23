import { isURL } from '../src/util';

test('isURL detects URL', () => {
  expect(isURL('https://vega.github.io/vega/examples/global-development.vg.json'));
  expect(isURL('https://vega.github.io/vega/examples/global-development.vg.json'));
  expect(isURL('//vega.github.io/vega/examples/global-development.vg.json'));

  expect(!isURL('#vis'));
});
