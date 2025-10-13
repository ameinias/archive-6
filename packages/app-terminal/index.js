"use strict";

var _excluded = ["completion"];
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i.return && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, catch: function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*    ______      _
 *   / ____/___ _(_)___ ___  ____ _____
 *  / / __/ __ `/ / __ `__ \/ __ `/ __ \
 * / /_/ / /_/ / / / / / / / /_/ / / / /
 * \____/\__,_/_/_/ /_/ /_/\__,_/_/ /_/
 *
 * Code generated by Gaiman version 1.0.0-beta.3
 * https://gaiman.js.org
 */
function parse_cookies(cookies) {
  var result = {};
  cookies.split(/\s*;\s*/).forEach(function (pair) {
    pair = pair.split(/\s*=\s*/);
    var name = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair.splice(1).join('='));
    result[name] = value;
  });
  return result;
}
function is_function(obj) {
  return typeof obj === 'function';
}
function is_promise(obj) {
  return obj && is_function(obj.then);
}
function is_node() {
  return typeof process !== 'undefined' && process.release.name === 'node';
}

// based on https://stackoverflow.com/a/46282334/387194
function extend(object, prototype) {
  var descriptors = Object.getOwnPropertyDescriptors(object);
  for (var prop in descriptors) {
    Object.defineProperty(prototype, prop, descriptors[prop]);
  }
}
var loops = {};
var Gaiman = _defineProperty(_defineProperty({
  _get_time: function _get_time() {
    return +new Date();
  },
  should_break_loop: function should_break_loop(id) {
    if (!loops[id]) {
      loops[id] = {
        start: this._get_time(),
        count: 1
      };
      return false;
    } else {
      var now = this._get_time();
      var start = loops[id].start;
      var count = ++loops[id].count;
      if (count > this._config.loop_threshold) {
        var stop = now - start > this._config.loop_timeout;
        if (stop) {
          window.parent.postMessage({
            message: 'Infinite Loop detected!',
            colno: null,
            lineno: null
          });
        }
        return stop;
      }
      return false;
    }
  },
  exit_loop: function exit_loop(id) {
    delete loops[id];
  },
  type: function type(obj) {
    if (obj === 'null') {
      return 'null';
    } else if (Number.isNaN(obj)) {
      return 'nan';
    } else if (obj instanceof Array) {
      return 'array';
    } else {
      var type = _typeof(obj);
      if (type === 'object') {
        // https://tinyurl.com/fixing-typeof
        return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
      }
      return type;
    }
  },
  parse: function parse(input) {
    return $.terminal.parse_arguments(input);
  },
  parse_extra: function parse_extra(input) {
    return $.terminal.split_arguments(input);
  },
  set_cookie: function set_cookie(name, value) {
    document.cookie = "".concat(name, "=").concat(value);
    cookie[name] = value;
  },
  post: function post(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return $.post(url, data);
  },
  post_extra: function post_extra(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return $.post(url, data, $.noop, "text");
  },
  get: function get(url, data) {
    if (data) {
      return $.get(url, data);
    }
    return $.get(url);
  },
  get_extra: function get_extra(url, data) {
    if (data) {
      return $.get(url, data, $.noop, "text");
    }
    return $.get(url, $.noop, "text");
  },
  load: function load(url) {
    return $.getScript(url);
  }
}, 'async', function async(fn) {
  setTimeout(fn, 0);
}), "rpc", function rpc(url) {
  return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Proxy({}, {
            get: function get(target, name) {
              if (name in target) {
                return target[name];
              }
              if (name === 'then') {
                return undefined;
              }
              return function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }
                return $.rpc(url, name, args);
              };
            },
            set: function set() {
              throw new Error("You can't set properties on rpc object");
            }
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }))();
});
function to_string(object) {
  if (object instanceof Array) {
    object = object.map(to_string);
  } else {
    var type = _typeof(object);
    if (type === 'number') {
      object = String(object);
    } else if (type !== 'string') {
      if (object) {
        object = JSON.stringify(object, null, 2);
      } else {
        object = String(object);
      }
    }
  }
  return object;
}
var WebAdapter = /*#__PURE__*/function () {
  function WebAdapter() {
    var _window$parent,
      _this = this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, WebAdapter);
    this._config = $.extend({
      newline: true,
      loop_threshold: 500,
      loop_timeout: 200
    }, config);
    var root = $('#term');
    var options = root.css('--options');
    if (typeof options === 'undefined') {
      options = {};
    } else {
      try {
        options = JSON.parse(options);
      } catch (e) {
        console.warn('Gaiman: Invalid --option CSS variable');
        options = {};
      }
    }
    var playground = (_window$parent = window.parent) === null || _window$parent === void 0 ? void 0 : _window$parent.__GAIMAN_PLAYGROUND__;
    if (playground) {
      options.enabled = false;
    }
    this._term = root.terminal($.noop, $.extend({
      greetings: false,
      exit: false,
      keydown: function keydown() {
        if (_this._animation) {
          return false;
        }
      },
      exceptionHandler: function exceptionHandler(e) {
        if (is_iframe) {
          window.parent.postMessage({
            message: 'Internal: ' + e.message,
            colno: null,
            lineno: null
          });
        } else {
          throw e;
        }
      }
    }, options));
  }
  return _createClass(WebAdapter, [{
    key: "config",
    value: function config(name, value) {
      if (typeof name === 'string') {
        this._config[name] = value;
      } else {
        var completion = name.completion,
          rest = _objectWithoutProperties(name, _excluded);
        this._term.settings().completion = completion;
        $.extend(rest, name);
      }
    }
  }, {
    key: "store",
    value: function store(name) {
      try {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        if (args.length === 0) {
          return JSON.parse(localStorage.getItem(name));
        } else {
          var value = args[0];
          localStorage.setItem(name, JSON.stringify(value));
        }
      } catch (e) {
        // ignore errors that may happen in Incognito mode
      }
    }
  }, {
    key: "sleep",
    value: function sleep(timeout) {
      var _this2 = this;
      var visible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this._term.pause(visible);
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this2._term.resume();
          resolve();
        }, Number(timeout));
      });
    }
  }, {
    key: "sleep_extra",
    value: function sleep_extra(timeout) {
      return this.sleep(timeout, true);
    }
  }, {
    key: "mask",
    value: function mask(char) {
      if (arguments.length === 0) {
        return this._term.cmd().mask();
      }
      this._term.set_mask(char);
    }
  }, {
    key: "error",
    value: function error(e) {
      var message;
      if (e.statusText) {
        message = "Failed to fetch: ".concat(e.url, "\n").concat(e.statusText);
      } else {
        message = e.message || e;
      }
      this._term.error(message);
    }
  }, {
    key: "echo",
    value: function echo() {
      var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      if (typeof arg !== 'function') {
        arg = to_string(arg);
      }
      this._term.echo(arg, {
        newline: this._config.newline
      });
    }
  }, {
    key: "echo_extra",
    value: function echo_extra(string, delay) {
      return this._term.echo(string, {
        typing: true,
        delay: delay
      });
    }
  }, {
    key: "enter",
    value: function enter(string) {
      return this._term.enter(string);
    }
  }, {
    key: "enter_extra",
    value: function enter_extra(string, delay) {
      return this._term.enter(string, {
        typing: true,
        delay: delay
      });
    }
  }, {
    key: "ask",
    value: function ask(message) {
      var _this3 = this;
      var validator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return true;
      };
      return new Promise(function (resolve) {
        _this3._term.push(function (result) {
          return Promise.resolve().then(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(typeof validator !== 'function')) {
                    _context2.next = 2;
                    break;
                  }
                  throw new Error('ask validator needs to be a function');
                case 2:
                  _context2.next = 4;
                  return validator(result);
                case 4:
                  if (!_context2.sent) {
                    _context2.next = 7;
                    break;
                  }
                  _this3._term.pop();
                  resolve(result);
                case 7:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          })));
        }, {
          prompt: message
        });
      });
    }
  }, {
    key: "ask_extra",
    value: function ask_extra(message, delay) {
      var _this4 = this;
      var validator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return true;
      };
      return new Promise(function (resolve) {
        var prompt = _this4._term.get_prompt();
        _this4._term.push(function (result) {
          return Promise.resolve().then(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(typeof validator !== 'function')) {
                    _context3.next = 2;
                    break;
                  }
                  throw new Error('ask* validator needs to be a function');
                case 2:
                  _context3.next = 4;
                  return validator(result);
                case 4:
                  if (!_context3.sent) {
                    _context3.next = 9;
                    break;
                  }
                  _this4._term.pop().set_prompt(prompt);
                  resolve(result);
                  _context3.next = 10;
                  break;
                case 9:
                  _this4._term.set_prompt(message, {
                    typing: true,
                    delay: delay
                  });
                case 10:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          })));
        }).set_prompt(message, {
          typing: true,
          delay: delay
        });
      });
    }
  }, {
    key: "update",
    value: function update(index, string) {
      this._term.update(index, string);
    }
  }, {
    key: "prompt",
    value: function prompt(string) {
      this._term.set_prompt(string);
    }
  }, {
    key: "prompt_extra",
    value: function prompt_extra(string, delay) {
      return this._term.set_prompt(string, {
        typing: true,
        delay: delay
      });
    }
  }, {
    key: "input",
    value: function input(string) {
      return this._term.exec(string);
    }
  }, {
    key: "input_extra",
    value: function input_extra(string, delay) {
      return this._term.exec(string, {
        typing: true,
        delay: delay
      });
    }
  }, {
    key: "exec",
    value: function exec(command) {
      return this._term.exec(command);
    }
  }, {
    key: "exec_extra",
    value: function exec_extra(command, delay) {
      return this._term.exec(command, {
        typing: true,
        delay: delay
      });
    }
  }, {
    key: "animate",
    value: function () {
      var _animate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(fn) {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              this._animation = true;
              _context4.next = 3;
              return fn();
            case 3:
              this._animation = false;
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function animate(_x) {
        return _animate.apply(this, arguments);
      }
      return animate;
    }()
  }, {
    key: "clear",
    value: function clear() {
      this._term.clear();
    }
  }]);
}();
$.ajaxSetup({
  beforeSend: function beforeSend(jqXHR, settings) {
    jqXHR.url = settings.url;
  }
});
extend(Gaiman, WebAdapter.prototype);
var GaimanArray = /*#__PURE__*/function (_Array) {
  function GaimanArray() {
    _classCallCheck(this, GaimanArray);
    return _callSuper(this, GaimanArray, arguments);
  }
  _inherits(GaimanArray, _Array);
  return _createClass(GaimanArray, [{
    key: "map",
    value: function map() {
      function call(arr) {
        return _construct(GaimanArray, _toConsumableArray(arr));
      }
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      var arr = _superPropGet(GaimanArray, "map", this, 1).apply(this, args);
      var some = _superPropGet(GaimanArray, "some", this, 1);
      var has_promise = some.call(arr, is_promise);
      if (has_promise) {
        return Promise.all(arr).then(call);
      } else {
        return call(arr);
      }
    }
  }, {
    key: "forEach",
    value: function forEach() {
      return this.map.apply(this, arguments);
    }
  }, {
    key: "filter",
    value: function filter(fn, ctx) {
      var filter = _superPropGet(GaimanArray, "filter", this, 1);
      function call(arr) {
        return _construct(GaimanArray, _toConsumableArray(filter.call(arr, function (x) {
          return x;
        })));
      }
      var items = this.map(fn, ctx);
      if (is_promise(items)) {
        return items.then(function (arr) {
          return call(arr);
        });
      } else {
        return call(items);
      }
    }
  }, {
    key: "reduce",
    value: function reduce(fn, init) {
      return _construct(GaimanArray, _toConsumableArray(_superPropGet(GaimanArray, "reduce", this, 1).call(this, function (acc) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }
        if (is_promise(acc)) {
          return acc.then(function (acc) {
            return fn.apply(void 0, [acc].concat(args));
          });
        } else {
          return fn.apply(void 0, [acc].concat(args));
        }
      }, init)));
    }
  }, {
    key: "sort",
    value: function sort() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultSortFn;
      return mergeSort(this, fn);
    }
  }, {
    key: "some",
    value: function some(fn, ctx) {
      var some = _superPropGet(GaimanArray, "some", this, 1);
      return this.mapWithCallback(fn, function (arr) {
        return some.call(arr, function (x) {
          return x;
        });
      }, ctx);
    }
  }, {
    key: "every",
    value: function every(fn, ctx) {
      var every = _superPropGet(GaimanArray, "every", this, 1);
      return this.mapWithCallback(fn, function (arr) {
        return every.call(arr, function (x) {
          return x;
        });
      }, ctx);
    }
  }, {
    key: "find",
    value: function find(fn, ctx) {
      var _this5 = this;
      return this.mapWithCallback(fn, function (arr) {
        var index = arr.findIndex(function (x) {
          return x;
        });
        return _this5[index];
      }, ctx);
    }
  }, {
    key: "flatMap",
    value: function flatMap(fn) {
      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }
      return this.map.apply(this, args).flat();
    }
  }, {
    key: "mapWithCallback",
    value: function mapWithCallback(fn, callback, ctx) {
      var items = this.map(fn, ctx);
      if (is_promise(items)) {
        return items.then(function (arr) {
          return callback(arr);
        });
      } else {
        return callback(items);
      }
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(Array));
function defaultSortFn(a, b) {
  if (typeof a !== 'string') {
    a = String(a);
  }
  if (typeof b !== 'string') {
    b = String(b);
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

// based on: https://rosettacode.org/wiki/Sorting_algorithms/Merge_sort#JavaScript
function mergeSort(_x2) {
  return _mergeSort.apply(this, arguments);
} // STD library
function _mergeSort() {
  _mergeSort = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(array) {
    var fn,
      mid,
      left,
      right,
      ia,
      il,
      ir,
      _args5 = arguments;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          fn = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : defaultSortFn;
          if (!(array.length <= 1)) {
            _context5.next = 3;
            break;
          }
          return _context5.abrupt("return", array);
        case 3:
          mid = Math.floor(array.length / 2), left = array.slice(0, mid), right = array.slice(mid);
          _context5.next = 6;
          return mergeSort(left, fn);
        case 6:
          _context5.next = 8;
          return mergeSort(right, fn);
        case 8:
          ia = 0, il = 0, ir = 0;
        case 9:
          if (!(il < left.length && ir < right.length)) {
            _context5.next = 21;
            break;
          }
          _context5.next = 12;
          return fn(left[il], right[ir]);
        case 12:
          _context5.t0 = _context5.sent;
          if (!(_context5.t0 <= 0)) {
            _context5.next = 17;
            break;
          }
          _context5.t1 = left[il++];
          _context5.next = 18;
          break;
        case 17:
          _context5.t1 = right[ir++];
        case 18:
          array[ia++] = _context5.t1;
          _context5.next = 9;
          break;
        case 21:
          while (il < left.length) {
            array[ia++] = left[il++];
          }
          while (ir < right.length) {
            array[ia++] = right[ir++];
          }
          return _context5.abrupt("return", array);
        case 24:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _mergeSort.apply(this, arguments);
}
function $_ord(x) {
  var type = _typeof(x);
  if (type !== 'string') {
    throw new Error("ord: Invalid argument, expected string got ".concat(type));
  }
  var len = _toConsumableArray(x).length;
  if (len > 1) {
    throw new Error('ord: argument need to be string of length 1');
  }
  return x.codePointAt(0);
}
function $_chr(x) {
  var type = _typeof(x);
  if (type !== 'number') {
    throw new Error("chr: Invalid argument, expected number got ".concat(type));
  }
  return String.fromCodePoint(x);
}
function $_range(start, stop, step) {
  if (!stop) {
    stop = start;
    start = 0;
  }
  if (!step) {
    if (start > stop) {
      step = -1;
    } else {
      step = 1;
    }
  }
  if (start > stop && step > 0) {
    return new GaimanArray();
  }
  var result = new GaimanArray();
  function run() {
    result.push(start);
    start += step;
  }
  if (start > stop) {
    while (start > stop) {
      run();
    }
  } else {
    while (start < stop) {
      run();
    }
  }
  return result;
}
var $_abs = Math.abs;
var $_acos = Math.acos;
var $_acosh = Math.acosh;
var $_asin = Math.asin;
var $_asinh = Math.asinh;
var $_atan = Math.atan;
var $_atanh = Math.atanh;
var $_atan2 = Math.atan2;
var $_ceil = Math.ceil;
var $_cbrt = Math.cbrt;
var $_expm1 = Math.expm1;
var $_clz32 = Math.clz32;
var $_cos = Math.cos;
var $_cosh = Math.cosh;
var $_exp = Math.exp;
var $_floor = Math.floor;
var $_fround = Math.fround;
var $_hypot = Math.hypot;
var $_imul = Math.imul;
var $_log = Math.log;
var $_log1p = Math.log1p;
var $_log2 = Math.log2;
var $_log10 = Math.log10;
var $_max = Math.max;
var $_min = Math.min;
var $_pow = Math.pow;
var $_random = Math.random;
var $_round = Math.round;
var $_sign = Math.sign;
var $_sin = Math.sin;
var $_sinh = Math.sinh;
var $_sqrt = Math.sqrt;
var $_tan = Math.tan;
var $_tanh = Math.tanh;
var $_trunc = Math.trunc;
var $_E = Math.E;
var $_LN10 = Math.LN10;
var $_LN2 = Math.LN2;
var $_LOG10E = Math.LOG10E;
var $_LOG2E = Math.LOG2E;
var $_PI = Math.PI;
var $_SQRT1_2 = Math.SQRT1_2;
var $_SQRT2 = Math.SQRT2;
var $_to_base64 = btoa;
var $_from_base64 = atob;
var $_sprintf = sprintf;
var $_cols = function $_cols() {
  return gaiman._term.cols();
};
var $_rows = function $_rows() {
  return gaiman._term.rows();
};
var $_delay = function $_delay(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
};

// Fisher-Yates (aka Knuth) Shuffle
// ref: https://stackoverflow.com/a/2450976/387194
function $_shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    var _ref3 = [array[randomIndex], array[currentIndex]];
    array[currentIndex] = _ref3[0];
    array[randomIndex] = _ref3[1];
  }
  return array;
}
var cookie, argv, gaiman, $$__m;
try {
  if (is_node()) {
    argv = process.argv;
  } else {
    cookie = parse_cookies(document.cookie);
    gaiman = new WebAdapter();
  }
  main();
} catch (e) {
  window.parent.postMessage({
    message: e.message,
    colno: null,
    lineno: null
  });
  throw e;
}
function main() {
  return _main.apply(this, arguments);
}
function _main() {
  _main = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    var $_figlet, $_Array, $_service, $_ready, _$_ready;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _$_ready = function _$_ready3() {
            _$_ready = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
              var $_ascii, $_term, _iterator, _step, $_result;
              return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return $_figlet.textSync("Jargon File", _defineProperty({}, "font", "Standard"));
                  case 2:
                    $_ascii = _context6.sent;
                    gaiman.echo("<yellow>".concat($_ascii, "</yellow>"));
                    _context6.next = 6;
                    return gaiman.echo_extra("<white>This is the Jargon File, a comprehensive compendium of hacker slang illuminating many aspects of hackish tradition, folklore, and humor.</white>", 20);
                  case 6:
                    gaiman.echo();
                  case 7:
                    if (!true) {
                      _context6.next = 39;
                      break;
                    }
                    if (!gaiman.should_break_loop(2)) {
                      _context6.next = 10;
                      break;
                    }
                    return _context6.abrupt("break", 39);
                  case 10:
                    _context6.next = 12;
                    return gaiman.ask("jargon? ");
                  case 12:
                    $_term = _context6.sent;
                    _context6.t0 = _createForOfIteratorHelper;
                    _context6.next = 16;
                    return $_service.jargon($_term);
                  case 16:
                    _context6.t1 = _context6.sent;
                    _iterator = (0, _context6.t0)(_context6.t1);
                    _context6.prev = 18;
                    _iterator.s();
                  case 20:
                    if ((_step = _iterator.n()).done) {
                      _context6.next = 28;
                      break;
                    }
                    $_result = _step.value;
                    if (!gaiman.should_break_loop(1)) {
                      _context6.next = 24;
                      break;
                    }
                    return _context6.abrupt("break", 28);
                  case 24:
                    gaiman.echo($_result["def"]);
                    gaiman.echo();
                  case 26:
                    _context6.next = 20;
                    break;
                  case 28:
                    _context6.next = 33;
                    break;
                  case 30:
                    _context6.prev = 30;
                    _context6.t2 = _context6["catch"](18);
                    _iterator.e(_context6.t2);
                  case 33:
                    _context6.prev = 33;
                    _iterator.f();
                    return _context6.finish(33);
                  case 36:
                    gaiman.exit_loop(1);
                    _context6.next = 7;
                    break;
                  case 39:
                    gaiman.exit_loop(2);
                  case 40:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6, null, [[18, 30, 33, 36]]);
            }));
            return _$_ready.apply(this, arguments);
          };
          $_ready = function _$_ready2() {
            return _$_ready.apply(this, arguments);
          };
          _context7.next = 5;
          return gaiman.load("https://cdn.jsdelivr.net/npm/figlet/lib/figlet.js");
        case 5:
          $_figlet = figlet;
          $_Array = Array;
          _context7.next = 9;
          return $_figlet.defaults(_defineProperty({}, "fontPath", "https://unpkg.com/figlet/fonts/"));
        case 9:
          _context7.t0 = $_figlet;
          _context7.next = 12;
          return $_Array.from(new GaimanArray("Standard"));
        case 12:
          _context7.t1 = _context7.sent;
          _context7.t2 = $_ready;
          _context7.next = 16;
          return _context7.t0.preloadFonts.call(_context7.t0, _context7.t1, _context7.t2);
        case 16:
          _context7.next = 18;
          return gaiman.rpc("https://terminal.jcubic.pl/service.php");
        case 18:
          $_service = _context7.sent;
          _context7.next = 24;
          break;
        case 21:
          _context7.prev = 21;
          _context7.t3 = _context7["catch"](0);
          gaiman.error(_context7.t3);
        case 24:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 21]]);
  }));
  return _main.apply(this, arguments);
}