export interface EmbedSchedulingOptions {
  signal?: AbortSignal;
}

export interface ResolvedScheduling {
  enabled: boolean;
  signal?: AbortSignal;
}

export function resolveScheduling(scheduling?: boolean | EmbedSchedulingOptions): ResolvedScheduling {
  if (scheduling === true) {
    return {enabled: true, signal: undefined};
  }
  if (typeof scheduling !== 'object' || scheduling === null) {
    return {enabled: false, signal: undefined};
  }
  return {enabled: true, signal: scheduling.signal};
}

export async function yieldToMain(signal?: AbortSignal): Promise<void> {
  signal?.throwIfAborted();
  const schedulerGlobal = globalThis.scheduler as Scheduler | undefined;
  if (typeof schedulerGlobal?.yield === 'function') {
    await schedulerGlobal.yield();
  } else {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  signal?.throwIfAborted();
}
