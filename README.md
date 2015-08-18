# vega-embed

Publish Vega visualizations as embedded web components.

## Build Process

To build `vega-embed.js` and view the test examples, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the vega-embed folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files into vega-embed.js, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified vega-embed.min.js.
3. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the vega-embed folder and then point your web browser at the test directory (e.g., `http://localhost:8000/test/`).
