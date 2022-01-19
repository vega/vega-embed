(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vega'), require('vega-lite')) :
  typeof define === 'function' && define.amd ? define(['vega', 'vega-lite'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.vegaEmbed = factory(global.vega, global.vegaLite));
})(this, (function (vegaImport, vegaLiteImport) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var vegaImport__namespace = /*#__PURE__*/_interopNamespace(vegaImport);
  var vegaLiteImport__namespace = /*#__PURE__*/_interopNamespace(vegaLiteImport);

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  } // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.


  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};

  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  function isGeneratorFunction(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  }

  function mark(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;

      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.

  function awrap(arg) {
    return {
      __await: arg
    };
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  }; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.


  function async(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  function keys(object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined$1,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined$1;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  }; // Export a default namespace that plays well with Rollup

  var _regeneratorRuntime = {
    wrap: wrap,
    isGeneratorFunction: isGeneratorFunction,
    AsyncIterator: AsyncIterator,
    mark: mark,
    awrap: awrap,
    async: async,
    keys: keys,
    values: values
  };

  /*!
   * https://github.com/Starcounter-Jack/JSON-Patch
   * (c) 2017 Joachim Wester
   * MIT license
   */
  var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
      _extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) {
          if (b.hasOwnProperty(p)) d[p] = b[p];
        }
      };

      return _extendStatics(d, b);
    };

    return function (d, b) {
      _extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();

  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwnProperty(obj, key) {
    return _hasOwnProperty.call(obj, key);
  }
  function _objectKeys(obj) {
    if (Array.isArray(obj)) {
      var keys = new Array(obj.length);

      for (var k = 0; k < keys.length; k++) {
        keys[k] = "" + k;
      }

      return keys;
    }

    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (hasOwnProperty(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }
  /**
  * Deeply clone the object.
  * https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
  * @param  {any} obj value to clone
  * @return {any} cloned obj
  */

  function _deepClone(obj) {
    switch (_typeof(obj)) {
      case "object":
        return JSON.parse(JSON.stringify(obj));
      //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5

      case "undefined":
        return null;
      //this is how JSON.stringify behaves for array items

      default:
        return obj;
      //no need to clone primitives
    }
  } //3x faster than cached /^\d+$/.test(str)

  function isInteger(str) {
    var i = 0;
    var len = str.length;
    var charCode;

    while (i < len) {
      charCode = str.charCodeAt(i);

      if (charCode >= 48 && charCode <= 57) {
        i++;
        continue;
      }

      return false;
    }

    return true;
  }
  /**
  * Escapes a json pointer path
  * @param path The raw pointer
  * @return the Escaped path
  */

  function escapePathComponent(path) {
    if (path.indexOf('/') === -1 && path.indexOf('~') === -1) return path;
    return path.replace(/~/g, '~0').replace(/\//g, '~1');
  }
  /**
   * Unescapes a json pointer path
   * @param path The escaped pointer
   * @return The unescaped path
   */

  function unescapePathComponent(path) {
    return path.replace(/~1/g, '/').replace(/~0/g, '~');
  }
  /**
  * Recursively checks whether an object has any undefined values inside.
  */

  function hasUndefined(obj) {
    if (obj === undefined) {
      return true;
    }

    if (obj) {
      if (Array.isArray(obj)) {
        for (var i = 0, len = obj.length; i < len; i++) {
          if (hasUndefined(obj[i])) {
            return true;
          }
        }
      } else if (_typeof(obj) === "object") {
        var objKeys = _objectKeys(obj);

        var objKeysLength = objKeys.length;

        for (var i = 0; i < objKeysLength; i++) {
          if (hasUndefined(obj[objKeys[i]])) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function patchErrorMessageFormatter(message, args) {
    var messageParts = [message];

    for (var key in args) {
      var value = _typeof(args[key]) === 'object' ? JSON.stringify(args[key], null, 2) : args[key]; // pretty print

      if (typeof value !== 'undefined') {
        messageParts.push(key + ": " + value);
      }
    }

    return messageParts.join('\n');
  }

  var PatchError =
  /** @class */
  function (_super) {
    __extends(PatchError, _super);

    function PatchError(message, name, index, operation, tree) {
      var _newTarget = this.constructor;

      var _this = _super.call(this, patchErrorMessageFormatter(message, {
        name: name,
        index: index,
        operation: operation,
        tree: tree
      })) || this;

      _this.name = name;
      _this.index = index;
      _this.operation = operation;
      _this.tree = tree;
      Object.setPrototypeOf(_this, _newTarget.prototype); // restore prototype chain, see https://stackoverflow.com/a/48342359

      _this.message = patchErrorMessageFormatter(message, {
        name: name,
        index: index,
        operation: operation,
        tree: tree
      });
      return _this;
    }

    return PatchError;
  }(Error);

  var JsonPatchError = PatchError;
  var deepClone = _deepClone;
  /* We use a Javascript hash to store each
   function. Each hash entry (property) uses
   the operation identifiers specified in rfc6902.
   In this way, we can map each patch operation
   to its dedicated function in efficient way.
   */

  /* The operations applicable to an object */

  var objOps = {
    add: function add(obj, key, document) {
      obj[key] = this.value;
      return {
        newDocument: document
      };
    },
    remove: function remove(obj, key, document) {
      var removed = obj[key];
      delete obj[key];
      return {
        newDocument: document,
        removed: removed
      };
    },
    replace: function replace(obj, key, document) {
      var removed = obj[key];
      obj[key] = this.value;
      return {
        newDocument: document,
        removed: removed
      };
    },
    move: function move(obj, key, document) {
      /* in case move target overwrites an existing value,
      return the removed value, this can be taxing performance-wise,
      and is potentially unneeded */
      var removed = getValueByPointer(document, this.path);

      if (removed) {
        removed = _deepClone(removed);
      }

      var originalValue = applyOperation(document, {
        op: "remove",
        path: this.from
      }).removed;
      applyOperation(document, {
        op: "add",
        path: this.path,
        value: originalValue
      });
      return {
        newDocument: document,
        removed: removed
      };
    },
    copy: function copy(obj, key, document) {
      var valueToCopy = getValueByPointer(document, this.from); // enforce copy by value so further operations don't affect source (see issue #177)

      applyOperation(document, {
        op: "add",
        path: this.path,
        value: _deepClone(valueToCopy)
      });
      return {
        newDocument: document
      };
    },
    test: function test(obj, key, document) {
      return {
        newDocument: document,
        test: _areEquals(obj[key], this.value)
      };
    },
    _get: function _get(obj, key, document) {
      this.value = obj[key];
      return {
        newDocument: document
      };
    }
  };
  /* The operations applicable to an array. Many are the same as for the object */

  var arrOps = {
    add: function add(arr, i, document) {
      if (isInteger(i)) {
        arr.splice(i, 0, this.value);
      } else {
        // array props
        arr[i] = this.value;
      } // this may be needed when using '-' in an array


      return {
        newDocument: document,
        index: i
      };
    },
    remove: function remove(arr, i, document) {
      var removedList = arr.splice(i, 1);
      return {
        newDocument: document,
        removed: removedList[0]
      };
    },
    replace: function replace(arr, i, document) {
      var removed = arr[i];
      arr[i] = this.value;
      return {
        newDocument: document,
        removed: removed
      };
    },
    move: objOps.move,
    copy: objOps.copy,
    test: objOps.test,
    _get: objOps._get
  };
  /**
   * Retrieves a value from a JSON document by a JSON pointer.
   * Returns the value.
   *
   * @param document The document to get the value from
   * @param pointer an escaped JSON pointer
   * @return The retrieved value
   */

  function getValueByPointer(document, pointer) {
    if (pointer == '') {
      return document;
    }

    var getOriginalDestination = {
      op: "_get",
      path: pointer
    };
    applyOperation(document, getOriginalDestination);
    return getOriginalDestination.value;
  }
  /**
   * Apply a single JSON Patch Operation on a JSON document.
   * Returns the {newDocument, result} of the operation.
   * It modifies the `document` and `operation` objects - it gets the values by reference.
   * If you would like to avoid touching your values, clone them:
   * `jsonpatch.applyOperation(document, jsonpatch._deepClone(operation))`.
   *
   * @param document The document to patch
   * @param operation The operation to apply
   * @param validateOperation `false` is without validation, `true` to use default jsonpatch's validation, or you can pass a `validateOperation` callback to be used for validation.
   * @param mutateDocument Whether to mutate the original document or clone it before applying
   * @param banPrototypeModifications Whether to ban modifications to `__proto__`, defaults to `true`.
   * @return `{newDocument, result}` after the operation
   */

  function applyOperation(document, operation, validateOperation, mutateDocument, banPrototypeModifications, index) {
    if (validateOperation === void 0) {
      validateOperation = false;
    }

    if (mutateDocument === void 0) {
      mutateDocument = true;
    }

    if (banPrototypeModifications === void 0) {
      banPrototypeModifications = true;
    }

    if (index === void 0) {
      index = 0;
    }

    if (validateOperation) {
      if (typeof validateOperation == 'function') {
        validateOperation(operation, 0, document, operation.path);
      } else {
        validator(operation, 0);
      }
    }
    /* ROOT OPERATIONS */


    if (operation.path === "") {
      var returnValue = {
        newDocument: document
      };

      if (operation.op === 'add') {
        returnValue.newDocument = operation.value;
        return returnValue;
      } else if (operation.op === 'replace') {
        returnValue.newDocument = operation.value;
        returnValue.removed = document; //document we removed

        return returnValue;
      } else if (operation.op === 'move' || operation.op === 'copy') {
        // it's a move or copy to root
        returnValue.newDocument = getValueByPointer(document, operation.from); // get the value by json-pointer in `from` field

        if (operation.op === 'move') {
          // report removed item
          returnValue.removed = document;
        }

        return returnValue;
      } else if (operation.op === 'test') {
        returnValue.test = _areEquals(document, operation.value);

        if (returnValue.test === false) {
          throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', index, operation, document);
        }

        returnValue.newDocument = document;
        return returnValue;
      } else if (operation.op === 'remove') {
        // a remove on root
        returnValue.removed = document;
        returnValue.newDocument = null;
        return returnValue;
      } else if (operation.op === '_get') {
        operation.value = document;
        return returnValue;
      } else {
        /* bad operation */
        if (validateOperation) {
          throw new JsonPatchError('Operation `op` property is not one of operations defined in RFC-6902', 'OPERATION_OP_INVALID', index, operation, document);
        } else {
          return returnValue;
        }
      }
    }
    /* END ROOT OPERATIONS */
    else {
      if (!mutateDocument) {
        document = _deepClone(document);
      }

      var path = operation.path || "";
      var keys = path.split('/');
      var obj = document;
      var t = 1; //skip empty element - http://jsperf.com/to-shift-or-not-to-shift

      var len = keys.length;
      var existingPathFragment = undefined;
      var key = void 0;
      var validateFunction = void 0;

      if (typeof validateOperation == 'function') {
        validateFunction = validateOperation;
      } else {
        validateFunction = validator;
      }

      while (true) {
        key = keys[t];

        if (key && key.indexOf('~') != -1) {
          key = unescapePathComponent(key);
        }

        if (banPrototypeModifications && key == '__proto__') {
          throw new TypeError('JSON-Patch: modifying `__proto__` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README');
        }

        if (validateOperation) {
          if (existingPathFragment === undefined) {
            if (obj[key] === undefined) {
              existingPathFragment = keys.slice(0, t).join('/');
            } else if (t == len - 1) {
              existingPathFragment = operation.path;
            }

            if (existingPathFragment !== undefined) {
              validateFunction(operation, 0, document, existingPathFragment);
            }
          }
        }

        t++;

        if (Array.isArray(obj)) {
          if (key === '-') {
            key = obj.length;
          } else {
            if (validateOperation && !isInteger(key)) {
              throw new JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", index, operation, document);
            } // only parse key when it's an integer for `arr.prop` to work
            else if (isInteger(key)) {
              key = ~~key;
            }
          }

          if (t >= len) {
            if (validateOperation && operation.op === "add" && key > obj.length) {
              throw new JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", index, operation, document);
            }

            var returnValue = arrOps[operation.op].call(operation, obj, key, document); // Apply patch

            if (returnValue.test === false) {
              throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', index, operation, document);
            }

            return returnValue;
          }
        } else {
          if (t >= len) {
            var returnValue = objOps[operation.op].call(operation, obj, key, document); // Apply patch

            if (returnValue.test === false) {
              throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', index, operation, document);
            }

            return returnValue;
          }
        }

        obj = obj[key]; // If we have more keys in the path, but the next value isn't a non-null object,
        // throw an OPERATION_PATH_UNRESOLVABLE error instead of iterating again.

        if (validateOperation && t < len && (!obj || _typeof(obj) !== "object")) {
          throw new JsonPatchError('Cannot perform operation at the desired path', 'OPERATION_PATH_UNRESOLVABLE', index, operation, document);
        }
      }
    }
  }
  /**
   * Apply a full JSON Patch array on a JSON document.
   * Returns the {newDocument, result} of the patch.
   * It modifies the `document` object and `patch` - it gets the values by reference.
   * If you would like to avoid touching your values, clone them:
   * `jsonpatch.applyPatch(document, jsonpatch._deepClone(patch))`.
   *
   * @param document The document to patch
   * @param patch The patch to apply
   * @param validateOperation `false` is without validation, `true` to use default jsonpatch's validation, or you can pass a `validateOperation` callback to be used for validation.
   * @param mutateDocument Whether to mutate the original document or clone it before applying
   * @param banPrototypeModifications Whether to ban modifications to `__proto__`, defaults to `true`.
   * @return An array of `{newDocument, result}` after the patch
   */

  function applyPatch(document, patch, validateOperation, mutateDocument, banPrototypeModifications) {
    if (mutateDocument === void 0) {
      mutateDocument = true;
    }

    if (banPrototypeModifications === void 0) {
      banPrototypeModifications = true;
    }

    if (validateOperation) {
      if (!Array.isArray(patch)) {
        throw new JsonPatchError('Patch sequence must be an array', 'SEQUENCE_NOT_AN_ARRAY');
      }
    }

    if (!mutateDocument) {
      document = _deepClone(document);
    }

    var results = new Array(patch.length);

    for (var i = 0, length_1 = patch.length; i < length_1; i++) {
      // we don't need to pass mutateDocument argument because if it was true, we already deep cloned the object, we'll just pass `true`
      results[i] = applyOperation(document, patch[i], validateOperation, true, banPrototypeModifications, i);
      document = results[i].newDocument; // in case root was replaced
    }

    results.newDocument = document;
    return results;
  }
  /**
   * Apply a single JSON Patch Operation on a JSON document.
   * Returns the updated document.
   * Suitable as a reducer.
   *
   * @param document The document to patch
   * @param operation The operation to apply
   * @return The updated document
   */

  function applyReducer(document, operation, index) {
    var operationResult = applyOperation(document, operation);

    if (operationResult.test === false) {
      // failed test
      throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', index, operation, document);
    }

    return operationResult.newDocument;
  }
  /**
   * Validates a single operation. Called from `jsonpatch.validate`. Throws `JsonPatchError` in case of an error.
   * @param {object} operation - operation object (patch)
   * @param {number} index - index of operation in the sequence
   * @param {object} [document] - object where the operation is supposed to be applied
   * @param {string} [existingPathFragment] - comes along with `document`
   */

  function validator(operation, index, document, existingPathFragment) {
    if (_typeof(operation) !== 'object' || operation === null || Array.isArray(operation)) {
      throw new JsonPatchError('Operation is not an object', 'OPERATION_NOT_AN_OBJECT', index, operation, document);
    } else if (!objOps[operation.op]) {
      throw new JsonPatchError('Operation `op` property is not one of operations defined in RFC-6902', 'OPERATION_OP_INVALID', index, operation, document);
    } else if (typeof operation.path !== 'string') {
      throw new JsonPatchError('Operation `path` property is not a string', 'OPERATION_PATH_INVALID', index, operation, document);
    } else if (operation.path.indexOf('/') !== 0 && operation.path.length > 0) {
      // paths that aren't empty string should start with "/"
      throw new JsonPatchError('Operation `path` property must start with "/"', 'OPERATION_PATH_INVALID', index, operation, document);
    } else if ((operation.op === 'move' || operation.op === 'copy') && typeof operation.from !== 'string') {
      throw new JsonPatchError('Operation `from` property is not present (applicable in `move` and `copy` operations)', 'OPERATION_FROM_REQUIRED', index, operation, document);
    } else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && operation.value === undefined) {
      throw new JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_REQUIRED', index, operation, document);
    } else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && hasUndefined(operation.value)) {
      throw new JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED', index, operation, document);
    } else if (document) {
      if (operation.op == "add") {
        var pathLen = operation.path.split("/").length;
        var existingPathLen = existingPathFragment.split("/").length;

        if (pathLen !== existingPathLen + 1 && pathLen !== existingPathLen) {
          throw new JsonPatchError('Cannot perform an `add` operation at the desired path', 'OPERATION_PATH_CANNOT_ADD', index, operation, document);
        }
      } else if (operation.op === 'replace' || operation.op === 'remove' || operation.op === '_get') {
        if (operation.path !== existingPathFragment) {
          throw new JsonPatchError('Cannot perform the operation at a path that does not exist', 'OPERATION_PATH_UNRESOLVABLE', index, operation, document);
        }
      } else if (operation.op === 'move' || operation.op === 'copy') {
        var existingValue = {
          op: "_get",
          path: operation.from,
          value: undefined
        };
        var error = validate([existingValue], document);

        if (error && error.name === 'OPERATION_PATH_UNRESOLVABLE') {
          throw new JsonPatchError('Cannot perform the operation from a path that does not exist', 'OPERATION_FROM_UNRESOLVABLE', index, operation, document);
        }
      }
    }
  }
  /**
   * Validates a sequence of operations. If `document` parameter is provided, the sequence is additionally validated against the object document.
   * If error is encountered, returns a JsonPatchError object
   * @param sequence
   * @param document
   * @returns {JsonPatchError|undefined}
   */

  function validate(sequence, document, externalValidator) {
    try {
      if (!Array.isArray(sequence)) {
        throw new JsonPatchError('Patch sequence must be an array', 'SEQUENCE_NOT_AN_ARRAY');
      }

      if (document) {
        //clone document and sequence so that we can safely try applying operations
        applyPatch(_deepClone(document), _deepClone(sequence), externalValidator || true);
      } else {
        externalValidator = externalValidator || validator;

        for (var i = 0; i < sequence.length; i++) {
          externalValidator(sequence[i], i, document, undefined);
        }
      }
    } catch (e) {
      if (e instanceof JsonPatchError) {
        return e;
      } else {
        throw e;
      }
    }
  } // based on https://github.com/epoberezkin/fast-deep-equal
  // MIT License
  // Copyright (c) 2017 Evgeny Poberezkin
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  // SOFTWARE.

  function _areEquals(a, b) {
    if (a === b) return true;

    if (a && b && _typeof(a) == 'object' && _typeof(b) == 'object') {
      var arrA = Array.isArray(a),
          arrB = Array.isArray(b),
          i,
          length,
          key;

      if (arrA && arrB) {
        length = a.length;
        if (length != b.length) return false;

        for (i = length; i-- !== 0;) {
          if (!_areEquals(a[i], b[i])) return false;
        }

        return true;
      }

      if (arrA != arrB) return false;
      var keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;

      for (i = length; i-- !== 0;) {
        if (!b.hasOwnProperty(keys[i])) return false;
      }

      for (i = length; i-- !== 0;) {
        key = keys[i];
        if (!_areEquals(a[key], b[key])) return false;
      }

      return true;
    }

    return a !== a && b !== b;
  }

  var core = /*#__PURE__*/Object.freeze({
    __proto__: null,
    JsonPatchError: JsonPatchError,
    deepClone: deepClone,
    getValueByPointer: getValueByPointer,
    applyOperation: applyOperation,
    applyPatch: applyPatch,
    applyReducer: applyReducer,
    validator: validator,
    validate: validate,
    _areEquals: _areEquals
  });

  var beforeDict = new WeakMap();

  var Mirror =
  /** @class */
  function () {
    function Mirror(obj) {
      this.observers = new Map();
      this.obj = obj;
    }

    return Mirror;
  }();

  var ObserverInfo =
  /** @class */
  function () {
    function ObserverInfo(callback, observer) {
      this.callback = callback;
      this.observer = observer;
    }

    return ObserverInfo;
  }();

  function getMirror(obj) {
    return beforeDict.get(obj);
  }

  function getObserverFromMirror(mirror, callback) {
    return mirror.observers.get(callback);
  }

  function removeObserverFromMirror(mirror, observer) {
    mirror.observers.delete(observer.callback);
  }
  /**
   * Detach an observer from an object
   */


  function unobserve(root, observer) {
    observer.unobserve();
  }
  /**
   * Observes changes made to an object, which can then be retrieved using generate
   */

  function observe(obj, callback) {
    var patches = [];
    var observer;
    var mirror = getMirror(obj);

    if (!mirror) {
      mirror = new Mirror(obj);
      beforeDict.set(obj, mirror);
    } else {
      var observerInfo = getObserverFromMirror(mirror, callback);
      observer = observerInfo && observerInfo.observer;
    }

    if (observer) {
      return observer;
    }

    observer = {};
    mirror.value = _deepClone(obj);

    if (callback) {
      observer.callback = callback;
      observer.next = null;

      var dirtyCheck = function dirtyCheck() {
        generate(observer);
      };

      var fastCheck = function fastCheck() {
        clearTimeout(observer.next);
        observer.next = setTimeout(dirtyCheck);
      };

      if (typeof window !== 'undefined') {
        //not Node
        window.addEventListener('mouseup', fastCheck);
        window.addEventListener('keyup', fastCheck);
        window.addEventListener('mousedown', fastCheck);
        window.addEventListener('keydown', fastCheck);
        window.addEventListener('change', fastCheck);
      }
    }

    observer.patches = patches;
    observer.object = obj;

    observer.unobserve = function () {
      generate(observer);
      clearTimeout(observer.next);
      removeObserverFromMirror(mirror, observer);

      if (typeof window !== 'undefined') {
        window.removeEventListener('mouseup', fastCheck);
        window.removeEventListener('keyup', fastCheck);
        window.removeEventListener('mousedown', fastCheck);
        window.removeEventListener('keydown', fastCheck);
        window.removeEventListener('change', fastCheck);
      }
    };

    mirror.observers.set(callback, new ObserverInfo(callback, observer));
    return observer;
  }
  /**
   * Generate an array of patches from an observer
   */

  function generate(observer, invertible) {
    if (invertible === void 0) {
      invertible = false;
    }

    var mirror = beforeDict.get(observer.object);

    _generate(mirror.value, observer.object, observer.patches, "", invertible);

    if (observer.patches.length) {
      applyPatch(mirror.value, observer.patches);
    }

    var temp = observer.patches;

    if (temp.length > 0) {
      observer.patches = [];

      if (observer.callback) {
        observer.callback(temp);
      }
    }

    return temp;
  } // Dirty check if obj is different from mirror, generate patches and update mirror

  function _generate(mirror, obj, patches, path, invertible) {
    if (obj === mirror) {
      return;
    }

    if (typeof obj.toJSON === "function") {
      obj = obj.toJSON();
    }

    var newKeys = _objectKeys(obj);

    var oldKeys = _objectKeys(mirror);
    var deleted = false; //if ever "move" operation is implemented here, make sure this test runs OK: "should not generate the same patch twice (move)"

    for (var t = oldKeys.length - 1; t >= 0; t--) {
      var key = oldKeys[t];
      var oldVal = mirror[key];

      if (hasOwnProperty(obj, key) && !(obj[key] === undefined && oldVal !== undefined && Array.isArray(obj) === false)) {
        var newVal = obj[key];

        if (_typeof(oldVal) == "object" && oldVal != null && _typeof(newVal) == "object" && newVal != null && Array.isArray(oldVal) === Array.isArray(newVal)) {
          _generate(oldVal, newVal, patches, path + "/" + escapePathComponent(key), invertible);
        } else {
          if (oldVal !== newVal) {

            if (invertible) {
              patches.push({
                op: "test",
                path: path + "/" + escapePathComponent(key),
                value: _deepClone(oldVal)
              });
            }

            patches.push({
              op: "replace",
              path: path + "/" + escapePathComponent(key),
              value: _deepClone(newVal)
            });
          }
        }
      } else if (Array.isArray(mirror) === Array.isArray(obj)) {
        if (invertible) {
          patches.push({
            op: "test",
            path: path + "/" + escapePathComponent(key),
            value: _deepClone(oldVal)
          });
        }

        patches.push({
          op: "remove",
          path: path + "/" + escapePathComponent(key)
        });
        deleted = true; // property has been deleted
      } else {
        if (invertible) {
          patches.push({
            op: "test",
            path: path,
            value: mirror
          });
        }

        patches.push({
          op: "replace",
          path: path,
          value: obj
        });
      }
    }

    if (!deleted && newKeys.length == oldKeys.length) {
      return;
    }

    for (var t = 0; t < newKeys.length; t++) {
      var key = newKeys[t];

      if (!hasOwnProperty(mirror, key) && obj[key] !== undefined) {
        patches.push({
          op: "add",
          path: path + "/" + escapePathComponent(key),
          value: _deepClone(obj[key])
        });
      }
    }
  }
  /**
   * Create an array of patches from the differences in two objects
   */


  function compare$7(tree1, tree2, invertible) {
    if (invertible === void 0) {
      invertible = false;
    }

    var patches = [];

    _generate(tree1, tree2, patches, '', invertible);

    return patches;
  }

  var duplex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    unobserve: unobserve,
    observe: observe,
    generate: generate,
    compare: compare$7
  });

  Object.assign({}, core, duplex, {
    JsonPatchError: PatchError,
    deepClone: _deepClone,
    escapePathComponent: escapePathComponent,
    unescapePathComponent: unescapePathComponent
  });

  // working on the output of `JSON.stringify` we know that only valid strings
  // are present (unless the user supplied a weird `options.indent` but in
  // that case we don’t care since the output would be invalid anyway).


  var stringOrChar = /("(?:[^\\"]|\\.)*")|[:,]/g;

  var jsonStringifyPrettyCompact = function stringify(passedObj, options) {
    var indent, maxLength, replacer;
    options = options || {};
    indent = JSON.stringify([1], undefined, options.indent === undefined ? 2 : options.indent).slice(2, -3);
    maxLength = indent === "" ? Infinity : options.maxLength === undefined ? 80 : options.maxLength;
    replacer = options.replacer;
    return function _stringify(obj, currentIndent, reserved) {
      // prettier-ignore
      var end, index, items, key, keyPart, keys, length, nextIndent, prettified, start, string, value;

      if (obj && typeof obj.toJSON === "function") {
        obj = obj.toJSON();
      }

      string = JSON.stringify(obj, replacer);

      if (string === undefined) {
        return string;
      }

      length = maxLength - currentIndent.length - reserved;

      if (string.length <= length) {
        prettified = string.replace(stringOrChar, function (match, stringLiteral) {
          return stringLiteral || match + " ";
        });

        if (prettified.length <= length) {
          return prettified;
        }
      }

      if (replacer != null) {
        obj = JSON.parse(string);
        replacer = undefined;
      }

      if (_typeof(obj) === "object" && obj !== null) {
        nextIndent = currentIndent + indent;
        items = [];
        index = 0;

        if (Array.isArray(obj)) {
          start = "[";
          end = "]";
          length = obj.length;

          for (; index < length; index++) {
            items.push(_stringify(obj[index], nextIndent, index === length - 1 ? 0 : 1) || "null");
          }
        } else {
          start = "{";
          end = "}";
          keys = Object.keys(obj);
          length = keys.length;

          for (; index < length; index++) {
            key = keys[index];
            keyPart = JSON.stringify(key) + ": ";
            value = _stringify(obj[key], nextIndent, keyPart.length + (index === length - 1 ? 0 : 1));

            if (value !== undefined) {
              items.push(keyPart + value);
            }
          }
        }

        if (items.length > 0) {
          return [start, indent + items.join(",\n" + nextIndent), end].join("\n" + currentIndent);
        }
      }

      return string;
    }(passedObj, "", 0);
  };

  function _arrayLikeToArray$2(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$2(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray$2(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread();
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var yallist = Yallist$1;
  Yallist$1.Node = Node;
  Yallist$1.create = Yallist$1;

  function Yallist$1(list) {
    var self = this;

    if (!(self instanceof Yallist$1)) {
      self = new Yallist$1();
    }

    self.tail = null;
    self.head = null;
    self.length = 0;

    if (list && typeof list.forEach === 'function') {
      list.forEach(function (item) {
        self.push(item);
      });
    } else if (arguments.length > 0) {
      for (var i = 0, l = arguments.length; i < l; i++) {
        self.push(arguments[i]);
      }
    }

    return self;
  }

  Yallist$1.prototype.removeNode = function (node) {
    if (node.list !== this) {
      throw new Error('removing node which does not belong to this list');
    }

    var next = node.next;
    var prev = node.prev;

    if (next) {
      next.prev = prev;
    }

    if (prev) {
      prev.next = next;
    }

    if (node === this.head) {
      this.head = next;
    }

    if (node === this.tail) {
      this.tail = prev;
    }

    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;
    return next;
  };

  Yallist$1.prototype.unshiftNode = function (node) {
    if (node === this.head) {
      return;
    }

    if (node.list) {
      node.list.removeNode(node);
    }

    var head = this.head;
    node.list = this;
    node.next = head;

    if (head) {
      head.prev = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }

    this.length++;
  };

  Yallist$1.prototype.pushNode = function (node) {
    if (node === this.tail) {
      return;
    }

    if (node.list) {
      node.list.removeNode(node);
    }

    var tail = this.tail;
    node.list = this;
    node.prev = tail;

    if (tail) {
      tail.next = node;
    }

    this.tail = node;

    if (!this.head) {
      this.head = node;
    }

    this.length++;
  };

  Yallist$1.prototype.push = function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      push(this, arguments[i]);
    }

    return this.length;
  };

  Yallist$1.prototype.unshift = function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      unshift(this, arguments[i]);
    }

    return this.length;
  };

  Yallist$1.prototype.pop = function () {
    if (!this.tail) {
      return undefined;
    }

    var res = this.tail.value;
    this.tail = this.tail.prev;

    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }

    this.length--;
    return res;
  };

  Yallist$1.prototype.shift = function () {
    if (!this.head) {
      return undefined;
    }

    var res = this.head.value;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    this.length--;
    return res;
  };

  Yallist$1.prototype.forEach = function (fn, thisp) {
    thisp = thisp || this;

    for (var walker = this.head, i = 0; walker !== null; i++) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.next;
    }
  };

  Yallist$1.prototype.forEachReverse = function (fn, thisp) {
    thisp = thisp || this;

    for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.prev;
    }
  };

  Yallist$1.prototype.get = function (n) {
    for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
      // abort out of the list early if we hit a cycle
      walker = walker.next;
    }

    if (i === n && walker !== null) {
      return walker.value;
    }
  };

  Yallist$1.prototype.getReverse = function (n) {
    for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
      // abort out of the list early if we hit a cycle
      walker = walker.prev;
    }

    if (i === n && walker !== null) {
      return walker.value;
    }
  };

  Yallist$1.prototype.map = function (fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist$1();

    for (var walker = this.head; walker !== null;) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.next;
    }

    return res;
  };

  Yallist$1.prototype.mapReverse = function (fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist$1();

    for (var walker = this.tail; walker !== null;) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.prev;
    }

    return res;
  };

  Yallist$1.prototype.reduce = function (fn, initial) {
    var acc;
    var walker = this.head;

    if (arguments.length > 1) {
      acc = initial;
    } else if (this.head) {
      walker = this.head.next;
      acc = this.head.value;
    } else {
      throw new TypeError('Reduce of empty list with no initial value');
    }

    for (var i = 0; walker !== null; i++) {
      acc = fn(acc, walker.value, i);
      walker = walker.next;
    }

    return acc;
  };

  Yallist$1.prototype.reduceReverse = function (fn, initial) {
    var acc;
    var walker = this.tail;

    if (arguments.length > 1) {
      acc = initial;
    } else if (this.tail) {
      walker = this.tail.prev;
      acc = this.tail.value;
    } else {
      throw new TypeError('Reduce of empty list with no initial value');
    }

    for (var i = this.length - 1; walker !== null; i--) {
      acc = fn(acc, walker.value, i);
      walker = walker.prev;
    }

    return acc;
  };

  Yallist$1.prototype.toArray = function () {
    var arr = new Array(this.length);

    for (var i = 0, walker = this.head; walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.next;
    }

    return arr;
  };

  Yallist$1.prototype.toArrayReverse = function () {
    var arr = new Array(this.length);

    for (var i = 0, walker = this.tail; walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.prev;
    }

    return arr;
  };

  Yallist$1.prototype.slice = function (from, to) {
    to = to || this.length;

    if (to < 0) {
      to += this.length;
    }

    from = from || 0;

    if (from < 0) {
      from += this.length;
    }

    var ret = new Yallist$1();

    if (to < from || to < 0) {
      return ret;
    }

    if (from < 0) {
      from = 0;
    }

    if (to > this.length) {
      to = this.length;
    }

    for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
      walker = walker.next;
    }

    for (; walker !== null && i < to; i++, walker = walker.next) {
      ret.push(walker.value);
    }

    return ret;
  };

  Yallist$1.prototype.sliceReverse = function (from, to) {
    to = to || this.length;

    if (to < 0) {
      to += this.length;
    }

    from = from || 0;

    if (from < 0) {
      from += this.length;
    }

    var ret = new Yallist$1();

    if (to < from || to < 0) {
      return ret;
    }

    if (from < 0) {
      from = 0;
    }

    if (to > this.length) {
      to = this.length;
    }

    for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
      walker = walker.prev;
    }

    for (; walker !== null && i > from; i--, walker = walker.prev) {
      ret.push(walker.value);
    }

    return ret;
  };

  Yallist$1.prototype.splice = function (start, deleteCount) {
    if (start > this.length) {
      start = this.length - 1;
    }

    if (start < 0) {
      start = this.length + start;
    }

    for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
      walker = walker.next;
    }

    var ret = [];

    for (var i = 0; walker && i < deleteCount; i++) {
      ret.push(walker.value);
      walker = this.removeNode(walker);
    }

    if (walker === null) {
      walker = this.tail;
    }

    if (walker !== this.head && walker !== this.tail) {
      walker = walker.prev;
    }

    for (var i = 0; i < (arguments.length <= 2 ? 0 : arguments.length - 2); i++) {
      walker = insert(this, walker, i + 2 < 2 || arguments.length <= i + 2 ? undefined : arguments[i + 2]);
    }

    return ret;
  };

  Yallist$1.prototype.reverse = function () {
    var head = this.head;
    var tail = this.tail;

    for (var walker = head; walker !== null; walker = walker.prev) {
      var p = walker.prev;
      walker.prev = walker.next;
      walker.next = p;
    }

    this.head = tail;
    this.tail = head;
    return this;
  };

  function insert(self, node, value) {
    var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);

    if (inserted.next === null) {
      self.tail = inserted;
    }

    if (inserted.prev === null) {
      self.head = inserted;
    }

    self.length++;
    return inserted;
  }

  function push(self, item) {
    self.tail = new Node(item, self.tail, null, self);

    if (!self.head) {
      self.head = self.tail;
    }

    self.length++;
  }

  function unshift(self, item) {
    self.head = new Node(item, null, self.head, self);

    if (!self.tail) {
      self.tail = self.head;
    }

    self.length++;
  }

  function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
      return new Node(value, prev, next, list);
    }

    this.list = list;
    this.value = value;

    if (prev) {
      prev.next = this;
      this.prev = prev;
    } else {
      this.prev = null;
    }

    if (next) {
      next.prev = this;
      this.next = next;
    } else {
      this.next = null;
    }
  }

  try {
    // add if support for Symbol.iterator is present
    Yallist$1.prototype[Symbol.iterator] = /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var walker;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              walker = this.head;

            case 1:
              if (!walker) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return walker.value;

            case 4:
              walker = walker.next;
              _context.next = 1;
              break;

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    });
  } catch (er) {}

  var Yallist = yallist;
  var MAX = Symbol('max');
  var LENGTH = Symbol('length');
  var LENGTH_CALCULATOR = Symbol('lengthCalculator');
  var ALLOW_STALE = Symbol('allowStale');
  var MAX_AGE = Symbol('maxAge');
  var DISPOSE = Symbol('dispose');
  var NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
  var LRU_LIST = Symbol('lruList');
  var CACHE = Symbol('cache');
  var UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

  var naiveLength = function naiveLength() {
    return 1;
  }; // lruList is a yallist where the head is the youngest
  // item, and the tail is the oldest.  the list contains the Hit
  // objects as the entries.
  // Each Hit object has a reference to its Yallist.Node.  This
  // never changes.
  //
  // cache is a Map (or PseudoMap) that matches the keys to
  // the Yallist.Node object.


  var LRUCache = /*#__PURE__*/function () {
    function LRUCache(options) {
      _classCallCheck(this, LRUCache);

      if (typeof options === 'number') options = {
        max: options
      };
      if (!options) options = {};
      if (options.max && (typeof options.max !== 'number' || options.max < 0)) throw new TypeError('max must be a non-negative number'); // Kind of weird to have a default max of Infinity, but oh well.

      this[MAX] = options.max || Infinity;
      var lc = options.length || naiveLength;
      this[LENGTH_CALCULATOR] = typeof lc !== 'function' ? naiveLength : lc;
      this[ALLOW_STALE] = options.stale || false;
      if (options.maxAge && typeof options.maxAge !== 'number') throw new TypeError('maxAge must be a number');
      this[MAX_AGE] = options.maxAge || 0;
      this[DISPOSE] = options.dispose;
      this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
      this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
      this.reset();
    } // resize the cache when the max changes.


    _createClass(LRUCache, [{
      key: "max",
      get: function get() {
        return this[MAX];
      },
      set: function set(mL) {
        if (typeof mL !== 'number' || mL < 0) throw new TypeError('max must be a non-negative number');
        this[MAX] = mL || Infinity;
        trim(this);
      }
    }, {
      key: "allowStale",
      get: function get() {
        return this[ALLOW_STALE];
      },
      set: function set(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
      }
    }, {
      key: "maxAge",
      get: function get() {
        return this[MAX_AGE];
      } // resize the cache when the lengthCalculator changes.
      ,
      set: function set(mA) {
        if (typeof mA !== 'number') throw new TypeError('maxAge must be a non-negative number');
        this[MAX_AGE] = mA;
        trim(this);
      }
    }, {
      key: "lengthCalculator",
      get: function get() {
        return this[LENGTH_CALCULATOR];
      },
      set: function set(lC) {
        var _this = this;

        if (typeof lC !== 'function') lC = naiveLength;

        if (lC !== this[LENGTH_CALCULATOR]) {
          this[LENGTH_CALCULATOR] = lC;
          this[LENGTH] = 0;
          this[LRU_LIST].forEach(function (hit) {
            hit.length = _this[LENGTH_CALCULATOR](hit.value, hit.key);
            _this[LENGTH] += hit.length;
          });
        }

        trim(this);
      }
    }, {
      key: "length",
      get: function get() {
        return this[LENGTH];
      }
    }, {
      key: "itemCount",
      get: function get() {
        return this[LRU_LIST].length;
      }
    }, {
      key: "rforEach",
      value: function rforEach(fn, thisp) {
        thisp = thisp || this;

        for (var walker = this[LRU_LIST].tail; walker !== null;) {
          var prev = walker.prev;
          forEachStep(this, fn, walker, thisp);
          walker = prev;
        }
      }
    }, {
      key: "forEach",
      value: function forEach(fn, thisp) {
        thisp = thisp || this;

        for (var walker = this[LRU_LIST].head; walker !== null;) {
          var next = walker.next;
          forEachStep(this, fn, walker, thisp);
          walker = next;
        }
      }
    }, {
      key: "keys",
      value: function keys() {
        return this[LRU_LIST].toArray().map(function (k) {
          return k.key;
        });
      }
    }, {
      key: "values",
      value: function values() {
        return this[LRU_LIST].toArray().map(function (k) {
          return k.value;
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        var _this2 = this;

        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
          this[LRU_LIST].forEach(function (hit) {
            return _this2[DISPOSE](hit.key, hit.value);
          });
        }

        this[CACHE] = new Map(); // hash of items by key

        this[LRU_LIST] = new Yallist(); // list of items in order of use recency

        this[LENGTH] = 0; // length of items in the list
      }
    }, {
      key: "dump",
      value: function dump() {
        var _this3 = this;

        return this[LRU_LIST].map(function (hit) {
          return isStale(_this3, hit) ? false : {
            k: hit.key,
            v: hit.value,
            e: hit.now + (hit.maxAge || 0)
          };
        }).toArray().filter(function (h) {
          return h;
        });
      }
    }, {
      key: "dumpLru",
      value: function dumpLru() {
        return this[LRU_LIST];
      }
    }, {
      key: "set",
      value: function set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== 'number') throw new TypeError('maxAge must be a number');
        var now = maxAge ? Date.now() : 0;
        var len = this[LENGTH_CALCULATOR](value, key);

        if (this[CACHE].has(key)) {
          if (len > this[MAX]) {
            _del(this, this[CACHE].get(key));

            return false;
          }

          var node = this[CACHE].get(key);
          var item = node.value; // dispose of the old one before overwriting
          // split out into 2 ifs for better coverage tracking

          if (this[DISPOSE]) {
            if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
          }

          item.now = now;
          item.maxAge = maxAge;
          item.value = value;
          this[LENGTH] += len - item.length;
          item.length = len;
          this.get(key);
          trim(this);
          return true;
        }

        var hit = new Entry(key, value, len, now, maxAge); // oversized objects fall out of cache automatically.

        if (hit.length > this[MAX]) {
          if (this[DISPOSE]) this[DISPOSE](key, value);
          return false;
        }

        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
      }
    }, {
      key: "has",
      value: function has(key) {
        if (!this[CACHE].has(key)) return false;
        var hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
      }
    }, {
      key: "get",
      value: function get(key) {
        return _get(this, key, true);
      }
    }, {
      key: "peek",
      value: function peek(key) {
        return _get(this, key, false);
      }
    }, {
      key: "pop",
      value: function pop() {
        var node = this[LRU_LIST].tail;
        if (!node) return null;

        _del(this, node);

        return node.value;
      }
    }, {
      key: "del",
      value: function del(key) {
        _del(this, this[CACHE].get(key));
      }
    }, {
      key: "load",
      value: function load(arr) {
        // reset the cache
        this.reset();
        var now = Date.now(); // A previous serialized cache has the most recent items first

        for (var l = arr.length - 1; l >= 0; l--) {
          var hit = arr[l];
          var expiresAt = hit.e || 0;
          if (expiresAt === 0) // the item was created without expiration in a non aged cache
            this.set(hit.k, hit.v);else {
            var maxAge = expiresAt - now; // dont add already expired items

            if (maxAge > 0) {
              this.set(hit.k, hit.v, maxAge);
            }
          }
        }
      }
    }, {
      key: "prune",
      value: function prune() {
        var _this4 = this;

        this[CACHE].forEach(function (value, key) {
          return _get(_this4, key, false);
        });
      }
    }]);

    return LRUCache;
  }();

  var _get = function _get(self, key, doUse) {
    var node = self[CACHE].get(key);

    if (node) {
      var hit = node.value;

      if (isStale(self, hit)) {
        _del(self, node);

        if (!self[ALLOW_STALE]) return undefined;
      } else {
        if (doUse) {
          if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
          self[LRU_LIST].unshiftNode(node);
        }
      }

      return hit.value;
    }
  };

  var isStale = function isStale(self, hit) {
    if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
    var diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
  };

  var trim = function trim(self) {
    if (self[LENGTH] > self[MAX]) {
      for (var walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;) {
        // We know that we're about to delete this one, and also
        // what the next least recently used key will be, so just
        // go ahead and set it now.
        var prev = walker.prev;

        _del(self, walker);

        walker = prev;
      }
    }
  };

  var _del = function _del(self, node) {
    if (node) {
      var hit = node.value;
      if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
      self[LENGTH] -= hit.length;
      self[CACHE].delete(hit.key);
      self[LRU_LIST].removeNode(node);
    }
  };

  var Entry = function Entry(key, value, length, now, maxAge) {
    _classCallCheck(this, Entry);

    this.key = key;
    this.value = value;
    this.length = length;
    this.now = now;
    this.maxAge = maxAge || 0;
  };

  var forEachStep = function forEachStep(self, fn, node, thisp) {
    var hit = node.value;

    if (isStale(self, hit)) {
      _del(self, node);

      if (!self[ALLOW_STALE]) hit = undefined;
    }

    if (hit) fn.call(thisp, hit.value, hit.key, self);
  };

  var lruCache = LRUCache;

  // obj with keys in a consistent order.

  var opts = ['includePrerelease', 'loose', 'rtl'];

  var parseOptions$3 = function parseOptions(options) {
    return !options ? {} : _typeof(options) !== 'object' ? {
      loose: true
    } : opts.filter(function (k) {
      return options[k];
    }).reduce(function (options, k) {
      options[k] = true;
      return options;
    }, {});
  };

  var parseOptions_1 = parseOptions$3;

  var re$3 = {exports: {}};

  // Not necessarily the package version of this code.

  var SEMVER_SPEC_VERSION = '2.0.0';
  var MAX_LENGTH$1 = 256;
  var MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */
  9007199254740991; // Max safe segment length for coercion.

  var MAX_SAFE_COMPONENT_LENGTH = 16;
  var constants = {
    SEMVER_SPEC_VERSION: SEMVER_SPEC_VERSION,
    MAX_LENGTH: MAX_LENGTH$1,
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
    MAX_SAFE_COMPONENT_LENGTH: MAX_SAFE_COMPONENT_LENGTH
  };

  var debug$3 = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? function () {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_console = console).error.apply(_console, ['SEMVER'].concat(args));
  } : function () {};
  var debug_1 = debug$3;

  (function (module, exports) {
    var MAX_SAFE_COMPONENT_LENGTH = constants.MAX_SAFE_COMPONENT_LENGTH;
    var debug = debug_1;
    exports = module.exports = {}; // The actual regexps go on exports.re

    var re = exports.re = [];
    var src = exports.src = [];
    var t = exports.t = {};
    var R = 0;

    var createToken = function createToken(name, value, isGlobal) {
      var index = R++;
      debug(index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    }; // The following Regular Expressions can be used for tokenizing,
    // validating, and parsing SemVer version strings.
    // ## Numeric Identifier
    // A single `0`, or a non-zero digit followed by zero or more digits.


    createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
    createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+'); // ## Non-numeric Identifier
    // Zero or more digits, followed by a letter or hyphen, and then zero or
    // more letters, digits, or hyphens.

    createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*'); // ## Main Version
    // Three dot-separated numeric identifiers.

    createToken('MAINVERSION', "(".concat(src[t.NUMERICIDENTIFIER], ")\\.") + "(".concat(src[t.NUMERICIDENTIFIER], ")\\.") + "(".concat(src[t.NUMERICIDENTIFIER], ")"));
    createToken('MAINVERSIONLOOSE', "(".concat(src[t.NUMERICIDENTIFIERLOOSE], ")\\.") + "(".concat(src[t.NUMERICIDENTIFIERLOOSE], ")\\.") + "(".concat(src[t.NUMERICIDENTIFIERLOOSE], ")")); // ## Pre-release Version Identifier
    // A numeric identifier, or a non-numeric identifier.

    createToken('PRERELEASEIDENTIFIER', "(?:".concat(src[t.NUMERICIDENTIFIER], "|").concat(src[t.NONNUMERICIDENTIFIER], ")"));
    createToken('PRERELEASEIDENTIFIERLOOSE', "(?:".concat(src[t.NUMERICIDENTIFIERLOOSE], "|").concat(src[t.NONNUMERICIDENTIFIER], ")")); // ## Pre-release Version
    // Hyphen, followed by one or more dot-separated pre-release version
    // identifiers.

    createToken('PRERELEASE', "(?:-(".concat(src[t.PRERELEASEIDENTIFIER], "(?:\\.").concat(src[t.PRERELEASEIDENTIFIER], ")*))"));
    createToken('PRERELEASELOOSE', "(?:-?(".concat(src[t.PRERELEASEIDENTIFIERLOOSE], "(?:\\.").concat(src[t.PRERELEASEIDENTIFIERLOOSE], ")*))")); // ## Build Metadata Identifier
    // Any combination of digits, letters, or hyphens.

    createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+'); // ## Build Metadata
    // Plus sign, followed by one or more period-separated build metadata
    // identifiers.

    createToken('BUILD', "(?:\\+(".concat(src[t.BUILDIDENTIFIER], "(?:\\.").concat(src[t.BUILDIDENTIFIER], ")*))")); // ## Full Version String
    // A main version, followed optionally by a pre-release version and
    // build metadata.
    // Note that the only major, minor, patch, and pre-release sections of
    // the version string are capturing groups.  The build metadata is not a
    // capturing group, because it should not ever be used in version
    // comparison.

    createToken('FULLPLAIN', "v?".concat(src[t.MAINVERSION]).concat(src[t.PRERELEASE], "?").concat(src[t.BUILD], "?"));
    createToken('FULL', "^".concat(src[t.FULLPLAIN], "$")); // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
    // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
    // common in the npm registry.

    createToken('LOOSEPLAIN', "[v=\\s]*".concat(src[t.MAINVERSIONLOOSE]).concat(src[t.PRERELEASELOOSE], "?").concat(src[t.BUILD], "?"));
    createToken('LOOSE', "^".concat(src[t.LOOSEPLAIN], "$"));
    createToken('GTLT', '((?:<|>)?=?)'); // Something like "2.*" or "1.2.x".
    // Note that "x.x" is a valid xRange identifer, meaning "any version"
    // Only the first item is strictly required.

    createToken('XRANGEIDENTIFIERLOOSE', "".concat(src[t.NUMERICIDENTIFIERLOOSE], "|x|X|\\*"));
    createToken('XRANGEIDENTIFIER', "".concat(src[t.NUMERICIDENTIFIER], "|x|X|\\*"));
    createToken('XRANGEPLAIN', "[v=\\s]*(".concat(src[t.XRANGEIDENTIFIER], ")") + "(?:\\.(".concat(src[t.XRANGEIDENTIFIER], ")") + "(?:\\.(".concat(src[t.XRANGEIDENTIFIER], ")") + "(?:".concat(src[t.PRERELEASE], ")?").concat(src[t.BUILD], "?") + ")?)?");
    createToken('XRANGEPLAINLOOSE', "[v=\\s]*(".concat(src[t.XRANGEIDENTIFIERLOOSE], ")") + "(?:\\.(".concat(src[t.XRANGEIDENTIFIERLOOSE], ")") + "(?:\\.(".concat(src[t.XRANGEIDENTIFIERLOOSE], ")") + "(?:".concat(src[t.PRERELEASELOOSE], ")?").concat(src[t.BUILD], "?") + ")?)?");
    createToken('XRANGE', "^".concat(src[t.GTLT], "\\s*").concat(src[t.XRANGEPLAIN], "$"));
    createToken('XRANGELOOSE', "^".concat(src[t.GTLT], "\\s*").concat(src[t.XRANGEPLAINLOOSE], "$")); // Coercion.
    // Extract anything that could conceivably be a part of a valid semver

    createToken('COERCE', "".concat('(^|[^\\d])' + '(\\d{1,').concat(MAX_SAFE_COMPONENT_LENGTH, "})") + "(?:\\.(\\d{1,".concat(MAX_SAFE_COMPONENT_LENGTH, "}))?") + "(?:\\.(\\d{1,".concat(MAX_SAFE_COMPONENT_LENGTH, "}))?") + "(?:$|[^\\d])");
    createToken('COERCERTL', src[t.COERCE], true); // Tilde ranges.
    // Meaning is "reasonably at or greater than"

    createToken('LONETILDE', '(?:~>?)');
    createToken('TILDETRIM', "(\\s*)".concat(src[t.LONETILDE], "\\s+"), true);
    exports.tildeTrimReplace = '$1~';
    createToken('TILDE', "^".concat(src[t.LONETILDE]).concat(src[t.XRANGEPLAIN], "$"));
    createToken('TILDELOOSE', "^".concat(src[t.LONETILDE]).concat(src[t.XRANGEPLAINLOOSE], "$")); // Caret ranges.
    // Meaning is "at least and backwards compatible with"

    createToken('LONECARET', '(?:\\^)');
    createToken('CARETTRIM', "(\\s*)".concat(src[t.LONECARET], "\\s+"), true);
    exports.caretTrimReplace = '$1^';
    createToken('CARET', "^".concat(src[t.LONECARET]).concat(src[t.XRANGEPLAIN], "$"));
    createToken('CARETLOOSE', "^".concat(src[t.LONECARET]).concat(src[t.XRANGEPLAINLOOSE], "$")); // A simple gt/lt/eq thing, or just "" to indicate "any version"

    createToken('COMPARATORLOOSE', "^".concat(src[t.GTLT], "\\s*(").concat(src[t.LOOSEPLAIN], ")$|^$"));
    createToken('COMPARATOR', "^".concat(src[t.GTLT], "\\s*(").concat(src[t.FULLPLAIN], ")$|^$")); // An expression to strip any whitespace between the gtlt and the thing
    // it modifies, so that `> 1.2.3` ==> `>1.2.3`

    createToken('COMPARATORTRIM', "(\\s*)".concat(src[t.GTLT], "\\s*(").concat(src[t.LOOSEPLAIN], "|").concat(src[t.XRANGEPLAIN], ")"), true);
    exports.comparatorTrimReplace = '$1$2$3'; // Something like `1.2.3 - 1.2.4`
    // Note that these all use the loose form, because they'll be
    // checked against either the strict or loose comparator form
    // later.

    createToken('HYPHENRANGE', "^\\s*(".concat(src[t.XRANGEPLAIN], ")") + "\\s+-\\s+" + "(".concat(src[t.XRANGEPLAIN], ")") + "\\s*$");
    createToken('HYPHENRANGELOOSE', "^\\s*(".concat(src[t.XRANGEPLAINLOOSE], ")") + "\\s+-\\s+" + "(".concat(src[t.XRANGEPLAINLOOSE], ")") + "\\s*$"); // Star ranges basically just allow anything at all.

    createToken('STAR', '(<|>)?=?\\s*\\*'); // >=0.0.0 is like a star

    createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$');
    createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$');
  })(re$3, re$3.exports);

  var numeric = /^[0-9]+$/;

  var compareIdentifiers$1 = function compareIdentifiers(a, b) {
    var anum = numeric.test(a);
    var bnum = numeric.test(b);

    if (anum && bnum) {
      a = +a;
      b = +b;
    }

    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  };

  var rcompareIdentifiers = function rcompareIdentifiers(a, b) {
    return compareIdentifiers$1(b, a);
  };

  var identifiers = {
    compareIdentifiers: compareIdentifiers$1,
    rcompareIdentifiers: rcompareIdentifiers
  };

  var debug$2 = debug_1;
  var MAX_LENGTH = constants.MAX_LENGTH,
      MAX_SAFE_INTEGER = constants.MAX_SAFE_INTEGER;
  var re$2 = re$3.exports.re,
      t$2 = re$3.exports.t;
  var parseOptions$2 = parseOptions_1;
  var compareIdentifiers = identifiers.compareIdentifiers;

  var SemVer$3 = /*#__PURE__*/function () {
    function SemVer(version, options) {
      _classCallCheck(this, SemVer);

      options = parseOptions$2(options);

      if (version instanceof SemVer) {
        if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== 'string') {
        throw new TypeError("Invalid Version: ".concat(version));
      }

      if (version.length > MAX_LENGTH) {
        throw new TypeError("version is longer than ".concat(MAX_LENGTH, " characters"));
      }

      debug$2('SemVer', version, options);
      this.options = options;
      this.loose = !!options.loose; // this isn't actually relevant for versions, but keep it so that we
      // don't run into trouble passing this.options around.

      this.includePrerelease = !!options.includePrerelease;
      var m = version.trim().match(options.loose ? re$2[t$2.LOOSE] : re$2[t$2.FULL]);

      if (!m) {
        throw new TypeError("Invalid Version: ".concat(version));
      }

      this.raw = version; // these are actually numbers

      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];

      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError('Invalid major version');
      }

      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError('Invalid minor version');
      }

      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError('Invalid patch version');
      } // numberify any prerelease numeric ids


      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split('.').map(function (id) {
          if (/^[0-9]+$/.test(id)) {
            var num = +id;

            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }

          return id;
        });
      }

      this.build = m[5] ? m[5].split('.') : [];
      this.format();
    }

    _createClass(SemVer, [{
      key: "format",
      value: function format() {
        this.version = "".concat(this.major, ".").concat(this.minor, ".").concat(this.patch);

        if (this.prerelease.length) {
          this.version += "-".concat(this.prerelease.join('.'));
        }

        return this.version;
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.version;
      }
    }, {
      key: "compare",
      value: function compare(other) {
        debug$2('SemVer.compare', this.version, this.options, other);

        if (!(other instanceof SemVer)) {
          if (typeof other === 'string' && other === this.version) {
            return 0;
          }

          other = new SemVer(other, this.options);
        }

        if (other.version === this.version) {
          return 0;
        }

        return this.compareMain(other) || this.comparePre(other);
      }
    }, {
      key: "compareMain",
      value: function compareMain(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }

        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
      }
    }, {
      key: "comparePre",
      value: function comparePre(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        } // NOT having a prerelease is > having one


        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }

        var i = 0;

        do {
          var a = this.prerelease[i];
          var b = other.prerelease[i];
          debug$2('prerelease compare', i, a, b);

          if (a === undefined && b === undefined) {
            return 0;
          } else if (b === undefined) {
            return 1;
          } else if (a === undefined) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
    }, {
      key: "compareBuild",
      value: function compareBuild(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }

        var i = 0;

        do {
          var a = this.build[i];
          var b = other.build[i];
          debug$2('prerelease compare', i, a, b);

          if (a === undefined && b === undefined) {
            return 0;
          } else if (b === undefined) {
            return 1;
          } else if (a === undefined) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      } // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.

    }, {
      key: "inc",
      value: function inc(release, identifier) {
        switch (release) {
          case 'premajor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc('pre', identifier);
            break;

          case 'preminor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc('pre', identifier);
            break;

          case 'prepatch':
            // If this is already a prerelease, it will bump to the next version
            // drop any prereleases that might already exist, since they are not
            // relevant at this point.
            this.prerelease.length = 0;
            this.inc('patch', identifier);
            this.inc('pre', identifier);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.

          case 'prerelease':
            if (this.prerelease.length === 0) {
              this.inc('patch', identifier);
            }

            this.inc('pre', identifier);
            break;

          case 'major':
            // If this is a pre-major version, bump up to the same major version.
            // Otherwise increment major.
            // 1.0.0-5 bumps to 1.0.0
            // 1.1.0 bumps to 2.0.0
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }

            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;

          case 'minor':
            // If this is a pre-minor version, bump up to the same minor version.
            // Otherwise increment minor.
            // 1.2.0-5 bumps to 1.2.0
            // 1.2.1 bumps to 1.3.0
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }

            this.patch = 0;
            this.prerelease = [];
            break;

          case 'patch':
            // If this is not a pre-release version, it will increment the patch.
            // If it is a pre-release it will bump up to the same patch version.
            // 1.2.0-5 patches to 1.2.0
            // 1.2.0 patches to 1.2.1
            if (this.prerelease.length === 0) {
              this.patch++;
            }

            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.

          case 'pre':
            if (this.prerelease.length === 0) {
              this.prerelease = [0];
            } else {
              var i = this.prerelease.length;

              while (--i >= 0) {
                if (typeof this.prerelease[i] === 'number') {
                  this.prerelease[i]++;
                  i = -2;
                }
              }

              if (i === -1) {
                // didn't increment anything
                this.prerelease.push(0);
              }
            }

            if (identifier) {
              // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
              // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
              if (this.prerelease[0] === identifier) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = [identifier, 0];
                }
              } else {
                this.prerelease = [identifier, 0];
              }
            }

            break;

          default:
            throw new Error("invalid increment argument: ".concat(release));
        }

        this.format();
        this.raw = this.version;
        return this;
      }
    }]);

    return SemVer;
  }();

  var semver = SemVer$3;

  var SemVer$2 = semver;

  var compare$6 = function compare(a, b, loose) {
    return new SemVer$2(a, loose).compare(new SemVer$2(b, loose));
  };

  var compare_1 = compare$6;

  var compare$5 = compare_1;

  var eq$1 = function eq(a, b, loose) {
    return compare$5(a, b, loose) === 0;
  };

  var eq_1 = eq$1;

  var compare$4 = compare_1;

  var neq$1 = function neq(a, b, loose) {
    return compare$4(a, b, loose) !== 0;
  };

  var neq_1 = neq$1;

  var compare$3 = compare_1;

  var gt$1 = function gt(a, b, loose) {
    return compare$3(a, b, loose) > 0;
  };

  var gt_1 = gt$1;

  var compare$2 = compare_1;

  var gte$1 = function gte(a, b, loose) {
    return compare$2(a, b, loose) >= 0;
  };

  var gte_1 = gte$1;

  var compare$1 = compare_1;

  var lt$1 = function lt(a, b, loose) {
    return compare$1(a, b, loose) < 0;
  };

  var lt_1 = lt$1;

  var compare = compare_1;

  var lte$1 = function lte(a, b, loose) {
    return compare(a, b, loose) <= 0;
  };

  var lte_1 = lte$1;

  var eq = eq_1;
  var neq = neq_1;
  var gt = gt_1;
  var gte = gte_1;
  var lt = lt_1;
  var lte = lte_1;

  var cmp$1 = function cmp(a, op, b, loose) {
    switch (op) {
      case '===':
        if (_typeof(a) === 'object') a = a.version;
        if (_typeof(b) === 'object') b = b.version;
        return a === b;

      case '!==':
        if (_typeof(a) === 'object') a = a.version;
        if (_typeof(b) === 'object') b = b.version;
        return a !== b;

      case '':
      case '=':
      case '==':
        return eq(a, b, loose);

      case '!=':
        return neq(a, b, loose);

      case '>':
        return gt(a, b, loose);

      case '>=':
        return gte(a, b, loose);

      case '<':
        return lt(a, b, loose);

      case '<=':
        return lte(a, b, loose);

      default:
        throw new TypeError("Invalid operator: ".concat(op));
    }
  };

  var cmp_1 = cmp$1;

  var ANY = Symbol('SemVer ANY'); // hoisted class for cyclic dependency

  var Comparator$1 = /*#__PURE__*/function () {
    function Comparator(comp, options) {
      _classCallCheck(this, Comparator);

      options = parseOptions$1(options);

      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }

      debug$1('comparator', comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);

      if (this.semver === ANY) {
        this.value = '';
      } else {
        this.value = this.operator + this.semver.version;
      }

      debug$1('comp', this);
    }

    _createClass(Comparator, [{
      key: "parse",
      value: function parse(comp) {
        var r = this.options.loose ? re$1[t$1.COMPARATORLOOSE] : re$1[t$1.COMPARATOR];
        var m = comp.match(r);

        if (!m) {
          throw new TypeError("Invalid comparator: ".concat(comp));
        }

        this.operator = m[1] !== undefined ? m[1] : '';

        if (this.operator === '=') {
          this.operator = '';
        } // if it literally is just '>' or '' then allow anything.


        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer$1(m[2], this.options.loose);
        }
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.value;
      }
    }, {
      key: "test",
      value: function test(version) {
        debug$1('Comparator.test', version, this.options.loose);

        if (this.semver === ANY || version === ANY) {
          return true;
        }

        if (typeof version === 'string') {
          try {
            version = new SemVer$1(version, this.options);
          } catch (er) {
            return false;
          }
        }

        return cmp(version, this.operator, this.semver, this.options);
      }
    }, {
      key: "intersects",
      value: function intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
          throw new TypeError('a Comparator is required');
        }

        if (!options || _typeof(options) !== 'object') {
          options = {
            loose: !!options,
            includePrerelease: false
          };
        }

        if (this.operator === '') {
          if (this.value === '') {
            return true;
          }

          return new Range$2(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
          if (comp.value === '') {
            return true;
          }

          return new Range$2(this.value, options).test(comp.semver);
        }

        var sameDirectionIncreasing = (this.operator === '>=' || this.operator === '>') && (comp.operator === '>=' || comp.operator === '>');
        var sameDirectionDecreasing = (this.operator === '<=' || this.operator === '<') && (comp.operator === '<=' || comp.operator === '<');
        var sameSemVer = this.semver.version === comp.semver.version;
        var differentDirectionsInclusive = (this.operator === '>=' || this.operator === '<=') && (comp.operator === '>=' || comp.operator === '<=');
        var oppositeDirectionsLessThan = cmp(this.semver, '<', comp.semver, options) && (this.operator === '>=' || this.operator === '>') && (comp.operator === '<=' || comp.operator === '<');
        var oppositeDirectionsGreaterThan = cmp(this.semver, '>', comp.semver, options) && (this.operator === '<=' || this.operator === '<') && (comp.operator === '>=' || comp.operator === '>');
        return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
      }
    }], [{
      key: "ANY",
      get: function get() {
        return ANY;
      }
    }]);

    return Comparator;
  }();

  var comparator = Comparator$1;
  var parseOptions$1 = parseOptions_1;
  var re$1 = re$3.exports.re,
      t$1 = re$3.exports.t;
  var cmp = cmp_1;
  var debug$1 = debug_1;
  var SemVer$1 = semver;
  var Range$2 = range;

  function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var Range$1 = /*#__PURE__*/function () {
    function Range(range, options) {
      var _this = this;

      _classCallCheck(this, Range);

      options = parseOptions(options);

      if (range instanceof Range) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
          return range;
        } else {
          return new Range(range.raw, options);
        }
      }

      if (range instanceof Comparator) {
        // just put it in the set and return
        this.raw = range.value;
        this.set = [[range]];
        this.format();
        return this;
      }

      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease; // First, split based on boolean or ||

      this.raw = range;
      this.set = range.split(/\s*\|\|\s*/) // map the range to a 2d array of comparators
      .map(function (range) {
        return _this.parseRange(range.trim());
      }) // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(function (c) {
        return c.length;
      });

      if (!this.set.length) {
        throw new TypeError("Invalid SemVer Range: ".concat(range));
      } // if we have any that are not the null set, throw out null sets.


      if (this.set.length > 1) {
        // keep the first one, in case they're all null sets
        var first = this.set[0];
        this.set = this.set.filter(function (c) {
          return !isNullSet(c[0]);
        });
        if (this.set.length === 0) this.set = [first];else if (this.set.length > 1) {
          // if we have any that are *, then the range is just *
          var _iterator = _createForOfIteratorHelper$1(this.set),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var c = _step.value;

              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }

      this.format();
    }

    _createClass(Range, [{
      key: "format",
      value: function format() {
        this.range = this.set.map(function (comps) {
          return comps.join(' ').trim();
        }).join('||').trim();
        return this.range;
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.range;
      }
    }, {
      key: "parseRange",
      value: function parseRange(range) {
        var _this2 = this;

        range = range.trim(); // memoize range parsing for performance.
        // this is a very hot path, and fully deterministic.

        var memoOpts = Object.keys(this.options).join(',');
        var memoKey = "parseRange:".concat(memoOpts, ":").concat(range);
        var cached = cache.get(memoKey);
        if (cached) return cached;
        var loose = this.options.loose; // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`

        var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug('hyphen replace', range); // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`

        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug('comparator trim', range, re[t.COMPARATORTRIM]); // `~ 1.2.3` => `~1.2.3`

        range = range.replace(re[t.TILDETRIM], tildeTrimReplace); // `^ 1.2.3` => `^1.2.3`

        range = range.replace(re[t.CARETTRIM], caretTrimReplace); // normalize spaces

        range = range.split(/\s+/).join(' '); // At this point, the range is completely trimmed and
        // ready to be split into comparators.

        var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        var rangeList = range.split(' ').map(function (comp) {
          return parseComparator(comp, _this2.options);
        }).join(' ').split(/\s+/) // >=0.0.0 is equivalent to *
        .map(function (comp) {
          return replaceGTE0(comp, _this2.options);
        }) // in loose mode, throw out any that are not valid comparators
        .filter(this.options.loose ? function (comp) {
          return !!comp.match(compRe);
        } : function () {
          return true;
        }).map(function (comp) {
          return new Comparator(comp, _this2.options);
        }); // if any comparators are the null set, then replace with JUST null set
        // if more than one comparator, remove any * comparators
        // also, don't include the same comparator more than once

        rangeList.length;
        var rangeMap = new Map();

        var _iterator2 = _createForOfIteratorHelper$1(rangeList),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var comp = _step2.value;
            if (isNullSet(comp)) return [comp];
            rangeMap.set(comp.value, comp);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (rangeMap.size > 1 && rangeMap.has('')) rangeMap.delete('');

        var result = _toConsumableArray(rangeMap.values());

        cache.set(memoKey, result);
        return result;
      }
    }, {
      key: "intersects",
      value: function intersects(range, options) {
        if (!(range instanceof Range)) {
          throw new TypeError('a Range is required');
        }

        return this.set.some(function (thisComparators) {
          return isSatisfiable(thisComparators, options) && range.set.some(function (rangeComparators) {
            return isSatisfiable(rangeComparators, options) && thisComparators.every(function (thisComparator) {
              return rangeComparators.every(function (rangeComparator) {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      } // if ANY of the sets match ALL of its comparators, then pass

    }, {
      key: "test",
      value: function test(version) {
        if (!version) {
          return false;
        }

        if (typeof version === 'string') {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }

        for (var i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }

        return false;
      }
    }]);

    return Range;
  }();

  var range = Range$1;
  var LRU = lruCache;
  var cache = new LRU({
    max: 1000
  });
  var parseOptions = parseOptions_1;
  var Comparator = comparator;
  var debug = debug_1;
  var SemVer = semver;
  var re = re$3.exports.re,
      t = re$3.exports.t,
      comparatorTrimReplace = re$3.exports.comparatorTrimReplace,
      tildeTrimReplace = re$3.exports.tildeTrimReplace,
      caretTrimReplace = re$3.exports.caretTrimReplace;

  var isNullSet = function isNullSet(c) {
    return c.value === '<0.0.0-0';
  };

  var isAny = function isAny(c) {
    return c.value === '';
  }; // take a set of comparators and determine whether there
  // exists a version which can satisfy it


  var isSatisfiable = function isSatisfiable(comparators, options) {
    var result = true;
    var remainingComparators = comparators.slice();
    var testComparator = remainingComparators.pop();

    while (result && remainingComparators.length) {
      result = remainingComparators.every(function (otherComparator) {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }

    return result;
  }; // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.


  var parseComparator = function parseComparator(comp, options) {
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp;
  };

  var isX = function isX(id) {
    return !id || id.toLowerCase() === 'x' || id === '*';
  }; // ~, ~> --> * (any, kinda silly)
  // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
  // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
  // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
  // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
  // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0


  var replaceTildes = function replaceTildes(comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceTilde(comp, options);
    }).join(' ');
  };

  var replaceTilde = function replaceTilde(comp, options) {
    var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('tilde', comp, _, M, m, p, pr);
      var ret;

      if (isX(M)) {
        ret = '';
      } else if (isX(m)) {
        ret = ">=".concat(M, ".0.0 <").concat(+M + 1, ".0.0-0");
      } else if (isX(p)) {
        // ~1.2 == >=1.2.0 <1.3.0-0
        ret = ">=".concat(M, ".").concat(m, ".0 <").concat(M, ".").concat(+m + 1, ".0-0");
      } else if (pr) {
        debug('replaceTilde pr', pr);
        ret = ">=".concat(M, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(M, ".").concat(+m + 1, ".0-0");
      } else {
        // ~1.2.3 == >=1.2.3 <1.3.0-0
        ret = ">=".concat(M, ".").concat(m, ".").concat(p, " <").concat(M, ".").concat(+m + 1, ".0-0");
      }

      debug('tilde return', ret);
      return ret;
    });
  }; // ^ --> * (any, kinda silly)
  // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
  // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
  // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
  // ^1.2.3 --> >=1.2.3 <2.0.0-0
  // ^1.2.0 --> >=1.2.0 <2.0.0-0


  var replaceCarets = function replaceCarets(comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceCaret(comp, options);
    }).join(' ');
  };

  var replaceCaret = function replaceCaret(comp, options) {
    debug('caret', comp, options);
    var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    var z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('caret', comp, _, M, m, p, pr);
      var ret;

      if (isX(M)) {
        ret = '';
      } else if (isX(m)) {
        ret = ">=".concat(M, ".0.0").concat(z, " <").concat(+M + 1, ".0.0-0");
      } else if (isX(p)) {
        if (M === '0') {
          ret = ">=".concat(M, ".").concat(m, ".0").concat(z, " <").concat(M, ".").concat(+m + 1, ".0-0");
        } else {
          ret = ">=".concat(M, ".").concat(m, ".0").concat(z, " <").concat(+M + 1, ".0.0-0");
        }
      } else if (pr) {
        debug('replaceCaret pr', pr);

        if (M === '0') {
          if (m === '0') {
            ret = ">=".concat(M, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(M, ".").concat(m, ".").concat(+p + 1, "-0");
          } else {
            ret = ">=".concat(M, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(M, ".").concat(+m + 1, ".0-0");
          }
        } else {
          ret = ">=".concat(M, ".").concat(m, ".").concat(p, "-").concat(pr, " <").concat(+M + 1, ".0.0-0");
        }
      } else {
        debug('no pr');

        if (M === '0') {
          if (m === '0') {
            ret = ">=".concat(M, ".").concat(m, ".").concat(p).concat(z, " <").concat(M, ".").concat(m, ".").concat(+p + 1, "-0");
          } else {
            ret = ">=".concat(M, ".").concat(m, ".").concat(p).concat(z, " <").concat(M, ".").concat(+m + 1, ".0-0");
          }
        } else {
          ret = ">=".concat(M, ".").concat(m, ".").concat(p, " <").concat(+M + 1, ".0.0-0");
        }
      }

      debug('caret return', ret);
      return ret;
    });
  };

  var replaceXRanges = function replaceXRanges(comp, options) {
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map(function (comp) {
      return replaceXRange(comp, options);
    }).join(' ');
  };

  var replaceXRange = function replaceXRange(comp, options) {
    comp = comp.trim();
    var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
      debug('xRange', comp, ret, gtlt, M, m, p, pr);
      var xM = isX(M);
      var xm = xM || isX(m);
      var xp = xm || isX(p);
      var anyX = xp;

      if (gtlt === '=' && anyX) {
        gtlt = '';
      } // if we're including prereleases in the match, then we need
      // to fix this to -0, the lowest possible prerelease value


      pr = options.includePrerelease ? '-0' : '';

      if (xM) {
        if (gtlt === '>' || gtlt === '<') {
          // nothing is allowed
          ret = '<0.0.0-0';
        } else {
          // nothing is forbidden
          ret = '*';
        }
      } else if (gtlt && anyX) {
        // we know patch is an x, because we have any x at all.
        // replace X with 0
        if (xm) {
          m = 0;
        }

        p = 0;

        if (gtlt === '>') {
          // >1 => >=2.0.0
          // >1.2 => >=1.3.0
          gtlt = '>=';

          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === '<=') {
          // <=0.7.x is actually <0.8.0, since any 0.7.x should
          // pass.  Similarly, <=7.x is actually <8.0.0, etc.
          gtlt = '<';

          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }

        if (gtlt === '<') pr = '-0';
        ret = "".concat(gtlt + M, ".").concat(m, ".").concat(p).concat(pr);
      } else if (xm) {
        ret = ">=".concat(M, ".0.0").concat(pr, " <").concat(+M + 1, ".0.0-0");
      } else if (xp) {
        ret = ">=".concat(M, ".").concat(m, ".0").concat(pr, " <").concat(M, ".").concat(+m + 1, ".0-0");
      }

      debug('xRange return', ret);
      return ret;
    });
  }; // Because * is AND-ed with everything else in the comparator,
  // and '' means "any version", just remove the *s entirely.


  var replaceStars = function replaceStars(comp, options) {
    debug('replaceStars', comp, options); // Looseness is ignored here.  star is always as loose as it gets!

    return comp.trim().replace(re[t.STAR], '');
  };

  var replaceGTE0 = function replaceGTE0(comp, options) {
    debug('replaceGTE0', comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '');
  }; // This function is passed to string.replace(re[t.HYPHENRANGE])
  // M, m, patch, prerelease, build
  // 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  // 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
  // 1.2 - 3.4 => >=1.2.0 <3.5.0-0


  var hyphenReplace = function hyphenReplace(incPr) {
    return function ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
      if (isX(fM)) {
        from = '';
      } else if (isX(fm)) {
        from = ">=".concat(fM, ".0.0").concat(incPr ? '-0' : '');
      } else if (isX(fp)) {
        from = ">=".concat(fM, ".").concat(fm, ".0").concat(incPr ? '-0' : '');
      } else if (fpr) {
        from = ">=".concat(from);
      } else {
        from = ">=".concat(from).concat(incPr ? '-0' : '');
      }

      if (isX(tM)) {
        to = '';
      } else if (isX(tm)) {
        to = "<".concat(+tM + 1, ".0.0-0");
      } else if (isX(tp)) {
        to = "<".concat(tM, ".").concat(+tm + 1, ".0-0");
      } else if (tpr) {
        to = "<=".concat(tM, ".").concat(tm, ".").concat(tp, "-").concat(tpr);
      } else if (incPr) {
        to = "<".concat(tM, ".").concat(tm, ".").concat(+tp + 1, "-0");
      } else {
        to = "<=".concat(to);
      }

      return "".concat(from, " ").concat(to).trim();
    };
  };

  var testSet = function testSet(set, version, options) {
    for (var i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false;
      }
    }

    if (version.prerelease.length && !options.includePrerelease) {
      // Find the set of versions that are allowed to have prereleases
      // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
      // That should allow `1.2.3-pr.2` to pass.
      // However, `1.2.4-alpha.notready` should NOT be allowed,
      // even though it's within the range set by the comparators.
      for (var _i = 0; _i < set.length; _i++) {
        debug(set[_i].semver);

        if (set[_i].semver === Comparator.ANY) {
          continue;
        }

        if (set[_i].semver.prerelease.length > 0) {
          var allowed = set[_i].semver;

          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      } // Version has a -pre, but it's not one of the ones we like.


      return false;
    }

    return true;
  };

  var Range = range;

  var satisfies = function satisfies(version, range, options) {
    try {
      range = new Range(range, options);
    } catch (er) {
      return false;
    }

    return range.test(version);
  };

  var satisfies_1 = satisfies;

  function adjustSpatial(item, encode, swap) {
    var t;

    if (encode.x2) {
      if (encode.x) {
        if (swap && item.x > item.x2) {
          t = item.x;
          item.x = item.x2;
          item.x2 = t;
        }

        item.width = item.x2 - item.x;
      } else {
        item.x = item.x2 - (item.width || 0);
      }
    }

    if (encode.xc) {
      item.x = item.xc - (item.width || 0) / 2;
    }

    if (encode.y2) {
      if (encode.y) {
        if (swap && item.y > item.y2) {
          t = item.y;
          item.y = item.y2;
          item.y2 = t;
        }

        item.height = item.y2 - item.y;
      } else {
        item.y = item.y2 - (item.height || 0);
      }
    }

    if (encode.yc) {
      item.y = item.yc - (item.height || 0) / 2;
    }
  }

  var Constants = {
    NaN: NaN,
    E: Math.E,
    LN2: Math.LN2,
    LN10: Math.LN10,
    LOG2E: Math.LOG2E,
    LOG10E: Math.LOG10E,
    PI: Math.PI,
    SQRT1_2: Math.SQRT1_2,
    SQRT2: Math.SQRT2,
    MIN_VALUE: Number.MIN_VALUE,
    MAX_VALUE: Number.MAX_VALUE
  };
  var Ops = {
    '*': function _(a, b) {
      return a * b;
    },
    '+': function _(a, b) {
      return a + b;
    },
    '-': function _(a, b) {
      return a - b;
    },
    '/': function _(a, b) {
      return a / b;
    },
    '%': function _(a, b) {
      return a % b;
    },
    '>': function _(a, b) {
      return a > b;
    },
    '<': function _(a, b) {
      return a < b;
    },
    '<=': function _(a, b) {
      return a <= b;
    },
    '>=': function _(a, b) {
      return a >= b;
    },
    '==': function _(a, b) {
      return a == b;
    },
    '!=': function _(a, b) {
      return a != b;
    },
    '===': function _(a, b) {
      return a === b;
    },
    '!==': function _(a, b) {
      return a !== b;
    },
    '&': function _(a, b) {
      return a & b;
    },
    '|': function _(a, b) {
      return a | b;
    },
    '^': function _(a, b) {
      return a ^ b;
    },
    '<<': function _(a, b) {
      return a << b;
    },
    '>>': function _(a, b) {
      return a >> b;
    },
    '>>>': function _(a, b) {
      return a >>> b;
    }
  };
  var Unary = {
    '+': function _(a) {
      return +a;
    },
    '-': function _(a) {
      return -a;
    },
    '~': function _(a) {
      return ~a;
    },
    '!': function _(a) {
      return !a;
    }
  };
  var slice = Array.prototype.slice;

  var apply = function apply(m, args, cast) {
    var obj = cast ? cast(args[0]) : args[0];
    return obj[m].apply(obj, slice.call(args, 1));
  };

  var datetime = function datetime(y, m, d, H, M, S, ms) {
    return new Date(y, m || 0, d != null ? d : 1, H || 0, M || 0, S || 0, ms || 0);
  };

  var Functions = {
    // math functions
    isNaN: Number.isNaN,
    isFinite: Number.isFinite,
    abs: Math.abs,
    acos: Math.acos,
    asin: Math.asin,
    atan: Math.atan,
    atan2: Math.atan2,
    ceil: Math.ceil,
    cos: Math.cos,
    exp: Math.exp,
    floor: Math.floor,
    log: Math.log,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    random: Math.random,
    round: Math.round,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    clamp: function clamp(a, b, c) {
      return Math.max(b, Math.min(c, a));
    },
    // date functions
    now: Date.now,
    utc: Date.UTC,
    datetime: datetime,
    date: function date(d) {
      return new Date(d).getDate();
    },
    day: function day(d) {
      return new Date(d).getDay();
    },
    year: function year(d) {
      return new Date(d).getFullYear();
    },
    month: function month(d) {
      return new Date(d).getMonth();
    },
    hours: function hours(d) {
      return new Date(d).getHours();
    },
    minutes: function minutes(d) {
      return new Date(d).getMinutes();
    },
    seconds: function seconds(d) {
      return new Date(d).getSeconds();
    },
    milliseconds: function milliseconds(d) {
      return new Date(d).getMilliseconds();
    },
    time: function time(d) {
      return new Date(d).getTime();
    },
    timezoneoffset: function timezoneoffset(d) {
      return new Date(d).getTimezoneOffset();
    },
    utcdate: function utcdate(d) {
      return new Date(d).getUTCDate();
    },
    utcday: function utcday(d) {
      return new Date(d).getUTCDay();
    },
    utcyear: function utcyear(d) {
      return new Date(d).getUTCFullYear();
    },
    utcmonth: function utcmonth(d) {
      return new Date(d).getUTCMonth();
    },
    utchours: function utchours(d) {
      return new Date(d).getUTCHours();
    },
    utcminutes: function utcminutes(d) {
      return new Date(d).getUTCMinutes();
    },
    utcseconds: function utcseconds(d) {
      return new Date(d).getUTCSeconds();
    },
    utcmilliseconds: function utcmilliseconds(d) {
      return new Date(d).getUTCMilliseconds();
    },
    // sequence functions
    length: function length(x) {
      return x.length;
    },
    join: function join() {
      return apply('join', arguments);
    },
    indexof: function indexof() {
      return apply('indexOf', arguments);
    },
    lastindexof: function lastindexof() {
      return apply('lastIndexOf', arguments);
    },
    slice: function slice() {
      return apply('slice', arguments);
    },
    reverse: function reverse(x) {
      return x.slice().reverse();
    },
    // string functions
    parseFloat: parseFloat,
    parseInt: parseInt,
    upper: function upper(x) {
      return String(x).toUpperCase();
    },
    lower: function lower(x) {
      return String(x).toLowerCase();
    },
    substring: function substring() {
      return apply('substring', arguments, String);
    },
    split: function split() {
      return apply('split', arguments, String);
    },
    replace: function replace() {
      return apply('replace', arguments, String);
    },
    trim: function trim(x) {
      return String(x).trim();
    },
    // regexp functions
    regexp: RegExp,
    test: function test(r, t) {
      return RegExp(r).test(t);
    }
  };
  var EventFunctions = ['view', 'item', 'group', 'xy', 'x', 'y'];
  var Visitors = {
    Literal: function Literal($, n) {
      return n.value;
    },
    Identifier: function Identifier($, n) {
      var id = n.name;
      return $.memberDepth > 0 ? id : id === 'datum' ? $.datum : id === 'event' ? $.event : id === 'item' ? $.item : Constants[id] || $.params['$' + id];
    },
    MemberExpression: function MemberExpression($, n) {
      var d = !n.computed,
          o = $(n.object);
      if (d) $.memberDepth += 1;
      var p = $(n.property);
      if (d) $.memberDepth -= 1;
      return o[p];
    },
    CallExpression: function CallExpression($, n) {
      var args = n.arguments;
      var name = n.callee.name; // handle special internal functions used by encoders
      // re-route to corresponding standard function

      if (name.startsWith('_')) {
        name = name.slice(1);
      } // special case "if" due to conditional evaluation of branches


      return name === 'if' ? $(args[0]) ? $(args[1]) : $(args[2]) : ($.fn[name] || Functions[name]).apply($.fn, args.map($));
    },
    ArrayExpression: function ArrayExpression($, n) {
      return n.elements.map($);
    },
    BinaryExpression: function BinaryExpression($, n) {
      return Ops[n.operator]($(n.left), $(n.right));
    },
    UnaryExpression: function UnaryExpression($, n) {
      return Unary[n.operator]($(n.argument));
    },
    ConditionalExpression: function ConditionalExpression($, n) {
      return $(n.test) ? $(n.consequent) : $(n.alternate);
    },
    LogicalExpression: function LogicalExpression($, n) {
      return n.operator === '&&' ? $(n.left) && $(n.right) : $(n.left) || $(n.right);
    },
    ObjectExpression: function ObjectExpression($, n) {
      return n.properties.reduce(function (o, p) {
        $.memberDepth += 1;
        var k = $(p.key);
        $.memberDepth -= 1;
        o[k] = $(p.value);
        return o;
      }, {});
    }
  };

  function interpret(ast, fn, params, datum, event, item) {
    var $ = function $(n) {
      return Visitors[n.type]($, n);
    };

    $.memberDepth = 0;
    $.fn = Object.create(fn);
    $.params = params;
    $.datum = datum;
    $.event = event;
    $.item = item; // route event functions to annotated vega event context

    EventFunctions.forEach(function (f) {
      return $.fn[f] = function () {
        var _event$vega;

        return (_event$vega = event.vega)[f].apply(_event$vega, arguments);
      };
    });
    return $(ast);
  }

  var expression = {
    /**
     * Parse an expression used to update an operator value.
     */
    operator: function operator(ctx, expr) {
      var ast = expr.ast,
          fn = ctx.functions;
      return function (_) {
        return interpret(ast, fn, _);
      };
    },

    /**
     * Parse an expression provided as an operator parameter value.
     */
    parameter: function parameter(ctx, expr) {
      var ast = expr.ast,
          fn = ctx.functions;
      return function (datum, _) {
        return interpret(ast, fn, _, datum);
      };
    },

    /**
     * Parse an expression applied to an event stream.
     */
    event: function event(ctx, expr) {
      var ast = expr.ast,
          fn = ctx.functions;
      return function (event) {
        return interpret(ast, fn, undefined, undefined, event);
      };
    },

    /**
     * Parse an expression used to handle an event-driven operator update.
     */
    handler: function handler(ctx, expr) {
      var ast = expr.ast,
          fn = ctx.functions;
      return function (_, event) {
        var datum = event.item && event.item.datum;
        return interpret(ast, fn, _, datum, event);
      };
    },

    /**
     * Parse an expression that performs visual encoding.
     */
    encode: function encode(ctx, _encode) {
      var marktype = _encode.marktype,
          channels = _encode.channels,
          fn = ctx.functions,
          swap = marktype === 'group' || marktype === 'image' || marktype === 'rect';
      return function (item, _) {
        var datum = item.datum;
        var m = 0,
            v;

        for (var name in channels) {
          v = interpret(channels[name].ast, fn, _, datum, undefined, item);

          if (item[name] !== v) {
            item[name] = v;
            m = 1;
          }
        }

        if (marktype !== 'rule') {
          adjustSpatial(item, channels, swap);
        }

        return m;
      };
    }
  };

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest();
  }

  function e(e) {
    var _$exec$slice = /schema\/([\w-]+)\/([\w\.\-]+)\.json$/g.exec(e).slice(1, 3),
        _$exec$slice2 = _slicedToArray(_$exec$slice, 2),
        n = _$exec$slice2[0],
        r = _$exec$slice2[1];

    return {
      library: n,
      version: r
    };
  }

  var name$1 = "vega-themes";
  var version$2 = "2.10.0";
  var description$1 = "Themes for stylized Vega and Vega-Lite visualizations.";
  var keywords$1 = ["vega", "vega-lite", "themes", "style"];
  var license$1 = "BSD-3-Clause";
  var author$1 = {
    name: "UW Interactive Data Lab",
    url: "https://idl.cs.washington.edu"
  };
  var contributors$1 = [{
    name: "Emily Gu",
    url: "https://github.com/emilygu"
  }, {
    name: "Arvind Satyanarayan",
    url: "http://arvindsatya.com"
  }, {
    name: "Jeffrey Heer",
    url: "https://idl.cs.washington.edu"
  }, {
    name: "Dominik Moritz",
    url: "https://www.domoritz.de"
  }];
  var main$1 = "build/vega-themes.js";
  var module$1 = "build/vega-themes.module.js";
  var unpkg$1 = "build/vega-themes.min.js";
  var jsdelivr$1 = "build/vega-themes.min.js";
  var types$1 = "build/vega-themes.module.d.ts";
  var repository$1 = {
    type: "git",
    url: "https://github.com/vega/vega-themes.git"
  };
  var files$1 = ["src", "build"];
  var scripts$1 = {
    prebuild: "yarn clean",
    build: "rollup -c",
    clean: "rimraf build && rimraf examples/build",
    "copy:data": "rsync -r node_modules/vega-datasets/data/* examples/data",
    "copy:build": "rsync -r build/* examples/build",
    "deploy:gh": "yarn build && mkdir -p examples/build && rsync -r build/* examples/build && gh-pages -d examples",
    prepublishOnly: "yarn clean && yarn build",
    preversion: "yarn lint",
    serve: "browser-sync start -s -f build examples --serveStatic examples",
    start: "yarn build && concurrently --kill-others -n Server,Rollup 'yarn serve' 'rollup -c -w'",
    prepare: "beemo create-config",
    eslintbase: "beemo eslint .",
    format: "yarn eslintbase --fix",
    lint: "yarn eslintbase"
  };
  var devDependencies$1 = {
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-node-resolve": "^11.2.0",
    "@wessberg/rollup-plugin-ts": "^1.3.8",
    "browser-sync": "^2.26.14",
    concurrently: "^6.0.0",
    "gh-pages": "^3.1.0",
    rollup: "^2.39.1",
    "rollup-plugin-bundle-size": "^1.0.3",
    "rollup-plugin-terser": "^7.0.2",
    typescript: "^4.2.2",
    vega: "^5.19.1",
    "vega-lite": "^5.0.0",
    "vega-lite-dev-config": "^0.16.1"
  };
  var peerDependencies$1 = {
    vega: "*",
    "vega-lite": "*"
  };
  var pkg$1 = {
    name: name$1,
    version: version$2,
    description: description$1,
    keywords: keywords$1,
    license: license$1,
    author: author$1,
    contributors: contributors$1,
    main: main$1,
    module: module$1,
    unpkg: unpkg$1,
    jsdelivr: jsdelivr$1,
    types: types$1,
    repository: repository$1,
    files: files$1,
    scripts: scripts$1,
    devDependencies: devDependencies$1,
    peerDependencies: peerDependencies$1
  };
  var lightColor = '#fff';
  var medColor = '#888';
  var darkTheme = {
    background: '#333',
    title: {
      color: lightColor,
      subtitleColor: lightColor
    },
    style: {
      'guide-label': {
        fill: lightColor
      },
      'guide-title': {
        fill: lightColor
      }
    },
    axis: {
      domainColor: lightColor,
      gridColor: medColor,
      tickColor: lightColor
    }
  };
  var markColor = '#4572a7';
  var excelTheme = {
    background: '#fff',
    arc: {
      fill: markColor
    },
    area: {
      fill: markColor
    },
    line: {
      stroke: markColor,
      strokeWidth: 2
    },
    path: {
      stroke: markColor
    },
    rect: {
      fill: markColor
    },
    shape: {
      stroke: markColor
    },
    symbol: {
      fill: markColor,
      strokeWidth: 1.5,
      size: 50
    },
    axis: {
      bandPosition: 0.5,
      grid: true,
      gridColor: '#000000',
      gridOpacity: 1,
      gridWidth: 0.5,
      labelPadding: 10,
      tickSize: 5,
      tickWidth: 0.5
    },
    axisBand: {
      grid: false,
      tickExtra: true
    },
    legend: {
      labelBaseline: 'middle',
      labelFontSize: 11,
      symbolSize: 50,
      symbolType: 'square'
    },
    range: {
      category: ['#4572a7', '#aa4643', '#8aa453', '#71598e', '#4598ae', '#d98445', '#94aace', '#d09393', '#b9cc98', '#a99cbc']
    }
  };
  var markColor$1 = '#30a2da';
  var axisColor = '#cbcbcb';
  var guideLabelColor = '#999';
  var guideTitleColor = '#333';
  var backgroundColor = '#f0f0f0';
  var blackTitle = '#333';
  var fiveThirtyEightTheme = {
    arc: {
      fill: markColor$1
    },
    area: {
      fill: markColor$1
    },
    axis: {
      domainColor: axisColor,
      grid: true,
      gridColor: axisColor,
      gridWidth: 1,
      labelColor: guideLabelColor,
      labelFontSize: 10,
      titleColor: guideTitleColor,
      tickColor: axisColor,
      tickSize: 10,
      titleFontSize: 14,
      titlePadding: 10,
      labelPadding: 4
    },
    axisBand: {
      grid: false
    },
    background: backgroundColor,
    group: {
      fill: backgroundColor
    },
    legend: {
      labelColor: blackTitle,
      labelFontSize: 11,
      padding: 1,
      symbolSize: 30,
      symbolType: 'square',
      titleColor: blackTitle,
      titleFontSize: 14,
      titlePadding: 10
    },
    line: {
      stroke: markColor$1,
      strokeWidth: 2
    },
    path: {
      stroke: markColor$1,
      strokeWidth: 0.5
    },
    rect: {
      fill: markColor$1
    },
    range: {
      category: ['#30a2da', '#fc4f30', '#e5ae38', '#6d904f', '#8b8b8b', '#b96db8', '#ff9e27', '#56cc60', '#52d2ca', '#52689e', '#545454', '#9fe4f8'],
      diverging: ['#cc0020', '#e77866', '#f6e7e1', '#d6e8ed', '#91bfd9', '#1d78b5'],
      heatmap: ['#d6e8ed', '#cee0e5', '#91bfd9', '#549cc6', '#1d78b5']
    },
    point: {
      filled: true,
      shape: 'circle'
    },
    shape: {
      stroke: markColor$1
    },
    bar: {
      binSpacing: 2,
      fill: markColor$1,
      stroke: null
    },
    title: {
      anchor: 'start',
      fontSize: 24,
      fontWeight: 600,
      offset: 20
    }
  };
  var markColor$2 = '#000';
  var ggplot2Theme = {
    group: {
      fill: '#e5e5e5'
    },
    arc: {
      fill: markColor$2
    },
    area: {
      fill: markColor$2
    },
    line: {
      stroke: markColor$2
    },
    path: {
      stroke: markColor$2
    },
    rect: {
      fill: markColor$2
    },
    shape: {
      stroke: markColor$2
    },
    symbol: {
      fill: markColor$2,
      size: 40
    },
    axis: {
      domain: false,
      grid: true,
      gridColor: '#FFFFFF',
      gridOpacity: 1,
      labelColor: '#7F7F7F',
      labelPadding: 4,
      tickColor: '#7F7F7F',
      tickSize: 5.67,
      titleFontSize: 16,
      titleFontWeight: 'normal'
    },
    legend: {
      labelBaseline: 'middle',
      labelFontSize: 11,
      symbolSize: 40
    },
    range: {
      category: ['#000000', '#7F7F7F', '#1A1A1A', '#999999', '#333333', '#B0B0B0', '#4D4D4D', '#C9C9C9', '#666666', '#DCDCDC']
    }
  };
  var headlineFontSize = 22;
  var headlineFontWeight = 'normal';
  var labelFont = 'Benton Gothic, sans-serif';
  var labelFontSize = 11.5;
  var labelFontWeight = 'normal';
  var markColor$3 = '#82c6df'; // const markHighlight = '#006d8f';
  // const markDemocrat = '#5789b8';
  // const markRepublican = '#d94f54';

  var titleFont = 'Benton Gothic Bold, sans-serif';
  var titleFontWeight = 'normal';
  var titleFontSize = 13;
  var colorSchemes = {
    'category-6': ['#ec8431', '#829eb1', '#c89d29', '#3580b1', '#adc839', '#ab7fb4'],
    'fire-7': ['#fbf2c7', '#f9e39c', '#f8d36e', '#f4bb6a', '#e68a4f', '#d15a40', '#ab4232'],
    'fireandice-6': ['#e68a4f', '#f4bb6a', '#f9e39c', '#dadfe2', '#a6b7c6', '#849eae'],
    'ice-7': ['#edefee', '#dadfe2', '#c4ccd2', '#a6b7c6', '#849eae', '#607785', '#47525d']
  };
  var latimesTheme = {
    background: '#ffffff',
    title: {
      anchor: 'start',
      color: '#000000',
      font: titleFont,
      fontSize: headlineFontSize,
      fontWeight: headlineFontWeight
    },
    arc: {
      fill: markColor$3
    },
    area: {
      fill: markColor$3
    },
    line: {
      stroke: markColor$3,
      strokeWidth: 2
    },
    path: {
      stroke: markColor$3
    },
    rect: {
      fill: markColor$3
    },
    shape: {
      stroke: markColor$3
    },
    symbol: {
      fill: markColor$3,
      size: 30
    },
    axis: {
      labelFont: labelFont,
      labelFontSize: labelFontSize,
      labelFontWeight: labelFontWeight,
      titleFont: titleFont,
      titleFontSize: titleFontSize,
      titleFontWeight: titleFontWeight
    },
    axisX: {
      labelAngle: 0,
      labelPadding: 4,
      tickSize: 3
    },
    axisY: {
      labelBaseline: 'middle',
      maxExtent: 45,
      minExtent: 45,
      tickSize: 2,
      titleAlign: 'left',
      titleAngle: 0,
      titleX: -45,
      titleY: -11
    },
    legend: {
      labelFont: labelFont,
      labelFontSize: labelFontSize,
      symbolType: 'square',
      titleFont: titleFont,
      titleFontSize: titleFontSize,
      titleFontWeight: titleFontWeight
    },
    range: {
      category: colorSchemes['category-6'],
      diverging: colorSchemes['fireandice-6'],
      heatmap: colorSchemes['fire-7'],
      ordinal: colorSchemes['fire-7'],
      ramp: colorSchemes['fire-7']
    }
  };
  var markColor$4 = '#ab5787';
  var axisColor$1 = '#979797';
  var quartzTheme = {
    background: '#f9f9f9',
    arc: {
      fill: markColor$4
    },
    area: {
      fill: markColor$4
    },
    line: {
      stroke: markColor$4
    },
    path: {
      stroke: markColor$4
    },
    rect: {
      fill: markColor$4
    },
    shape: {
      stroke: markColor$4
    },
    symbol: {
      fill: markColor$4,
      size: 30
    },
    axis: {
      domainColor: axisColor$1,
      domainWidth: 0.5,
      gridWidth: 0.2,
      labelColor: axisColor$1,
      tickColor: axisColor$1,
      tickWidth: 0.2,
      titleColor: axisColor$1
    },
    axisBand: {
      grid: false
    },
    axisX: {
      grid: true,
      tickSize: 10
    },
    axisY: {
      domain: false,
      grid: true,
      tickSize: 0
    },
    legend: {
      labelFontSize: 11,
      padding: 1,
      symbolSize: 30,
      symbolType: 'square'
    },
    range: {
      category: ['#ab5787', '#51b2e5', '#703c5c', '#168dd9', '#d190b6', '#00609f', '#d365ba', '#154866', '#666666', '#c4c4c4']
    }
  };
  var markColor$5 = '#3e5c69';
  var voxTheme = {
    background: '#fff',
    arc: {
      fill: markColor$5
    },
    area: {
      fill: markColor$5
    },
    line: {
      stroke: markColor$5
    },
    path: {
      stroke: markColor$5
    },
    rect: {
      fill: markColor$5
    },
    shape: {
      stroke: markColor$5
    },
    symbol: {
      fill: markColor$5
    },
    axis: {
      domainWidth: 0.5,
      grid: true,
      labelPadding: 2,
      tickSize: 5,
      tickWidth: 0.5,
      titleFontWeight: 'normal'
    },
    axisBand: {
      grid: false
    },
    axisX: {
      gridWidth: 0.2
    },
    axisY: {
      gridDash: [3],
      gridWidth: 0.4
    },
    legend: {
      labelFontSize: 11,
      padding: 1,
      symbolType: 'square'
    },
    range: {
      category: ['#3e5c69', '#6793a6', '#182429', '#0570b0', '#3690c0', '#74a9cf', '#a6bddb', '#e2ddf2']
    }
  };
  var markColor$6 = '#1696d2';
  var axisColor$2 = '#000000';
  var backgroundColor$1 = '#FFFFFF';
  var font = 'Lato';
  var labelFont$1 = 'Lato';
  var sourceFont = 'Lato';
  var gridColor = '#DEDDDD';
  var titleFontSize$1 = 18;
  var colorSchemes$1 = {
    'main-colors': ['#1696d2', '#d2d2d2', '#000000', '#fdbf11', '#ec008b', '#55b748', '#5c5859', '#db2b27'],
    'shades-blue': ['#CFE8F3', '#A2D4EC', '#73BFE2', '#46ABDB', '#1696D2', '#12719E', '#0A4C6A', '#062635'],
    'shades-gray': ['#F5F5F5', '#ECECEC', '#E3E3E3', '#DCDBDB', '#D2D2D2', '#9D9D9D', '#696969', '#353535'],
    'shades-yellow': ['#FFF2CF', '#FCE39E', '#FDD870', '#FCCB41', '#FDBF11', '#E88E2D', '#CA5800', '#843215'],
    'shades-magenta': ['#F5CBDF', '#EB99C2', '#E46AA7', '#E54096', '#EC008B', '#AF1F6B', '#761548', '#351123'],
    'shades-green': ['#DCEDD9', '#BCDEB4', '#98CF90', '#78C26D', '#55B748', '#408941', '#2C5C2D', '#1A2E19'],
    'shades-black': ['#D5D5D4', '#ADABAC', '#848081', '#5C5859', '#332D2F', '#262223', '#1A1717', '#0E0C0D'],
    'shades-red': ['#F8D5D4', '#F1AAA9', '#E9807D', '#E25552', '#DB2B27', '#A4201D', '#6E1614', '#370B0A'],
    'one-group': ['#1696d2', '#000000'],
    'two-groups-cat-1': ['#1696d2', '#000000'],
    'two-groups-cat-2': ['#1696d2', '#fdbf11'],
    'two-groups-cat-3': ['#1696d2', '#db2b27'],
    'two-groups-seq': ['#a2d4ec', '#1696d2'],
    'three-groups-cat': ['#1696d2', '#fdbf11', '#000000'],
    'three-groups-seq': ['#a2d4ec', '#1696d2', '#0a4c6a'],
    'four-groups-cat-1': ['#000000', '#d2d2d2', '#fdbf11', '#1696d2'],
    'four-groups-cat-2': ['#1696d2', '#ec0008b', '#fdbf11', '#5c5859'],
    'four-groups-seq': ['#cfe8f3', '#73bf42', '#1696d2', '#0a4c6a'],
    'five-groups-cat-1': ['#1696d2', '#fdbf11', '#d2d2d2', '#ec008b', '#000000'],
    'five-groups-cat-2': ['#1696d2', '#0a4c6a', '#d2d2d2', '#fdbf11', '#332d2f'],
    'five-groups-seq': ['#cfe8f3', '#73bf42', '#1696d2', '#0a4c6a', '#000000'],
    'six-groups-cat-1': ['#1696d2', '#ec008b', '#fdbf11', '#000000', '#d2d2d2', '#55b748'],
    'six-groups-cat-2': ['#1696d2', '#d2d2d2', '#ec008b', '#fdbf11', '#332d2f', '#0a4c6a'],
    'six-groups-seq': ['#cfe8f3', '#a2d4ec', '#73bfe2', '#46abdb', '#1696d2', '#12719e'],
    'diverging-colors': ['#ca5800', '#fdbf11', '#fdd870', '#fff2cf', '#cfe8f3', '#73bfe2', '#1696d2', '#0a4c6a']
  };
  var urbanInstituteTheme = {
    background: backgroundColor$1,
    title: {
      anchor: 'start',
      fontSize: titleFontSize$1,
      font: font
    },
    axisX: {
      domain: true,
      domainColor: axisColor$2,
      domainWidth: 1,
      grid: false,
      labelFontSize: 12,
      labelFont: labelFont$1,
      labelAngle: 0,
      tickColor: axisColor$2,
      tickSize: 5,
      titleFontSize: 12,
      titlePadding: 10,
      titleFont: font
    },
    axisY: {
      domain: false,
      domainWidth: 1,
      grid: true,
      gridColor: gridColor,
      gridWidth: 1,
      labelFontSize: 12,
      labelFont: labelFont$1,
      labelPadding: 8,
      ticks: false,
      titleFontSize: 12,
      titlePadding: 10,
      titleFont: font,
      titleAngle: 0,
      titleY: -10,
      titleX: 18
    },
    legend: {
      labelFontSize: 12,
      labelFont: labelFont$1,
      symbolSize: 100,
      titleFontSize: 12,
      titlePadding: 10,
      titleFont: font,
      orient: 'right',
      offset: 10
    },
    view: {
      stroke: 'transparent'
    },
    range: {
      category: colorSchemes$1['six-groups-cat-1'],
      diverging: colorSchemes$1['diverging-colors'],
      heatmap: colorSchemes$1['diverging-colors'],
      ordinal: colorSchemes$1['six-groups-seq'],
      ramp: colorSchemes$1['shades-blue']
    },
    area: {
      fill: markColor$6
    },
    rect: {
      fill: markColor$6
    },
    line: {
      color: markColor$6,
      stroke: markColor$6,
      strokeWidth: 5
    },
    trail: {
      color: markColor$6,
      stroke: markColor$6,
      strokeWidth: 0,
      size: 1
    },
    path: {
      stroke: markColor$6,
      strokeWidth: 0.5
    },
    point: {
      filled: true
    },
    text: {
      font: sourceFont,
      color: markColor$6,
      fontSize: 11,
      align: 'center',
      fontWeight: 400,
      size: 11
    },
    style: {
      bar: {
        fill: markColor$6,
        stroke: null
      }
    },
    arc: {
      fill: markColor$6
    },
    shape: {
      stroke: markColor$6
    },
    symbol: {
      fill: markColor$6,
      size: 30
    }
  };
  /**
   * Copyright 2020 Google LLC.
   *
   * Use of this source code is governed by a BSD-style
   * license that can be found in the LICENSE file or at
   * https://developers.google.com/open-source/licenses/bsd
   */

  var markColor$7 = '#3366CC';
  var gridColor$1 = '#ccc';
  var defaultFont = 'Arial, sans-serif';
  var googlechartsTheme = {
    arc: {
      fill: markColor$7
    },
    area: {
      fill: markColor$7
    },
    path: {
      stroke: markColor$7
    },
    rect: {
      fill: markColor$7
    },
    shape: {
      stroke: markColor$7
    },
    symbol: {
      stroke: markColor$7
    },
    circle: {
      fill: markColor$7
    },
    background: '#fff',
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    style: {
      'guide-label': {
        font: defaultFont,
        fontSize: 12
      },
      'guide-title': {
        font: defaultFont,
        fontSize: 12
      },
      'group-title': {
        font: defaultFont,
        fontSize: 12
      }
    },
    title: {
      font: defaultFont,
      fontSize: 14,
      fontWeight: 'bold',
      dy: -3,
      anchor: 'start'
    },
    axis: {
      gridColor: gridColor$1,
      tickColor: gridColor$1,
      domain: false,
      grid: true
    },
    range: {
      category: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1', '#FF7043', '#9E9D24', '#5C6BC0', '#F06292', '#00796B', '#C2185B'],
      heatmap: ['#c6dafc', '#5e97f6', '#2a56c6']
    }
  };
  var version$1$1 = pkg$1.version;

  var themes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dark: darkTheme,
    excel: excelTheme,
    fivethirtyeight: fiveThirtyEightTheme,
    ggplot2: ggplot2Theme,
    googlecharts: googlechartsTheme,
    latimes: latimesTheme,
    quartz: quartzTheme,
    urbaninstitute: urbanInstituteTheme,
    version: version$1$1,
    vox: voxTheme
  });

  function accessor(fn, fields, name) {
    fn.fields = fields || [];
    fn.fname = name;
    return fn;
  }

  function getter(path) {
    return path.length === 1 ? get1(path[0]) : getN(path);
  }

  var get1 = function get1(field) {
    return function (obj) {
      return obj[field];
    };
  };

  var getN = function getN(path) {
    var len = path.length;
    return function (obj) {
      for (var i = 0; i < len; ++i) {
        obj = obj[path[i]];
      }

      return obj;
    };
  };

  function error(message) {
    throw Error(message);
  }

  function splitAccessPath(p) {
    var path = [],
        n = p.length;
    var q = null,
        b = 0,
        s = '',
        i,
        j,
        c;
    p = p + '';

    function push() {
      path.push(s + p.substring(i, j));
      s = '';
      i = j + 1;
    }

    for (i = j = 0; j < n; ++j) {
      c = p[j];

      if (c === '\\') {
        s += p.substring(i, j);
        s += p.substring(++j, ++j);
        i = j;
      } else if (c === q) {
        push();
        q = null;
        b = -1;
      } else if (q) {
        continue;
      } else if (i === b && c === '"') {
        i = j + 1;
        q = c;
      } else if (i === b && c === "'") {
        i = j + 1;
        q = c;
      } else if (c === '.' && !b) {
        if (j > i) {
          push();
        } else {
          i = j + 1;
        }
      } else if (c === '[') {
        if (j > i) push();
        b = i = j + 1;
      } else if (c === ']') {
        if (!b) error('Access path missing open bracket: ' + p);
        if (b > 0) push();
        b = 0;
        i = j + 1;
      }
    }

    if (b) error('Access path missing closing bracket: ' + p);
    if (q) error('Access path missing closing quote: ' + p);

    if (j > i) {
      j++;
      push();
    }

    return path;
  }

  function field(field, name, opt) {
    var path = splitAccessPath(field);
    field = path.length === 1 ? path[0] : field;
    return accessor((opt && opt.get || getter)(path), [field], name || field);
  }

  field('id');
  accessor(function (_) {
    return _;
  }, [], 'identity');
  accessor(function () {
    return 0;
  }, [], 'zero');
  accessor(function () {
    return 1;
  }, [], 'one');
  accessor(function () {
    return true;
  }, [], 'true');
  accessor(function () {
    return false;
  }, [], 'false');

  var isArray = Array.isArray;

  function isObject(_) {
    return _ === Object(_);
  }

  function isString(_) {
    return typeof _ === 'string';
  }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __rest(s, e) {
    var t = {};

    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }

    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  }
  /**
   * Format the value to be shown in the tooltip.
   *
   * @param value The value to show in the tooltip.
   * @param valueToHtml Function to convert a single cell value to an HTML string
   */


  function formatValue(value, valueToHtml, maxDepth) {
    if (isArray(value)) {
      return "[".concat(value.map(function (v) {
        return valueToHtml(isString(v) ? v : stringify(v, maxDepth));
      }).join(', '), "]");
    }

    if (isObject(value)) {
      var content = '';

      var _a = value,
          title = _a.title,
          image = _a.image,
          rest = __rest(_a, ["title", "image"]);

      if (title) {
        content += "<h2>".concat(valueToHtml(title), "</h2>");
      }

      if (image) {
        content += "<img src=\"".concat(valueToHtml(image), "\">");
      }

      var keys = Object.keys(rest);

      if (keys.length > 0) {
        content += '<table>';

        var _iterator = _createForOfIteratorHelper(keys),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var key = _step.value;
            var val = rest[key]; // ignore undefined properties

            if (val === undefined) {
              continue;
            }

            if (isObject(val)) {
              val = stringify(val, maxDepth);
            }

            content += "<tr><td class=\"key\">".concat(valueToHtml(key), ":</td><td class=\"value\">").concat(valueToHtml(val), "</td></tr>");
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        content += "</table>";
      }

      return content || '{}'; // show empty object if there are no properties
    }

    return valueToHtml(value);
  }

  function replacer(maxDepth) {
    var stack = [];
    return function (key, value) {
      if (_typeof(value) !== 'object' || value === null) {
        return value;
      }

      var pos = stack.indexOf(this) + 1;
      stack.length = pos;

      if (stack.length > maxDepth) {
        return '[Object]';
      }

      if (stack.indexOf(value) >= 0) {
        return '[Circular]';
      }

      stack.push(value);
      return value;
    };
  }
  /**
   * Stringify any JS object to valid JSON
   */


  function stringify(obj, maxDepth) {
    return JSON.stringify(obj, replacer(maxDepth));
  } // generated with build-style.sh


  var defaultStyle = "#vg-tooltip-element {\n  visibility: hidden;\n  padding: 8px;\n  position: fixed;\n  z-index: 1000;\n  font-family: sans-serif;\n  font-size: 11px;\n  border-radius: 3px;\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);\n  /* The default theme is the light theme. */\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black; }\n  #vg-tooltip-element.visible {\n    visibility: visible; }\n  #vg-tooltip-element h2 {\n    margin-top: 0;\n    margin-bottom: 10px;\n    font-size: 13px; }\n  #vg-tooltip-element img {\n    max-width: 200px;\n    max-height: 200px; }\n  #vg-tooltip-element table {\n    border-spacing: 0; }\n    #vg-tooltip-element table tr {\n      border: none; }\n      #vg-tooltip-element table tr td {\n        overflow: hidden;\n        text-overflow: ellipsis;\n        padding-top: 2px;\n        padding-bottom: 2px; }\n        #vg-tooltip-element table tr td.key {\n          color: #808080;\n          max-width: 150px;\n          text-align: right;\n          padding-right: 4px; }\n        #vg-tooltip-element table tr td.value {\n          display: block;\n          max-width: 300px;\n          max-height: 7em;\n          text-align: left; }\n  #vg-tooltip-element.dark-theme {\n    background-color: rgba(32, 32, 32, 0.9);\n    border: 1px solid #f5f5f5;\n    color: white; }\n    #vg-tooltip-element.dark-theme td.key {\n      color: #bfbfbf; }\n";
  var EL_ID = 'vg-tooltip-element';
  var DEFAULT_OPTIONS = {
    /**
     * X offset.
     */
    offsetX: 10,

    /**
     * Y offset.
     */
    offsetY: 10,

    /**
     * ID of the tooltip element.
     */
    id: EL_ID,

    /**
     * ID of the tooltip CSS style.
     */
    styleId: 'vega-tooltip-style',

    /**
     * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
     *
     * There are two predefined themes: "light" (default) and "dark".
     */
    theme: 'light',

    /**
     * Do not use the default styles provided by Vega Tooltip. If you enable this option, you need to use your own styles. It is not necessary to disable the default style when using a custom theme.
     */
    disableDefaultStyle: false,

    /**
     * HTML sanitizer function that removes dangerous HTML to prevent XSS.
     *
     * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
     */
    sanitize: escapeHTML,

    /**
     * The maximum recursion depth when printing objects in the tooltip.
     */
    maxDepth: 2,

    /**
     * A function to customize the rendered HTML of the tooltip.
     * @param value A value string, or object of value strings keyed by field
     * @param sanitize The `sanitize` function from `options.sanitize`
     * @returns {string} The returned string will become the `innerHTML` of the tooltip element
     */
    formatTooltip: formatValue
  };
  /**
   * Escape special HTML characters.
   *
   * @param value A value to convert to string and HTML-escape.
   */

  function escapeHTML(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function createDefaultStyle(id) {
    // Just in case this id comes from a user, ensure these is no security issues
    if (!/^[A-Za-z]+[-:.\w]*$/.test(id)) {
      throw new Error('Invalid HTML ID');
    }

    return defaultStyle.toString().replace(EL_ID, id);
  }
  /**
   * Position the tooltip
   *
   * @param event The mouse event.
   * @param tooltipBox
   * @param offsetX Horizontal offset.
   * @param offsetY Vertical offset.
   */


  function calculatePosition(event, tooltipBox, offsetX, offsetY) {
    var x = event.clientX + offsetX;

    if (x + tooltipBox.width > window.innerWidth) {
      x = +event.clientX - offsetX - tooltipBox.width;
    }

    var y = event.clientY + offsetY;

    if (y + tooltipBox.height > window.innerHeight) {
      y = +event.clientY - offsetY - tooltipBox.height;
    }

    return {
      x: x,
      y: y
    };
  }
  /**
   * The tooltip handler class.
   */


  var Handler = /*#__PURE__*/function () {
    /**
     * Create the tooltip handler and initialize the element and style.
     *
     * @param options Tooltip Options
     */
    function Handler(options) {
      _classCallCheck(this, Handler);

      this.options = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
      var elementId = this.options.id;
      this.el = null; // bind this to call

      this.call = this.tooltipHandler.bind(this); // prepend a default stylesheet for tooltips to the head

      if (!this.options.disableDefaultStyle && !document.getElementById(this.options.styleId)) {
        var style = document.createElement('style');
        style.setAttribute('id', this.options.styleId);
        style.innerHTML = createDefaultStyle(elementId);
        var head = document.head;

        if (head.childNodes.length > 0) {
          head.insertBefore(style, head.childNodes[0]);
        } else {
          head.appendChild(style);
        }
      }
    }
    /**
     * The tooltip handler function.
     */


    _createClass(Handler, [{
      key: "tooltipHandler",
      value: function tooltipHandler(handler, event, item, value) {
        // console.log(handler, event, item, value);
        var _a; // append a div element that we use as a tooltip unless it already exists


        this.el = document.getElementById(this.options.id);

        if (!this.el) {
          this.el = document.createElement('div');
          this.el.setAttribute('id', this.options.id);
          this.el.classList.add('vg-tooltip');
          document.body.appendChild(this.el);
        }

        var tooltipContainer = (_a = document.fullscreenElement) !== null && _a !== void 0 ? _a : document.body;
        tooltipContainer.appendChild(this.el); // hide tooltip for null, undefined, or empty string values

        if (value == null || value === '') {
          this.el.classList.remove('visible', "".concat(this.options.theme, "-theme"));
          return;
        } // set the tooltip content


        this.el.innerHTML = this.options.formatTooltip(value, this.options.sanitize, this.options.maxDepth); // make the tooltip visible

        this.el.classList.add('visible', "".concat(this.options.theme, "-theme"));

        var _calculatePosition = calculatePosition(event, this.el.getBoundingClientRect(), this.options.offsetX, this.options.offsetY),
            x = _calculatePosition.x,
            y = _calculatePosition.y;

        this.el.setAttribute('style', "top: ".concat(y, "px; left: ").concat(x, "px"));
      }
    }]);

    return Handler;
  }();

  /**
   * Open editor url in a new window, and pass a message.
   */
  function post (window, url, data) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var editor = window.open(url);
    var wait = 10000;
    var step = 250;

    var _URL = new URL(url),
        origin = _URL.origin; // eslint-disable-next-line no-bitwise


    var count = ~~(wait / step);

    function listen(evt) {
      if (evt.source === editor) {
        count = 0;
        window.removeEventListener('message', listen, false);
      }
    }

    window.addEventListener('message', listen, false); // send message
    // periodically resend until ack received or timeout

    function send() {
      if (count <= 0) {
        return;
      }

      editor.postMessage(data, origin);
      setTimeout(send, step);
      count -= 1;
    }

    setTimeout(send, step);
  }

  // generated with build-style.sh
  var embedStyle = ".vega-embed {\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n.vega-embed.has-actions {\n  padding-right: 38px;\n}\n.vega-embed details:not([open]) > :not(summary) {\n  display: none !important;\n}\n.vega-embed summary {\n  list-style: none;\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 6px;\n  z-index: 1000;\n  background: white;\n  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);\n  color: #1b1e23;\n  border: 1px solid #aaa;\n  border-radius: 999px;\n  opacity: 0.2;\n  transition: opacity 0.4s ease-in;\n  outline: none;\n  cursor: pointer;\n  line-height: 0px;\n}\n.vega-embed summary::-webkit-details-marker {\n  display: none;\n}\n.vega-embed summary:active {\n  box-shadow: #aaa 0px 0px 0px 1px inset;\n}\n.vega-embed summary svg {\n  width: 14px;\n  height: 14px;\n}\n.vega-embed details[open] summary {\n  opacity: 0.7;\n}\n.vega-embed:hover summary, .vega-embed:focus-within summary {\n  opacity: 1 !important;\n  transition: opacity 0.2s ease;\n}\n.vega-embed .vega-actions {\n  position: absolute;\n  z-index: 1001;\n  top: 35px;\n  right: -9px;\n  display: flex;\n  flex-direction: column;\n  padding-bottom: 8px;\n  padding-top: 8px;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);\n  border: 1px solid #d9d9d9;\n  background: white;\n  animation-duration: 0.15s;\n  animation-name: scale-in;\n  animation-timing-function: cubic-bezier(0.2, 0, 0.13, 1.5);\n  text-align: left;\n}\n.vega-embed .vega-actions a {\n  padding: 8px 16px;\n  font-family: sans-serif;\n  font-size: 14px;\n  font-weight: 600;\n  white-space: nowrap;\n  color: #434a56;\n  text-decoration: none;\n}\n.vega-embed .vega-actions a:hover {\n  background-color: #f7f7f9;\n  color: black;\n}\n.vega-embed .vega-actions::before, .vega-embed .vega-actions::after {\n  content: \"\";\n  display: inline-block;\n  position: absolute;\n}\n.vega-embed .vega-actions::before {\n  left: auto;\n  right: 14px;\n  top: -16px;\n  border: 8px solid #0000;\n  border-bottom-color: #d9d9d9;\n}\n.vega-embed .vega-actions::after {\n  left: auto;\n  right: 15px;\n  top: -14px;\n  border: 7px solid #0000;\n  border-bottom-color: #fff;\n}\n.vega-embed .chart-wrapper.fit-x {\n  width: 100%;\n}\n.vega-embed .chart-wrapper.fit-y {\n  height: 100%;\n}\n\n.vega-embed-wrapper {\n  max-width: 100%;\n  overflow: auto;\n  padding-right: 14px;\n}\n\n@keyframes scale-in {\n  from {\n    opacity: 0;\n    transform: scale(0.6);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n";

  if (!String.prototype.startsWith) {
    // eslint-disable-next-line no-extend-native,func-names
    String.prototype.startsWith = function (search, pos) {
      return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
  }

  function isURL(s) {
    return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//');
  }
  function mergeDeep(dest) {
    for (var _len = arguments.length, src = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      src[_key - 1] = arguments[_key];
    }

    for (var _i = 0, _src = src; _i < _src.length; _i++) {
      var s = _src[_i];
      deepMerge_(dest, s);
    }

    return dest;
  }

  function deepMerge_(dest, src) {
    for (var _i2 = 0, _Object$keys = Object.keys(src); _i2 < _Object$keys.length; _i2++) {
      var property = _Object$keys[_i2];
      vegaImport.writeConfig(dest, property, src[property], true);
    }
  }

  var name = "vega-embed";
  var version$1 = "6.18.2";
  var description = "Publish Vega visualizations as embedded web components.";
  var keywords = ["vega", "data", "visualization", "component", "embed"];
  var repository = {
    type: "git",
    url: "http://github.com/vega/vega-embed.git"
  };
  var author = {
    name: "UW Interactive Data Lab",
    url: "http://idl.cs.washington.edu"
  };
  var contributors = [{
    name: "Dominik Moritz",
    url: "https://www.domoritz.de"
  }];
  var bugs = {
    url: "https://github.com/vega/vega-embed/issues"
  };
  var homepage = "https://github.com/vega/vega-embed#readme";
  var license = "BSD-3-Clause";
  var main = "build/vega-embed.js";
  var module = "build/vega-embed.module.js";
  var unpkg = "build/vega-embed.min.js";
  var jsdelivr = "build/vega-embed.min.js";
  var types = "build/vega-embed.module.d.ts";
  var files = ["src", "build", "build-es5", "patches"];
  var devDependencies = {
    "@auto-it/conventional-commits": "^10.32.3",
    "@auto-it/first-time-contributor": "^10.32.3",
    "@babel/plugin-transform-runtime": "^7.16.4",
    "@rollup/plugin-commonjs": "21.0.1",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-node-resolve": "^13.0.6",
    "@types/semver": "^7.3.9",
    auto: "^10.32.3",
    "browser-sync": "^2.27.7",
    concurrently: "^7.0.0",
    "del-cli": "^4.0.1",
    "jest-canvas-mock": "^2.3.1",
    "patch-package": "^6.4.7",
    "postinstall-postinstall": "^2.1.0",
    rollup: "2.64.0",
    "rollup-plugin-bundle-size": "^1.0.3",
    "rollup-plugin-terser": "^7.0.2",
    "rollup-plugin-ts": "^2.0.4",
    sass: "^1.43.5",
    typescript: "^4.5.2",
    vega: "^5.21.0",
    "vega-lite": "^5.0.0",
    "vega-lite-dev-config": "^0.20.0"
  };
  var peerDependencies = {
    vega: "^5.21.0",
    "vega-lite": "*"
  };
  var dependencies = {
    "fast-json-patch": "^3.1.0",
    "json-stringify-pretty-compact": "^3.0.0",
    semver: "^7.3.5",
    tslib: "^2.3.1",
    "vega-interpreter": "^1.0.4",
    "vega-schema-url-parser": "^2.2.0",
    "vega-themes": "^2.10.0",
    "vega-tooltip": "^0.27.0"
  };
  var bundledDependencies = ["yallist"];
  var scripts = {
    prebuild: "yarn clean && yarn build:style",
    build: "rollup -c",
    "build:style": "./build-style.sh",
    clean: "del-cli build build-es5 src/style.ts",
    prepublishOnly: "yarn clean && yarn build",
    preversion: "yarn lint && yarn test",
    serve: "browser-sync start --directory -s -f build *.html",
    start: "yarn build && concurrently --kill-others -n Server,Rollup 'yarn serve' 'rollup -c -w'",
    pretest: "yarn build:style",
    test: "beemo jest --stdio stream",
    "test:inspect": "node --inspect-brk ./node_modules/.bin/jest --runInBand",
    prepare: "beemo create-config && npx patch-package",
    prettierbase: "beemo prettier '*.{css,scss,html}'",
    eslintbase: "beemo eslint .",
    format: "yarn eslintbase --fix && yarn prettierbase --write",
    lint: "yarn eslintbase && yarn prettierbase --check",
    release: "yarn build && auto shipit"
  };
  var pkg = {
    name: name,
    version: version$1,
    description: description,
    keywords: keywords,
    repository: repository,
    author: author,
    contributors: contributors,
    bugs: bugs,
    homepage: homepage,
    license: license,
    main: main,
    module: module,
    unpkg: unpkg,
    jsdelivr: jsdelivr,
    types: types,
    files: files,
    devDependencies: devDependencies,
    peerDependencies: peerDependencies,
    dependencies: dependencies,
    bundledDependencies: bundledDependencies,
    scripts: scripts
  };

  var _w$vl;

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var version = pkg.version;
  var vega = vegaImport__namespace;
  var _vegaLite = vegaLiteImport__namespace; // For backwards compatibility with Vega-Lite before v4.
  var w = typeof window !== 'undefined' ? window : undefined;

  if (_vegaLite === undefined && w !== null && w !== void 0 && (_w$vl = w.vl) !== null && _w$vl !== void 0 && _w$vl.compile) {
    _vegaLite = w.vl;
  }

  var DEFAULT_ACTIONS = {
    export: {
      svg: true,
      png: true
    },
    source: true,
    compiled: true,
    editor: true
  };
  var I18N = {
    CLICK_TO_VIEW_ACTIONS: 'Click to view actions',
    COMPILED_ACTION: 'View Compiled Vega',
    EDITOR_ACTION: 'Open in Vega Editor',
    PNG_ACTION: 'Save as PNG',
    SOURCE_ACTION: 'View Source',
    SVG_ACTION: 'Save as SVG'
  };
  var NAMES = {
    vega: 'Vega',
    'vega-lite': 'Vega-Lite'
  };
  var VERSION = {
    vega: vega.version,
    'vega-lite': _vegaLite ? _vegaLite.version : 'not available'
  };
  var PREPROCESSOR = {
    vega: function vega(vgSpec) {
      return vgSpec;
    },
    'vega-lite': function vegaLite(vlSpec, config) {
      return _vegaLite.compile(vlSpec, {
        config: config
      }).spec;
    }
  };
  var SVG_CIRCLES = "\n<svg viewBox=\"0 0 16 16\" fill=\"currentColor\" stroke=\"none\" stroke-width=\"1\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n  <circle r=\"2\" cy=\"8\" cx=\"2\"></circle>\n  <circle r=\"2\" cy=\"8\" cx=\"8\"></circle>\n  <circle r=\"2\" cy=\"8\" cx=\"14\"></circle>\n</svg>";
  var CHART_WRAPPER_CLASS = 'chart-wrapper';

  function isTooltipHandler(h) {
    return typeof h === 'function';
  }

  function viewSource(source, sourceHeader, sourceFooter, mode) {
    var header = "<html><head>".concat(sourceHeader, "</head><body><pre><code class=\"json\">");
    var footer = "</code></pre>".concat(sourceFooter, "</body></html>"); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    var win = window.open('');
    win.document.write(header + source + footer);
    win.document.title = "".concat(NAMES[mode], " JSON Source");
  }
  /**
   * Try to guess the type of spec.
   *
   * @param spec Vega or Vega-Lite spec.
   */


  function guessMode(spec, providedMode) {
    // Decide mode
    if (spec.$schema) {
      var parsed = e(spec.$schema);

      if (providedMode && providedMode !== parsed.library) {
        var _NAMES$providedMode;

        console.warn("The given visualization spec is written in ".concat(NAMES[parsed.library], ", but mode argument sets ").concat((_NAMES$providedMode = NAMES[providedMode]) !== null && _NAMES$providedMode !== void 0 ? _NAMES$providedMode : providedMode, "."));
      }

      var mode = parsed.library;

      if (!satisfies_1(VERSION[mode], "^".concat(parsed.version.slice(1)))) {
        console.warn("The input spec uses ".concat(NAMES[mode], " ").concat(parsed.version, ", but the current version of ").concat(NAMES[mode], " is v").concat(VERSION[mode], "."));
      }

      return mode;
    } // try to guess from the provided spec


    if ('mark' in spec || 'encoding' in spec || 'layer' in spec || 'hconcat' in spec || 'vconcat' in spec || 'facet' in spec || 'repeat' in spec) {
      return 'vega-lite';
    }

    if ('marks' in spec || 'signals' in spec || 'scales' in spec || 'axes' in spec) {
      return 'vega';
    }

    return providedMode !== null && providedMode !== void 0 ? providedMode : 'vega';
  }

  function isLoader(o) {
    return !!(o && 'load' in o);
  }

  function createLoader(opts) {
    return isLoader(opts) ? opts : vega.loader(opts);
  }

  function embedOptionsFromUsermeta(parsedSpec) {
    var _parsedSpec$usermeta$, _parsedSpec$usermeta;

    return (_parsedSpec$usermeta$ = (_parsedSpec$usermeta = parsedSpec.usermeta) === null || _parsedSpec$usermeta === void 0 ? void 0 : _parsedSpec$usermeta.embedOptions) !== null && _parsedSpec$usermeta$ !== void 0 ? _parsedSpec$usermeta$ : {};
  }
  /**
   * Embed a Vega visualization component in a web page. This function returns a promise.
   *
   * @param el        DOM element in which to place component (DOM node or CSS selector).
   * @param spec      String : A URL string from which to load the Vega specification.
   *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
   * @param opts       A JavaScript object containing options for embedding.
   */


  function embed(_x, _x2) {
    return _embed2.apply(this, arguments);
  }

  function _embed2() {
    _embed2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(el, spec) {
      var _parsedOpts$config, _usermetaOpts$config;

      var opts,
          parsedSpec,
          loader,
          usermetaLoader,
          _opts$loader,
          usermetaOpts,
          parsedOpts,
          mergedOpts,
          _args = arguments;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              opts = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};

              if (!vegaImport.isString(spec)) {
                _context.next = 10;
                break;
              }

              loader = createLoader(opts.loader);
              _context.t0 = JSON;
              _context.next = 6;
              return loader.load(spec);

            case 6:
              _context.t1 = _context.sent;
              parsedSpec = _context.t0.parse.call(_context.t0, _context.t1);
              _context.next = 11;
              break;

            case 10:
              parsedSpec = spec;

            case 11:
              usermetaLoader = embedOptionsFromUsermeta(parsedSpec).loader; // either create the loader for the first time or create a new loader if the spec has new loader options

              if (!loader || usermetaLoader) {
                loader = createLoader((_opts$loader = opts.loader) !== null && _opts$loader !== void 0 ? _opts$loader : usermetaLoader);
              }

              _context.next = 15;
              return loadOpts(embedOptionsFromUsermeta(parsedSpec), loader);

            case 15:
              usermetaOpts = _context.sent;
              _context.next = 18;
              return loadOpts(opts, loader);

            case 18:
              parsedOpts = _context.sent;
              mergedOpts = _objectSpread$1(_objectSpread$1({}, mergeDeep(parsedOpts, usermetaOpts)), {}, {
                config: vegaImport.mergeConfig((_parsedOpts$config = parsedOpts.config) !== null && _parsedOpts$config !== void 0 ? _parsedOpts$config : {}, (_usermetaOpts$config = usermetaOpts.config) !== null && _usermetaOpts$config !== void 0 ? _usermetaOpts$config : {})
              });
              _context.next = 22;
              return _embed(el, parsedSpec, mergedOpts, loader);

            case 22:
              return _context.abrupt("return", _context.sent);

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _embed2.apply(this, arguments);
  }

  function loadOpts(_x3, _x4) {
    return _loadOpts.apply(this, arguments);
  }

  function _loadOpts() {
    _loadOpts = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(opt, loader) {
      var _opt$config;

      var config, patch;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!vegaImport.isString(opt.config)) {
                _context2.next = 8;
                break;
              }

              _context2.t1 = JSON;
              _context2.next = 4;
              return loader.load(opt.config);

            case 4:
              _context2.t2 = _context2.sent;
              _context2.t0 = _context2.t1.parse.call(_context2.t1, _context2.t2);
              _context2.next = 9;
              break;

            case 8:
              _context2.t0 = (_opt$config = opt.config) !== null && _opt$config !== void 0 ? _opt$config : {};

            case 9:
              config = _context2.t0;

              if (!vegaImport.isString(opt.patch)) {
                _context2.next = 18;
                break;
              }

              _context2.t4 = JSON;
              _context2.next = 14;
              return loader.load(opt.patch);

            case 14:
              _context2.t5 = _context2.sent;
              _context2.t3 = _context2.t4.parse.call(_context2.t4, _context2.t5);
              _context2.next = 19;
              break;

            case 18:
              _context2.t3 = opt.patch;

            case 19:
              patch = _context2.t3;
              return _context2.abrupt("return", _objectSpread$1(_objectSpread$1(_objectSpread$1({}, opt), patch ? {
                patch: patch
              } : {}), config ? {
                config: config
              } : {}));

            case 21:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _loadOpts.apply(this, arguments);
  }

  function getRoot(el) {
    var _document$head;

    var possibleRoot = el.getRootNode ? el.getRootNode() : document;
    return possibleRoot instanceof ShadowRoot ? {
      root: possibleRoot,
      rootContainer: possibleRoot
    } : {
      root: document,
      rootContainer: (_document$head = document.head) !== null && _document$head !== void 0 ? _document$head : document.body
    };
  }

  function _embed(_x5, _x6) {
    return _embed3.apply(this, arguments);
  }

  function _embed3() {
    _embed3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(el, spec) {
      var _opts$config, _opts$actions, _opts$renderer, _opts$logLevel, _opts$downloadFileNam, _ref, _vega$expressionInter;

      var opts,
          loader,
          config,
          actions,
          i18n,
          renderer,
          logLevel,
          downloadFileName,
          element,
          ID,
          _getRoot,
          root,
          rootContainer,
          style,
          mode,
          vgSpec,
          parsed,
          container,
          chartWrapper,
          patch,
          ast,
          runtime,
          view,
          handler,
          hover,
          _ref2,
          hoverSet,
          updateSet,
          documentClickHandler,
          wrapper,
          details,
          summary,
          ctrl,
          _loop,
          _i,
          _arr,
          viewSourceLink,
          compileLink,
          _opts$editorUrl,
          editorUrl,
          editorLink,
          finalize,
          _args4 = arguments;

      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              finalize = function _finalize() {
                if (documentClickHandler) {
                  document.removeEventListener('click', documentClickHandler);
                }

                view.finalize();
              };

              opts = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
              loader = _args4.length > 3 ? _args4[3] : undefined;
              config = opts.theme ? vegaImport.mergeConfig(themes[opts.theme], (_opts$config = opts.config) !== null && _opts$config !== void 0 ? _opts$config : {}) : opts.config;
              actions = vegaImport.isBoolean(opts.actions) ? opts.actions : mergeDeep({}, DEFAULT_ACTIONS, (_opts$actions = opts.actions) !== null && _opts$actions !== void 0 ? _opts$actions : {});
              i18n = _objectSpread$1(_objectSpread$1({}, I18N), opts.i18n);
              renderer = (_opts$renderer = opts.renderer) !== null && _opts$renderer !== void 0 ? _opts$renderer : 'canvas';
              logLevel = (_opts$logLevel = opts.logLevel) !== null && _opts$logLevel !== void 0 ? _opts$logLevel : vega.Warn;
              downloadFileName = (_opts$downloadFileNam = opts.downloadFileName) !== null && _opts$downloadFileNam !== void 0 ? _opts$downloadFileNam : 'visualization';
              element = typeof el === 'string' ? document.querySelector(el) : el;

              if (element) {
                _context4.next = 12;
                break;
              }

              throw new Error("".concat(el, " does not exist"));

            case 12:
              if (opts.defaultStyle !== false) {
                // Add a default stylesheet to the head of the document.
                ID = 'vega-embed-style';
                _getRoot = getRoot(element), root = _getRoot.root, rootContainer = _getRoot.rootContainer;

                if (!root.getElementById(ID)) {
                  style = document.createElement('style');
                  style.id = ID;
                  style.innerText = opts.defaultStyle === undefined || opts.defaultStyle === true ? (embedStyle ).toString() : opts.defaultStyle;
                  rootContainer.appendChild(style);
                }
              }

              mode = guessMode(spec, opts.mode);
              vgSpec = PREPROCESSOR[mode](spec, config);

              if (mode === 'vega-lite') {
                if (vgSpec.$schema) {
                  parsed = e(vgSpec.$schema);

                  if (!satisfies_1(VERSION.vega, "^".concat(parsed.version.slice(1)))) {
                    console.warn("The compiled spec uses Vega ".concat(parsed.version, ", but current version is v").concat(VERSION.vega, "."));
                  }
                }
              }

              element.classList.add('vega-embed');

              if (actions) {
                element.classList.add('has-actions');
              }

              element.innerHTML = ''; // clear container

              container = element;

              if (actions) {
                chartWrapper = document.createElement('div');
                chartWrapper.classList.add(CHART_WRAPPER_CLASS);
                element.appendChild(chartWrapper);
                container = chartWrapper;
              }

              patch = opts.patch;

              if (patch) {
                vgSpec = patch instanceof Function ? patch(vgSpec) : applyPatch(vgSpec, patch, true, false).newDocument;
              } // Set locale. Note that this is a global setting.


              if (opts.formatLocale) {
                vega.formatLocale(opts.formatLocale);
              }

              if (opts.timeFormatLocale) {
                vega.timeFormatLocale(opts.timeFormatLocale);
              }

              ast = opts.ast; // Do not apply the config to Vega when we have already applied it to Vega-Lite.
              // This call may throw an Error if parsing fails.

              runtime = vega.parse(vgSpec, mode === 'vega-lite' ? {} : config, {
                ast: ast
              });
              view = new (opts.viewClass || vega.View)(runtime, _objectSpread$1({
                loader: loader,
                logLevel: logLevel,
                renderer: renderer
              }, ast ? {
                expr: (_ref = (_vega$expressionInter = vega.expressionInterpreter) !== null && _vega$expressionInter !== void 0 ? _vega$expressionInter : opts.expr) !== null && _ref !== void 0 ? _ref : expression
              } : {}));
              view.addSignalListener('autosize', function (_, autosize) {
                var type = autosize.type;

                if (type == 'fit-x') {
                  container.classList.add('fit-x');
                  container.classList.remove('fit-y');
                } else if (type == 'fit-y') {
                  container.classList.remove('fit-x');
                  container.classList.add('fit-y');
                } else if (type == 'fit') {
                  container.classList.add('fit-x', 'fit-y');
                } else {
                  container.classList.remove('fit-x', 'fit-y');
                }
              });

              if (opts.tooltip !== false) {
                handler = isTooltipHandler(opts.tooltip) ? opts.tooltip : // user provided boolean true or tooltip options
                new Handler(opts.tooltip === true ? {} : opts.tooltip).call;
                view.tooltip(handler);
              }

              hover = opts.hover;

              if (hover === undefined) {
                hover = mode === 'vega';
              }

              if (hover) {
                _ref2 = typeof hover === 'boolean' ? {} : hover, hoverSet = _ref2.hoverSet, updateSet = _ref2.updateSet;
                view.hover(hoverSet, updateSet);
              }

              if (opts) {
                if (opts.width != null) {
                  view.width(opts.width);
                }

                if (opts.height != null) {
                  view.height(opts.height);
                }

                if (opts.padding != null) {
                  view.padding(opts.padding);
                }
              }

              _context4.next = 36;
              return view.initialize(container, opts.bind).runAsync();

            case 36:
              if (actions !== false) {
                wrapper = element;

                if (opts.defaultStyle !== false) {
                  details = document.createElement('details');
                  details.title = i18n.CLICK_TO_VIEW_ACTIONS;
                  element.append(details);
                  wrapper = details;
                  summary = document.createElement('summary');
                  summary.innerHTML = SVG_CIRCLES;
                  details.append(summary);

                  documentClickHandler = function documentClickHandler(ev) {
                    if (!details.contains(ev.target)) {
                      details.removeAttribute('open');
                    }
                  };

                  document.addEventListener('click', documentClickHandler);
                }

                ctrl = document.createElement('div');
                wrapper.append(ctrl);
                ctrl.classList.add('vega-actions'); // add 'Export' action

                if (actions === true || actions.export !== false) {
                  _loop = function _loop() {
                    var ext = _arr[_i];

                    if (actions === true || actions.export === true || actions.export[ext]) {
                      var i18nExportAction = i18n["".concat(ext.toUpperCase(), "_ACTION")];
                      var exportLink = document.createElement('a');
                      exportLink.text = i18nExportAction;
                      exportLink.href = '#';
                      exportLink.target = '_blank';
                      exportLink.download = "".concat(downloadFileName, ".").concat(ext); // add link on mousedown so that it's correct when the click happens

                      exportLink.addEventListener('mousedown', /*#__PURE__*/function () {
                        var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(e) {
                          var url;
                          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  e.preventDefault();
                                  _context3.next = 3;
                                  return view.toImageURL(ext, opts.scaleFactor);

                                case 3:
                                  url = _context3.sent;
                                  this.href = url;

                                case 5:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3, this);
                        }));

                        return function (_x7) {
                          return _ref3.apply(this, arguments);
                        };
                      }());
                      ctrl.append(exportLink);
                    }
                  };

                  for (_i = 0, _arr = ['svg', 'png']; _i < _arr.length; _i++) {
                    _loop();
                  }
                } // add 'View Source' action


                if (actions === true || actions.source !== false) {
                  viewSourceLink = document.createElement('a');
                  viewSourceLink.text = i18n.SOURCE_ACTION;
                  viewSourceLink.href = '#';
                  viewSourceLink.addEventListener('click', function (e) {
                    var _opts$sourceHeader, _opts$sourceFooter;

                    viewSource(jsonStringifyPrettyCompact(spec), (_opts$sourceHeader = opts.sourceHeader) !== null && _opts$sourceHeader !== void 0 ? _opts$sourceHeader : '', (_opts$sourceFooter = opts.sourceFooter) !== null && _opts$sourceFooter !== void 0 ? _opts$sourceFooter : '', mode);
                    e.preventDefault();
                  });
                  ctrl.append(viewSourceLink);
                } // add 'View Compiled' action


                if (mode === 'vega-lite' && (actions === true || actions.compiled !== false)) {
                  compileLink = document.createElement('a');
                  compileLink.text = i18n.COMPILED_ACTION;
                  compileLink.href = '#';
                  compileLink.addEventListener('click', function (e) {
                    var _opts$sourceHeader2, _opts$sourceFooter2;

                    viewSource(jsonStringifyPrettyCompact(vgSpec), (_opts$sourceHeader2 = opts.sourceHeader) !== null && _opts$sourceHeader2 !== void 0 ? _opts$sourceHeader2 : '', (_opts$sourceFooter2 = opts.sourceFooter) !== null && _opts$sourceFooter2 !== void 0 ? _opts$sourceFooter2 : '', 'vega');
                    e.preventDefault();
                  });
                  ctrl.append(compileLink);
                } // add 'Open in Vega Editor' action


                if (actions === true || actions.editor !== false) {
                  editorUrl = (_opts$editorUrl = opts.editorUrl) !== null && _opts$editorUrl !== void 0 ? _opts$editorUrl : 'https://vega.github.io/editor/';
                  editorLink = document.createElement('a');
                  editorLink.text = i18n.EDITOR_ACTION;
                  editorLink.href = '#';
                  editorLink.addEventListener('click', function (e) {
                    post(window, editorUrl, {
                      config: config,
                      mode: mode,
                      renderer: renderer,
                      spec: jsonStringifyPrettyCompact(spec)
                    });
                    e.preventDefault();
                  });
                  ctrl.append(editorLink);
                }
              }

              return _context4.abrupt("return", {
                view: view,
                spec: spec,
                vgSpec: vgSpec,
                finalize: finalize
              });

            case 38:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _embed3.apply(this, arguments);
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  /**
   * Create a promise to an HTML Div element with an embedded Vega-Lite or Vega visualization.
   * The element has a value property with the view. By default all actions except for the editor action are disabled.
   *
   * The main use case is in [Observable](https://observablehq.com/).
   */

  function container (_x) {
    return _ref.apply(this, arguments);
  }

  function _ref() {
    _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(spec) {
      var _opt$actions;

      var opt,
          wrapper,
          div,
          actions,
          result,
          _args = arguments;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              opt = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              wrapper = document.createElement('div');
              wrapper.classList.add('vega-embed-wrapper');
              div = document.createElement('div');
              wrapper.appendChild(div);
              actions = opt.actions === true || opt.actions === false ? opt.actions : _objectSpread({
                export: true,
                source: false,
                compiled: true,
                editor: true
              }, (_opt$actions = opt.actions) !== null && _opt$actions !== void 0 ? _opt$actions : {});
              _context.next = 8;
              return embed(div, spec, _objectSpread({
                actions: actions
              }, opt !== null && opt !== void 0 ? opt : {}));

            case 8:
              result = _context.sent;
              wrapper.value = result.view;
              return _context.abrupt("return", wrapper);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _ref.apply(this, arguments);
  }

  /**
   * Returns true if the object is an HTML element.
   */

  function isElement(obj) {
    return obj instanceof HTMLElement;
  }

  var wrapper = function wrapper() {
    if (arguments.length > 1 && (vegaImport.isString(arguments.length <= 0 ? undefined : arguments[0]) && !isURL(arguments.length <= 0 ? undefined : arguments[0]) || isElement(arguments.length <= 0 ? undefined : arguments[0]) || arguments.length === 3)) {
      return embed(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]);
    }

    return container(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
  };

  wrapper.vegaLite = _vegaLite;
  wrapper.vl = _vegaLite; // backwards compatibility

  wrapper.container = container;
  wrapper.embed = embed;
  wrapper.vega = vega;
  wrapper.default = embed;
  wrapper.version = version;

  return wrapper;

}));
//# sourceMappingURL=vega-embed.js.map
