var d3 = require('d3'),
    vg = require('vega'),
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

function load(url, arg, el, callback) {
  vg.util.load({url: url}, function(err, data) {
    if (err || !data) {
      console.error(err || ('No data found at ' + url));
    } else {
      // marshal embedding spec and restart
      var opt = !arg ? JSON.parse(data) : vg.util.extend({source: data}, arg);
      embed(el, opt, callback);
    }
  });
}

// Embed a Vega visualization component in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// opt: Embedding specification (parsed JSON or URL string)
// callback: invoked with the generated Vega View instance
function embed(el, opt, callback) {
  var params = [], source, spec;

  if (vg.util.isString(opt)) {
    return load(opt, null, el, callback);
  } else if (opt.source) {
    source = opt.source;
    spec = JSON.parse(source);
  } else if (opt.spec) {
    spec = opt.spec;
    source = JSON.stringify(spec, null, 2);
  } else if (opt.url) {
    return load(opt.url, opt, el, callback);
  } else {
    spec = opt;
    source = JSON.stringify(spec, null, 2);
    opt = {spec: spec, actions: false};
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

  vg.parse.spec(spec, function(chart) {
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
        ctrl.append('a')
          .text('Export as ' + (renderer==='canvas' ? 'PNG' : 'SVG'))
          .attr('href', '#')
          .attr('download', spec.name || 'vega')
          .on('mousedown', function() {
            this.href = imageURL(view);
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
            post(window, embed.config.editor_url, {spec: source});
            d3.event.preventDefault();
          });
      }
    }

    // bind all parameter elements
    params.forEach(function(p) { parameter.bind(p, view); });

    // initialize and return visualization
    view.update();
    if (callback) callback(view, spec);
  });
}

function imageURL(view) {
  var ren = view.renderer(),
      scene = ren.scene();

  if (ren.svg) {
    var blob = new Blob([ren.svg()], {type: 'image/svg+xml'});
    return window.URL.createObjectURL(blob);
  } else if (scene.toDataURL) {
    return scene.toDataURL('image/png');
  } else {
    throw Error('Renderer does not support image export.');
  }
}

function viewSource(source) {
  var header = '<html><head>' + config.source_header + '</head>' + '<body><pre><code class="json">';
  var footer = '</code></pre>' + config.source_footer + '</body></html>';
  var win = window.open('');
  win.document.write(header + source + footer);
  win.document.title = 'Vega JSON Source';
}

// make config and imageURL externally visible
embed.config = config;
embed.imageURL = imageURL;

module.exports = embed;
