import {View} from 'vega';
import embed, {EmbedOptions, VisualizationSpec} from './embed.js';

const lifecycleTag = 'vega-embed-lifecycle';

interface Lifecycle extends HTMLElement {
  finalize?: () => void;
}

/**
 * Creates an element that calls `finalize` when it is removed from the document.
 * The custom element is defined on first use because `HTMLElement` does not exist outside the browser.
 */
function createLifecycle(finalize: () => void) {
  if (!customElements.get(lifecycleTag)) {
    customElements.define(
      lifecycleTag,
      class extends HTMLElement implements Lifecycle {
        finalize?: () => void;

        disconnectedCallback() {
          // A move within the document also disconnects the element, so check again after the move completes.
          queueMicrotask(() => {
            if (!this.isConnected) {
              this.finalize?.();
              this.finalize = undefined;
            }
          });
        }
      },
    );
  }
  const lifecycle = document.createElement(lifecycleTag) as Lifecycle;
  lifecycle.finalize = finalize;
  return lifecycle;
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

  wrapper.append(createLifecycle(result.finalize));

  return wrapper;
}
