import * as vega from 'vega';
import {View, Spec as VgSpec, logger} from 'vega';
import {expressionInterpreter} from 'vega-interpreter';
import * as vl from 'vega-lite';
import {compile, TopLevelSpec} from 'vega-lite';
import {afterEach, expect, test, vi} from 'vitest';
import embed, {guessMode, Mode} from '../src/embed';
import {createSchedulerStub} from './scheduler-stub';

const vlSpec: TopLevelSpec = {
  data: {values: [1, 2, 3]},
  encoding: {},
  mark: 'point',
};

const vgSpec = compile(vlSpec).spec;

const testLogger = logger(vega.Warn);

afterEach(() => {
  vi.unstubAllGlobals();
});

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
  expect(guessMode({$schema: 'https://vega.github.io/schema/vega/v6.json'}, testLogger, 'invalid' as Mode)).toBe(
    'vega',
  );
});

test('guessMode from Vega-Lite schema', () => {
  expect(guessMode({$schema: 'https://vega.github.io/schema/vega-lite/v6.json'}, testLogger, 'invalid' as Mode)).toBe(
    'vega-lite',
  );
});

test('guessMode from Vega-Lite spec', () => {
  const unitSpec: TopLevelSpec = {data: {values: []}, mark: 'bar', encoding: {}};
  const specs: TopLevelSpec[] = [
    unitSpec,
    {layer: []},
    {repeat: {}, spec: unitSpec} as any,
    {data: {values: []}, facet: {row: {field: 'foo', type: 'nominal'}}, spec: {mark: 'bar', encoding: {}}},
    {vconcat: []},
    {hconcat: []},
  ];

  for (const spec of specs) {
    expect(guessMode(spec, testLogger, 'invalid' as Mode)).toBe('vega-lite');
  }
});

test('guessMode from Vega spec', () => {
  expect(guessMode({marks: []}, testLogger, 'invalid' as Mode)).toBe('vega');
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
    ['WARN', `The input spec uses Vega-Lite v2, but the current version of Vega-Lite is v${vl.version}.`],
    ['WARN', `The input spec uses Vega v4, but the current version of Vega is v${vega.version}.`],
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

test('can set logLevel', async () => {
  const el = document.createElement('div');
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const logLevel = vega.None;

  const faultySpec = {
    encoding: {text: {datum: 0}},
    mark: 'point',
  } as TopLevelSpec;

  const faultyVgSpec = {
    $schema: 'https://vega.github.io/schema/vega/v6.json',
    data: [{url: 'data/cars2.json'}],
  } as VgSpec;

  await embed(
    el,
    {
      $schema: '$schema": "https://vega.github.io/schema/vega-lite/v1.json',
      mark: 'bar',
    },
    {logLevel},
  );

  await embed(el, faultySpec, {logLevel});

  await embed(el, {
    ...faultySpec,
    usermeta: {
      embedOptions: {
        logLevel,
      },
    },
  });

  await embed(el, faultyVgSpec, {logLevel});

  expect(spy.mock.calls).toEqual([]);
  spy.mockRestore();
});

test('can set custom logger', async () => {
  const el = document.createElement('div');
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const spec = {
    $schema: '$schema": "https://vega.github.io/schema/vega-lite/v1.json',
    mark: 'bar',
  };

  const customLogger = logger();
  customLogger.warn = () => {
    if (customLogger.level() >= vega.Warn) console.warn('test');
    return customLogger;
  };

  // should log nothing
  await embed(el, spec, {logger: customLogger});

  // should log 'test'
  await embed(el, spec, {logger: customLogger, logLevel: vega.Warn});

  expect(spy.mock.calls).toEqual([['test']]);

  spy.mockRestore();
});

test('scheduling embeds successfully via the setTimeout fallback when no scheduler global exists', async () => {
  expect(globalThis.scheduler).toBeUndefined();
  const el = document.createElement('div');
  const result = await embed(el, vlSpec, {scheduling: true});
  expect(result.view).toBeDefined();
});

test('scheduling produces the same result shape and DOM as the default path', async () => {
  const defaultEl = document.createElement('div');
  const defaultResult = await embed(defaultEl, vlSpec);

  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const scheduledEl = document.createElement('div');
  const scheduledResult = await embed(scheduledEl, vlSpec, {scheduling: true});

  expect(scheduledResult.view).toBeDefined();
  expect(scheduledResult.spec).toEqual(defaultResult.spec);
  expect(scheduledResult.vgSpec).toEqual(defaultResult.vgSpec);
  expect(scheduledResult.finalize).toBeDefined();

  // vega generates globally unique clip ids, so normalize them before comparing markup
  const normalizeIds = (html: string) => html.replace(/clip\d+/g, 'clip');
  expect(normalizeIds(scheduledEl.innerHTML)).toBe(normalizeIds(defaultEl.innerHTML));
});

test('scheduling: true yields at every stage seam and posts no tasks', async () => {
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');
  // the stub's postTask throws, so completing proves embed never posts a task
  await embed(el, vlSpec, {scheduling: true});

  // compile, parse + view construction (one task: global locale/expression-function
  // registration must not be separated from the parse/construction that snapshots it),
  // first render, actions menu
  expect(calls.yield).toBe(4);
});

test('locale registration, parse, and view construction share one task', async () => {
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  let yieldsBeforeViewConstruction = -1;
  class RecordingView extends View {
    constructor(...args: ConstructorParameters<typeof View>) {
      super(...args);
      yieldsBeforeViewConstruction = calls.yield;
    }
  }
  const el = document.createElement('div');
  await embed(el, vlSpec, {scheduling: true, viewClass: RecordingView});

  // the view must be constructed in the continuation of the second yield — a third yield
  // before construction would reopen the global locale/expression-function race
  expect(yieldsBeforeViewConstruction).toBe(2);
});

test('scheduling is forwarded to the View constructor so vega evaluation and rendering can yield', async () => {
  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const controller = new AbortController();
  let viewOptions: Record<string, unknown> | undefined;
  class RecordingView extends View {
    constructor(...args: ConstructorParameters<typeof View>) {
      super(...args);
      viewOptions = args[1] as Record<string, unknown>;
    }
  }
  const el = document.createElement('div');
  await embed(el, vlSpec, {
    scheduling: {signal: controller.signal},
    viewClass: RecordingView,
  });

  expect(viewOptions?.scheduling).toEqual({signal: controller.signal});
});

test('the View constructor receives no scheduling option when scheduling is disabled', async () => {
  let viewOptions: Record<string, unknown> | undefined;
  class RecordingView extends View {
    constructor(...args: ConstructorParameters<typeof View>) {
      super(...args);
      viewOptions = args[1] as Record<string, unknown>;
    }
  }
  const el = document.createElement('div');
  await embed(el, vlSpec, {viewClass: RecordingView});

  expect(viewOptions).toBeDefined();
  expect('scheduling' in (viewOptions as Record<string, unknown>)).toBe(false);
});

test('a present scheduler stub records zero calls when scheduling is disabled', async () => {
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');
  await embed(el, vlSpec);

  expect(calls.yield).toBe(0);
});

test('an already-aborted scheduling signal rejects before any DOM mutation', async () => {
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');
  const existingChild = document.createElement('span');
  el.appendChild(existingChild);
  const reason = new Error('cancelled before start');
  const controller = new AbortController();
  controller.abort(reason);

  await expect(embed(el, vlSpec, {scheduling: {signal: controller.signal}})).rejects.toBe(reason);
  expect(el.classList.contains('vega-embed')).toBe(false);
  expect(Array.from(el.children)).toEqual([existingChild]);
  expect(calls.yield).toBe(0);
});

test('aborting at the first yield stops embedding before any actions menu is added', async () => {
  const {stub} = createSchedulerStub();
  const reason = new Error('stop embedding');
  const controller = new AbortController();
  stub.yield = () => {
    controller.abort(reason);
    return Promise.resolve();
  };
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');

  await expect(embed(el, vlSpec, {scheduling: {signal: controller.signal}})).rejects.toBe(reason);
  expect(el.querySelector('.vega-actions')).toBeNull();
});

// finalizing the already-constructed view on abort is what prevents listener and dataflow timer leaks
test('aborting after the view is constructed finalizes the view and rejects with the custom reason', async () => {
  const finalizeSpy = vi.spyOn(View.prototype, 'finalize');
  const {stub} = createSchedulerStub();
  // custom non-Error reason must surface unchanged, not a synthesized error
  const reason = 'custom abort reason';
  const controller = new AbortController();
  let yields = 0;
  stub.yield = () => {
    yields++;
    if (yields === 3) {
      controller.abort(reason);
    }
    return Promise.resolve();
  };
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');

  await expect(embed(el, vlSpec, {scheduling: {signal: controller.signal}})).rejects.toBe(reason);
  expect(yields).toBe(3);
  expect(finalizeSpy).toHaveBeenCalledTimes(1);
  finalizeSpy.mockRestore();
});

test('aborting after embed has resolved has no effect', async () => {
  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const controller = new AbortController();
  const el = document.createElement('div');

  const result = await embed(el, vlSpec, {scheduling: {signal: controller.signal}});
  controller.abort(new Error('too late'));

  expect(el.querySelector('svg')).not.toBeNull();
  expect(el.querySelector('.vega-actions')).not.toBeNull();
  expect(() => result.finalize()).not.toThrow();
});

test('scheduling builds the complete actions menu after the final yield', async () => {
  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');
  await embed(el, vlSpec, {scheduling: true});

  expect(el.children[1].tagName).toBe('DETAILS');
  expect(el.children[1].children[1].classList[0]).toBe('vega-actions');
  expect(el.children[1].children[1].childElementCount).toBe(5);
});

test('scheduling with actions disabled skips the actions-menu yield', async () => {
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');
  await embed(el, vlSpec, {scheduling: true, actions: false});

  expect(calls.yield).toBe(3);
});

// embed() checks the signal before any spec/config fetch so a pre-aborted embed does no network work
test('an already-aborted signal prevents loading a URL spec', async () => {
  const reason = new Error('cancelled before load');
  const controller = new AbortController();
  controller.abort(reason);
  const load = vi.fn();
  const el = document.createElement('div');

  await expect(
    embed(el, 'https://example.com/spec.json', {loader: {load} as never, scheduling: {signal: controller.signal}}),
  ).rejects.toBe(reason);
  expect(load).not.toHaveBeenCalled();
});

test('aborting during the first render rejects even with actions disabled', async () => {
  const finalizeSpy = vi.spyOn(View.prototype, 'finalize');
  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const reason = new Error('abort mid-render');
  const controller = new AbortController();
  const runAsyncSpy = vi.spyOn(View.prototype, 'runAsync').mockImplementation(function (this: View) {
    controller.abort(reason);
    return Promise.resolve(this);
  });
  const el = document.createElement('div');

  await expect(embed(el, vlSpec, {actions: false, scheduling: {signal: controller.signal}})).rejects.toBe(reason);
  expect(finalizeSpy).toHaveBeenCalledTimes(1);
  expect(el.classList).toHaveLength(0);
  expect(el.children).toHaveLength(0);
  runAsyncSpy.mockRestore();
  finalizeSpy.mockRestore();
});

test('a genuine pipeline error with scheduling enabled propagates and clears the container', async () => {
  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const failure = new Error('render exploded');
  const runAsyncSpy = vi.spyOn(View.prototype, 'runAsync').mockRejectedValue(failure);
  const el = document.createElement('div');

  await expect(embed(el, vlSpec, {scheduling: true})).rejects.toBe(failure);
  expect(el.children).toHaveLength(0);
  expect(el.classList).toHaveLength(0);
  runAsyncSpy.mockRestore();
});

test('a throwing finalize during abort cleanup neither masks the reason nor skips the reset', async () => {
  const finalizeSpy = vi.spyOn(View.prototype, 'finalize').mockImplementation(() => {
    throw new Error('finalize exploded');
  });
  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const reason = new Error('abort mid-render');
  const controller = new AbortController();
  const runAsyncSpy = vi.spyOn(View.prototype, 'runAsync').mockImplementation(function (this: View) {
    controller.abort(reason);
    return Promise.resolve(this);
  });
  const el = document.createElement('div');

  await expect(embed(el, vlSpec, {actions: false, scheduling: {signal: controller.signal}})).rejects.toBe(reason);
  expect(el.children).toHaveLength(0);
  expect(el.classList).toHaveLength(0);
  runAsyncSpy.mockRestore();
  finalizeSpy.mockRestore();
});

// abort cleanup resets the container only while this embed still owns it (containerOwners): a newer
// embed can take ownership of the element while the aborted one is parked at a yield
test('a delayed abort cleanup does not wipe a newer embed into the same element', async () => {
  const {stub} = createSchedulerStub();
  const reason = new Error('superseded');
  const controller = new AbortController();
  let releaseParkedYield!: () => void;
  const parkedYield = new Promise<void>((resolve) => {
    releaseParkedYield = resolve;
  });
  let yields = 0;
  stub.yield = () => {
    yields++;
    // park the first embed at the seam after it has claimed the element (yield 2, before the
    // parse/view-construction task)
    return yields === 2 ? parkedYield : Promise.resolve();
  };
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');

  const first = embed(el, vlSpec, {scheduling: {signal: controller.signal}});
  while (yields < 2) {
    await new Promise((resolve) => setTimeout(resolve));
  }
  controller.abort(reason);

  const second = await embed(el, vlSpec);
  // the first embed stays parked until released, so its rejection settles only after the
  // assertion below has attached its handler
  releaseParkedYield();
  await expect(first).rejects.toBe(reason);

  expect(second.view).toBeDefined();
  expect(el.querySelector('svg')).not.toBeNull();
  expect(el.classList.contains('vega-embed')).toBe(true);
});

test('aborting at the actions-menu boundary clears the container', async () => {
  const finalizeSpy = vi.spyOn(View.prototype, 'finalize');
  const {stub} = createSchedulerStub();
  const reason = new Error('late abort');
  const controller = new AbortController();
  let yields = 0;
  stub.yield = () => {
    yields++;
    // the fourth yield is the seam right before the actions menu is built
    if (yields === 4) {
      controller.abort(reason);
    }
    return Promise.resolve();
  };
  vi.stubGlobal('scheduler', stub);
  const el = document.createElement('div');

  await expect(embed(el, vlSpec, {scheduling: {signal: controller.signal}})).rejects.toBe(reason);
  expect(finalizeSpy).toHaveBeenCalledTimes(1);
  expect(el.children).toHaveLength(0);
  expect(el.classList).toHaveLength(0);
  finalizeSpy.mockRestore();
});
