import {View} from 'vega';
import embed, {EmbedOptions, VisualizationSpec} from './embed.js';

/**
 * Create a promise to an HTML Div element with an embedded Vega-Lite or Vega visualization.
 * The element has a value property with the view. By default all actions except for the editor action are disabled.
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
  return wrapper;
}
