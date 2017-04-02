# vega-embed

[![npm version](https://img.shields.io/npm/v/vega-embed.svg)](https://www.npmjs.com/package/vega-embed)

The [vega-embed](http://github.com/vega/vega-embed) module provides advanced support for embedding interactive Vega views into web pages. Current version supports only Vega 3 / Vega-Lite 2. The primary features include:

- Load Vega/Vega-Lite specs from source text, parsed JSON, or URLs.
- Add action links such as "View Source" and "Open in Vega Editor".


_As Vega 3's `signal` supports [bind](https://github.com/vega/vega/blob/master/PORTING_GUIDE.md#scales), `parameter` property from the [older version of vega-embed](https://github.com/vega/vega-embed/releases/tag/v2.2.0) is now deprecated._

## Basic Example

You can import vega-embed from a local copy or (as shown below) [from CDNJS](https://cdnjs.com/libraries/vega-embed). 

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Import Vega 3 & Vega-Lite 2 js (does not have to be from cdn) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega/3.0.0-beta.25/vega.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/2.0.0-alpha.7/vega-lite.js"></script>
  <!-- Import vega-embed -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/3.0.0-beta.7/vega-embed.js"></script>
</head>
<body>

<div id="vis"></div>

<script type="text/javascript">
  var spec = "https://raw.githubusercontent.com/vega/vega/master/test/specs-valid/bar.vg.json";
  vega.embed('#vis', spec);
</script>
</body>
</html>
```


## API Reference

<a href="#embed" name="embed">#</a>
vega.<b>embed</b>(<i>el</i>, <i>embed_spec</i>[, <i>opt</i>][, <i>callback</i>])
[<>](https://github.com/vega/vega-embed/src/embed.js "Source")

The embed function accepts the following arguments:

| Property| Type       | Description    |
| :------ | :--------- | :------------- |
| `el`      |  String  | A DOM element or CSS selector indicating the element on the page in which to add the embedded view. |
| `spec`    | String / Object | _String_ : A URL string* from which to load the Vega specification. <br> _Object_ :  The Vega/Vega-Lite specification as a parsed JSON object. |
| `opt`     | Object   | _(Optional)_ A JavaScript object containing options for embedding. |
| `callback`| Function | _(Optional)_ An optional callback function that upon successful parsing will be invoked with the instantiated [Vega `View` instance](https://github.com/vega/vega-view#vega-view) and a copy of the parsed JSON Vega spec. |

*_Note that this URL will be subject to standard browser security restrictions. Typically this URL will point to a file on the same host and port number as the web page itself._

##### Vega Embed `opt` Specification Reference

```js
var opt = {
  "mode": ...,
  "renderer" : ...,
  "actions" : ...,
  "config"  : ...
}
```

| Property | Type             | Description    |
| :------- | :--------------- | :------------- |
| `mode`        | String        | If specified, tells vega-embed to parse the spec as `vega` or `vega-lite`. Vega-embed will parse the [`$schema` url](https://github.com/vega/schema) if the mode is not specified. Vega-embed will default to `vega` if neither `mode`, nor `$schema` are specified. |
| `renderer`    | String        | The renderer to use for the view. One of `"canvas"` (default) or `"svg"`. |
| `actions`     | Boolean / Object       | Determines if action links ("Export as PNG/SVG", "View Source", "Open in Vega Editor") are included with the embedded view. If the value is `true` (default), all action links will be shown and none if the value is `false`.  This property can take a key-value mapping object that maps keys (`export`, `source`, `editor`) to boolean values for determining if each action link should be shown.  Unspecified keys will be `true` by default.  For example, if `actions` is `{export: false, source: true}`, the embedded visualization will have two links – "View Source" and "Open in Vega Editor".        |
| `config`      | Object        | An optional object to override the [default configuration options](https://github.com/vega/vega-parser/blob/master/src/config.js) or [specify a theme](https://github.com/vega/vega-parser#configuration-reference). |



<a href="#embed.config" name="embed.config">#</a>
vega.embed.<b>config</b>
[<>](https://github.com/vega/vega-embed/src/embed.js "Source")


The `vega.embed.config` object can configure the `vega.embed` function to change the behavior of the action links through the following properties.

| Property        | Type     | Description    |
| :-------------- | :------- | :------------- |
| `editor_url`    | String   | The URL at which to open embedded Vega specs in a Vega editor. Defaults to `"http://vega.github.io/vega-editor/"`. Internally, vega-embed uses [HTML5 postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to pass the specification information to the editor. |
| `source_header` | String   | HTML to inject into the `` tag of the page generated by the "View Source" action link. For example, this can be used to add code for [syntax highlighting](https://highlightjs.org/). |
| `source_footer` | String   | HTML to inject into the end of the page generated by the "View Source" action link. The text will be added immediately before the closing `` tag. |



## Build Process

To build `vega-embed.js` and view the test examples, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the vega-embed folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files into vega-embed.js, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified vega-embed.min.js.
3. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the vega-embed folder and then point your web browser at the test page (e.g., `http://localhost:8000/test.html`).
