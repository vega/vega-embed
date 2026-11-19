import {View} from 'vega';
import embed, {EmbedOptions, VisualizationSpec} from './embed.js';

const lifecycleTag = 'vega-embed-lifecycle';

interface LifecycleElement extends HTMLElement {
  cleanup?: () => void;
}

/**
 * Create a promise to an HTML Div element with an embedded Vega-Lite or Vega visualization.
 * The element has a value property with the view. By default all actions except for the editor action are disabled.
 *
 * The main use case is in [Observable](https://observablehq.com/).
 * The view is finalized when the wrapper is removed from the document.
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

  // Use a child element to track connection without changing the returned div.
  if (!customElements.get(lifecycleTag)) {
    customElements.define(
      lifecycleTag,
      class extends HTMLElement implements LifecycleElement {
        cleanup?: () => void;

        disconnectedCallback() {
          // Moving the wrapper within the document also disconnects this node.
          queueMicrotask(() => {
            if (!this.isConnected) {
              const cleanup = this.cleanup;
              this.cleanup = undefined;
              cleanup?.();
            }
          });
        }
      },
    );
  }
  const lifecycle = document.createElement(lifecycleTag) as LifecycleElement;
  lifecycle.hidden = true;
  lifecycle.cleanup = result.finalize;
  wrapper.append(lifecycle);

  return wrapper;
}
