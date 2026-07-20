export interface SchedulerStubCalls {
  yield: number;
}

/**
 * jsdom has no Prioritized Task Scheduling API. This hand-rolled stub resolves
 * `yield` immediately and counts calls so tests can assert how often the
 * pipeline yielded. vega-embed must never post tasks itself (consumers wrap
 * `embed()` in their own `scheduler.postTask`), so `postTask` throws.
 */
export function createSchedulerStub(): {stub: Scheduler; calls: SchedulerStubCalls} {
  const calls: SchedulerStubCalls = {yield: 0};

  const stub: Scheduler = {
    postTask() {
      throw new Error('vega-embed must not call scheduler.postTask');
    },
    yield() {
      calls.yield++;
      return Promise.resolve();
    },
  };

  return {stub, calls};
}
