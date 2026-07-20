import {TopLevelSpec} from 'vega-lite';
import {afterEach, expect, test, vi} from 'vitest';
import embed from '../src/embed';
import {resolveScheduling, yieldToMain} from '../src/scheduler';
import {createSchedulerStub} from './scheduler-stub';

const vlSpec: TopLevelSpec = {
  data: {values: [1, 2, 3]},
  encoding: {},
  mark: 'point',
};

afterEach(() => {
  vi.unstubAllGlobals();
});

test('resolveScheduling treats undefined and false as disabled', () => {
  expect(resolveScheduling(undefined).enabled).toBe(false);
  expect(resolveScheduling(false).enabled).toBe(false);
});

test('resolveScheduling treats true as enabled without a signal', () => {
  expect(resolveScheduling(true)).toEqual({enabled: true, signal: undefined});
});

test('resolveScheduling passes the signal through so aborts reach the pipeline seams', () => {
  const controller = new AbortController();
  expect(resolveScheduling({signal: controller.signal})).toEqual({
    enabled: true,
    signal: controller.signal,
  });
  expect(resolveScheduling({}).signal).toBeUndefined();
});

test('yieldToMain resolves and yields once', async () => {
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  await expect(yieldToMain()).resolves.toBeUndefined();
  expect(calls.yield).toBe(1);
});

test('yieldToMain throws the signal reason without yielding when already aborted', async () => {
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  const reason = new Error('stop embedding');
  const controller = new AbortController();
  controller.abort(reason);
  await expect(yieldToMain(controller.signal)).rejects.toBe(reason);
  expect(calls.yield).toBe(0);
});

test('yieldToMain throws the signal reason when the signal aborts while parked', async () => {
  const {stub} = createSchedulerStub();
  const reason = new Error('stop embedding');
  const controller = new AbortController();
  stub.yield = () => {
    controller.abort(reason);
    return Promise.resolve();
  };
  vi.stubGlobal('scheduler', stub);
  await expect(yieldToMain(controller.signal)).rejects.toBe(reason);
});

// scheduling must be opted into by the embedding page: spec content must not be able to change
// how the host page's main thread is chunked or carry an AbortSignal
test('usermeta cannot enable scheduling', async () => {
  expect(globalThis.scheduler).toBeUndefined();
  const el = document.createElement('div');
  const result = await embed(el, {
    ...vlSpec,
    usermeta: {
      embedOptions: {
        scheduling: true,
      },
    },
  });
  expect(result).toBeTruthy();
  expect(result.embedOptions.scheduling).toBeUndefined();
});

test('resolveScheduling treats null and other falsy non-false values as disabled', () => {
  expect(resolveScheduling(null as never).enabled).toBe(false);
  expect(resolveScheduling(0 as never).enabled).toBe(false);
  expect(resolveScheduling('' as never).enabled).toBe(false);
});

test('yieldToMain falls back to setTimeout without a scheduler global', async () => {
  expect(globalThis.scheduler).toBeUndefined();
  const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
  await expect(yieldToMain()).resolves.toBeUndefined();
  expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
  setTimeoutSpy.mockRestore();
});

test('yieldToMain falls back to setTimeout for a partial scheduler missing yield', async () => {
  const {stub} = createSchedulerStub();
  vi.stubGlobal('scheduler', {postTask: stub.postTask});
  const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
  await expect(yieldToMain()).resolves.toBeUndefined();
  expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
  setTimeoutSpy.mockRestore();
});

test('an inherited scheduling property cannot enable scheduling', async () => {
  // a recording stub is installed so a broken hasOwn guard cannot slip through via the
  // setTimeout fallback: zero recorded yields proves scheduling stayed disabled
  const {stub, calls} = createSchedulerStub();
  vi.stubGlobal('scheduler', stub);
  // simulate prototype pollution reachable through usermeta option merging; non-enumerable so
  // vega's own object iteration is unaffected and only the inherited-read path is exercised
  Object.defineProperty(Object.prototype, 'scheduling', {value: true, configurable: true, enumerable: false});
  try {
    const el = document.createElement('div');
    const result = await embed(el, vlSpec);
    expect(result).toBeTruthy();
    expect(calls.yield).toBe(0);
  } finally {
    delete (Object.prototype as Record<string, unknown>).scheduling;
  }
});
