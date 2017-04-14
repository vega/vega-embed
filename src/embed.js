var d3 = require('d3-selection'),
    vega = require('vega'),
    vl = require('vega-lite'),
    post = require('./post'),
    versionCompare = require('./version'),
    schemaParser = require('vega-schema-url-parser').default;


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

var VERSION = {
  'vega':      vega.version,
  'vega-lite': vl.version
}

var PREPROCESSOR = {
  'vega':      function(vgjson) { return vgjson; },
  'vega-lite': function(vljson) { return vl.compile(vljson).spec; }
};

function load(url, arg, prop, el, callback) {
  var loader = vega.loader();
  loader.load(url).then(function(data) {
    if (!data) {
      console.error('No data found at ' + url);
    } else {
      if (prop === 'config') {
        arg.opt['config'] = JSON.parse(data);
        embed(el, arg.spec, arg.opt, callback);
      } else {
        embed(el, JSON.parse(data), arg, callback);
      }
    }
  }).catch(function(error){
    console.error(error);
  });
}

// Embed a Vega visualization component in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// spec : String : A URL string from which to load the Vega specification.
//        Object : The Vega/Vega-Lite specification as a parsed JSON object.
// opt: A JavaScript object containing options for embedding.
// callback: invoked with the generated Vega View instance
function embed(el, spec, opt, callback) {
  var cb = callback || function(){}, source,
  renderer = (opt && opt.renderer) || 'canvas',
  actions  = opt && (opt.actions !== undefined) ? opt.actions : true,
  mode;
  opt = opt || {};
  try {
    // Load the visualization specification.
    if (vega.isString(spec)) {
      return load(spec, opt, 'url', el, callback);
    } else {
      source = JSON.stringify(spec, null, 2);
    }

    // Load Vega theme/configuration.
    if (vega.isString(opt.config)) {
      return load(opt.config, {spec: spec, opt: opt}, 'config', el, callback);
    }

    // Decide mode
    var parsed, parsedVersion;
    if (spec.$schema) {
      parsed = schemaParser(spec.$schema);
      if (opt.mode && opt.mode !== MODES[parsed.library]) {
        console.warn("The given visualization spec is written in \"" + parsed.library + "\", "
                   + "but mode argument is assigned as \"" + mode + "\".");
      }
      mode = MODES[parsed.library];

      parsedVersion = parsed.version.replace(/^v/g,'');
      if (versionCompare(parsedVersion, VERSION[mode]) !== 0 ){
        console.warn("The input spec uses \"" + mode + "\" " + parsedVersion + ", "
                   + "but current version of \"" + mode + "\" is " + VERSION[mode] + ".");
      }
    } else {
      mode = MODES[opt.mode] || MODES.vega;
    }

    spec = PREPROCESSOR[mode](spec);
    if (mode === MODES['vega-lite']) {
      if (spec.$schema) {
        parsed = schemaParser(spec.$schema);
        parsedVersion = parsed.version.replace(/^v/g,'');
        if (versionCompare(parsedVersion, VERSION['vega']) !== 0 ){
          console.warn("The compiled spec uses \"vega\" " + parsedVersion + ", "
                     + "but current version of \"vega\" is " + VERSION['vega'] + ".");
        }
      }
    }

    // ensure container div has class 'vega-embed'
    var div = d3.select(el)
      .classed('vega-embed', true)
      .html(''); // clear container

  } catch (err) { cb(err); }

  var runtime = vega.parse(spec, opt.config); // may throw an Error if parsing fails
  try {
    var view = new vega.View(runtime)
      .logLevel(vega.Warn)
      .initialize(el)
      .renderer(renderer)
      .hover()
      .run();

    if (actions !== false) {
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

// for es5
module.exports = embed;
// for es 6
module.exports.default = embed;
