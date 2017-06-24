var d3 = require('d3-selection');
var vega = require('vega');
var vl = require('vega-lite');
var post = require('./post');
var versionCompare = require('./version');
var schemaParser = require('vega-schema-url-parser').default;


var MODES = {
  'vega':      'vega',
  'vega-lite': 'vega-lite'
};

var VERSION = {
  'vega':      vega.version,
  'vega-lite': vl ? vl.version : -1
};

var PREPROCESSOR = {
  'vega':      function(vgjson) { return vgjson; },
  'vega-lite': function(vljson) { return vl.compile(vljson).spec; }
};

function load(url, arg, prop, el) {
  return vega.loader().load(url).then(function (data) {
    if (!data) {
      throw new Error('No data found at ' + url);
    }
    if (prop === 'config') {
      arg.opt['config'] = JSON.parse(data);
      return embed(el, arg.spec, arg.opt);
    }
    return embed(el, JSON.parse(data), arg);
  });
}

/**
 * Embed a Vega visualization component in a web page.
 * This function will either throw an exception, or return a promise
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector)
 * @param spec      String : A URL string from which to load the Vega specification.
                    Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
function embed(el, spec, opt) {
  opt = opt || {};
  var renderer = opt.renderer || 'canvas';
  var actions  = opt.actions !== undefined ? opt.actions : true;

  // Load the visualization specification.
  if (vega.isString(spec)) {
    return load(spec, opt, 'url', el);
  }

  // Load Vega theme/configuration.
  if (vega.isString(opt.config)) {
    return load(opt.config, {spec: spec, opt: opt}, 'config', el);
  }

  // Decide mode
  var parsed, parsedVersion, mode, vgSpec;
  if (spec.$schema) {
    parsed = schemaParser(spec.$schema);
    if (opt.mode && opt.mode !== MODES[parsed.library]) {
      console.warn("The given visualization spec is written in \"" + parsed.library + "\", "
                 + "but mode argument is assigned as \"" + opt.mode + "\".");
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

  vgSpec = PREPROCESSOR[mode](spec);
  if (mode === MODES['vega-lite']) {
    if (vgSpec.$schema) {
      parsed = schemaParser(vgSpec.$schema);

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

  if (opt.onBeforeParse) {
    // Allow Vega spec to be modified before being used
    vgSpec = opt.onBeforeParse(vgSpec);
  }


  var runtime = vega.parse(vgSpec, opt.config); // may throw an Error if parsing fails

  var view = new vega.View(runtime, opt.viewConfig)
    .logLevel(opt.logLevel | vega.Warn)
    .initialize(el)
    .renderer(renderer);

  // Vega-Lite does not need hover so we can improve perf by not activating it
  if (mode !== MODES['vega-lite']) {
    view.hover();
  }

  if (opt) {
    if (opt.width) {
      view.width(opt.width)
    }
    if (opt.height) {
      view.height(opt.height)
    }
    if (opt.padding) {
      view.padding(opt.padding)
    }
  }

  view.run();

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
          viewSource(JSON.stringify(spec, null, 2), opt.sourceHeader || '', opt.sourceFooter || '');
          d3.event.preventDefault();
        });
    }

    // add 'Open in Vega Editor' action
    if (actions.editor !== false) {
      var editorUrl = opt.editorUrl || 'https://vega.github.io/editor/'
      ctrl.append('a')
        .text('Open in Vega Editor')
        .attr('href', '#')
        .on('click', function() {
          post(window, editorUrl, {
            spec: JSON.stringify(spec, null, 2),
            mode: mode
          });
          d3.event.preventDefault();
        });
    }
  }

  return Promise.resolve({view: view, spec: spec});
}

function viewSource(source, sourceHeader, sourceFooter) {
  var header = '<html><head>' + sourceHeader + '</head>' + '<body><pre><code class="json">';
  var footer = '</code></pre>' + sourceFooter + '</body></html>';
  var win = window.open('');
  win.document.write(header + source + footer);
  win.document.title = 'Vega JSON Source';
}

/**
 * Embed a Vega visualization component in a web page.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector)
 * @param spec      String : A URL string from which to load the Vega specification.
 Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
function embedMain(el, spec, opt) {
  // Ensure any exceptions will be properly handled
  return new Promise((accept, reject) => {
    embed(el, spec, opt).then(accept, reject);
  });
}

// expose Vega and Vega-Lite libs
embedMain.vega = vega;
embedMain.vegalite = vl;

// for es5
module.exports = embedMain;
// for es 6
module.exports.default = embedMain;
