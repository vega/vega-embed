"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var versionCompare = require("compare-versions");
var d3 = require("d3-selection");
var vegaImport = require("vega-lib");
var VegaLite = require("vega-lite");
var vega_schema_url_parser_1 = require("vega-schema-url-parser");
var post_1 = require("./post");
exports.vega = vegaImport;
exports.vl = VegaLite;
var NAMES = {
    'vega': 'Vega',
    'vega-lite': 'Vega-Lite',
};
var VERSION = {
    'vega': exports.vega.version,
    'vega-lite': exports.vl ? exports.vl.version : 'not available',
};
var PREPROCESSOR = {
    'vega': function (vgjson, _) { return vgjson; },
    'vega-lite': function (vljson, config) { return exports.vl.compile(vljson, { config: config }).spec; },
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
        var vgSpec = PREPROCESSOR[mode_1](spec, config);
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
        // Do not apply the config to Vega when we have already applied it to Vega-Lite.
        // This call may throw an Error if parsing fails.
        var runtime = exports.vega.parse(vgSpec, mode_1 === 'vega-lite' ? {} : config);
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
                    .attr('download', "visualization." + ext_1)
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
    var header = "<html><head>" + sourceHeader + "</head><body><pre><code class=\"json\">";
    var footer = "</code></pre>" + sourceFooter + "</body></html>";
    var win = window.open('');
    win.document.write(header + source + footer);
    win.document.title = 'Vega JSON Source';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZW1iZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBbUQ7QUFDbkQsaUNBQW1DO0FBQ25DLHFDQUF1QztBQUN2QyxvQ0FBc0M7QUFDdEMsaUVBQWtEO0FBS2xELCtCQUE4QjtBQUVqQixRQUFBLElBQUksR0FBRyxVQUFVLENBQUM7QUFDbEIsUUFBQSxFQUFFLEdBQUcsUUFBUSxDQUFDO0FBb0IzQixJQUFNLEtBQUssR0FBRztJQUNaLE1BQU0sRUFBTyxNQUFNO0lBQ25CLFdBQVcsRUFBRSxXQUFXO0NBQ3pCLENBQUM7QUFFRixJQUFNLE9BQU8sR0FBRztJQUNkLE1BQU0sRUFBTyxZQUFJLENBQUMsT0FBTztJQUN6QixXQUFXLEVBQUUsVUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlO0NBQy9DLENBQUM7QUFFRixJQUFNLFlBQVksR0FBRztJQUNuQixNQUFNLEVBQU8sVUFBQyxNQUFNLEVBQUUsQ0FBQyxJQUFLLE9BQUEsTUFBTSxFQUFOLENBQU07SUFDbEMsV0FBVyxFQUFFLFVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSyxPQUFBLFVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDLElBQUksRUFBakMsQ0FBaUM7Q0FDbkUsQ0FBQztBQUlGOzs7Ozs7O0dBT0c7QUFDSCxlQUE4QixFQUE0QixFQUFFLElBQWdDLEVBQUUsR0FBaUI7SUFDN0csSUFBSSxDQUFDO1FBQ0gsR0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDaEIsSUFBTSxPQUFPLEdBQUksR0FBRyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVoRSxJQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMs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