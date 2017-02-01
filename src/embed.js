var d3 = require('d3'),
    vega = require('vega'),
    vl = require('vega-lite'),
    post = require('./post')
    ural_parser = require('vega-schema-url-parser');

var config = {
  // URL for loading specs into editor
  editor_url: 'http://vega.github.io/vega-editor/',

  // HTML to inject within view source head element
  source_header: '',

  // HTML to inject before view source closing body tag
  source_footer: ''
};

var MODES = {
  'vega':      'vega',
  'vega-lite': 'vega-lite'
};

var PREPROCESSOR = {
  'vega':      function(vgjson) { return vgjson; },
  'vega-lite': function(vljson) { return vl.compile(vljson).spec; }
};

function load(url, arg, prop, el, callback) {
  var loader = vega.loader();
  loader.load(url).then(function(data) {
    var opt;
    if (!data) {
      console.error('No data found at ' + url);
    } else {
      // marshal embedding spec and restart
      if (!arg) { // Loading embed spec from URL
        opt = JSON.parse(data);
      } else {  // Loading vg/vl spec or config from URL
        opt = vega.extend({}, arg);
        opt[prop] = prop === 'source' ? data : JSON.parse(data);
      }
      embed(el, opt, callback);
    }
  }).catch(function(error){
    console.error(error);
  });
}

// Embed a Vega visualization component in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// opt: Embedding specification (parsed JSON or URL string)
// callback: invoked with the generated Vega View instance
function embed(el, opt, callback) {
  var cb = callback || function(){}, source, spec, mode, config;

  try {
    // Load the visualization specification.
    if (vega.isString(opt)) {
      return load(opt, null, null, el, callback);
    } else if (opt.source) {
      source = opt.source;
      spec = JSON.parse(source);
    } else if (opt.spec) {
      spec = opt.spec;
      source = JSON.stringify(spec, null, 2);
    } else if (opt.url) {
      return load(opt.url, opt, 'source', el, callback);
    } else {
      spec = opt;
      source = JSON.stringify(spec, null, 2);
      opt = {spec: spec, actions: false};
    }
    mode = MODES[opt.mode] || MODES.vega;
    spec = PREPROCESSOR[mode](spec);

    // Load Vega theme/configuration.
    if (vega.isString(opt.config)) {
      return load(opt.config, opt, 'config', el, callback);
    } else if (opt.config) {
      config = opt.config;
    }

    // ensure container div has class 'vega-embed'
    var div = d3.select(el)
      .classed('vega-embed', true)
      .html(''); // clear container

  } catch (err) { cb(err); }

  var renderer = opt.renderer || 'canvas',
      actions  = opt.actions || {};

  const runtime = vega.parse(spec); // may throw an Error if parsing fails
  try {
    var view = new vega.View(runtime)
      .logLevel(vega.Warn)
      .initialize(document.querySelector(el))
      .renderer(renderer)
      .hover()
      .run();

    if (opt.actions !== false) {
      // add child div to house action links
      var ctrl = div.append('div')
        .attr('class', 'vega-actions');

      // add 'Export' action
      if (actions.export !== false) {
        var ext = (renderer==='canvas' ? 'png' : 'svg');
        ctrl.append('a')
          .text('Export as ' + ext.toUpperCase())
          .attr('href', '#')
          .attr('target', '_blank')
          .attr('download', (spec.name || 'vega') + '.' + ext)
          .on('mousedown', function() {
            var that = this;
            view.toImageURL(ext).then(function(url) {
              that.href =  url;
            }).catch(function(error) { throw error; });
            d3.event.preventDefault();
          });
      }

      // add 'View Source' action
      if (actions.source !== false) {
        ctrl.append('a')
          .text('View Source')
          .attr('href', '#')
          .on('click', function() {
            viewSource(source);
            d3.event.preventDefault();
          });
      }

      // add 'Open in Vega Editor' action
      if (actions.editor !== false) {
        ctrl.append('a')
          .text('Open in Vega Editor')
          .attr('href', '#')
          .on('click', function() {
            post(window, embed.config.editor_url, {spec: source, mode: mode});
            d3.event.preventDefault();
          });
      }
    }

    cb(null, {view: view, spec: spec});
  } catch (err) { cb(err); }
}

function viewSource(source) {
  var header = '<html><head>' + config.source_header + '</head>' + '<body><pre><code class="json">';
  var footer = '</code></pre>' + config.source_footer + '</body></html>';
  var win = window.open('');
  win.document.write(header + source + footer);
  win.document.title = 'Vega JSON Source';
}

// make config externally visible
embed.config = config;

module.exports = embed;
