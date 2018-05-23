import { View } from 'vega';
import { isObject } from 'vega-util';
import embed, { EmbedOptions, VisualizationSpec } from './embed';

/**
 * Create a promise to an HTML Div element with an embedded Vega-Lite or Vega visualization.
 * The element has a value property with the view. By default all actions except for the editor action are disabled.
 *
 * The main use case is in [Observable](https://observablehq.com/).
 */
export async function container(spec: VisualizationSpec | string, opt: EmbedOptions = {}) {
  const div = document.createElement('div') as HTMLDivElement & { value: View };

  const actions =
    opt.actions === true || opt.actions === false
      ? opt.actions
      : { export: true, source: false, compiled: true, editor: true, ...(opt.actions || {}) };

  return embed(div, spec, {
    actions,
    defaultStyle: true,
    runAsync: true,
    ...(opt || {}),
  }).then(result => {
    div.value = result.view;
    return div;
  });
}
