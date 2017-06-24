# Vega-Embed

[![npm version](https://img.shields.io/npm/v/vega-embed.svg)](https://www.npmjs.com/package/vega-embed)

The [Vega-Embed](http://github.com/vega/vega-embed) module provides advanced support for embedding interactive Vega views into web pages. Current version supports only Vega 3 / Vega-Lite 2. The primary features include:

- Load Vega/Vega-Lite specs from source text, parsed JSON, or URLs.
- Add action links such as "View Source" and "Open in Vega Editor".


_As Vega 3's `signal` supports [bind](https://github.com/vega/vega/blob/master/PORTING_GUIDE.md#scales), the `parameter` property from the [older version of Vega-Embed](https://github.com/vega/vega-embed/releases/tag/v2.2.0) is now deprecated._

## Basic Example

You can import Vega-Embed from a local copy or (as shown below) [from CDNJS](https://cdnjs.com/libraries/vega-embed). Please replace `[VERSION]` with the correct [Vega](https://cdnjs.com/libraries/vega), [Vega-Lite](https://cdnjs.com/libraries/vega), and [Vega-Embed](https://cdnjs.com/libraries/vega-embed) versions.

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Import Vega 3 & Vega-Lite 2 js (does not have to be from cdn) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega/[VERSION]/vega.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/[VERSION]/vega-lite.js"></script>
  <!-- Import vega-embed -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/[VERSION]/vega-embed.js"></script>
</head>
<body>

<div id="vis"></div>

<script type="text/javascript">
  var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
  vega.embed('#vis', spec);
</script>
</body>
</html>
```


## API Reference

<a href="#embed" name="embed">#</a>
vega.<b>embed</b>(<i>el</i>, <i>embed_spec</i>[, <i>opt</i>][, <i>callback</i>])
[<>](https://github.com/vega/vega-embed/blob/master/src/embed.js "Source")

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)* that resolves to the instantiated [Vega `View` instance](https://github.com/vega/vega-view#vega-view) and a copy of the parsed JSON Vega spec. The embed function accepts the following arguments:

| Property| Type       | Description    |
| :------ | :--------- | :------------- |
| `el`      |  String  | A DOM element or CSS selector indicating the element on the page in which to add the embedded view. |
| `spec`    | String / Object | _String_ : A URL string** from which to load the Vega specification. <br> _Object_ :  The Vega/Vega-Lite specification as a parsed JSON object. |
| `opt`     | Object   | _(Optional)_ A JavaScript object containing options for embedding. |

*_Internet Explorer does not support [the ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) feature. To make it work correctly, please follow [the instructions on the Vega website](https://vega.github.io/vega/usage/#ie)._

**_This URL will be subject to standard browser security restrictions. Typically this URL will point to a file on the same host and port number as the web page itself._

##### Vega Embed `opt` Specification Reference

```js
var opt = {
  "mode": ...,
  "renderer" : ...,
  "onBeforeParse" : ...,
  "logLevel" : ...,
  "width" : ...,
  "height" : ...,
  "padding" : ...,
  "actions" : ...,
  "config"  : ...,
  "embedConfig": ...
}
```

| Property | Type             | Description    |
| :------- | :--------------- | :------------- |
| `mode`        | String        | If specified, tells Vega-Embed to parse the spec as `vega` or `vega-lite`. Vega-Embed will parse the [`$schema` url](https://github.com/vega/schema) if the mode is not specified. Vega-Embed will default to `vega` if neither `mode`, nor `$schema` are specified. |
| `renderer`    | String        | The renderer to use for the view. One of `"canvas"` (default) or `"svg"`. See [Vega docs](https://vega.github.io/vega/docs/api/view/#view_renderer) for details. |
|`onBeforeParse`| Function      | Modifies the spec before being parsed.|
| `logLevel`    | Level         | Sets the current log level. See [Vega docs](https://vega.github.io/vega/docs/api/view/#view_logLevel) for details. |
| `width`       | Number        | Sets the view width in pixels. See [Vega docs](https://vega.github.io/vega/docs/api/view/#view_width) for details. Note that Vega-Lite overrides this option. |
| `height`      | Number        | Sets the view height in pixels. See [Vega docs](https://vega.github.io/vega/docs/api/view/#view_height) for details. Note that Vega-Lite overrides this option. |
| `padding`     | Object        | Sets the view padding in pixels. See [Vega docs](https://vega.github.io/vega/docs/api/view/#view_padding) for details. |
| `actions`     | Boolean / Object       | Determines if action links ("Export as PNG/SVG", "View Source", "Open in Vega Editor") are included with the embedded view. If the value is `true` (default), all action links will be shown and none if the value is `false`.  This property can take a key-value mapping object that maps keys (`export`, `source`, `editor`) to boolean values for determining if each action link should be shown.  Unspecified keys will be `true` by default.  For example, if `actions` is `{export: false, source: true}`, the embedded visualization will have two links – "View Source" and "Open in Vega Editor".        |
| `config`      | String / Object | _String_ : A URL string** from which to load a [Vega](https://vega.github.io/vega/docs/config/)/[Vega-Lite](https://vega.github.io/vega-lite/docs/config.html) configuration file. <br> _Object_ : A Vega/Vega-Lite configuration as a parsed JSON object to override the [default configuration options](https://github.com/vega/vega-parser/blob/master/src/config.js) or [specify a theme](https://github.com/vega/vega-parser#configuration-reference). |
| `embedConfig` | Object | Specifies the configuration for Vega-Embed. <ul><li>`editorUrl` is the url for loading specs into editor. The default is `https://vega.github.io/editor/`. </li><li>`sourceHeader` is the HTML to inject within view source head element. </li><li>`sourceFooter` is the HTML to inject before view source closing body tag.</li></ul> |

**_This URL will be subject to standard browser security restrictions. Typically this URL will point to a file on the same host and port number as the web page itself._

<a href="#embed.config" name="embed.config">#</a>
vega.embed.<b>config</b>
[<>](https://github.com/vega/vega-embed/blob/master/src/embed.js "Source")


The `vega.embed.config` object can configure the `vega.embed` function to change the behavior of the action links through the following properties.

| Property        | Type     | Description    |
| :-------------- | :------- | :------------- |
| `editor_url`    | String   | The URL at which to open embedded Vega specs in a Vega editor. Defaults to `"http://vega.github.io/vega-editor/"`. Internally, Vega-Embed uses [HTML5 postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to pass the specification information to the editor. |
| `source_header` | String   | HTML to inject into the `` tag of the page generated by the "View Source" action link. For example, this can be used to add code for [syntax highlighting](https://highlightjs.org/). |
| `source_footer` | String   | HTML to inject into the end of the page generated by the "View Source" action link. The text will be added immediately before the closing `` tag. |



## Build Process

To build `vega-embed.js` and view the test examples, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the Vega-Embed folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files into `vega-embed.js`, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified `vega-embed.min.js`.
3. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the Vega-Embed folder and then point your web browser at the test page (e.g., `http://localhost:8000/test.html`).
