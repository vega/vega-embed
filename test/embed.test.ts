import * as vega from 'vega';
import {View} from 'vega';
import {expressionInterpreter} from 'vega-interpreter';
import * as vl from 'vega-lite';
import {compile, TopLevelSpec} from 'vega-lite';
import {RepeatSpec} from 'vega-lite/build/src/spec';
import {expect, test, vi} from 'vitest';
import embed, {guessMode, Mode} from '../src/embed';

const vlSpec: TopLevelSpec = {
  data: {values: [1, 2, 3]},
  encoding: {},
  mark: 'point',
};

const vgSpec = compile(vlSpec).spec;

const vlSpecCustomFunction: TopLevelSpec = {
  data: {values: [1, 2, 3]},
  encoding: {
    y: {
      axis: {
        format: '',
        formatType: 'simpleFunction',
      },
    },
  },
  mark: 'point',
  transform: [
    {calculate: 'simpleFunction()', as: 'result1'},
    {calculate: 'functionWithVisitor()', as: 'result2'},
  ],
};

test('embed returns result', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec);
  expect(result).toBeDefined();
  expect(result.spec).toBeDefined();
  expect(result.vgSpec).toBeDefined();
  expect(result.view).toBeDefined();
  expect(result.finalize).toBeDefined();
});

test('can change renderer to SVG', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {renderer: 'svg'});
  expect(el.children[0].children[0].tagName).toBe('svg');
});

test('creates simple actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {defaultStyle: false});
  expect(el.children[1].classList[0]).toBe('vega-actions');
});

test('creates default actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec);
  expect(el.children[1].tagName).toBe('DETAILS');
  expect(el.children[1].children[1].classList[0]).toBe('vega-actions');
  expect(el.children[1].children[1].childElementCount).toBe(5);
});

test('creates all actions for Vega-Lite', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {actions: true});
  expect(el.children[1].children[1].childElementCount).toBe(5);
});

test('can disable actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {actions: false});
  expect(el.childElementCount).toBe(2);
});

test('can disable specific actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {actions: {export: false}});
  expect(el.children[1].children[1].childElementCount).toBe(3);
});

test('can disable export actions', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {actions: {export: {svg: false}}});
  expect(el.children[1].children[1].childElementCount).toBe(4);
});

test('creates default download filename for svg', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {actions: true});
  expect(el.children[1].children[1].children[0].getAttribute('download')).toBe('visualization.svg');
});

test('create default download filename for png', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec);
  expect(el.children[1].children[1].children[1].getAttribute('download')).toBe('visualization.png');
});

test('can use custom download filename for svg', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {downloadFileName: 'your_chart'});
  expect(el.children[1].children[1].children[0].getAttribute('download')).toBe('your_chart.svg');
});

test('can use custom download filename for png', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {downloadFileName: 'my_chart'});
  expect(el.children[1].children[1].children[1].getAttribute('download')).toBe('my_chart.png');
});

test('creates default actions for Vega', async () => {
  const el = document.createElement('div');
  await embed(el, vgSpec);
  expect(el.classList[0]).toBe('vega-embed');
  expect(el.classList[1]).toBe('has-actions');
  expect(el.children[1].children[1].classList[0]).toBe('vega-actions');
  expect(el.children[1].children[1].childElementCount).toBe(4);
});

test('does not set has-actions if actions are not specified', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {actions: false});
  expect(el.classList).toHaveLength(1);
  expect(el.querySelector('.has-actions')).toBeNull();
});

test('shows actions in menu if defaultStyle and forceActionsMenu are both false', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {defaultStyle: false, forceActionsMenu: false});
  expect(el.querySelector('details')).toBeNull();
});

test('shows actions in menu if defaultStyle is false and forceActionsMenu is true', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {defaultStyle: false, forceActionsMenu: true});
  expect(el.querySelector('details')).not.toBeNull();
});

test('add fix-x class when needed', async () => {
  const el = document.createElement('div');
  await embed(el, {
    autosize: 'fit-x',
  });
  expect(el.children[0].classList).toHaveLength(2);
  expect(el.children[0].classList[1]).toBe('fit-x');

  await embed(el, {
    autosize: {
      type: 'fit-x',
    },
  });
  expect(el.children[0].classList).toHaveLength(2);
  expect(el.children[0].classList[1]).toBe('fit-x');
});

test('add fix-y class when needed', async () => {
  const el = document.createElement('div');
  await embed(el, {
    autosize: 'fit-y',
  });
  expect(el.children[0].classList).toHaveLength(2);
  expect(el.children[0].classList[1]).toBe('fit-y');

  await embed(el, {
    autosize: {
      type: 'fit-y',
    },
  });
  expect(el.children[0].classList).toHaveLength(2);
  expect(el.children[0].classList[1]).toBe('fit-y');
});

test('add fix-x and fit-y class when needed', async () => {
  const el = document.createElement('div');
  await embed(el, {
    autosize: 'fit',
  });
  expect(el.children[0].classList).toHaveLength(3);
  expect(el.children[0].classList[1]).toBe('fit-x');
  expect(el.children[0].classList[2]).toBe('fit-y');

  await embed(el, {
    autosize: {
      type: 'fit',
    },
  });
  expect(el.children[0].classList).toHaveLength(3);
  expect(el.children[0].classList[1]).toBe('fit-x');
  expect(el.children[0].classList[2]).toBe('fit-y');
});

test('can access compiled Vega', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec);
  expect(result.spec).toEqual(vlSpec);
  expect(result.vgSpec).toEqual(compile(vlSpec).spec);
});

test('can patch Vega', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vgSpec, {patch: [{op: 'add', path: '/description', value: 'Hello World!'}]});
  expect(vgSpec.description).toBeUndefined();
  expect(result.spec).toEqual(vgSpec);
  expect(result.vgSpec).not.toEqual(compile(vlSpec).spec);
  expect(result.vgSpec.description).toBe('Hello World!');
});

test('can patch compiled Vega', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {patch: [{op: 'add', path: '/description', value: 'Hello World!'}]});
  expect(result.spec).toEqual(vlSpec);
  expect(result.vgSpec).not.toEqual(compile(vlSpec).spec);
  expect(result.vgSpec.description).toBe('Hello World!');
});

test('can patch compiled Vega signals', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {patch: [{op: 'add', path: '/signals', value: [{name: 'mySignal'}]}]});
  const compiledVgSpec = compile(vlSpec).spec;
  expect(result.spec).toEqual(vlSpec);
  expect(result.vgSpec).not.toEqual(compiledVgSpec);
  expect(result.vgSpec.signals).toEqual((compiledVgSpec.signals ?? []).concat({name: 'mySignal'}));
});

test('can patch compiled Vega with a function', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    patch: (spec) => ({...spec, description: 'Hello World!'}),
  });
  expect(result.spec).toEqual(vlSpec);
  expect(result.vgSpec).not.toEqual(compile(vlSpec).spec);
  expect(result.vgSpec.description).toBe('Hello World!');
});

test('guessMode from Vega schema', () => {
  expect(guessMode({$schema: 'https://vega.github.io/schema/vega/v6.json'}, 'invalid' as Mode)).toBe('vega');
});

test('guessMode from Vega-Lite schema', () => {
  expect(guessMode({$schema: 'https://vega.github.io/schema/vega-lite/v6.json'}, 'invalid' as Mode)).toBe('vega-lite');
});

test('guessMode from Vega-Lite spec', () => {
  const unitSpec: TopLevelSpec = {data: {values: []}, mark: 'bar', encoding: {}};
  const specs: TopLevelSpec[] = [
    unitSpec,
    {layer: []},
    {repeat: {}, spec: unitSpec} as RepeatSpec,
    {data: {values: []}, facet: {row: {field: 'foo', type: 'nominal'}}, spec: {mark: 'bar', encoding: {}}},
    {vconcat: []},
    {hconcat: []},
  ];

  for (const spec of specs) {
    expect(guessMode(spec, 'invalid' as Mode)).toBe('vega-lite');
  }
});

test('guessMode from Vega spec', () => {
  expect(guessMode({marks: []}, 'invalid' as Mode)).toBe('vega');
});

test('can set locale', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    formatLocale: {
      decimal: ',',
      thousands: '.',
    },
  });
  expect(result).toBeTruthy();
});

test('throws error when expressionFunction does not exist', async () => {
  const el = document.createElement('div');

  const getErrorFromEmbed = async () => {
    try {
      await embed(el, vlSpecCustomFunction);

      throw Error('No Thrown Error');
    } catch (e: any) {
      return e;
    }
  };

  const error = await getErrorFromEmbed();
  expect(error.message).toBe('Unrecognized function: simpleFunction');
});

test('can set and use expressionFunctions', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpecCustomFunction, {
    expressionFunctions: {
      simpleFunction: () => {
        return 'test';
      },
      functionWithVisitor: {
        fn: () => {
          return 'test';
        },
        visitor: () => {
          return 'test';
        },
      },
    },
  });
  expect(result).toBeTruthy();
});

test('can set tooltip theme', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    tooltip: {
      theme: 'dark',
    },
  });
  expect(result).toBeTruthy();
});

test('can set ast option', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    ast: true,
  });
  expect(result).toBeTruthy();
});

test('can set expr option', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    expr: expressionInterpreter,
  });
  expect(result).toBeTruthy();
});

test('can change i18n strings', async () => {
  const el = document.createElement('div');
  await embed(el, vlSpec, {
    actions: true,
    i18n: {COMPILED_ACTION: 'foo', EDITOR_ACTION: 'bar', PNG_ACTION: 'baz', SOURCE_ACTION: 'qux', SVG_ACTION: 'quux'},
  });

  const ctrl = el.children[1].children[1];
  const ctrlChildren = ctrl.children;

  expect(ctrl.childElementCount).toBe(5);
  expect(ctrlChildren[0].textContent).toBe('quux');
  expect(ctrlChildren[1].textContent).toBe('baz');
  expect(ctrlChildren[2].textContent).toBe('qux');
  expect(ctrlChildren[3].textContent).toBe('foo');
  expect(ctrlChildren[4].textContent).toBe('bar');
});

test('can set hover arguments', async () => {
  const hoverSpy = vi.spyOn(View.prototype, 'hover');

  const el = document.createElement('div');

  // Hover disabled by default
  await embed(el, vlSpec);
  expect(hoverSpy).not.toHaveBeenCalled();
  hoverSpy.mockReset();

  await embed(el, vlSpec, {
    hover: true,
  });
  expect(hoverSpy).toHaveBeenCalledWith(undefined, undefined);
  hoverSpy.mockReset();

  // Hover enabled by default
  await embed(el, vgSpec);
  expect(hoverSpy).toHaveBeenCalledWith(undefined, undefined);
  hoverSpy.mockReset();

  await embed(el, vgSpec, {
    hover: false,
  });
  expect(hoverSpy).not.toHaveBeenCalled();
  hoverSpy.mockReset();

  await embed(el, vgSpec, {
    hover: {
      hoverSet: 'enter',
    },
  });
  expect(hoverSpy).toHaveBeenCalledWith('enter', undefined);
  hoverSpy.mockReset();

  await embed(el, vgSpec, {
    hover: {
      updateSet: 'exit',
    },
  });
  expect(hoverSpy).toHaveBeenCalledWith(undefined, 'exit');
  hoverSpy.mockReset();

  hoverSpy.mockRestore();
});

test('Should warn about incompatible Vega and Vega-Lite versions', async () => {
  const el = document.createElement('div');

  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  await embed(
    el,
    {
      $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
      mark: 'bar',
      encoding: {},
    },
    {},
  );

  await embed(
    el,
    {
      // should not cause a warning
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      mark: 'bar',
      encoding: {},
    },
    {},
  );

  await embed(
    el,
    {
      $schema: 'https://vega.github.io/schema/vega/v4.json',
    },
    {},
  );

  expect(spy.mock.calls).toEqual([
    [`The input spec uses Vega-Lite v2, but the current version of Vega-Lite is v${vl.version}.`],
    [`The input spec uses Vega v4, but the current version of Vega is v${vega.version}.`],
  ]);

  spy.mockRestore();
});

test('can set loader', async () => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    loader: {
      target: '_blank',
    },
  });
  expect(result).toBeTruthy();
  expect((result.view as any)._loader.options).toEqual({
    target: '_blank',
  });
});

test('can set loader via usermeta', async () => {
  const el = document.createElement('div');
  const result = await embed(el, {
    ...vlSpec,
    usermeta: {
      embedOptions: {
        loader: {
          target: '_blank',
        },
      },
    },
  });
  expect(result).toBeTruthy();
  expect(result.embedOptions.loader).toEqual({
    target: '_blank',
  });
  expect((result.view as any)._loader.options).toEqual({
    target: '_blank',
  });
});

test('cannot set style via usermeta', async () => {
  const el = document.createElement('div');
  const result = await embed(el, {
    ...vlSpec,
    usermeta: {
      embedOptions: {
        defaultStyle: 'body {color: red}',
      },
    },
  });
  expect(result).toBeTruthy();
  expect(result.embedOptions.defaultStyle).toBe(false);
});

test.each([5, {svg: 2, png: 5}, {svg: 2}, {png: 5}])('can set scaleFactor', async (scaleFactor) => {
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {
    scaleFactor,
  });
  expect(result).toBeTruthy();
});
