"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var versionCompare = require("compare-versions");
var d3 = require("d3-selection");
var vegaImport = require("vega");
var vlImport = require("vega-lite");
var vega_schema_url_parser_1 = require("vega-schema-url-parser");
exports.vega = vegaImport;
exports.vl = vlImport;
var post_1 = require("./post");
var NAMES = {
    'vega': 'Vega',
    'vega-lite': 'Vega-Lite',
};
var VERSION = {
    'vega': exports.vega.version,
    'vega-lite': exports.vl ? exports.vl.version : 'not available',
};
var PREPROCESSOR = {
    'vega': function (vgjson) { return vgjson; },
    'vega-lite': function (vljson) { return exports.vl.compile(vljson).spec; },
};
/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
function embed(el, spec, opt) {
    try {
        opt = opt || {};
        var actions = opt.actions !== undefined ? opt.actions : true;
        var loader = opt.loader || exports.vega.loader();
        var renderer = opt.renderer || 'canvas';
        var logLevel = opt.logLevel || exports.vega.Warn;
        // Load the visualization specification.
        if (exports.vega.isString(spec)) {
            return loader.load(spec).then(function (data) { return embed(el, JSON.parse(data), opt); }).catch(Promise.reject);
        }
        // Load Vega theme/configuration.
        var config = opt.config;
        if (exports.vega.isString(config)) {
            return loader.load(config).then(function (data) {
                opt.config = JSON.parse(data);
                return embed(el, spec, opt);
            }).catch(Promise.reject);
        }
        // Decide mode
        var parsed = void 0;
        var mode_1;
        if (spec.$schema) {
            parsed = vega_schema_url_parser_1.default(spec.$schema);
            if (opt.mode && opt.mode !== parsed.library) {
                console.warn("The given visualization spec is written in " + NAMES[parsed.library] + ", but mode argument sets " + NAMES[opt.mode] + ".");
            }
            mode_1 = parsed.library;
            if (versionCompare(parsed.version, VERSION[mode_1]) > 0) {
                console.warn("The input spec uses " + mode_1 + " " + parsed.version + ", but the current version of " + NAMES[mode_1] + " is " + VERSION[mode_1] + ".");
            }
        }
        else {
            mode_1 = opt.mode || 'vega';
        }
        var vgSpec = PREPROCESSOR[mode_1](spec);
        if (mode_1 === 'vega-lite') {
            if (vgSpec.$schema) {
                parsed = vega_schema_url_parser_1.default(vgSpec.$schema);
                if (versionCompare(parsed.version, VERSION.vega) > 0) {
                    console.warn("The compiled spec uses Vega " + parsed.version + ", but current version is " + VERSION.vega + ".");
                }
            }
        }
        // ensure container div has class 'vega-embed'
        var div = d3.select(el) // d3.select supports elements and strings
            .classed('vega-embed', true)
            .html(''); // clear container
        if (opt.onBeforeParse) {
            // Allow Vega spec to be modified before being used
            vgSpec = opt.onBeforeParse(vgSpec);
        }
        var runtime = exports.vega.parse(vgSpec, opt.config); // may throw an Error if parsing fails
        var view_1 = new exports.vega.View(runtime, { loader: loader, logLevel: logLevel, renderer: renderer })
            .initialize(el);
        // Vega-Lite does not need hover so we can improve perf by not activating it
        if (mode_1 !== 'vega-lite') {
            view_1.hover();
        }
        if (opt) {
            if (opt.width) {
                view_1.width(opt.width);
            }
            if (opt.height) {
                view_1.height(opt.height);
            }
            if (opt.padding) {
                view_1.padding(opt.padding);
            }
        }
        view_1.run();
        if (actions !== false) {
            // add child div to house action links
            var ctrl = div.append('div')
                .attr('class', 'vega-actions');
            // add 'Export' action
            if (actions === true || actions.export !== false) {
                var ext_1 = renderer === 'canvas' ? 'png' : 'svg';
                ctrl.append('a')
                    .text("Export as " + ext_1.toUpperCase())
                    .attr('href', '#')
                    .attr('target', '_blank')
                    .attr('download', (spec.name || 'vega') + '.' + ext_1)
                    .on('mousedown', function () {
                    var _this = this;
                    view_1.toImageURL(ext_1).then(function (url) {
                        _this.href = url;
                    }).catch(function (error) { throw error; });
                    d3.event.preventDefault();
                });
            }
            // add 'View Source' action
            if (actions === true || actions.source !== false) {
                ctrl.append('a')
                    .text('View Source')
                    .attr('href', '#')
                    .on('click', function () {
                    viewSource(JSON.stringify(spec, null, 2), opt.sourceHeader || '', opt.sourceFooter || '');
                    d3.event.preventDefault();
                });
            }
            // add 'Open in Vega Editor' action
            if (actions === true || actions.editor !== false) {
                var editorUrl_1 = opt.editorUrl || 'https://vega.github.io/editor/';
                ctrl.append('a')
                    .text('Open in Vega Editor')
                    .attr('href', '#')
                    .on('click', function () {
                    post_1.post(window, editorUrl_1, {
                        mode: mode_1,
                        spec: JSON.stringify(spec, null, 2),
                    });
                    d3.event.preventDefault();
                });
            }
        }
        return Promise.resolve({ view: view_1, spec: spec });
    }
    catch (err) {
        return Promise.reject(err);
    }
}
exports.default = embed;
function viewSource(source, sourceHeader, sourceFooter) {
    var header = "<html><head>" + sourceHeader + "</head>' + '<body><pre><code class=\"json\">";
    var footer = "</code></pre>" + sourceFooter + "</body></html>";
    var win = window.open('');
    win.document.write(header + source + footer);
    win.document.title = 'Vega JSON Source';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZW1iZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBbUQ7QUFDbkQsaUNBQW1DO0FBQ25DLGlDQUFtQztBQUNuQyxvQ0FBc0M7QUFDdEMsaUVBQWtEO0FBRXJDLFFBQUEsSUFBSSxHQUFHLFVBQVUsQ0FBQztBQUNsQixRQUFBLEVBQUUsR0FBRyxRQUFRLENBQUM7QUFFM0IsK0JBQThCO0FBb0I5QixJQUFNLEtBQUssR0FBRztJQUNaLE1BQU0sRUFBTyxNQUFNO0lBQ25CLFdBQVcsRUFBRSxXQUFXO0NBQ3pCLENBQUM7QUFFRixJQUFNLE9BQU8sR0FBRztJQUNkLE1BQU0sRUFBTyxZQUFJLENBQUMsT0FBTztJQUN6QixXQUFXLEVBQUUsVUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlO0NBQy9DLENBQUM7QUFFRixJQUFNLFlBQVksR0FBRztJQUNuQixNQUFNLEVBQU8sVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLEVBQU4sQ0FBTTtJQUM3QixXQUFXLEVBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxVQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBdkIsQ0FBdUI7Q0FDL0MsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFDSCxlQUE4QixFQUE0QixFQUFFLElBQVMsRUFBRSxHQUFrQjtJQUN2RixJQUFJLENBQUM7UUFDSCxHQUFHLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUNoQixJQUFNLE9BQU8sR0FBSSxHQUFHLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRWhFLElBQU0sTUFBTSxHQUFzQixHQUFHLENBQUMsTUFBTSxJQUFJLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM5RCxJQUFN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