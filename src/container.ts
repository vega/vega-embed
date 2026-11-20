import {View} from 'vega';
import embed, {EmbedOptions, VisualizationSpec} from './embed.js';

const lifecycleTag = 'vega-embed-lifecycle';

/**
 * Calls `finalize` when it is removed from the document.
 * A move within the document also disconnects the element, so we check again after the move completes.
 */
class Lifecycle extends HTMLElement {
  finalize?: () => void;

  disconnectedCallback() {
    queueMicrotask(() => {
      if (!this.isConnected) {
        this.finalize?.();
        this.finalize = undefined;
      }
    });
  }
}

/**
 * Create a promise to an HTML Div element with an embedded Vega-Lite or Vega visualization.
 * The element has a value property with the view. By default all actions except for the editor action are disabled.
 * The visualization is finalized when the element is removed from the document.
 *
 * The main use case is in [Observable](https://observablehq.com/).
 */
export default async function (spec: VisualizationSpec | string, opt: EmbedOptions = {}) {
  const wrapper = document.createElement('div') as HTMLDivElement & {value: View};
  wrapper.classList.add('vega-embed-wrapper');

  const div = document.createElement('div');
  wrapper.appendChild(div);

  const actions =
    opt.actions === true || opt.actions === false
      ? opt.actions
      : {export: true, source: false, compiled: true, editor: true, ...opt.actions};

  const result = await embed(div, spec, {
    actions,
    ...opt,
  });

  wrapper.value = result.view;

  if (!customElements.get(lifecycleTag)) {
    customElements.define(lifecycleTag, Lifecycle);
  }
  const lifecycle = document.createElement(lifecycleTag) as Lifecycle;
  lifecycle.finalize = result.finalize;
  wrapper.append(lifecycle);

  return wrapper;
}
