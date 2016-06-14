var d3 = require('d3'),
    vg = require('vega'),
    vl = require('vega-lite'),
    parameter = require('./parameter'),
    post = require('./post');

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
  vg.util.load({url: url}, function(err, data) {
    var opt;
    if (err || !data) {
      console.error(err || ('No data found at ' + url));
    } else {
      // marshal embedding spec and restart
      if (!arg) { // Loading embed spec from URL
        opt = JSON.parse(data);
      } else {  // Loading vg/vl spec or config from URL
        opt = vg.util.extend({}, arg);
        opt[prop] = prop === 'source' ? data : JSON.parse(data);
      }
      embed(el, opt, callback);
    }
  });
}

// Embed a Vega visualization component in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// opt: Embedding specification (parsed JSON or URL string)
// callback: invoked with the generated Vega View instance
function embed(el, opt, callback) {
  var cb = callback || function(){},
      params = [], source, spec, mode, config;

  try {
    // Load the visualization specification.
    if (vg.util.isString(opt)) {
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
    if (vg.util.isString(opt.config)) {
      return load(opt.config, opt, 'config', el, callback);
    } else if (opt.config) {
      config = opt.config;
    }

    // ensure container div has class 'vega-embed'
    var div = d3.select(el)
      .classed('vega-embed', true)
      .html(''); // clear container

    // handle parameters
    if (opt.parameters) {
      var elp = opt.parameter_el ? d3.select(opt.parameter_el) : div;
      var pdiv = elp.append('div')
        .attr('class', 'vega-params');
      params = opt.parameters.map(function(p) {
        return parameter.init(pdiv, p, spec);
      });
    }
  } catch (err) { cb(err); }

  vg.parse.spec(spec, config, function(error, chart) {
    if (error) { cb(error); return; }
    try {
      var renderer = opt.renderer || 'canvas',
          actions  = opt.actions || {};

      var view = chart({
        el: el,
        data: opt.data || undefined,
        renderer: renderer
      });

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
              this.href = view.toImageURL(ext);
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

      // bind all parameter elements
      params.forEach(function(p) { parameter.bind(p, view); });

      // initialize and return visualization
      view.update();
      cb(null, {view: view, spec: spec});
    } catch (err) { cb(err); }
  });
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
