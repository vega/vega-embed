"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    vega: 'Vega',
    'vega-lite': 'Vega-Lite',
};
var VERSION = {
    vega: exports.vega.version,
    'vega-lite': exports.vl ? exports.vl.version : 'not available',
};
var PREPROCESSOR = {
    vega: function (vgjson, _) { return vgjson; },
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
    return __awaiter(this, void 0, void 0, function () {
        var actions, loader, renderer, logLevel, data, config, data, parsed, mode, vgSpec, div, runtime, view, ctrl, ext_1, editorUrl_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opt = opt || {};
                    actions = opt.actions !== undefined ? opt.actions : true;
                    loader = opt.loader || exports.vega.loader();
                    renderer = opt.renderer || 'canvas';
                    logLevel = opt.logLevel || exports.vega.Warn;
                    if (!exports.vega.isString(spec)) return [3 /*break*/, 2];
                    return [4 /*yield*/, loader.load(spec)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, embed(el, JSON.parse(data), opt)];
                case 2:
                    config = opt.config;
                    if (!exports.vega.isString(config)) return [3 /*break*/, 4];
                    return [4 /*yield*/, loader.load(config)];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, embed(el, spec, __assign({}, opt, { config: JSON.parse(data) }))];
                case 4:
                    if (spec.$schema) {
                        parsed = vega_schema_url_parser_1.default(spec.$schema);
                        if (opt.mode && opt.mode !== parsed.library) {
                            console.warn("The given visualization spec is written in " + NAMES[parsed.library] + ", but mode argument sets " + NAMES[opt.mode] + ".");
                        }
                        mode = parsed.library;
                        if (versionCompare(parsed.version, VERSION[mode]) > 0) {
                            console.warn("The input spec uses " + mode + " " + parsed.version + ", but the current version of " + NAMES[mode] + " is " + VERSION[mode] + ".");
                        }
                    }
                    else {
                        mode = opt.mode || 'vega';
                    }
                    vgSpec = PREPROCESSOR[mode](spec, config);
                    if (mode === 'vega-lite') {
                        if (vgSpec.$schema) {
                            parsed = vega_schema_url_parser_1.default(vgSpec.$schema);
                            if (versionCompare(parsed.version, VERSION.vega) > 0) {
                                console.warn("The compiled spec uses Vega " + parsed.version + ", but current version is " + VERSION.vega + ".");
                            }
                        }
                    }
                    div = d3
                        .select(el) // d3.select supports elements and strings
                        .classed('vega-embed', true)
                        .html('');
                    if (opt.onBeforeParse) {
                        // Allow Vega spec to be modified before being used
                        vgSpec = opt.onBeforeParse(vgSpec);
                    }
                    runtime = exports.vega.parse(vgSpec, mode === 'vega-lite' ? {} : config);
                    view = new exports.vega.View(runtime, {
                        loader: loader,
                        logLevel: logLevel,
                        renderer: renderer,
                    }).initialize(el);
                    // Vega-Lite does not need hover so we can improve perf by not activating it
                    if (mode !== 'vega-lite') {
                        view.hover();
                    }
                    if (opt) {
                        if (opt.width) {
                            view.width(opt.width);
                        }
                        if (opt.height) {
                            view.height(opt.height);
                        }
                        if (opt.padding) {
                            view.padding(opt.padding);
                        }
                    }
                    if (!opt.runAsync) return [3 /*break*/, 6];
                    return [4 /*yield*/, view.runAsync()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    view.run();
                    _a.label = 7;
                case 7:
                    if (actions !== false) {
                        ctrl = div.append('div').attr('class', 'vega-actions');
                        // add 'Export' action
                        if (actions === true || actions.export !== false) {
                            ext_1 = renderer === 'canvas' ? 'png' : 'svg';
                            ctrl
                                .append('a')
                                .text("Export as " + ext_1.toUpperCase())
                                .attr('href', '#')
                                .attr('target', '_blank')
                                .attr('download', "visualization." + ext_1)
                                .on('mousedown', function () {
                                var _this = this;
                                view
                                    .toImageURL(ext_1)
                                    .then(function (url) {
                                    _this.href = url;
                                })
                                    .catch(function (error) {
                                    throw error;
                                });
                                d3.event.preventDefault();
                            });
                        }
                        // add 'View Source' action
                        if (actions === true || actions.source !== false) {
                            ctrl
                                .append('a')
                                .text('View Source')
                                .attr('href', '#')
                                .on('click', function () {
                                viewSource(JSON.stringify(spec, null, 2), opt.sourceHeader || '', opt.sourceFooter || '');
                                d3.event.preventDefault();
                            });
                        }
                        // add 'Open in Vega Editor' action
                        if (actions === true || actions.editor !== false) {
                            editorUrl_1 = opt.editorUrl || 'https://vega.github.io/editor/';
                            ctrl
                                .append('a')
                                .text('Open in Vega Editor')
                                .attr('href', '#')
                                .on('click', function () {
                                post_1.post(window, editorUrl_1, {
                                    config: config || null,
                                    mode: mode,
                                    renderer: renderer,
                                    spec: JSON.stringify(spec, null, 2),
                                });
                                d3.event.preventDefault();
                            });
                        }
                    }
                    return [2 /*return*/, { view: view, spec: spec }];
            }
        });
    });
}
exports.default = embed;
function viewSource(source, sourceHeader, sourceFooter) {
    var header = "<html><head>" + sourceHeader + "</head><body><pre><code class=\"json\">";
    var footer = "</code></pre>" + sourceFooter + "</body></html>";
    var win = window.open('');
    win.document.write(header + source + footer);
    win.document.title = 'Vega JSON Source';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZW1iZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW1EO0FBQ25ELGlDQUFtQztBQUNuQyxxQ0FBdUM7QUFDdkMsb0NBQXNDO0FBQ3RDLGlFQUFrRDtBQUlsRCwrQkFBOEI7QUFFakIsUUFBQSxJQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ2xCLFFBQUEsRUFBRSxHQUFHLFFBQVEsQ0FBQztBQXVCM0IsSUFBTSxLQUFLLEdBQUc7SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLFdBQVcsRUFBRSxXQUFXO0NBQ3pCLENBQUM7QUFFRixJQUFNLE9BQU8sR0FBRztJQUNkLElBQUksRUFBRSxZQUFJLENBQUMsT0FBTztJQUNsQixXQUFXLEVBQUUsVUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlO0NBQy9DLENBQUM7QUFFRixJQUFNLFlBQVksR0FBRztJQUNuQixJQUFJLEVBQUUsVUFBQyxNQUFNLEVBQUUsQ0FBQyxJQUFLLE9BQUEsTUFBTSxFQUFOLENBQU07SUFDM0IsV0FBVyxFQUFFLFVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSyxPQUFBLFVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBbkMsQ0FBbUM7Q0FDckUsQ0FBQztBQVNGOzs7Ozs7O0dBT0c7QUFDSCxlQUNFLEVBQXdCLEVBQ3hCLElBQWdDLEVBQ2hDLEdBQWlCOzs7Ozs7b0JBRWpCLEdBQUcsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO29CQUNWLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29C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