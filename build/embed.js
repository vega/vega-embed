"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var versionCompare = require("compare-versions");
var d3 = require("d3-selection");
var vega = require("vega");
var vl = require("vega-lite");
var vega_schema_url_parser_1 = require("vega-schema-url-parser");
var post_1 = require("./post");
var NAMES = {
    'vega': 'Vega',
    'vega-lite': 'Vega-Lite',
};
var VERSION = {
    'vega': vega.version,
    'vega-lite': vl ? vl.version : 'not available',
};
var PREPROCESSOR = {
    'vega': function (vgjson) { return vgjson; },
    'vega-lite': function (vljson) { return vl.compile(vljson).spec; },
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
        var loader = opt.loader || vega.loader();
        var renderer = opt.renderer || 'canvas';
        var logLevel = opt.logLevel || vega.Warn;
        // Load the visualization specification.
        if (vega.isString(spec)) {
            return loader.load(spec).then(function (data) { return embed(el, JSON.parse(data), opt); }).catch(Promise.reject);
        }
        // Load Vega theme/configuration.
        var config = opt.config;
        if (vega.isString(config)) {
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
        var runtime = vega.parse(vgSpec, opt.config); // may throw an Error if parsing fails
        var view_1 = new vega.View(runtime)
            .renderer(renderer)
            .logLevel(logLevel)
            .loader(loader)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZW1iZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBbUQ7QUFDbkQsaUNBQW1DO0FBQ25DLDJCQUE2QjtBQUM3Qiw4QkFBZ0M7QUFDaEMsaUVBQWtEO0FBRWxELCtCQUE4QjtBQW9COUIsSUFBTSxLQUFLLEdBQUc7SUFDWixNQUFNLEVBQU8sTUFBTTtJQUNuQixXQUFXLEVBQUUsV0FBVztDQUN6QixDQUFDO0FBRUYsSUFBTSxPQUFPLEdBQUc7SUFDZCxNQUFNLEVBQU8sSUFBSSxDQUFDLE9BQU87SUFDekIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsZUFBZTtDQUMvQyxDQUFDO0FBRUYsSUFBTSxZQUFZLEdBQUc7SUFDbkIsTUFBTSxFQUFPLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxFQUFOLENBQU07SUFDN0IsV0FBVyxFQUFFLFVBQUEsTUFBTSxJQUFJLE9BQUEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQXZCLENBQXVCO0NBQy9DLENBQUM7QUFFRjs7Ozs7OztHQU9HO0FBQ0gsZUFBOEIsRUFBNEIsRUFBRSxJQUFTLEVBQUUsR0FBa0I7SUFDdkYsSUFBSSxDQUFDO1FBQ0gsR0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDaEIsSUFBTSxPQUFPLEdBQUksR0FBRyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVoRSxJQUFNLE1BQU0sR0FBZ0IsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEQsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUM7UUFDMUMsSUFBTSxRQUFRLEdBQUcs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