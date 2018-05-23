import { View } from 'vega';
import { isObject } from 'vega-util';
import embedContainerStyle from '../vega-embed-container.css';
import embed, { EmbedOptions, VisualizationSpec } from './embed';

const SVG_CIRCLES = `
<svg viewBox="0 0 16 16" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
  <circle r="2" cy="8" cx="2"></circle>
  <circle r="2" cy="8" cx="8"></circle>
  <circle r="2" cy="8" cx="14"></circle>
</svg>`;

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
    _actionsWrapperContent: SVG_CIRCLES,
    actions,
    defaultStyle: embedContainerStyle,
    runAsync: true,
    ...(opt || {}),
  }).then(result => {
    div.value = result.view;
    return div;
  });
}
