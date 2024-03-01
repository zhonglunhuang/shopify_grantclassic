(() => {
  // node_modules/@ungap/custom-elements/index.js
  (function() {
    "use strict";
    var Lie = typeof Promise === "function" ? Promise : function(fn) {
      var queue = [], resolved = 0, value;
      fn(function($) {
        value = $;
        resolved = 1;
        queue.splice(0).forEach(then);
      });
      return {
        then
      };
      function then(fn2) {
        return resolved ? setTimeout(fn2, 0, value) : queue.push(fn2), this;
      }
    };
    var attributesObserver = function(whenDefined2, MutationObserver2) {
      var attributeChanged = function attributeChanged2(records) {
        for (var i = 0, length = records.length; i < length; i++) {
          dispatch(records[i]);
        }
      };
      var dispatch = function dispatch2(_ref2) {
        var target = _ref2.target, attributeName = _ref2.attributeName, oldValue = _ref2.oldValue;
        target.attributeChangedCallback(attributeName, oldValue, target.getAttribute(attributeName));
      };
      return function(target, is2) {
        var attributeFilter = target.constructor.observedAttributes;
        if (attributeFilter) {
          whenDefined2(is2).then(function() {
            new MutationObserver2(attributeChanged).observe(target, {
              attributes: true,
              attributeOldValue: true,
              attributeFilter
            });
            for (var i = 0, length = attributeFilter.length; i < length; i++) {
              if (target.hasAttribute(attributeFilter[i]))
                dispatch({
                  target,
                  attributeName: attributeFilter[i],
                  oldValue: null
                });
            }
          });
        }
        return target;
      };
    };
    var TRUE = true, FALSE = false;
    var QSA$1 = "querySelectorAll";
    function add(node) {
      this.observe(node, {
        subtree: TRUE,
        childList: TRUE
      });
    }
    var notify = function notify2(callback, root, MO) {
      var loop = function loop2(nodes, added, removed, connected, pass) {
        for (var i = 0, length = nodes.length; i < length; i++) {
          var node = nodes[i];
          if (pass || QSA$1 in node) {
            if (connected) {
              if (!added.has(node)) {
                added.add(node);
                removed["delete"](node);
                callback(node, connected);
              }
            } else if (!removed.has(node)) {
              removed.add(node);
              added["delete"](node);
              callback(node, connected);
            }
            if (!pass)
              loop2(node[QSA$1]("*"), added, removed, connected, TRUE);
          }
        }
      };
      var observer = new (MO || MutationObserver)(function(records) {
        for (var added = new Set(), removed = new Set(), i = 0, length = records.length; i < length; i++) {
          var _records$i = records[i], addedNodes = _records$i.addedNodes, removedNodes = _records$i.removedNodes;
          loop(removedNodes, added, removed, FALSE, FALSE);
          loop(addedNodes, added, removed, TRUE, FALSE);
        }
      });
      observer.add = add;
      observer.add(root || document);
      return observer;
    };
    var QSA = "querySelectorAll";
    var _self$1 = self, document$2 = _self$1.document, Element$1 = _self$1.Element, MutationObserver$2 = _self$1.MutationObserver, Set$2 = _self$1.Set, WeakMap$1 = _self$1.WeakMap;
    var elements = function elements2(element) {
      return QSA in element;
    };
    var filter = [].filter;
    var qsaObserver = function(options) {
      var live = new WeakMap$1();
      var drop = function drop2(elements2) {
        for (var i = 0, length = elements2.length; i < length; i++) {
          live["delete"](elements2[i]);
        }
      };
      var flush = function flush2() {
        var records = observer.takeRecords();
        for (var i = 0, length = records.length; i < length; i++) {
          parse2(filter.call(records[i].removedNodes, elements), false);
          parse2(filter.call(records[i].addedNodes, elements), true);
        }
      };
      var matches = function matches2(element) {
        return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
      };
      var notifier = function notifier2(element, connected) {
        var selectors;
        if (connected) {
          for (var q, m = matches(element), i = 0, length = query2.length; i < length; i++) {
            if (m.call(element, q = query2[i])) {
              if (!live.has(element))
                live.set(element, new Set$2());
              selectors = live.get(element);
              if (!selectors.has(q)) {
                selectors.add(q);
                options.handle(element, connected, q);
              }
            }
          }
        } else if (live.has(element)) {
          selectors = live.get(element);
          live["delete"](element);
          selectors.forEach(function(q2) {
            options.handle(element, connected, q2);
          });
        }
      };
      var parse2 = function parse3(elements2) {
        var connected = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        for (var i = 0, length = elements2.length; i < length; i++) {
          notifier(elements2[i], connected);
        }
      };
      var query2 = options.query;
      var root = options.root || document$2;
      var observer = notify(notifier, root, MutationObserver$2);
      var attachShadow2 = Element$1.prototype.attachShadow;
      if (attachShadow2)
        Element$1.prototype.attachShadow = function(init) {
          var shadowRoot = attachShadow2.call(this, init);
          observer.add(shadowRoot);
          return shadowRoot;
        };
      if (query2.length)
        parse2(root[QSA](query2));
      return {
        drop,
        flush,
        observer,
        parse: parse2
      };
    };
    var _self = self, document$1 = _self.document, Map = _self.Map, MutationObserver$1 = _self.MutationObserver, Object$1 = _self.Object, Set$1 = _self.Set, WeakMap = _self.WeakMap, Element2 = _self.Element, HTMLElement2 = _self.HTMLElement, Node = _self.Node, Error2 = _self.Error, TypeError2 = _self.TypeError, Reflect = _self.Reflect;
    var Promise$1 = self.Promise || Lie;
    var defineProperty = Object$1.defineProperty, keys = Object$1.keys, getOwnPropertyNames = Object$1.getOwnPropertyNames, setPrototypeOf = Object$1.setPrototypeOf;
    var legacy = !self.customElements;
    var expando = function expando2(element) {
      var key = keys(element);
      var value = [];
      var length = key.length;
      for (var i = 0; i < length; i++) {
        value[i] = element[key[i]];
        delete element[key[i]];
      }
      return function() {
        for (var _i = 0; _i < length; _i++) {
          element[key[_i]] = value[_i];
        }
      };
    };
    if (legacy) {
      var HTMLBuiltIn = function HTMLBuiltIn2() {
        var constructor = this.constructor;
        if (!classes.has(constructor))
          throw new TypeError2("Illegal constructor");
        var is2 = classes.get(constructor);
        if (override)
          return augment(override, is2);
        var element = createElement.call(document$1, is2);
        return augment(setPrototypeOf(element, constructor.prototype), is2);
      };
      var createElement = document$1.createElement;
      var classes = new Map();
      var defined = new Map();
      var prototypes = new Map();
      var registry = new Map();
      var query = [];
      var handle = function handle2(element, connected, selector) {
        var proto = prototypes.get(selector);
        if (connected && !proto.isPrototypeOf(element)) {
          var redefine = expando(element);
          override = setPrototypeOf(element, proto);
          try {
            new proto.constructor();
          } finally {
            override = null;
            redefine();
          }
        }
        var method = "".concat(connected ? "" : "dis", "connectedCallback");
        if (method in proto)
          element[method]();
      };
      var _qsaObserver = qsaObserver({
        query,
        handle
      }), parse = _qsaObserver.parse;
      var override = null;
      var whenDefined = function whenDefined2(name) {
        if (!defined.has(name)) {
          var _, $ = new Lie(function($2) {
            _ = $2;
          });
          defined.set(name, {
            $,
            _
          });
        }
        return defined.get(name).$;
      };
      var augment = attributesObserver(whenDefined, MutationObserver$1);
      defineProperty(self, "customElements", {
        configurable: true,
        value: {
          define: function define2(is2, Class) {
            if (registry.has(is2))
              throw new Error2('the name "'.concat(is2, '" has already been used with this registry'));
            classes.set(Class, is2);
            prototypes.set(is2, Class.prototype);
            registry.set(is2, Class);
            query.push(is2);
            whenDefined(is2).then(function() {
              parse(document$1.querySelectorAll(is2));
            });
            defined.get(is2)._(Class);
          },
          get: function get2(is2) {
            return registry.get(is2);
          },
          whenDefined
        }
      });
      defineProperty(HTMLBuiltIn.prototype = HTMLElement2.prototype, "constructor", {
        value: HTMLBuiltIn
      });
      defineProperty(self, "HTMLElement", {
        configurable: true,
        value: HTMLBuiltIn
      });
      defineProperty(document$1, "createElement", {
        configurable: true,
        value: function value(name, options) {
          var is2 = options && options.is;
          var Class = is2 ? registry.get(is2) : registry.get(name);
          return Class ? new Class() : createElement.call(document$1, name);
        }
      });
      if (!("isConnected" in Node.prototype))
        defineProperty(Node.prototype, "isConnected", {
          configurable: true,
          get: function get2() {
            return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
          }
        });
    } else {
      try {
        var LI = function LI2() {
          return self.Reflect.construct(HTMLLIElement, [], LI2);
        };
        LI.prototype = HTMLLIElement.prototype;
        var is = "extends-li";
        self.customElements.define("extends-li", LI, {
          "extends": "li"
        });
        legacy = document$1.createElement("li", {
          is
        }).outerHTML.indexOf(is) < 0;
        var _self$customElements = self.customElements, get = _self$customElements.get, _whenDefined = _self$customElements.whenDefined;
        defineProperty(self.customElements, "whenDefined", {
          configurable: true,
          value: function value(is2) {
            var _this = this;
            return _whenDefined.call(this, is2).then(function(Class) {
              return Class || get.call(_this, is2);
            });
          }
        });
      } catch (o_O) {
        legacy = !legacy;
      }
    }
    if (legacy) {
      var parseShadow = function parseShadow2(element) {
        var root = shadowRoots.get(element);
        _parse(root.querySelectorAll(this), element.isConnected);
      };
      var customElements = self.customElements;
      var attachShadow = Element2.prototype.attachShadow;
      var _createElement = document$1.createElement;
      var define = customElements.define, _get = customElements.get;
      var _ref = Reflect || {
        construct: function construct2(HTMLElement3) {
          return HTMLElement3.call(this);
        }
      }, construct = _ref.construct;
      var shadowRoots = new WeakMap();
      var shadows = new Set$1();
      var _classes = new Map();
      var _defined = new Map();
      var _prototypes = new Map();
      var _registry = new Map();
      var shadowed = [];
      var _query = [];
      var getCE = function getCE2(is2) {
        return _registry.get(is2) || _get.call(customElements, is2);
      };
      var _handle = function _handle2(element, connected, selector) {
        var proto = _prototypes.get(selector);
        if (connected && !proto.isPrototypeOf(element)) {
          var redefine = expando(element);
          _override = setPrototypeOf(element, proto);
          try {
            new proto.constructor();
          } finally {
            _override = null;
            redefine();
          }
        }
        var method = "".concat(connected ? "" : "dis", "connectedCallback");
        if (method in proto)
          element[method]();
      };
      var _qsaObserver2 = qsaObserver({
        query: _query,
        handle: _handle
      }), _parse = _qsaObserver2.parse;
      var _qsaObserver3 = qsaObserver({
        query: shadowed,
        handle: function handle2(element, connected) {
          if (shadowRoots.has(element)) {
            if (connected)
              shadows.add(element);
            else
              shadows["delete"](element);
            if (_query.length)
              parseShadow.call(_query, element);
          }
        }
      }), parseShadowed = _qsaObserver3.parse;
      var _whenDefined2 = function _whenDefined22(name) {
        if (!_defined.has(name)) {
          var _, $ = new Promise$1(function($2) {
            _ = $2;
          });
          _defined.set(name, {
            $,
            _
          });
        }
        return _defined.get(name).$;
      };
      var _augment = attributesObserver(_whenDefined2, MutationObserver$1);
      var _override = null;
      getOwnPropertyNames(self).filter(function(k) {
        return /^HTML/.test(k);
      }).forEach(function(k) {
        var HTMLElement3 = self[k];
        function HTMLBuiltIn2() {
          var constructor = this.constructor;
          if (!_classes.has(constructor))
            throw new TypeError2("Illegal constructor");
          var _classes$get = _classes.get(constructor), is2 = _classes$get.is, tag = _classes$get.tag;
          if (is2) {
            if (_override)
              return _augment(_override, is2);
            var element = _createElement.call(document$1, tag);
            element.setAttribute("is", is2);
            return _augment(setPrototypeOf(element, constructor.prototype), is2);
          } else
            return construct.call(this, HTMLElement3, [], constructor);
        }
        defineProperty(HTMLBuiltIn2.prototype = HTMLElement3.prototype, "constructor", {
          value: HTMLBuiltIn2
        });
        defineProperty(self, k, {
          value: HTMLBuiltIn2
        });
      });
      defineProperty(document$1, "createElement", {
        configurable: true,
        value: function value(name, options) {
          var is2 = options && options.is;
          if (is2) {
            var Class = _registry.get(is2);
            if (Class && _classes.get(Class).tag === name)
              return new Class();
          }
          var element = _createElement.call(document$1, name);
          if (is2)
            element.setAttribute("is", is2);
          return element;
        }
      });
      if (attachShadow)
        Element2.prototype.attachShadow = function(init) {
          var root = attachShadow.call(this, init);
          shadowRoots.set(this, root);
          return root;
        };
      defineProperty(customElements, "get", {
        configurable: true,
        value: getCE
      });
      defineProperty(customElements, "whenDefined", {
        configurable: true,
        value: _whenDefined2
      });
      defineProperty(customElements, "define", {
        configurable: true,
        value: function value(is2, Class, options) {
          if (getCE(is2))
            throw new Error2("'".concat(is2, "' has already been defined as a custom element"));
          var selector;
          var tag = options && options["extends"];
          _classes.set(Class, tag ? {
            is: is2,
            tag
          } : {
            is: "",
            tag: is2
          });
          if (tag) {
            selector = "".concat(tag, '[is="').concat(is2, '"]');
            _prototypes.set(selector, Class.prototype);
            _registry.set(is2, Class);
            _query.push(selector);
          } else {
            define.apply(customElements, arguments);
            shadowed.push(selector = is2);
          }
          _whenDefined2(is2).then(function() {
            if (tag) {
              _parse(document$1.querySelectorAll(selector));
              shadows.forEach(parseShadow, [selector]);
            } else
              parseShadowed(document$1.querySelectorAll(selector));
          });
          _defined.get(is2)._(Class);
        }
      });
    }
  })();

  // node_modules/web-animations-js/web-animations.min.js
  !function() {
    var a = {}, b = {};
    !function(a2, b2) {
      function c(a3) {
        if (typeof a3 == "number")
          return a3;
        var b3 = {};
        for (var c2 in a3)
          b3[c2] = a3[c2];
        return b3;
      }
      function d() {
        this._delay = 0, this._endDelay = 0, this._fill = "none", this._iterationStart = 0, this._iterations = 1, this._duration = 0, this._playbackRate = 1, this._direction = "normal", this._easing = "linear", this._easingFunction = x;
      }
      function e() {
        return a2.isDeprecated("Invalid timing inputs", "2016-03-02", "TypeError exceptions will be thrown instead.", true);
      }
      function f(b3, c2, e2) {
        var f2 = new d();
        return c2 && (f2.fill = "both", f2.duration = "auto"), typeof b3 != "number" || isNaN(b3) ? b3 !== void 0 && Object.getOwnPropertyNames(b3).forEach(function(c3) {
          if (b3[c3] != "auto") {
            if ((typeof f2[c3] == "number" || c3 == "duration") && (typeof b3[c3] != "number" || isNaN(b3[c3])))
              return;
            if (c3 == "fill" && v.indexOf(b3[c3]) == -1)
              return;
            if (c3 == "direction" && w.indexOf(b3[c3]) == -1)
              return;
            if (c3 == "playbackRate" && b3[c3] !== 1 && a2.isDeprecated("AnimationEffectTiming.playbackRate", "2014-11-28", "Use Animation.playbackRate instead."))
              return;
            f2[c3] = b3[c3];
          }
        }) : f2.duration = b3, f2;
      }
      function g(a3) {
        return typeof a3 == "number" && (a3 = isNaN(a3) ? { duration: 0 } : { duration: a3 }), a3;
      }
      function h(b3, c2) {
        return b3 = a2.numericTimingToObject(b3), f(b3, c2);
      }
      function i(a3, b3, c2, d2) {
        return a3 < 0 || a3 > 1 || c2 < 0 || c2 > 1 ? x : function(e2) {
          function f2(a4, b4, c3) {
            return 3 * a4 * (1 - c3) * (1 - c3) * c3 + 3 * b4 * (1 - c3) * c3 * c3 + c3 * c3 * c3;
          }
          if (e2 <= 0) {
            var g2 = 0;
            return a3 > 0 ? g2 = b3 / a3 : !b3 && c2 > 0 && (g2 = d2 / c2), g2 * e2;
          }
          if (e2 >= 1) {
            var h2 = 0;
            return c2 < 1 ? h2 = (d2 - 1) / (c2 - 1) : c2 == 1 && a3 < 1 && (h2 = (b3 - 1) / (a3 - 1)), 1 + h2 * (e2 - 1);
          }
          for (var i2 = 0, j2 = 1; i2 < j2; ) {
            var k2 = (i2 + j2) / 2, l2 = f2(a3, c2, k2);
            if (Math.abs(e2 - l2) < 1e-5)
              return f2(b3, d2, k2);
            l2 < e2 ? i2 = k2 : j2 = k2;
          }
          return f2(b3, d2, k2);
        };
      }
      function j(a3, b3) {
        return function(c2) {
          if (c2 >= 1)
            return 1;
          var d2 = 1 / a3;
          return (c2 += b3 * d2) - c2 % d2;
        };
      }
      function k(a3) {
        C || (C = document.createElement("div").style), C.animationTimingFunction = "", C.animationTimingFunction = a3;
        var b3 = C.animationTimingFunction;
        if (b3 == "" && e())
          throw new TypeError(a3 + " is not a valid value for easing");
        return b3;
      }
      function l(a3) {
        if (a3 == "linear")
          return x;
        var b3 = E.exec(a3);
        if (b3)
          return i.apply(this, b3.slice(1).map(Number));
        var c2 = F.exec(a3);
        if (c2)
          return j(Number(c2[1]), A);
        var d2 = G.exec(a3);
        return d2 ? j(Number(d2[1]), { start: y, middle: z, end: A }[d2[2]]) : B[a3] || x;
      }
      function m(a3) {
        return Math.abs(n(a3) / a3.playbackRate);
      }
      function n(a3) {
        return a3.duration === 0 || a3.iterations === 0 ? 0 : a3.duration * a3.iterations;
      }
      function o(a3, b3, c2) {
        if (b3 == null)
          return H;
        var d2 = c2.delay + a3 + c2.endDelay;
        return b3 < Math.min(c2.delay, d2) ? I : b3 >= Math.min(c2.delay + a3, d2) ? J : K;
      }
      function p(a3, b3, c2, d2, e2) {
        switch (d2) {
          case I:
            return b3 == "backwards" || b3 == "both" ? 0 : null;
          case K:
            return c2 - e2;
          case J:
            return b3 == "forwards" || b3 == "both" ? a3 : null;
          case H:
            return null;
        }
      }
      function q(a3, b3, c2, d2, e2) {
        var f2 = e2;
        return a3 === 0 ? b3 !== I && (f2 += c2) : f2 += d2 / a3, f2;
      }
      function r(a3, b3, c2, d2, e2, f2) {
        var g2 = a3 === 1 / 0 ? b3 % 1 : a3 % 1;
        return g2 !== 0 || c2 !== J || d2 === 0 || e2 === 0 && f2 !== 0 || (g2 = 1), g2;
      }
      function s(a3, b3, c2, d2) {
        return a3 === J && b3 === 1 / 0 ? 1 / 0 : c2 === 1 ? Math.floor(d2) - 1 : Math.floor(d2);
      }
      function t(a3, b3, c2) {
        var d2 = a3;
        if (a3 !== "normal" && a3 !== "reverse") {
          var e2 = b3;
          a3 === "alternate-reverse" && (e2 += 1), d2 = "normal", e2 !== 1 / 0 && e2 % 2 != 0 && (d2 = "reverse");
        }
        return d2 === "normal" ? c2 : 1 - c2;
      }
      function u(a3, b3, c2) {
        var d2 = o(a3, b3, c2), e2 = p(a3, c2.fill, b3, d2, c2.delay);
        if (e2 === null)
          return null;
        var f2 = q(c2.duration, d2, c2.iterations, e2, c2.iterationStart), g2 = r(f2, c2.iterationStart, d2, c2.iterations, e2, c2.duration), h2 = s(d2, c2.iterations, g2, f2), i2 = t(c2.direction, h2, g2);
        return c2._easingFunction(i2);
      }
      var v = "backwards|forwards|both|none".split("|"), w = "reverse|alternate|alternate-reverse".split("|"), x = function(a3) {
        return a3;
      };
      d.prototype = { _setMember: function(b3, c2) {
        this["_" + b3] = c2, this._effect && (this._effect._timingInput[b3] = c2, this._effect._timing = a2.normalizeTimingInput(this._effect._timingInput), this._effect.activeDuration = a2.calculateActiveDuration(this._effect._timing), this._effect._animation && this._effect._animation._rebuildUnderlyingAnimation());
      }, get playbackRate() {
        return this._playbackRate;
      }, set delay(a3) {
        this._setMember("delay", a3);
      }, get delay() {
        return this._delay;
      }, set endDelay(a3) {
        this._setMember("endDelay", a3);
      }, get endDelay() {
        return this._endDelay;
      }, set fill(a3) {
        this._setMember("fill", a3);
      }, get fill() {
        return this._fill;
      }, set iterationStart(a3) {
        if ((isNaN(a3) || a3 < 0) && e())
          throw new TypeError("iterationStart must be a non-negative number, received: " + a3);
        this._setMember("iterationStart", a3);
      }, get iterationStart() {
        return this._iterationStart;
      }, set duration(a3) {
        if (a3 != "auto" && (isNaN(a3) || a3 < 0) && e())
          throw new TypeError("duration must be non-negative or auto, received: " + a3);
        this._setMember("duration", a3);
      }, get duration() {
        return this._duration;
      }, set direction(a3) {
        this._setMember("direction", a3);
      }, get direction() {
        return this._direction;
      }, set easing(a3) {
        this._easingFunction = l(k(a3)), this._setMember("easing", a3);
      }, get easing() {
        return this._easing;
      }, set iterations(a3) {
        if ((isNaN(a3) || a3 < 0) && e())
          throw new TypeError("iterations must be non-negative, received: " + a3);
        this._setMember("iterations", a3);
      }, get iterations() {
        return this._iterations;
      } };
      var y = 1, z = 0.5, A = 0, B = { ease: i(0.25, 0.1, 0.25, 1), "ease-in": i(0.42, 0, 1, 1), "ease-out": i(0, 0, 0.58, 1), "ease-in-out": i(0.42, 0, 0.58, 1), "step-start": j(1, y), "step-middle": j(1, z), "step-end": j(1, A) }, C = null, D = "\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*", E = new RegExp("cubic-bezier\\(" + D + "," + D + "," + D + "," + D + "\\)"), F = /steps\(\s*(\d+)\s*\)/, G = /steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/, H = 0, I = 1, J = 2, K = 3;
      a2.cloneTimingInput = c, a2.makeTiming = f, a2.numericTimingToObject = g, a2.normalizeTimingInput = h, a2.calculateActiveDuration = m, a2.calculateIterationProgress = u, a2.calculatePhase = o, a2.normalizeEasing = k, a2.parseEasingFunction = l;
    }(a), function(a2, b2) {
      function c(a3, b3) {
        return a3 in k ? k[a3][b3] || b3 : b3;
      }
      function d(a3) {
        return a3 === "display" || a3.lastIndexOf("animation", 0) === 0 || a3.lastIndexOf("transition", 0) === 0;
      }
      function e(a3, b3, e2) {
        if (!d(a3)) {
          var f2 = h[a3];
          if (f2) {
            i.style[a3] = b3;
            for (var g2 in f2) {
              var j2 = f2[g2], k2 = i.style[j2];
              e2[j2] = c(j2, k2);
            }
          } else
            e2[a3] = c(a3, b3);
        }
      }
      function f(a3) {
        var b3 = [];
        for (var c2 in a3)
          if (!(c2 in ["easing", "offset", "composite"])) {
            var d2 = a3[c2];
            Array.isArray(d2) || (d2 = [d2]);
            for (var e2, f2 = d2.length, g2 = 0; g2 < f2; g2++)
              e2 = {}, e2.offset = "offset" in a3 ? a3.offset : f2 == 1 ? 1 : g2 / (f2 - 1), "easing" in a3 && (e2.easing = a3.easing), "composite" in a3 && (e2.composite = a3.composite), e2[c2] = d2[g2], b3.push(e2);
          }
        return b3.sort(function(a4, b4) {
          return a4.offset - b4.offset;
        }), b3;
      }
      function g(b3) {
        function c2() {
          var a3 = d2.length;
          d2[a3 - 1].offset == null && (d2[a3 - 1].offset = 1), a3 > 1 && d2[0].offset == null && (d2[0].offset = 0);
          for (var b4 = 0, c3 = d2[0].offset, e2 = 1; e2 < a3; e2++) {
            var f2 = d2[e2].offset;
            if (f2 != null) {
              for (var g3 = 1; g3 < e2 - b4; g3++)
                d2[b4 + g3].offset = c3 + (f2 - c3) * g3 / (e2 - b4);
              b4 = e2, c3 = f2;
            }
          }
        }
        if (b3 == null)
          return [];
        window.Symbol && Symbol.iterator && Array.prototype.from && b3[Symbol.iterator] && (b3 = Array.from(b3)), Array.isArray(b3) || (b3 = f(b3));
        for (var d2 = b3.map(function(b4) {
          var c3 = {};
          for (var d3 in b4) {
            var f2 = b4[d3];
            if (d3 == "offset") {
              if (f2 != null) {
                if (f2 = Number(f2), !isFinite(f2))
                  throw new TypeError("Keyframe offsets must be numbers.");
                if (f2 < 0 || f2 > 1)
                  throw new TypeError("Keyframe offsets must be between 0 and 1.");
              }
            } else if (d3 == "composite") {
              if (f2 == "add" || f2 == "accumulate")
                throw { type: DOMException.NOT_SUPPORTED_ERR, name: "NotSupportedError", message: "add compositing is not supported" };
              if (f2 != "replace")
                throw new TypeError("Invalid composite mode " + f2 + ".");
            } else
              f2 = d3 == "easing" ? a2.normalizeEasing(f2) : "" + f2;
            e(d3, f2, c3);
          }
          return c3.offset == void 0 && (c3.offset = null), c3.easing == void 0 && (c3.easing = "linear"), c3;
        }), g2 = true, h2 = -1 / 0, i2 = 0; i2 < d2.length; i2++) {
          var j2 = d2[i2].offset;
          if (j2 != null) {
            if (j2 < h2)
              throw new TypeError("Keyframes are not loosely sorted by offset. Sort or specify offsets.");
            h2 = j2;
          } else
            g2 = false;
        }
        return d2 = d2.filter(function(a3) {
          return a3.offset >= 0 && a3.offset <= 1;
        }), g2 || c2(), d2;
      }
      var h = { background: ["backgroundImage", "backgroundPosition", "backgroundSize", "backgroundRepeat", "backgroundAttachment", "backgroundOrigin", "backgroundClip", "backgroundColor"], border: ["borderTopColor", "borderTopStyle", "borderTopWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth"], borderBottom: ["borderBottomWidth", "borderBottomStyle", "borderBottomColor"], borderColor: ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"], borderLeft: ["borderLeftWidth", "borderLeftStyle", "borderLeftColor"], borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"], borderRight: ["borderRightWidth", "borderRightStyle", "borderRightColor"], borderTop: ["borderTopWidth", "borderTopStyle", "borderTopColor"], borderWidth: ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"], flex: ["flexGrow", "flexShrink", "flexBasis"], font: ["fontFamily", "fontSize", "fontStyle", "fontVariant", "fontWeight", "lineHeight"], margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"], outline: ["outlineColor", "outlineStyle", "outlineWidth"], padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] }, i = document.createElementNS("http://www.w3.org/1999/xhtml", "div"), j = { thin: "1px", medium: "3px", thick: "5px" }, k = { borderBottomWidth: j, borderLeftWidth: j, borderRightWidth: j, borderTopWidth: j, fontSize: { "xx-small": "60%", "x-small": "75%", small: "89%", medium: "100%", large: "120%", "x-large": "150%", "xx-large": "200%" }, fontWeight: { normal: "400", bold: "700" }, outlineWidth: j, textShadow: { none: "0px 0px 0px transparent" }, boxShadow: { none: "0px 0px 0px 0px transparent" } };
      a2.convertToArrayForm = f, a2.normalizeKeyframes = g;
    }(a), function(a2) {
      var b2 = {};
      a2.isDeprecated = function(a3, c, d, e) {
        var f = e ? "are" : "is", g = new Date(), h = new Date(c);
        return h.setMonth(h.getMonth() + 3), !(g < h && (a3 in b2 || console.warn("Web Animations: " + a3 + " " + f + " deprecated and will stop working on " + h.toDateString() + ". " + d), b2[a3] = true, 1));
      }, a2.deprecated = function(b3, c, d, e) {
        var f = e ? "are" : "is";
        if (a2.isDeprecated(b3, c, d, e))
          throw new Error(b3 + " " + f + " no longer supported. " + d);
      };
    }(a), function() {
      if (document.documentElement.animate) {
        var c = document.documentElement.animate([], 0), d = true;
        if (c && (d = false, "play|currentTime|pause|reverse|playbackRate|cancel|finish|startTime|playState".split("|").forEach(function(a2) {
          c[a2] === void 0 && (d = true);
        })), !d)
          return;
      }
      !function(a2, b2, c2) {
        function d2(a3) {
          for (var b3 = {}, c3 = 0; c3 < a3.length; c3++)
            for (var d3 in a3[c3])
              if (d3 != "offset" && d3 != "easing" && d3 != "composite") {
                var e2 = { offset: a3[c3].offset, easing: a3[c3].easing, value: a3[c3][d3] };
                b3[d3] = b3[d3] || [], b3[d3].push(e2);
              }
          for (var f in b3) {
            var g = b3[f];
            if (g[0].offset != 0 || g[g.length - 1].offset != 1)
              throw { type: DOMException.NOT_SUPPORTED_ERR, name: "NotSupportedError", message: "Partial keyframes are not supported" };
          }
          return b3;
        }
        function e(c3) {
          var d3 = [];
          for (var e2 in c3)
            for (var f = c3[e2], g = 0; g < f.length - 1; g++) {
              var h = g, i = g + 1, j = f[h].offset, k = f[i].offset, l = j, m = k;
              g == 0 && (l = -1 / 0, k == 0 && (i = h)), g == f.length - 2 && (m = 1 / 0, j == 1 && (h = i)), d3.push({ applyFrom: l, applyTo: m, startOffset: f[h].offset, endOffset: f[i].offset, easingFunction: a2.parseEasingFunction(f[h].easing), property: e2, interpolation: b2.propertyInterpolation(e2, f[h].value, f[i].value) });
            }
          return d3.sort(function(a3, b3) {
            return a3.startOffset - b3.startOffset;
          }), d3;
        }
        b2.convertEffectInput = function(c3) {
          var f = a2.normalizeKeyframes(c3), g = d2(f), h = e(g);
          return function(a3, c4) {
            if (c4 != null)
              h.filter(function(a4) {
                return c4 >= a4.applyFrom && c4 < a4.applyTo;
              }).forEach(function(d4) {
                var e2 = c4 - d4.startOffset, f2 = d4.endOffset - d4.startOffset, g2 = f2 == 0 ? 0 : d4.easingFunction(e2 / f2);
                b2.apply(a3, d4.property, d4.interpolation(g2));
              });
            else
              for (var d3 in g)
                d3 != "offset" && d3 != "easing" && d3 != "composite" && b2.clear(a3, d3);
          };
        };
      }(a, b), function(a2, b2, c2) {
        function d2(a3) {
          return a3.replace(/-(.)/g, function(a4, b3) {
            return b3.toUpperCase();
          });
        }
        function e(a3, b3, c3) {
          h[c3] = h[c3] || [], h[c3].push([a3, b3]);
        }
        function f(a3, b3, c3) {
          for (var f2 = 0; f2 < c3.length; f2++) {
            e(a3, b3, d2(c3[f2]));
          }
        }
        function g(c3, e2, f2) {
          var g2 = c3;
          /-/.test(c3) && !a2.isDeprecated("Hyphenated property names", "2016-03-22", "Use camelCase instead.", true) && (g2 = d2(c3)), e2 != "initial" && f2 != "initial" || (e2 == "initial" && (e2 = i[g2]), f2 == "initial" && (f2 = i[g2]));
          for (var j = e2 == f2 ? [] : h[g2], k = 0; j && k < j.length; k++) {
            var l = j[k][0](e2), m = j[k][0](f2);
            if (l !== void 0 && m !== void 0) {
              var n = j[k][1](l, m);
              if (n) {
                var o = b2.Interpolation.apply(null, n);
                return function(a3) {
                  return a3 == 0 ? e2 : a3 == 1 ? f2 : o(a3);
                };
              }
            }
          }
          return b2.Interpolation(false, true, function(a3) {
            return a3 ? f2 : e2;
          });
        }
        var h = {};
        b2.addPropertiesHandler = f;
        var i = { backgroundColor: "transparent", backgroundPosition: "0% 0%", borderBottomColor: "currentColor", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px", borderBottomWidth: "3px", borderLeftColor: "currentColor", borderLeftWidth: "3px", borderRightColor: "currentColor", borderRightWidth: "3px", borderSpacing: "2px", borderTopColor: "currentColor", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderTopWidth: "3px", bottom: "auto", clip: "rect(0px, 0px, 0px, 0px)", color: "black", fontSize: "100%", fontWeight: "400", height: "auto", left: "auto", letterSpacing: "normal", lineHeight: "120%", marginBottom: "0px", marginLeft: "0px", marginRight: "0px", marginTop: "0px", maxHeight: "none", maxWidth: "none", minHeight: "0px", minWidth: "0px", opacity: "1.0", outlineColor: "invert", outlineOffset: "0px", outlineWidth: "3px", paddingBottom: "0px", paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", right: "auto", strokeDasharray: "none", strokeDashoffset: "0px", textIndent: "0px", textShadow: "0px 0px 0px transparent", top: "auto", transform: "", verticalAlign: "0px", visibility: "visible", width: "auto", wordSpacing: "normal", zIndex: "auto" };
        b2.propertyInterpolation = g;
      }(a, b), function(a2, b2, c2) {
        function d2(b3) {
          var c3 = a2.calculateActiveDuration(b3), d3 = function(d4) {
            return a2.calculateIterationProgress(c3, d4, b3);
          };
          return d3._totalDuration = b3.delay + c3 + b3.endDelay, d3;
        }
        b2.KeyframeEffect = function(c3, e, f, g) {
          var h, i = d2(a2.normalizeTimingInput(f)), j = b2.convertEffectInput(e), k = function() {
            j(c3, h);
          };
          return k._update = function(a3) {
            return (h = i(a3)) !== null;
          }, k._clear = function() {
            j(c3, null);
          }, k._hasSameTarget = function(a3) {
            return c3 === a3;
          }, k._target = c3, k._totalDuration = i._totalDuration, k._id = g, k;
        };
      }(a, b), function(a2, b2) {
        function c2(a3, b3) {
          return !(!b3.namespaceURI || b3.namespaceURI.indexOf("/svg") == -1) && (g in a3 || (a3[g] = /Trident|MSIE|IEMobile|Edge|Android 4/i.test(a3.navigator.userAgent)), a3[g]);
        }
        function d2(a3, b3, c3) {
          c3.enumerable = true, c3.configurable = true, Object.defineProperty(a3, b3, c3);
        }
        function e(a3) {
          this._element = a3, this._surrogateStyle = document.createElementNS("http://www.w3.org/1999/xhtml", "div").style, this._style = a3.style, this._length = 0, this._isAnimatedProperty = {}, this._updateSvgTransformAttr = c2(window, a3), this._savedTransformAttr = null;
          for (var b3 = 0; b3 < this._style.length; b3++) {
            var d3 = this._style[b3];
            this._surrogateStyle[d3] = this._style[d3];
          }
          this._updateIndices();
        }
        function f(a3) {
          if (!a3._webAnimationsPatchedStyle) {
            var b3 = new e(a3);
            try {
              d2(a3, "style", { get: function() {
                return b3;
              } });
            } catch (b4) {
              a3.style._set = function(b5, c3) {
                a3.style[b5] = c3;
              }, a3.style._clear = function(b5) {
                a3.style[b5] = "";
              };
            }
            a3._webAnimationsPatchedStyle = a3.style;
          }
        }
        var g = "_webAnimationsUpdateSvgTransformAttr", h = { cssText: 1, length: 1, parentRule: 1 }, i = { getPropertyCSSValue: 1, getPropertyPriority: 1, getPropertyValue: 1, item: 1, removeProperty: 1, setProperty: 1 }, j = { removeProperty: 1, setProperty: 1 };
        e.prototype = { get cssText() {
          return this._surrogateStyle.cssText;
        }, set cssText(a3) {
          for (var b3 = {}, c3 = 0; c3 < this._surrogateStyle.length; c3++)
            b3[this._surrogateStyle[c3]] = true;
          this._surrogateStyle.cssText = a3, this._updateIndices();
          for (var c3 = 0; c3 < this._surrogateStyle.length; c3++)
            b3[this._surrogateStyle[c3]] = true;
          for (var d3 in b3)
            this._isAnimatedProperty[d3] || this._style.setProperty(d3, this._surrogateStyle.getPropertyValue(d3));
        }, get length() {
          return this._surrogateStyle.length;
        }, get parentRule() {
          return this._style.parentRule;
        }, _updateIndices: function() {
          for (; this._length < this._surrogateStyle.length; )
            Object.defineProperty(this, this._length, { configurable: true, enumerable: false, get: function(a3) {
              return function() {
                return this._surrogateStyle[a3];
              };
            }(this._length) }), this._length++;
          for (; this._length > this._surrogateStyle.length; )
            this._length--, Object.defineProperty(this, this._length, { configurable: true, enumerable: false, value: void 0 });
        }, _set: function(b3, c3) {
          this._style[b3] = c3, this._isAnimatedProperty[b3] = true, this._updateSvgTransformAttr && a2.unprefixedPropertyName(b3) == "transform" && (this._savedTransformAttr == null && (this._savedTransformAttr = this._element.getAttribute("transform")), this._element.setAttribute("transform", a2.transformToSvgMatrix(c3)));
        }, _clear: function(b3) {
          this._style[b3] = this._surrogateStyle[b3], this._updateSvgTransformAttr && a2.unprefixedPropertyName(b3) == "transform" && (this._savedTransformAttr ? this._element.setAttribute("transform", this._savedTransformAttr) : this._element.removeAttribute("transform"), this._savedTransformAttr = null), delete this._isAnimatedProperty[b3];
        } };
        for (var k in i)
          e.prototype[k] = function(a3, b3) {
            return function() {
              var c3 = this._surrogateStyle[a3].apply(this._surrogateStyle, arguments);
              return b3 && (this._isAnimatedProperty[arguments[0]] || this._style[a3].apply(this._style, arguments), this._updateIndices()), c3;
            };
          }(k, k in j);
        for (var l in document.documentElement.style)
          l in h || l in i || function(a3) {
            d2(e.prototype, a3, { get: function() {
              return this._surrogateStyle[a3];
            }, set: function(b3) {
              this._surrogateStyle[a3] = b3, this._updateIndices(), this._isAnimatedProperty[a3] || (this._style[a3] = b3);
            } });
          }(l);
        a2.apply = function(b3, c3, d3) {
          f(b3), b3.style._set(a2.propertyName(c3), d3);
        }, a2.clear = function(b3, c3) {
          b3._webAnimationsPatchedStyle && b3.style._clear(a2.propertyName(c3));
        };
      }(b), function(a2) {
        window.Element.prototype.animate = function(b2, c2) {
          var d2 = "";
          return c2 && c2.id && (d2 = c2.id), a2.timeline._play(a2.KeyframeEffect(this, b2, c2, d2));
        };
      }(b), function(a2, b2) {
        function c2(a3, b3, d2) {
          if (typeof a3 == "number" && typeof b3 == "number")
            return a3 * (1 - d2) + b3 * d2;
          if (typeof a3 == "boolean" && typeof b3 == "boolean")
            return d2 < 0.5 ? a3 : b3;
          if (a3.length == b3.length) {
            for (var e = [], f = 0; f < a3.length; f++)
              e.push(c2(a3[f], b3[f], d2));
            return e;
          }
          throw "Mismatched interpolation arguments " + a3 + ":" + b3;
        }
        a2.Interpolation = function(a3, b3, d2) {
          return function(e) {
            return d2(c2(a3, b3, e));
          };
        };
      }(b), function(a2, b2) {
        function c2(a3, b3, c3) {
          return Math.max(Math.min(a3, c3), b3);
        }
        function d2(b3, d3, e2) {
          var f = a2.dot(b3, d3);
          f = c2(f, -1, 1);
          var g = [];
          if (f === 1)
            g = b3;
          else
            for (var h = Math.acos(f), i = 1 * Math.sin(e2 * h) / Math.sqrt(1 - f * f), j = 0; j < 4; j++)
              g.push(b3[j] * (Math.cos(e2 * h) - f * i) + d3[j] * i);
          return g;
        }
        var e = function() {
          function a3(a4, b4) {
            for (var c4 = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], d3 = 0; d3 < 4; d3++)
              for (var e2 = 0; e2 < 4; e2++)
                for (var f = 0; f < 4; f++)
                  c4[d3][e2] += b4[d3][f] * a4[f][e2];
            return c4;
          }
          function b3(a4) {
            return a4[0][2] == 0 && a4[0][3] == 0 && a4[1][2] == 0 && a4[1][3] == 0 && a4[2][0] == 0 && a4[2][1] == 0 && a4[2][2] == 1 && a4[2][3] == 0 && a4[3][2] == 0 && a4[3][3] == 1;
          }
          function c3(c4, d3, e2, f, g) {
            for (var h = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], i = 0; i < 4; i++)
              h[i][3] = g[i];
            for (var i = 0; i < 3; i++)
              for (var j = 0; j < 3; j++)
                h[3][i] += c4[j] * h[j][i];
            var k = f[0], l = f[1], m = f[2], n = f[3], o = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
            o[0][0] = 1 - 2 * (l * l + m * m), o[0][1] = 2 * (k * l - m * n), o[0][2] = 2 * (k * m + l * n), o[1][0] = 2 * (k * l + m * n), o[1][1] = 1 - 2 * (k * k + m * m), o[1][2] = 2 * (l * m - k * n), o[2][0] = 2 * (k * m - l * n), o[2][1] = 2 * (l * m + k * n), o[2][2] = 1 - 2 * (k * k + l * l), h = a3(h, o);
            var p = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
            e2[2] && (p[2][1] = e2[2], h = a3(h, p)), e2[1] && (p[2][1] = 0, p[2][0] = e2[0], h = a3(h, p)), e2[0] && (p[2][0] = 0, p[1][0] = e2[0], h = a3(h, p));
            for (var i = 0; i < 3; i++)
              for (var j = 0; j < 3; j++)
                h[i][j] *= d3[i];
            return b3(h) ? [h[0][0], h[0][1], h[1][0], h[1][1], h[3][0], h[3][1]] : h[0].concat(h[1], h[2], h[3]);
          }
          return c3;
        }();
        a2.composeMatrix = e, a2.quat = d2;
      }(b), function(a2, b2, c2) {
        a2.sequenceNumber = 0;
        var d2 = function(a3, b3, c3) {
          this.target = a3, this.currentTime = b3, this.timelineTime = c3, this.type = "finish", this.bubbles = false, this.cancelable = false, this.currentTarget = a3, this.defaultPrevented = false, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now();
        };
        b2.Animation = function(b3) {
          this.id = "", b3 && b3._id && (this.id = b3._id), this._sequenceNumber = a2.sequenceNumber++, this._currentTime = 0, this._startTime = null, this._paused = false, this._playbackRate = 1, this._inTimeline = true, this._finishedFlag = true, this.onfinish = null, this._finishHandlers = [], this._effect = b3, this._inEffect = this._effect._update(0), this._idle = true, this._currentTimePending = false;
        }, b2.Animation.prototype = { _ensureAlive: function() {
          this.playbackRate < 0 && this.currentTime === 0 ? this._inEffect = this._effect._update(-1) : this._inEffect = this._effect._update(this.currentTime), this._inTimeline || !this._inEffect && this._finishedFlag || (this._inTimeline = true, b2.timeline._animations.push(this));
        }, _tickCurrentTime: function(a3, b3) {
          a3 != this._currentTime && (this._currentTime = a3, this._isFinished && !b3 && (this._currentTime = this._playbackRate > 0 ? this._totalDuration : 0), this._ensureAlive());
        }, get currentTime() {
          return this._idle || this._currentTimePending ? null : this._currentTime;
        }, set currentTime(a3) {
          a3 = +a3, isNaN(a3) || (b2.restart(), this._paused || this._startTime == null || (this._startTime = this._timeline.currentTime - a3 / this._playbackRate), this._currentTimePending = false, this._currentTime != a3 && (this._idle && (this._idle = false, this._paused = true), this._tickCurrentTime(a3, true), b2.applyDirtiedAnimation(this)));
        }, get startTime() {
          return this._startTime;
        }, set startTime(a3) {
          a3 = +a3, isNaN(a3) || this._paused || this._idle || (this._startTime = a3, this._tickCurrentTime((this._timeline.currentTime - this._startTime) * this.playbackRate), b2.applyDirtiedAnimation(this));
        }, get playbackRate() {
          return this._playbackRate;
        }, set playbackRate(a3) {
          if (a3 != this._playbackRate) {
            var c3 = this.currentTime;
            this._playbackRate = a3, this._startTime = null, this.playState != "paused" && this.playState != "idle" && (this._finishedFlag = false, this._idle = false, this._ensureAlive(), b2.applyDirtiedAnimation(this)), c3 != null && (this.currentTime = c3);
          }
        }, get _isFinished() {
          return !this._idle && (this._playbackRate > 0 && this._currentTime >= this._totalDuration || this._playbackRate < 0 && this._currentTime <= 0);
        }, get _totalDuration() {
          return this._effect._totalDuration;
        }, get playState() {
          return this._idle ? "idle" : this._startTime == null && !this._paused && this.playbackRate != 0 || this._currentTimePending ? "pending" : this._paused ? "paused" : this._isFinished ? "finished" : "running";
        }, _rewind: function() {
          if (this._playbackRate >= 0)
            this._currentTime = 0;
          else {
            if (!(this._totalDuration < 1 / 0))
              throw new DOMException("Unable to rewind negative playback rate animation with infinite duration", "InvalidStateError");
            this._currentTime = this._totalDuration;
          }
        }, play: function() {
          this._paused = false, (this._isFinished || this._idle) && (this._rewind(), this._startTime = null), this._finishedFlag = false, this._idle = false, this._ensureAlive(), b2.applyDirtiedAnimation(this);
        }, pause: function() {
          this._isFinished || this._paused || this._idle ? this._idle && (this._rewind(), this._idle = false) : this._currentTimePending = true, this._startTime = null, this._paused = true;
        }, finish: function() {
          this._idle || (this.currentTime = this._playbackRate > 0 ? this._totalDuration : 0, this._startTime = this._totalDuration - this.currentTime, this._currentTimePending = false, b2.applyDirtiedAnimation(this));
        }, cancel: function() {
          this._inEffect && (this._inEffect = false, this._idle = true, this._paused = false, this._finishedFlag = true, this._currentTime = 0, this._startTime = null, this._effect._update(null), b2.applyDirtiedAnimation(this));
        }, reverse: function() {
          this.playbackRate *= -1, this.play();
        }, addEventListener: function(a3, b3) {
          typeof b3 == "function" && a3 == "finish" && this._finishHandlers.push(b3);
        }, removeEventListener: function(a3, b3) {
          if (a3 == "finish") {
            var c3 = this._finishHandlers.indexOf(b3);
            c3 >= 0 && this._finishHandlers.splice(c3, 1);
          }
        }, _fireEvents: function(a3) {
          if (this._isFinished) {
            if (!this._finishedFlag) {
              var b3 = new d2(this, this._currentTime, a3), c3 = this._finishHandlers.concat(this.onfinish ? [this.onfinish] : []);
              setTimeout(function() {
                c3.forEach(function(a4) {
                  a4.call(b3.target, b3);
                });
              }, 0), this._finishedFlag = true;
            }
          } else
            this._finishedFlag = false;
        }, _tick: function(a3, b3) {
          this._idle || this._paused || (this._startTime == null ? b3 && (this.startTime = a3 - this._currentTime / this.playbackRate) : this._isFinished || this._tickCurrentTime((a3 - this._startTime) * this.playbackRate)), b3 && (this._currentTimePending = false, this._fireEvents(a3));
        }, get _needsTick() {
          return this.playState in { pending: 1, running: 1 } || !this._finishedFlag;
        }, _targetAnimations: function() {
          var a3 = this._effect._target;
          return a3._activeAnimations || (a3._activeAnimations = []), a3._activeAnimations;
        }, _markTarget: function() {
          var a3 = this._targetAnimations();
          a3.indexOf(this) === -1 && a3.push(this);
        }, _unmarkTarget: function() {
          var a3 = this._targetAnimations(), b3 = a3.indexOf(this);
          b3 !== -1 && a3.splice(b3, 1);
        } };
      }(a, b), function(a2, b2, c2) {
        function d2(a3) {
          var b3 = j;
          j = [], a3 < q.currentTime && (a3 = q.currentTime), q._animations.sort(e), q._animations = h(a3, true, q._animations)[0], b3.forEach(function(b4) {
            b4[1](a3);
          }), g(), l = void 0;
        }
        function e(a3, b3) {
          return a3._sequenceNumber - b3._sequenceNumber;
        }
        function f() {
          this._animations = [], this.currentTime = window.performance && performance.now ? performance.now() : 0;
        }
        function g() {
          o.forEach(function(a3) {
            a3();
          }), o.length = 0;
        }
        function h(a3, c3, d3) {
          p = true, n = false, b2.timeline.currentTime = a3, m = false;
          var e2 = [], f2 = [], g2 = [], h2 = [];
          return d3.forEach(function(b3) {
            b3._tick(a3, c3), b3._inEffect ? (f2.push(b3._effect), b3._markTarget()) : (e2.push(b3._effect), b3._unmarkTarget()), b3._needsTick && (m = true);
            var d4 = b3._inEffect || b3._needsTick;
            b3._inTimeline = d4, d4 ? g2.push(b3) : h2.push(b3);
          }), o.push.apply(o, e2), o.push.apply(o, f2), m && requestAnimationFrame(function() {
          }), p = false, [g2, h2];
        }
        var i = window.requestAnimationFrame, j = [], k = 0;
        window.requestAnimationFrame = function(a3) {
          var b3 = k++;
          return j.length == 0 && i(d2), j.push([b3, a3]), b3;
        }, window.cancelAnimationFrame = function(a3) {
          j.forEach(function(b3) {
            b3[0] == a3 && (b3[1] = function() {
            });
          });
        }, f.prototype = { _play: function(c3) {
          c3._timing = a2.normalizeTimingInput(c3.timing);
          var d3 = new b2.Animation(c3);
          return d3._idle = false, d3._timeline = this, this._animations.push(d3), b2.restart(), b2.applyDirtiedAnimation(d3), d3;
        } };
        var l = void 0, m = false, n = false;
        b2.restart = function() {
          return m || (m = true, requestAnimationFrame(function() {
          }), n = true), n;
        }, b2.applyDirtiedAnimation = function(a3) {
          if (!p) {
            a3._markTarget();
            var c3 = a3._targetAnimations();
            c3.sort(e), h(b2.timeline.currentTime, false, c3.slice())[1].forEach(function(a4) {
              var b3 = q._animations.indexOf(a4);
              b3 !== -1 && q._animations.splice(b3, 1);
            }), g();
          }
        };
        var o = [], p = false, q = new f();
        b2.timeline = q;
      }(a, b), function(a2, b2) {
        function c2(a3, b3) {
          for (var c3 = 0, d3 = 0; d3 < a3.length; d3++)
            c3 += a3[d3] * b3[d3];
          return c3;
        }
        function d2(a3, b3) {
          return [a3[0] * b3[0] + a3[4] * b3[1] + a3[8] * b3[2] + a3[12] * b3[3], a3[1] * b3[0] + a3[5] * b3[1] + a3[9] * b3[2] + a3[13] * b3[3], a3[2] * b3[0] + a3[6] * b3[1] + a3[10] * b3[2] + a3[14] * b3[3], a3[3] * b3[0] + a3[7] * b3[1] + a3[11] * b3[2] + a3[15] * b3[3], a3[0] * b3[4] + a3[4] * b3[5] + a3[8] * b3[6] + a3[12] * b3[7], a3[1] * b3[4] + a3[5] * b3[5] + a3[9] * b3[6] + a3[13] * b3[7], a3[2] * b3[4] + a3[6] * b3[5] + a3[10] * b3[6] + a3[14] * b3[7], a3[3] * b3[4] + a3[7] * b3[5] + a3[11] * b3[6] + a3[15] * b3[7], a3[0] * b3[8] + a3[4] * b3[9] + a3[8] * b3[10] + a3[12] * b3[11], a3[1] * b3[8] + a3[5] * b3[9] + a3[9] * b3[10] + a3[13] * b3[11], a3[2] * b3[8] + a3[6] * b3[9] + a3[10] * b3[10] + a3[14] * b3[11], a3[3] * b3[8] + a3[7] * b3[9] + a3[11] * b3[10] + a3[15] * b3[11], a3[0] * b3[12] + a3[4] * b3[13] + a3[8] * b3[14] + a3[12] * b3[15], a3[1] * b3[12] + a3[5] * b3[13] + a3[9] * b3[14] + a3[13] * b3[15], a3[2] * b3[12] + a3[6] * b3[13] + a3[10] * b3[14] + a3[14] * b3[15], a3[3] * b3[12] + a3[7] * b3[13] + a3[11] * b3[14] + a3[15] * b3[15]];
        }
        function e(a3) {
          var b3 = a3.rad || 0;
          return ((a3.deg || 0) / 360 + (a3.grad || 0) / 400 + (a3.turn || 0)) * (2 * Math.PI) + b3;
        }
        function f(a3) {
          switch (a3.t) {
            case "rotatex":
              var b3 = e(a3.d[0]);
              return [1, 0, 0, 0, 0, Math.cos(b3), Math.sin(b3), 0, 0, -Math.sin(b3), Math.cos(b3), 0, 0, 0, 0, 1];
            case "rotatey":
              var b3 = e(a3.d[0]);
              return [Math.cos(b3), 0, -Math.sin(b3), 0, 0, 1, 0, 0, Math.sin(b3), 0, Math.cos(b3), 0, 0, 0, 0, 1];
            case "rotate":
            case "rotatez":
              var b3 = e(a3.d[0]);
              return [Math.cos(b3), Math.sin(b3), 0, 0, -Math.sin(b3), Math.cos(b3), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            case "rotate3d":
              var c3 = a3.d[0], d3 = a3.d[1], f2 = a3.d[2], b3 = e(a3.d[3]), g2 = c3 * c3 + d3 * d3 + f2 * f2;
              if (g2 === 0)
                c3 = 1, d3 = 0, f2 = 0;
              else if (g2 !== 1) {
                var h2 = Math.sqrt(g2);
                c3 /= h2, d3 /= h2, f2 /= h2;
              }
              var i2 = Math.sin(b3 / 2), j = i2 * Math.cos(b3 / 2), k = i2 * i2;
              return [1 - 2 * (d3 * d3 + f2 * f2) * k, 2 * (c3 * d3 * k + f2 * j), 2 * (c3 * f2 * k - d3 * j), 0, 2 * (c3 * d3 * k - f2 * j), 1 - 2 * (c3 * c3 + f2 * f2) * k, 2 * (d3 * f2 * k + c3 * j), 0, 2 * (c3 * f2 * k + d3 * j), 2 * (d3 * f2 * k - c3 * j), 1 - 2 * (c3 * c3 + d3 * d3) * k, 0, 0, 0, 0, 1];
            case "scale":
              return [a3.d[0], 0, 0, 0, 0, a3.d[1], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            case "scalex":
              return [a3.d[0], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            case "scaley":
              return [1, 0, 0, 0, 0, a3.d[0], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            case "scalez":
              return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, a3.d[0], 0, 0, 0, 0, 1];
            case "scale3d":
              return [a3.d[0], 0, 0, 0, 0, a3.d[1], 0, 0, 0, 0, a3.d[2], 0, 0, 0, 0, 1];
            case "skew":
              var l = e(a3.d[0]), m = e(a3.d[1]);
              return [1, Math.tan(m), 0, 0, Math.tan(l), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            case "skewx":
              var b3 = e(a3.d[0]);
              return [1, 0, 0, 0, Math.tan(b3), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            case "skewy":
              var b3 = e(a3.d[0]);
              return [1, Math.tan(b3), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            case "translate":
              var c3 = a3.d[0].px || 0, d3 = a3.d[1].px || 0;
              return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, c3, d3, 0, 1];
            case "translatex":
              var c3 = a3.d[0].px || 0;
              return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, c3, 0, 0, 1];
            case "translatey":
              var d3 = a3.d[0].px || 0;
              return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, d3, 0, 1];
            case "translatez":
              var f2 = a3.d[0].px || 0;
              return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, f2, 1];
            case "translate3d":
              var c3 = a3.d[0].px || 0, d3 = a3.d[1].px || 0, f2 = a3.d[2].px || 0;
              return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, c3, d3, f2, 1];
            case "perspective":
              return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, a3.d[0].px ? -1 / a3.d[0].px : 0, 0, 0, 0, 1];
            case "matrix":
              return [a3.d[0], a3.d[1], 0, 0, a3.d[2], a3.d[3], 0, 0, 0, 0, 1, 0, a3.d[4], a3.d[5], 0, 1];
            case "matrix3d":
              return a3.d;
          }
        }
        function g(a3) {
          return a3.length === 0 ? [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] : a3.map(f).reduce(d2);
        }
        function h(a3) {
          return [i(g(a3))];
        }
        var i = function() {
          function a3(a4) {
            return a4[0][0] * a4[1][1] * a4[2][2] + a4[1][0] * a4[2][1] * a4[0][2] + a4[2][0] * a4[0][1] * a4[1][2] - a4[0][2] * a4[1][1] * a4[2][0] - a4[1][2] * a4[2][1] * a4[0][0] - a4[2][2] * a4[0][1] * a4[1][0];
          }
          function b3(b4) {
            for (var c3 = 1 / a3(b4), d4 = b4[0][0], e3 = b4[0][1], f3 = b4[0][2], g3 = b4[1][0], h3 = b4[1][1], i3 = b4[1][2], j2 = b4[2][0], k = b4[2][1], l = b4[2][2], m = [[(h3 * l - i3 * k) * c3, (f3 * k - e3 * l) * c3, (e3 * i3 - f3 * h3) * c3, 0], [(i3 * j2 - g3 * l) * c3, (d4 * l - f3 * j2) * c3, (f3 * g3 - d4 * i3) * c3, 0], [(g3 * k - h3 * j2) * c3, (j2 * e3 - d4 * k) * c3, (d4 * h3 - e3 * g3) * c3, 0]], n = [], o = 0; o < 3; o++) {
              for (var p = 0, q = 0; q < 3; q++)
                p += b4[3][q] * m[q][o];
              n.push(p);
            }
            return n.push(1), m.push(n), m;
          }
          function d3(a4) {
            return [[a4[0][0], a4[1][0], a4[2][0], a4[3][0]], [a4[0][1], a4[1][1], a4[2][1], a4[3][1]], [a4[0][2], a4[1][2], a4[2][2], a4[3][2]], [a4[0][3], a4[1][3], a4[2][3], a4[3][3]]];
          }
          function e2(a4, b4) {
            for (var c3 = [], d4 = 0; d4 < 4; d4++) {
              for (var e3 = 0, f3 = 0; f3 < 4; f3++)
                e3 += a4[f3] * b4[f3][d4];
              c3.push(e3);
            }
            return c3;
          }
          function f2(a4) {
            var b4 = g2(a4);
            return [a4[0] / b4, a4[1] / b4, a4[2] / b4];
          }
          function g2(a4) {
            return Math.sqrt(a4[0] * a4[0] + a4[1] * a4[1] + a4[2] * a4[2]);
          }
          function h2(a4, b4, c3, d4) {
            return [c3 * a4[0] + d4 * b4[0], c3 * a4[1] + d4 * b4[1], c3 * a4[2] + d4 * b4[2]];
          }
          function i2(a4, b4) {
            return [a4[1] * b4[2] - a4[2] * b4[1], a4[2] * b4[0] - a4[0] * b4[2], a4[0] * b4[1] - a4[1] * b4[0]];
          }
          function j(j2) {
            var k = [j2.slice(0, 4), j2.slice(4, 8), j2.slice(8, 12), j2.slice(12, 16)];
            if (k[3][3] !== 1)
              return null;
            for (var l = [], m = 0; m < 4; m++)
              l.push(k[m].slice());
            for (var m = 0; m < 3; m++)
              l[m][3] = 0;
            if (a3(l) === 0)
              return null;
            var n, o = [];
            k[0][3] || k[1][3] || k[2][3] ? (o.push(k[0][3]), o.push(k[1][3]), o.push(k[2][3]), o.push(k[3][3]), n = e2(o, d3(b3(l)))) : n = [0, 0, 0, 1];
            var p = k[3].slice(0, 3), q = [];
            q.push(k[0].slice(0, 3));
            var r = [];
            r.push(g2(q[0])), q[0] = f2(q[0]);
            var s = [];
            q.push(k[1].slice(0, 3)), s.push(c2(q[0], q[1])), q[1] = h2(q[1], q[0], 1, -s[0]), r.push(g2(q[1])), q[1] = f2(q[1]), s[0] /= r[1], q.push(k[2].slice(0, 3)), s.push(c2(q[0], q[2])), q[2] = h2(q[2], q[0], 1, -s[1]), s.push(c2(q[1], q[2])), q[2] = h2(q[2], q[1], 1, -s[2]), r.push(g2(q[2])), q[2] = f2(q[2]), s[1] /= r[2], s[2] /= r[2];
            var t = i2(q[1], q[2]);
            if (c2(q[0], t) < 0)
              for (var m = 0; m < 3; m++)
                r[m] *= -1, q[m][0] *= -1, q[m][1] *= -1, q[m][2] *= -1;
            var u, v, w = q[0][0] + q[1][1] + q[2][2] + 1;
            return w > 1e-4 ? (u = 0.5 / Math.sqrt(w), v = [(q[2][1] - q[1][2]) * u, (q[0][2] - q[2][0]) * u, (q[1][0] - q[0][1]) * u, 0.25 / u]) : q[0][0] > q[1][1] && q[0][0] > q[2][2] ? (u = 2 * Math.sqrt(1 + q[0][0] - q[1][1] - q[2][2]), v = [0.25 * u, (q[0][1] + q[1][0]) / u, (q[0][2] + q[2][0]) / u, (q[2][1] - q[1][2]) / u]) : q[1][1] > q[2][2] ? (u = 2 * Math.sqrt(1 + q[1][1] - q[0][0] - q[2][2]), v = [(q[0][1] + q[1][0]) / u, 0.25 * u, (q[1][2] + q[2][1]) / u, (q[0][2] - q[2][0]) / u]) : (u = 2 * Math.sqrt(1 + q[2][2] - q[0][0] - q[1][1]), v = [(q[0][2] + q[2][0]) / u, (q[1][2] + q[2][1]) / u, 0.25 * u, (q[1][0] - q[0][1]) / u]), [p, r, s, v, n];
          }
          return j;
        }();
        a2.dot = c2, a2.makeMatrixDecomposition = h, a2.transformListToMatrix = g;
      }(b), function(a2) {
        function b2(a3, b3) {
          var c3 = a3.exec(b3);
          if (c3)
            return c3 = a3.ignoreCase ? c3[0].toLowerCase() : c3[0], [c3, b3.substr(c3.length)];
        }
        function c2(a3, b3) {
          b3 = b3.replace(/^\s*/, "");
          var c3 = a3(b3);
          if (c3)
            return [c3[0], c3[1].replace(/^\s*/, "")];
        }
        function d2(a3, d3, e2) {
          a3 = c2.bind(null, a3);
          for (var f2 = []; ; ) {
            var g2 = a3(e2);
            if (!g2)
              return [f2, e2];
            if (f2.push(g2[0]), e2 = g2[1], !(g2 = b2(d3, e2)) || g2[1] == "")
              return [f2, e2];
            e2 = g2[1];
          }
        }
        function e(a3, b3) {
          for (var c3 = 0, d3 = 0; d3 < b3.length && (!/\s|,/.test(b3[d3]) || c3 != 0); d3++)
            if (b3[d3] == "(")
              c3++;
            else if (b3[d3] == ")" && (c3--, c3 == 0 && d3++, c3 <= 0))
              break;
          var e2 = a3(b3.substr(0, d3));
          return e2 == void 0 ? void 0 : [e2, b3.substr(d3)];
        }
        function f(a3, b3) {
          for (var c3 = a3, d3 = b3; c3 && d3; )
            c3 > d3 ? c3 %= d3 : d3 %= c3;
          return c3 = a3 * b3 / (c3 + d3);
        }
        function g(a3) {
          return function(b3) {
            var c3 = a3(b3);
            return c3 && (c3[0] = void 0), c3;
          };
        }
        function h(a3, b3) {
          return function(c3) {
            return a3(c3) || [b3, c3];
          };
        }
        function i(b3, c3) {
          for (var d3 = [], e2 = 0; e2 < b3.length; e2++) {
            var f2 = a2.consumeTrimmed(b3[e2], c3);
            if (!f2 || f2[0] == "")
              return;
            f2[0] !== void 0 && d3.push(f2[0]), c3 = f2[1];
          }
          if (c3 == "")
            return d3;
        }
        function j(a3, b3, c3, d3, e2) {
          for (var g2 = [], h2 = [], i2 = [], j2 = f(d3.length, e2.length), k2 = 0; k2 < j2; k2++) {
            var l = b3(d3[k2 % d3.length], e2[k2 % e2.length]);
            if (!l)
              return;
            g2.push(l[0]), h2.push(l[1]), i2.push(l[2]);
          }
          return [g2, h2, function(b4) {
            var d4 = b4.map(function(a4, b5) {
              return i2[b5](a4);
            }).join(c3);
            return a3 ? a3(d4) : d4;
          }];
        }
        function k(a3, b3, c3) {
          for (var d3 = [], e2 = [], f2 = [], g2 = 0, h2 = 0; h2 < c3.length; h2++)
            if (typeof c3[h2] == "function") {
              var i2 = c3[h2](a3[g2], b3[g2++]);
              d3.push(i2[0]), e2.push(i2[1]), f2.push(i2[2]);
            } else
              !function(a4) {
                d3.push(false), e2.push(false), f2.push(function() {
                  return c3[a4];
                });
              }(h2);
          return [d3, e2, function(a4) {
            for (var b4 = "", c4 = 0; c4 < a4.length; c4++)
              b4 += f2[c4](a4[c4]);
            return b4;
          }];
        }
        a2.consumeToken = b2, a2.consumeTrimmed = c2, a2.consumeRepeated = d2, a2.consumeParenthesised = e, a2.ignore = g, a2.optional = h, a2.consumeList = i, a2.mergeNestedRepeated = j.bind(null, null), a2.mergeWrappedNestedRepeated = j, a2.mergeList = k;
      }(b), function(a2) {
        function b2(b3) {
          function c3(b4) {
            var c4 = a2.consumeToken(/^inset/i, b4);
            return c4 ? (d3.inset = true, c4) : (c4 = a2.consumeLengthOrPercent(b4)) ? (d3.lengths.push(c4[0]), c4) : (c4 = a2.consumeColor(b4), c4 ? (d3.color = c4[0], c4) : void 0);
          }
          var d3 = { inset: false, lengths: [], color: null }, e2 = a2.consumeRepeated(c3, /^/, b3);
          if (e2 && e2[0].length)
            return [d3, e2[1]];
        }
        function c2(c3) {
          var d3 = a2.consumeRepeated(b2, /^,/, c3);
          if (d3 && d3[1] == "")
            return d3[0];
        }
        function d2(b3, c3) {
          for (; b3.lengths.length < Math.max(b3.lengths.length, c3.lengths.length); )
            b3.lengths.push({ px: 0 });
          for (; c3.lengths.length < Math.max(b3.lengths.length, c3.lengths.length); )
            c3.lengths.push({ px: 0 });
          if (b3.inset == c3.inset && !!b3.color == !!c3.color) {
            for (var d3, e2 = [], f2 = [[], 0], g = [[], 0], h = 0; h < b3.lengths.length; h++) {
              var i = a2.mergeDimensions(b3.lengths[h], c3.lengths[h], h == 2);
              f2[0].push(i[0]), g[0].push(i[1]), e2.push(i[2]);
            }
            if (b3.color && c3.color) {
              var j = a2.mergeColors(b3.color, c3.color);
              f2[1] = j[0], g[1] = j[1], d3 = j[2];
            }
            return [f2, g, function(a3) {
              for (var c4 = b3.inset ? "inset " : " ", f3 = 0; f3 < e2.length; f3++)
                c4 += e2[f3](a3[0][f3]) + " ";
              return d3 && (c4 += d3(a3[1])), c4;
            }];
          }
        }
        function e(b3, c3, d3, e2) {
          function f2(a3) {
            return { inset: a3, color: [0, 0, 0, 0], lengths: [{ px: 0 }, { px: 0 }, { px: 0 }, { px: 0 }] };
          }
          for (var g = [], h = [], i = 0; i < d3.length || i < e2.length; i++) {
            var j = d3[i] || f2(e2[i].inset), k = e2[i] || f2(d3[i].inset);
            g.push(j), h.push(k);
          }
          return a2.mergeNestedRepeated(b3, c3, g, h);
        }
        var f = e.bind(null, d2, ", ");
        a2.addPropertiesHandler(c2, f, ["box-shadow", "text-shadow"]);
      }(b), function(a2, b2) {
        function c2(a3) {
          return a3.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
        }
        function d2(a3, b3, c3) {
          return Math.min(b3, Math.max(a3, c3));
        }
        function e(a3) {
          if (/^\s*[-+]?(\d*\.)?\d+\s*$/.test(a3))
            return Number(a3);
        }
        function f(a3, b3) {
          return [a3, b3, c2];
        }
        function g(a3, b3) {
          if (a3 != 0)
            return i(0, 1 / 0)(a3, b3);
        }
        function h(a3, b3) {
          return [a3, b3, function(a4) {
            return Math.round(d2(1, 1 / 0, a4));
          }];
        }
        function i(a3, b3) {
          return function(e2, f2) {
            return [e2, f2, function(e3) {
              return c2(d2(a3, b3, e3));
            }];
          };
        }
        function j(a3) {
          var b3 = a3.trim().split(/\s*[\s,]\s*/);
          if (b3.length !== 0) {
            for (var c3 = [], d3 = 0; d3 < b3.length; d3++) {
              var f2 = e(b3[d3]);
              if (f2 === void 0)
                return;
              c3.push(f2);
            }
            return c3;
          }
        }
        function k(a3, b3) {
          if (a3.length == b3.length)
            return [a3, b3, function(a4) {
              return a4.map(c2).join(" ");
            }];
        }
        function l(a3, b3) {
          return [a3, b3, Math.round];
        }
        a2.clamp = d2, a2.addPropertiesHandler(j, k, ["stroke-dasharray"]), a2.addPropertiesHandler(e, i(0, 1 / 0), ["border-image-width", "line-height"]), a2.addPropertiesHandler(e, i(0, 1), ["opacity", "shape-image-threshold"]), a2.addPropertiesHandler(e, g, ["flex-grow", "flex-shrink"]), a2.addPropertiesHandler(e, h, ["orphans", "widows"]), a2.addPropertiesHandler(e, l, ["z-index"]), a2.parseNumber = e, a2.parseNumberList = j, a2.mergeNumbers = f, a2.numberToString = c2;
      }(b), function(a2, b2) {
        function c2(a3, b3) {
          if (a3 == "visible" || b3 == "visible")
            return [0, 1, function(c3) {
              return c3 <= 0 ? a3 : c3 >= 1 ? b3 : "visible";
            }];
        }
        a2.addPropertiesHandler(String, c2, ["visibility"]);
      }(b), function(a2, b2) {
        function c2(a3) {
          a3 = a3.trim(), f.fillStyle = "#000", f.fillStyle = a3;
          var b3 = f.fillStyle;
          if (f.fillStyle = "#fff", f.fillStyle = a3, b3 == f.fillStyle) {
            f.fillRect(0, 0, 1, 1);
            var c3 = f.getImageData(0, 0, 1, 1).data;
            f.clearRect(0, 0, 1, 1);
            var d3 = c3[3] / 255;
            return [c3[0] * d3, c3[1] * d3, c3[2] * d3, d3];
          }
        }
        function d2(b3, c3) {
          return [b3, c3, function(b4) {
            function c4(a3) {
              return Math.max(0, Math.min(255, a3));
            }
            if (b4[3])
              for (var d3 = 0; d3 < 3; d3++)
                b4[d3] = Math.round(c4(b4[d3] / b4[3]));
            return b4[3] = a2.numberToString(a2.clamp(0, 1, b4[3])), "rgba(" + b4.join(",") + ")";
          }];
        }
        var e = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        e.width = e.height = 1;
        var f = e.getContext("2d");
        a2.addPropertiesHandler(c2, d2, ["background-color", "border-bottom-color", "border-left-color", "border-right-color", "border-top-color", "color", "fill", "flood-color", "lighting-color", "outline-color", "stop-color", "stroke", "text-decoration-color"]), a2.consumeColor = a2.consumeParenthesised.bind(null, c2), a2.mergeColors = d2;
      }(b), function(a2, b2) {
        function c2(a3) {
          function b3() {
            var b4 = h2.exec(a3);
            g2 = b4 ? b4[0] : void 0;
          }
          function c3() {
            var a4 = Number(g2);
            return b3(), a4;
          }
          function d3() {
            if (g2 !== "(")
              return c3();
            b3();
            var a4 = f2();
            return g2 !== ")" ? NaN : (b3(), a4);
          }
          function e2() {
            for (var a4 = d3(); g2 === "*" || g2 === "/"; ) {
              var c4 = g2;
              b3();
              var e3 = d3();
              c4 === "*" ? a4 *= e3 : a4 /= e3;
            }
            return a4;
          }
          function f2() {
            for (var a4 = e2(); g2 === "+" || g2 === "-"; ) {
              var c4 = g2;
              b3();
              var d4 = e2();
              c4 === "+" ? a4 += d4 : a4 -= d4;
            }
            return a4;
          }
          var g2, h2 = /([\+\-\w\.]+|[\(\)\*\/])/g;
          return b3(), f2();
        }
        function d2(a3, b3) {
          if ((b3 = b3.trim().toLowerCase()) == "0" && "px".search(a3) >= 0)
            return { px: 0 };
          if (/^[^(]*$|^calc/.test(b3)) {
            b3 = b3.replace(/calc\(/g, "(");
            var d3 = {};
            b3 = b3.replace(a3, function(a4) {
              return d3[a4] = null, "U" + a4;
            });
            for (var e2 = "U(" + a3.source + ")", f2 = b3.replace(/[-+]?(\d*\.)?\d+([Ee][-+]?\d+)?/g, "N").replace(new RegExp("N" + e2, "g"), "D").replace(/\s[+-]\s/g, "O").replace(/\s/g, ""), g2 = [/N\*(D)/g, /(N|D)[*\/]N/g, /(N|D)O\1/g, /\((N|D)\)/g], h2 = 0; h2 < g2.length; )
              g2[h2].test(f2) ? (f2 = f2.replace(g2[h2], "$1"), h2 = 0) : h2++;
            if (f2 == "D") {
              for (var i2 in d3) {
                var j2 = c2(b3.replace(new RegExp("U" + i2, "g"), "").replace(new RegExp(e2, "g"), "*0"));
                if (!isFinite(j2))
                  return;
                d3[i2] = j2;
              }
              return d3;
            }
          }
        }
        function e(a3, b3) {
          return f(a3, b3, true);
        }
        function f(b3, c3, d3) {
          var e2, f2 = [];
          for (e2 in b3)
            f2.push(e2);
          for (e2 in c3)
            f2.indexOf(e2) < 0 && f2.push(e2);
          return b3 = f2.map(function(a3) {
            return b3[a3] || 0;
          }), c3 = f2.map(function(a3) {
            return c3[a3] || 0;
          }), [b3, c3, function(b4) {
            var c4 = b4.map(function(c5, e3) {
              return b4.length == 1 && d3 && (c5 = Math.max(c5, 0)), a2.numberToString(c5) + f2[e3];
            }).join(" + ");
            return b4.length > 1 ? "calc(" + c4 + ")" : c4;
          }];
        }
        var g = "px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc", h = d2.bind(null, new RegExp(g, "g")), i = d2.bind(null, new RegExp(g + "|%", "g")), j = d2.bind(null, /deg|rad|grad|turn/g);
        a2.parseLength = h, a2.parseLengthOrPercent = i, a2.consumeLengthOrPercent = a2.consumeParenthesised.bind(null, i), a2.parseAngle = j, a2.mergeDimensions = f;
        var k = a2.consumeParenthesised.bind(null, h), l = a2.consumeRepeated.bind(void 0, k, /^/), m = a2.consumeRepeated.bind(void 0, l, /^,/);
        a2.consumeSizePairList = m;
        var n = function(a3) {
          var b3 = m(a3);
          if (b3 && b3[1] == "")
            return b3[0];
        }, o = a2.mergeNestedRepeated.bind(void 0, e, " "), p = a2.mergeNestedRepeated.bind(void 0, o, ",");
        a2.mergeNonNegativeSizePair = o, a2.addPropertiesHandler(n, p, ["background-size"]), a2.addPropertiesHandler(i, e, ["border-bottom-width", "border-image-width", "border-left-width", "border-right-width", "border-top-width", "flex-basis", "font-size", "height", "line-height", "max-height", "max-width", "outline-width", "width"]), a2.addPropertiesHandler(i, f, ["border-bottom-left-radius", "border-bottom-right-radius", "border-top-left-radius", "border-top-right-radius", "bottom", "left", "letter-spacing", "margin-bottom", "margin-left", "margin-right", "margin-top", "min-height", "min-width", "outline-offset", "padding-bottom", "padding-left", "padding-right", "padding-top", "perspective", "right", "shape-margin", "stroke-dashoffset", "text-indent", "top", "vertical-align", "word-spacing"]);
      }(b), function(a2, b2) {
        function c2(b3) {
          return a2.consumeLengthOrPercent(b3) || a2.consumeToken(/^auto/, b3);
        }
        function d2(b3) {
          var d3 = a2.consumeList([a2.ignore(a2.consumeToken.bind(null, /^rect/)), a2.ignore(a2.consumeToken.bind(null, /^\(/)), a2.consumeRepeated.bind(null, c2, /^,/), a2.ignore(a2.consumeToken.bind(null, /^\)/))], b3);
          if (d3 && d3[0].length == 4)
            return d3[0];
        }
        function e(b3, c3) {
          return b3 == "auto" || c3 == "auto" ? [true, false, function(d3) {
            var e2 = d3 ? b3 : c3;
            if (e2 == "auto")
              return "auto";
            var f2 = a2.mergeDimensions(e2, e2);
            return f2[2](f2[0]);
          }] : a2.mergeDimensions(b3, c3);
        }
        function f(a3) {
          return "rect(" + a3 + ")";
        }
        var g = a2.mergeWrappedNestedRepeated.bind(null, f, e, ", ");
        a2.parseBox = d2, a2.mergeBoxes = g, a2.addPropertiesHandler(d2, g, ["clip"]);
      }(b), function(a2, b2) {
        function c2(a3) {
          return function(b3) {
            var c3 = 0;
            return a3.map(function(a4) {
              return a4 === k ? b3[c3++] : a4;
            });
          };
        }
        function d2(a3) {
          return a3;
        }
        function e(b3) {
          if ((b3 = b3.toLowerCase().trim()) == "none")
            return [];
          for (var c3, d3 = /\s*(\w+)\(([^)]*)\)/g, e2 = [], f2 = 0; c3 = d3.exec(b3); ) {
            if (c3.index != f2)
              return;
            f2 = c3.index + c3[0].length;
            var g2 = c3[1], h2 = n[g2];
            if (!h2)
              return;
            var i2 = c3[2].split(","), j2 = h2[0];
            if (j2.length < i2.length)
              return;
            for (var k2 = [], o = 0; o < j2.length; o++) {
              var p, q = i2[o], r = j2[o];
              if ((p = q ? { A: function(b4) {
                return b4.trim() == "0" ? m : a2.parseAngle(b4);
              }, N: a2.parseNumber, T: a2.parseLengthOrPercent, L: a2.parseLength }[r.toUpperCase()](q) : { a: m, n: k2[0], t: l }[r]) === void 0)
                return;
              k2.push(p);
            }
            if (e2.push({ t: g2, d: k2 }), d3.lastIndex == b3.length)
              return e2;
          }
        }
        function f(a3) {
          return a3.toFixed(6).replace(".000000", "");
        }
        function g(b3, c3) {
          if (b3.decompositionPair !== c3) {
            b3.decompositionPair = c3;
            var d3 = a2.makeMatrixDecomposition(b3);
          }
          if (c3.decompositionPair !== b3) {
            c3.decompositionPair = b3;
            var e2 = a2.makeMatrixDecomposition(c3);
          }
          return d3[0] == null || e2[0] == null ? [[false], [true], function(a3) {
            return a3 ? c3[0].d : b3[0].d;
          }] : (d3[0].push(0), e2[0].push(1), [d3, e2, function(b4) {
            var c4 = a2.quat(d3[0][3], e2[0][3], b4[5]);
            return a2.composeMatrix(b4[0], b4[1], b4[2], c4, b4[4]).map(f).join(",");
          }]);
        }
        function h(a3) {
          return a3.replace(/[xy]/, "");
        }
        function i(a3) {
          return a3.replace(/(x|y|z|3d)?$/, "3d");
        }
        function j(b3, c3) {
          var d3 = a2.makeMatrixDecomposition && true, e2 = false;
          if (!b3.length || !c3.length) {
            b3.length || (e2 = true, b3 = c3, c3 = []);
            for (var f2 = 0; f2 < b3.length; f2++) {
              var j2 = b3[f2].t, k2 = b3[f2].d, l2 = j2.substr(0, 5) == "scale" ? 1 : 0;
              c3.push({ t: j2, d: k2.map(function(a3) {
                if (typeof a3 == "number")
                  return l2;
                var b4 = {};
                for (var c4 in a3)
                  b4[c4] = l2;
                return b4;
              }) });
            }
          }
          var m2 = function(a3, b4) {
            return a3 == "perspective" && b4 == "perspective" || (a3 == "matrix" || a3 == "matrix3d") && (b4 == "matrix" || b4 == "matrix3d");
          }, o = [], p = [], q = [];
          if (b3.length != c3.length) {
            if (!d3)
              return;
            var r = g(b3, c3);
            o = [r[0]], p = [r[1]], q = [["matrix", [r[2]]]];
          } else
            for (var f2 = 0; f2 < b3.length; f2++) {
              var j2, s = b3[f2].t, t = c3[f2].t, u = b3[f2].d, v = c3[f2].d, w = n[s], x = n[t];
              if (m2(s, t)) {
                if (!d3)
                  return;
                var r = g([b3[f2]], [c3[f2]]);
                o.push(r[0]), p.push(r[1]), q.push(["matrix", [r[2]]]);
              } else {
                if (s == t)
                  j2 = s;
                else if (w[2] && x[2] && h(s) == h(t))
                  j2 = h(s), u = w[2](u), v = x[2](v);
                else {
                  if (!w[1] || !x[1] || i(s) != i(t)) {
                    if (!d3)
                      return;
                    var r = g(b3, c3);
                    o = [r[0]], p = [r[1]], q = [["matrix", [r[2]]]];
                    break;
                  }
                  j2 = i(s), u = w[1](u), v = x[1](v);
                }
                for (var y = [], z = [], A = [], B = 0; B < u.length; B++) {
                  var C = typeof u[B] == "number" ? a2.mergeNumbers : a2.mergeDimensions, r = C(u[B], v[B]);
                  y[B] = r[0], z[B] = r[1], A.push(r[2]);
                }
                o.push(y), p.push(z), q.push([j2, A]);
              }
            }
          if (e2) {
            var D = o;
            o = p, p = D;
          }
          return [o, p, function(a3) {
            return a3.map(function(a4, b4) {
              var c4 = a4.map(function(a5, c5) {
                return q[b4][1][c5](a5);
              }).join(",");
              return q[b4][0] == "matrix" && c4.split(",").length == 16 && (q[b4][0] = "matrix3d"), q[b4][0] + "(" + c4 + ")";
            }).join(" ");
          }];
        }
        var k = null, l = { px: 0 }, m = { deg: 0 }, n = { matrix: ["NNNNNN", [k, k, 0, 0, k, k, 0, 0, 0, 0, 1, 0, k, k, 0, 1], d2], matrix3d: ["NNNNNNNNNNNNNNNN", d2], rotate: ["A"], rotatex: ["A"], rotatey: ["A"], rotatez: ["A"], rotate3d: ["NNNA"], perspective: ["L"], scale: ["Nn", c2([k, k, 1]), d2], scalex: ["N", c2([k, 1, 1]), c2([k, 1])], scaley: ["N", c2([1, k, 1]), c2([1, k])], scalez: ["N", c2([1, 1, k])], scale3d: ["NNN", d2], skew: ["Aa", null, d2], skewx: ["A", null, c2([k, m])], skewy: ["A", null, c2([m, k])], translate: ["Tt", c2([k, k, l]), d2], translatex: ["T", c2([k, l, l]), c2([k, l])], translatey: ["T", c2([l, k, l]), c2([l, k])], translatez: ["L", c2([l, l, k])], translate3d: ["TTL", d2] };
        a2.addPropertiesHandler(e, j, ["transform"]), a2.transformToSvgMatrix = function(b3) {
          var c3 = a2.transformListToMatrix(e(b3));
          return "matrix(" + f(c3[0]) + " " + f(c3[1]) + " " + f(c3[4]) + " " + f(c3[5]) + " " + f(c3[12]) + " " + f(c3[13]) + ")";
        };
      }(b), function(a2) {
        function b2(a3) {
          var b3 = Number(a3);
          if (!(isNaN(b3) || b3 < 100 || b3 > 900 || b3 % 100 != 0))
            return b3;
        }
        function c2(b3) {
          return b3 = 100 * Math.round(b3 / 100), b3 = a2.clamp(100, 900, b3), b3 === 400 ? "normal" : b3 === 700 ? "bold" : String(b3);
        }
        function d2(a3, b3) {
          return [a3, b3, c2];
        }
        a2.addPropertiesHandler(b2, d2, ["font-weight"]);
      }(b), function(a2) {
        function b2(a3) {
          var b3 = {};
          for (var c3 in a3)
            b3[c3] = -a3[c3];
          return b3;
        }
        function c2(b3) {
          return a2.consumeToken(/^(left|center|right|top|bottom)\b/i, b3) || a2.consumeLengthOrPercent(b3);
        }
        function d2(b3, d3) {
          var e2 = a2.consumeRepeated(c2, /^/, d3);
          if (e2 && e2[1] == "") {
            var f2 = e2[0];
            if (f2[0] = f2[0] || "center", f2[1] = f2[1] || "center", b3 == 3 && (f2[2] = f2[2] || { px: 0 }), f2.length == b3) {
              if (/top|bottom/.test(f2[0]) || /left|right/.test(f2[1])) {
                var h2 = f2[0];
                f2[0] = f2[1], f2[1] = h2;
              }
              if (/left|right|center|Object/.test(f2[0]) && /top|bottom|center|Object/.test(f2[1]))
                return f2.map(function(a3) {
                  return typeof a3 == "object" ? a3 : g[a3];
                });
            }
          }
        }
        function e(d3) {
          var e2 = a2.consumeRepeated(c2, /^/, d3);
          if (e2) {
            for (var f2 = e2[0], h2 = [{ "%": 50 }, { "%": 50 }], i2 = 0, j = false, k = 0; k < f2.length; k++) {
              var l = f2[k];
              typeof l == "string" ? (j = /bottom|right/.test(l), i2 = { left: 0, right: 0, center: i2, top: 1, bottom: 1 }[l], h2[i2] = g[l], l == "center" && i2++) : (j && (l = b2(l), l["%"] = (l["%"] || 0) + 100), h2[i2] = l, i2++, j = false);
            }
            return [h2, e2[1]];
          }
        }
        function f(b3) {
          var c3 = a2.consumeRepeated(e, /^,/, b3);
          if (c3 && c3[1] == "")
            return c3[0];
        }
        var g = { left: { "%": 0 }, center: { "%": 50 }, right: { "%": 100 }, top: { "%": 0 }, bottom: { "%": 100 } }, h = a2.mergeNestedRepeated.bind(null, a2.mergeDimensions, " ");
        a2.addPropertiesHandler(d2.bind(null, 3), h, ["transform-origin"]), a2.addPropertiesHandler(d2.bind(null, 2), h, ["perspective-origin"]), a2.consumePosition = e, a2.mergeOffsetList = h;
        var i = a2.mergeNestedRepeated.bind(null, h, ", ");
        a2.addPropertiesHandler(f, i, ["background-position", "object-position"]);
      }(b), function(a2) {
        function b2(b3) {
          var c3 = a2.consumeToken(/^circle/, b3);
          if (c3 && c3[0])
            return ["circle"].concat(a2.consumeList([a2.ignore(a2.consumeToken.bind(void 0, /^\(/)), d2, a2.ignore(a2.consumeToken.bind(void 0, /^at/)), a2.consumePosition, a2.ignore(a2.consumeToken.bind(void 0, /^\)/))], c3[1]));
          var f2 = a2.consumeToken(/^ellipse/, b3);
          if (f2 && f2[0])
            return ["ellipse"].concat(a2.consumeList([a2.ignore(a2.consumeToken.bind(void 0, /^\(/)), e, a2.ignore(a2.consumeToken.bind(void 0, /^at/)), a2.consumePosition, a2.ignore(a2.consumeToken.bind(void 0, /^\)/))], f2[1]));
          var g2 = a2.consumeToken(/^polygon/, b3);
          return g2 && g2[0] ? ["polygon"].concat(a2.consumeList([a2.ignore(a2.consumeToken.bind(void 0, /^\(/)), a2.optional(a2.consumeToken.bind(void 0, /^nonzero\s*,|^evenodd\s*,/), "nonzero,"), a2.consumeSizePairList, a2.ignore(a2.consumeToken.bind(void 0, /^\)/))], g2[1])) : void 0;
        }
        function c2(b3, c3) {
          if (b3[0] === c3[0])
            return b3[0] == "circle" ? a2.mergeList(b3.slice(1), c3.slice(1), ["circle(", a2.mergeDimensions, " at ", a2.mergeOffsetList, ")"]) : b3[0] == "ellipse" ? a2.mergeList(b3.slice(1), c3.slice(1), ["ellipse(", a2.mergeNonNegativeSizePair, " at ", a2.mergeOffsetList, ")"]) : b3[0] == "polygon" && b3[1] == c3[1] ? a2.mergeList(b3.slice(2), c3.slice(2), ["polygon(", b3[1], g, ")"]) : void 0;
        }
        var d2 = a2.consumeParenthesised.bind(null, a2.parseLengthOrPercent), e = a2.consumeRepeated.bind(void 0, d2, /^/), f = a2.mergeNestedRepeated.bind(void 0, a2.mergeDimensions, " "), g = a2.mergeNestedRepeated.bind(void 0, f, ",");
        a2.addPropertiesHandler(b2, c2, ["shape-outside"]);
      }(b), function(a2, b2) {
        function c2(a3, b3) {
          b3.concat([a3]).forEach(function(b4) {
            b4 in document.documentElement.style && (d2[a3] = b4), e[b4] = a3;
          });
        }
        var d2 = {}, e = {};
        c2("transform", ["webkitTransform", "msTransform"]), c2("transformOrigin", ["webkitTransformOrigin"]), c2("perspective", ["webkitPerspective"]), c2("perspectiveOrigin", ["webkitPerspectiveOrigin"]), a2.propertyName = function(a3) {
          return d2[a3] || a3;
        }, a2.unprefixedPropertyName = function(a3) {
          return e[a3] || a3;
        };
      }(b);
    }(), function() {
      if (document.createElement("div").animate([]).oncancel === void 0) {
        var a2;
        if (window.performance && performance.now)
          var a2 = function() {
            return performance.now();
          };
        else
          var a2 = function() {
            return Date.now();
          };
        var b2 = function(a3, b3, c2) {
          this.target = a3, this.currentTime = b3, this.timelineTime = c2, this.type = "cancel", this.bubbles = false, this.cancelable = false, this.currentTarget = a3, this.defaultPrevented = false, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now();
        }, c = window.Element.prototype.animate;
        window.Element.prototype.animate = function(d, e) {
          var f = c.call(this, d, e);
          f._cancelHandlers = [], f.oncancel = null;
          var g = f.cancel;
          f.cancel = function() {
            g.call(this);
            var c2 = new b2(this, null, a2()), d2 = this._cancelHandlers.concat(this.oncancel ? [this.oncancel] : []);
            setTimeout(function() {
              d2.forEach(function(a3) {
                a3.call(c2.target, c2);
              });
            }, 0);
          };
          var h = f.addEventListener;
          f.addEventListener = function(a3, b3) {
            typeof b3 == "function" && a3 == "cancel" ? this._cancelHandlers.push(b3) : h.call(this, a3, b3);
          };
          var i = f.removeEventListener;
          return f.removeEventListener = function(a3, b3) {
            if (a3 == "cancel") {
              var c2 = this._cancelHandlers.indexOf(b3);
              c2 >= 0 && this._cancelHandlers.splice(c2, 1);
            } else
              i.call(this, a3, b3);
          }, f;
        };
      }
    }(), function(a2) {
      var b2 = document.documentElement, c = null, d = false;
      try {
        var e = getComputedStyle(b2).getPropertyValue("opacity"), f = e == "0" ? "1" : "0";
        c = b2.animate({ opacity: [f, f] }, { duration: 1 }), c.currentTime = 0, d = getComputedStyle(b2).getPropertyValue("opacity") == f;
      } catch (a3) {
      } finally {
        c && c.cancel();
      }
      if (!d) {
        var g = window.Element.prototype.animate;
        window.Element.prototype.animate = function(b3, c2) {
          return window.Symbol && Symbol.iterator && Array.prototype.from && b3[Symbol.iterator] && (b3 = Array.from(b3)), Array.isArray(b3) || b3 === null || (b3 = a2.convertToArrayForm(b3)), g.call(this, b3, c2);
        };
      }
    }(a);
  }();

  // node_modules/tocca/Tocca.js
  (function(doc, win) {
    if (typeof doc.createEvent !== "function")
      return false;
    var pointerEvent = function(type) {
      var lo = type.toLowerCase(), ms = "MS" + type;
      return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : false;
    }, touchEvent = function(name) {
      return "on" + name in window ? name : false;
    }, defaults = {
      useJquery: !win.IGNORE_JQUERY && typeof jQuery !== "undefined",
      swipeThreshold: win.SWIPE_THRESHOLD || 100,
      tapThreshold: win.TAP_THRESHOLD || 150,
      dbltapThreshold: win.DBL_TAP_THRESHOLD || 200,
      longtapThreshold: win.LONG_TAP_THRESHOLD || 1e3,
      tapPrecision: win.TAP_PRECISION / 2 || 60 / 2,
      justTouchEvents: win.JUST_ON_TOUCH_DEVICES
    }, wasTouch = false, touchevents = {
      touchstart: touchEvent("touchstart") || pointerEvent("PointerDown"),
      touchend: touchEvent("touchend") || pointerEvent("PointerUp"),
      touchmove: touchEvent("touchmove") || pointerEvent("PointerMove")
    }, isTheSameFingerId = function(e) {
      return !e.pointerId || typeof pointerId === "undefined" || e.pointerId === pointerId;
    }, setListener = function(elm, events, callback) {
      var eventsArray = events.split(" "), i = eventsArray.length;
      while (i--) {
        elm.addEventListener(eventsArray[i], callback, false);
      }
    }, getPointerEvent = function(event) {
      var hasTargetTouches = Boolean(event.targetTouches && event.targetTouches.length);
      switch (true) {
        case Boolean(event.target.touches):
          return event.target.touches[0];
        case (hasTargetTouches && typeof event.targetTouches[0].pageX !== "undefined"):
          return event.targetTouches[0];
        case (hasTargetTouches && Boolean(event.targetTouches[0].touches)):
          return event.targetTouches[0].touches[0];
        default:
          return event;
      }
    }, isMultipleTouches = function(event) {
      return (event.targetTouches || event.target.touches || []).length > 1;
    }, getTimestamp = function() {
      return new Date().getTime();
    }, sendEvent = function(elm, eventName, originalEvent, data) {
      var customEvent = doc.createEvent("Event");
      customEvent.originalEvent = originalEvent;
      data = data || {};
      data.x = currX;
      data.y = currY;
      if (defaults.useJquery) {
        customEvent = jQuery.Event(eventName, { originalEvent });
        jQuery(elm).trigger(customEvent, data);
      }
      if (customEvent.initEvent) {
        for (var key in data) {
          customEvent[key] = data[key];
        }
        customEvent.initEvent(eventName, true, true);
        elm.dispatchEvent(customEvent);
      }
      while (elm) {
        if (elm["on" + eventName])
          elm["on" + eventName](customEvent);
        elm = elm.parentNode;
      }
    }, onTouchStart = function(e) {
      if (!isTheSameFingerId(e) || isMultipleTouches(e))
        return;
      pointerId = e.pointerId;
      if (e.type !== "mousedown")
        wasTouch = true;
      if (e.type === "mousedown" && wasTouch)
        return;
      var pointer = getPointerEvent(e);
      cachedX = currX = pointer.pageX;
      cachedY = currY = pointer.pageY;
      longtapTimer = setTimeout(function() {
        sendEvent(e.target, "longtap", e);
        target = e.target;
      }, defaults.longtapThreshold);
      timestamp = getTimestamp();
      tapNum++;
    }, onTouchEnd = function(e) {
      if (!isTheSameFingerId(e) || isMultipleTouches(e))
        return;
      pointerId = void 0;
      if (e.type === "mouseup" && wasTouch) {
        wasTouch = false;
        return;
      }
      var eventsArr = [], now2 = getTimestamp(), deltaY = cachedY - currY, deltaX = cachedX - currX;
      clearTimeout(dblTapTimer);
      clearTimeout(longtapTimer);
      if (deltaX <= -defaults.swipeThreshold)
        eventsArr.push("swiperight");
      if (deltaX >= defaults.swipeThreshold)
        eventsArr.push("swipeleft");
      if (deltaY <= -defaults.swipeThreshold)
        eventsArr.push("swipedown");
      if (deltaY >= defaults.swipeThreshold)
        eventsArr.push("swipeup");
      if (eventsArr.length) {
        for (var i = 0; i < eventsArr.length; i++) {
          var eventName = eventsArr[i];
          sendEvent(e.target, eventName, e, {
            distance: {
              x: Math.abs(deltaX),
              y: Math.abs(deltaY)
            }
          });
        }
        tapNum = 0;
      } else {
        if (cachedX >= currX - defaults.tapPrecision && cachedX <= currX + defaults.tapPrecision && cachedY >= currY - defaults.tapPrecision && cachedY <= currY + defaults.tapPrecision) {
          if (timestamp + defaults.tapThreshold - now2 >= 0) {
            sendEvent(e.target, tapNum >= 2 && target === e.target ? "dbltap" : "tap", e);
            target = e.target;
          }
        }
        dblTapTimer = setTimeout(function() {
          tapNum = 0;
        }, defaults.dbltapThreshold);
      }
    }, onTouchMove = function(e) {
      if (!isTheSameFingerId(e))
        return;
      if (e.type === "mousemove" && wasTouch)
        return;
      var pointer = getPointerEvent(e);
      currX = pointer.pageX;
      currY = pointer.pageY;
    }, tapNum = 0, pointerId, currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer;
    setListener(doc, touchevents.touchstart + (defaults.justTouchEvents ? "" : " mousedown"), onTouchStart);
    setListener(doc, touchevents.touchend + (defaults.justTouchEvents ? "" : " mouseup"), onTouchEnd);
    setListener(doc, touchevents.touchmove + (defaults.justTouchEvents ? "" : " mousemove"), onTouchMove);
    win.tocca = function(options) {
      for (var opt in options) {
        defaults[opt] = options[opt];
      }
      return defaults;
    };
  })(document, window);

  // node_modules/instant.page/instantpage.js
  var mouseoverTimer;
  var lastTouchTimestamp;
  var prefetches = new Set();
  var prefetchElement = document.createElement("link");
  var isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports("prefetch") && window.IntersectionObserver && "isIntersecting" in IntersectionObserverEntry.prototype;
  var allowQueryString = "instantAllowQueryString" in document.body.dataset;
  var allowExternalLinks = "instantAllowExternalLinks" in document.body.dataset;
  var useWhitelist = "instantWhitelist" in document.body.dataset;
  var mousedownShortcut = "instantMousedownShortcut" in document.body.dataset;
  var DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION = 1111;
  var delayOnHover = 65;
  var useMousedown = false;
  var useMousedownOnly = false;
  var useViewport = false;
  if ("instantIntensity" in document.body.dataset) {
    const intensity = document.body.dataset.instantIntensity;
    if (intensity.substr(0, "mousedown".length) == "mousedown") {
      useMousedown = true;
      if (intensity == "mousedown-only") {
        useMousedownOnly = true;
      }
    } else if (intensity.substr(0, "viewport".length) == "viewport") {
      if (!(navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType && navigator.connection.effectiveType.includes("2g")))) {
        if (intensity == "viewport") {
          if (document.documentElement.clientWidth * document.documentElement.clientHeight < 45e4) {
            useViewport = true;
          }
        } else if (intensity == "viewport-all") {
          useViewport = true;
        }
      }
    } else {
      const milliseconds = parseInt(intensity);
      if (!isNaN(milliseconds)) {
        delayOnHover = milliseconds;
      }
    }
  }
  if (isSupported) {
    const eventListenersOptions = {
      capture: true,
      passive: true
    };
    if (!useMousedownOnly) {
      document.addEventListener("touchstart", touchstartListener, eventListenersOptions);
    }
    if (!useMousedown) {
      document.addEventListener("mouseover", mouseoverListener, eventListenersOptions);
    } else if (!mousedownShortcut) {
      document.addEventListener("mousedown", mousedownListener, eventListenersOptions);
    }
    if (mousedownShortcut) {
      document.addEventListener("mousedown", mousedownShortcutListener, eventListenersOptions);
    }
    if (useViewport) {
      let triggeringFunction;
      if (window.requestIdleCallback) {
        triggeringFunction = (callback) => {
          requestIdleCallback(callback, {
            timeout: 1500
          });
        };
      } else {
        triggeringFunction = (callback) => {
          callback();
        };
      }
      triggeringFunction(() => {
        const intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const linkElement = entry.target;
              intersectionObserver.unobserve(linkElement);
              preload(linkElement.href);
            }
          });
        });
        document.querySelectorAll("a").forEach((linkElement) => {
          if (isPreloadable(linkElement)) {
            intersectionObserver.observe(linkElement);
          }
        });
      });
    }
  }
  function touchstartListener(event) {
    lastTouchTimestamp = performance.now();
    const linkElement = event.target.closest("a");
    if (!isPreloadable(linkElement)) {
      return;
    }
    preload(linkElement.href);
  }
  function mouseoverListener(event) {
    if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
      return;
    }
    const linkElement = event.target.closest("a");
    if (!isPreloadable(linkElement)) {
      return;
    }
    linkElement.addEventListener("mouseout", mouseoutListener, { passive: true });
    mouseoverTimer = setTimeout(() => {
      preload(linkElement.href);
      mouseoverTimer = void 0;
    }, delayOnHover);
  }
  function mousedownListener(event) {
    const linkElement = event.target.closest("a");
    if (!isPreloadable(linkElement)) {
      return;
    }
    preload(linkElement.href);
  }
  function mouseoutListener(event) {
    if (event.relatedTarget && event.target.closest("a") == event.relatedTarget.closest("a")) {
      return;
    }
    if (mouseoverTimer) {
      clearTimeout(mouseoverTimer);
      mouseoverTimer = void 0;
    }
  }
  function mousedownShortcutListener(event) {
    if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
      return;
    }
    const linkElement = event.target.closest("a");
    if (event.which > 1 || event.metaKey || event.ctrlKey) {
      return;
    }
    if (!linkElement) {
      return;
    }
    linkElement.addEventListener("click", function(event2) {
      if (event2.detail == 1337) {
        return;
      }
      event2.preventDefault();
    }, { capture: true, passive: false, once: true });
    const customEvent = new MouseEvent("click", { view: window, bubbles: true, cancelable: false, detail: 1337 });
    linkElement.dispatchEvent(customEvent);
  }
  function isPreloadable(linkElement) {
    if (!linkElement || !linkElement.href) {
      return;
    }
    if (useWhitelist && !("instant" in linkElement.dataset)) {
      return;
    }
    if (!allowExternalLinks && linkElement.origin != location.origin && !("instant" in linkElement.dataset)) {
      return;
    }
    if (!["http:", "https:"].includes(linkElement.protocol)) {
      return;
    }
    if (linkElement.protocol == "http:" && location.protocol == "https:") {
      return;
    }
    if (!allowQueryString && linkElement.search && !("instant" in linkElement.dataset)) {
      return;
    }
    if (linkElement.hash && linkElement.pathname + linkElement.search == location.pathname + location.search) {
      return;
    }
    if ("noInstant" in linkElement.dataset) {
      return;
    }
    return true;
  }
  function preload(url) {
    if (prefetches.has(url)) {
      return;
    }
    const prefetcher = document.createElement("link");
    prefetcher.rel = "prefetch";
    prefetcher.href = url;
    document.head.appendChild(prefetcher);
    prefetches.add(url);
  }

  // node_modules/seamless-scroll-polyfill/lib/common.js
  var checkBehavior = (behavior) => {
    return behavior === void 0 || behavior === "auto" || behavior === "instant" || behavior === "smooth";
  };
  function elementScrollXY(x, y) {
    this.scrollLeft = x;
    this.scrollTop = y;
  }
  var failedExecute = (method, object, reason = "cannot convert to dictionary.") => `Failed to execute '${method}' on '${object}': ${reason}`;
  var failedExecuteInvalidEnumValue = (method, object, value) => failedExecute(method, object, `The provided value '${value}' is not a valid enum value of type ScrollBehavior.`);
  var backupMethod = (proto, method, fallback) => {
    var _a;
    const backup = `__SEAMLESS.BACKUP$${method}`;
    if (!proto[backup] && proto[method] && !((_a = proto[method]) == null ? void 0 : _a.__isPolyfill)) {
      proto[backup] = proto[method];
    }
    return proto[backup] || fallback;
  };
  var isObject = (value) => {
    const type = typeof value;
    return value !== null && (type === "object" || type === "function");
  };
  var isScrollBehaviorSupported = () => "scrollBehavior" in window.document.documentElement.style;
  var markPolyfill = (method) => {
    Object.defineProperty(method, "__isPolyfill", { value: true });
  };
  var modifyPrototypes = (prop, func) => {
    markPolyfill(func);
    [HTMLElement.prototype, SVGElement.prototype, Element.prototype].forEach((prototype) => {
      backupMethod(prototype, prop);
      prototype[prop] = func;
    });
  };
  var scrollingElement = (element) => element.ownerDocument.scrollingElement || element.ownerDocument.documentElement;

  // node_modules/seamless-scroll-polyfill/lib/scroll-step.js
  var ease = (k) => {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  };
  var now = () => {
    var _a, _b, _c;
    return (_c = (_b = (_a = window.performance) == null ? void 0 : _a.now) == null ? void 0 : _b.call(_a)) != null ? _c : window.Date.now();
  };
  var DURATION = 500;
  var step = (context) => {
    const currentTime = now();
    const elapsed = (currentTime - context.timeStamp) / (context.duration || DURATION);
    if (elapsed > 1) {
      context.method(context.targetX, context.targetY);
      context.callback();
      return;
    }
    const value = (context.timingFunc || ease)(elapsed);
    const currentX = context.startX + (context.targetX - context.startX) * value;
    const currentY = context.startY + (context.targetY - context.startY) * value;
    context.method(currentX, currentY);
    context.rafId = window.requestAnimationFrame(() => {
      step(context);
    });
  };

  // node_modules/seamless-scroll-polyfill/lib/scroll.js
  var nonFinite = (value) => {
    if (!isFinite(value)) {
      return 0;
    }
    return Number(value);
  };
  var isConnected = (node) => {
    var _a;
    return (_a = node.isConnected) != null ? _a : !node.ownerDocument || !(node.ownerDocument.compareDocumentPosition(node) & 1);
  };
  var scrollWithOptions = (element, options, config) => {
    var _a, _b;
    if (!isConnected(element)) {
      return;
    }
    const startX = element.scrollLeft;
    const startY = element.scrollTop;
    const targetX = nonFinite((_a = options.left) != null ? _a : startX);
    const targetY = nonFinite((_b = options.top) != null ? _b : startY);
    if (targetX === startX && targetY === startY) {
      return;
    }
    const fallback = backupMethod(HTMLElement.prototype, "scroll", elementScrollXY);
    const method = backupMethod(Object.getPrototypeOf(element), "scroll", fallback).bind(element);
    if (options.behavior !== "smooth") {
      method(targetX, targetY);
      return;
    }
    const removeEventListener = () => {
      window.removeEventListener("wheel", cancelScroll);
      window.removeEventListener("touchmove", cancelScroll);
    };
    const context = {
      ...config,
      timeStamp: now(),
      startX,
      startY,
      targetX,
      targetY,
      rafId: 0,
      method,
      callback: removeEventListener
    };
    const cancelScroll = () => {
      window.cancelAnimationFrame(context.rafId);
      removeEventListener();
    };
    window.addEventListener("wheel", cancelScroll, {
      passive: true,
      once: true
    });
    window.addEventListener("touchmove", cancelScroll, {
      passive: true,
      once: true
    });
    step(context);
  };
  var isWindow = (obj) => obj.window === obj;
  var createScroll = (scrollName) => (target, scrollOptions, config) => {
    const [element, scrollType] = isWindow(target) ? [scrollingElement(target.document.documentElement), "Window"] : [target, "Element"];
    const options = scrollOptions != null ? scrollOptions : {};
    if (!isObject(options)) {
      throw new TypeError(failedExecute(scrollName, scrollType));
    }
    if (!checkBehavior(options.behavior)) {
      throw new TypeError(failedExecuteInvalidEnumValue(scrollName, scrollType, options.behavior));
    }
    if (scrollName === "scrollBy") {
      options.left = nonFinite(options.left) + element.scrollLeft;
      options.top = nonFinite(options.top) + element.scrollTop;
    }
    scrollWithOptions(element, options, config);
  };
  var scroll = createScroll("scroll");
  var scrollTo = createScroll("scrollTo");
  var scrollBy = createScroll("scrollBy");
  var elementScroll = scroll;

  // node_modules/seamless-scroll-polyfill/lib/scrollIntoView.js
  var normalizeWritingMode = (writingMode) => {
    switch (writingMode) {
      case "horizontal-tb":
      case "lr":
      case "lr-tb":
      case "rl":
      case "rl-tb":
        return 0;
      case "vertical-rl":
      case "tb":
      case "tb-rl":
        return 1;
      case "vertical-lr":
      case "tb-lr":
        return 2;
      case "sideways-rl":
        return 3;
      case "sideways-lr":
        return 4;
    }
    return 0;
  };
  var calcPhysicalAxis = (writingMode, isLTR, hPos, vPos) => {
    let layout = 0;
    if (!isLTR) {
      layout ^= 2;
    }
    switch (writingMode) {
      case 0:
        layout = layout >> 1 | (layout & 1) << 1;
        [hPos, vPos] = [vPos, hPos];
        break;
      case 1:
      case 3:
        layout ^= 1;
        break;
      case 4:
        layout ^= 2;
        break;
    }
    return [layout, hPos, vPos];
  };
  var isXReversed = (computedStyle) => {
    const layout = calcPhysicalAxis(normalizeWritingMode(computedStyle.writingMode), computedStyle.direction !== "rtl", void 0, void 0)[0];
    return (layout & 1) === 1;
  };
  var toPhysicalAlignment = (options, writingMode, isLTR) => {
    const [layout, hPos, vPos] = calcPhysicalAxis(writingMode, isLTR, options.block || "start", options.inline || "nearest");
    return [hPos, vPos].map((value, index) => {
      switch (value) {
        case "center":
          return 1;
        case "nearest":
          return 0;
        default: {
          const reverse = layout >> index & 1;
          return value === "start" === !reverse ? 2 : 3;
        }
      }
    });
  };
  var mapNearest = (align, scrollingEdgeStart, scrollingEdgeEnd, scrollingSize, elementEdgeStart, elementEdgeEnd, elementSize) => {
    if (align !== 0) {
      return align;
    }
    if (elementEdgeStart < scrollingEdgeStart && elementEdgeEnd > scrollingEdgeEnd || elementEdgeStart > scrollingEdgeStart && elementEdgeEnd < scrollingEdgeEnd) {
      return null;
    }
    if (elementEdgeStart <= scrollingEdgeStart && elementSize <= scrollingSize || elementEdgeEnd >= scrollingEdgeEnd && elementSize >= scrollingSize) {
      return 2;
    }
    if (elementEdgeEnd > scrollingEdgeEnd && elementSize < scrollingSize || elementEdgeStart < scrollingEdgeStart && elementSize > scrollingSize) {
      return 3;
    }
    return null;
  };
  var canOverflow = (overflow) => {
    return overflow !== "visible" && overflow !== "clip";
  };
  var getFrameElement = (element) => {
    var _a;
    try {
      return ((_a = element.ownerDocument.defaultView) == null ? void 0 : _a.frameElement) || null;
    } catch {
      return null;
    }
  };
  var isScrollable = (element, computedStyle) => {
    if (element.clientHeight < element.scrollHeight || element.clientWidth < element.scrollWidth) {
      return canOverflow(computedStyle.overflowY) || canOverflow(computedStyle.overflowX) || element === scrollingElement(element);
    }
    return false;
  };
  var parentElement = (element) => {
    const pNode = element.parentNode;
    const pElement = element.parentElement;
    if (pElement === null && pNode !== null) {
      if (pNode.nodeType === 11) {
        return pNode.host;
      }
      if (pNode.nodeType === 9) {
        return getFrameElement(element);
      }
    }
    return pElement;
  };
  var clamp = (value, min, max) => {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  };
  var getSupportedScrollMarginProperty = (ownerDocument) => {
    return ["scroll-margin", "scroll-snap-margin"].filter((property) => property in ownerDocument.documentElement.style)[0];
  };
  var getElementScrollSnapArea = (element, elementRect, computedStyle) => {
    const { top, right, bottom, left } = elementRect;
    const scrollProperty = getSupportedScrollMarginProperty(element.ownerDocument);
    if (!scrollProperty) {
      return [top, right, bottom, left];
    }
    const scrollMarginValue = (edge) => {
      const value = computedStyle.getPropertyValue(`${scrollProperty}-${edge}`);
      return parseInt(value, 10) || 0;
    };
    return [
      top - scrollMarginValue("top"),
      right + scrollMarginValue("right"),
      bottom + scrollMarginValue("bottom"),
      left - scrollMarginValue("left")
    ];
  };
  var calcAlignEdge = (align, start, end) => {
    switch (align) {
      case 1:
        return (start + end) / 2;
      case 3:
        return end;
      case 2:
      case 0:
        return start;
    }
  };
  var getFrameViewport = (frame, frameRect) => {
    var _a, _b, _c;
    const visualViewport = (_a = frame.ownerDocument.defaultView) == null ? void 0 : _a.visualViewport;
    const [x, y, width, height] = frame === scrollingElement(frame) ? [0, 0, (_b = visualViewport == null ? void 0 : visualViewport.width) != null ? _b : frame.clientWidth, (_c = visualViewport == null ? void 0 : visualViewport.height) != null ? _c : frame.clientHeight] : [frameRect.left, frameRect.top, frame.clientWidth, frame.clientHeight];
    const left = x + frame.clientLeft;
    const top = y + frame.clientTop;
    const right = left + width;
    const bottom = top + height;
    return [top, right, bottom, left];
  };
  var computeScrollIntoView = (element, options) => {
    const actions = [];
    let ownerDocument = element.ownerDocument;
    let ownerWindow = ownerDocument.defaultView;
    if (!ownerWindow) {
      return actions;
    }
    const computedStyle = window.getComputedStyle(element);
    const isLTR = computedStyle.direction !== "rtl";
    const writingMode = normalizeWritingMode(computedStyle.writingMode || computedStyle.getPropertyValue("-webkit-writing-mode") || computedStyle.getPropertyValue("-ms-writing-mode"));
    const [alignH, alignV] = toPhysicalAlignment(options, writingMode, isLTR);
    let [top, right, bottom, left] = getElementScrollSnapArea(element, element.getBoundingClientRect(), computedStyle);
    for (let frame = parentElement(element); frame !== null; frame = parentElement(frame)) {
      if (ownerDocument !== frame.ownerDocument) {
        ownerDocument = frame.ownerDocument;
        ownerWindow = ownerDocument.defaultView;
        if (!ownerWindow) {
          break;
        }
        const { left: dX, top: dY } = frame.getBoundingClientRect();
        top += dY;
        right += dX;
        bottom += dY;
        left += dX;
      }
      const frameStyle = ownerWindow.getComputedStyle(frame);
      if (frameStyle.position === "fixed") {
        break;
      }
      if (!isScrollable(frame, frameStyle)) {
        continue;
      }
      const frameRect = frame.getBoundingClientRect();
      const [frameTop, frameRight, frameBottom, frameLeft] = getFrameViewport(frame, frameRect);
      const eAlignH = mapNearest(alignH, frameLeft, frameRight, frame.clientWidth, left, right, right - left);
      const eAlignV = mapNearest(alignV, frameTop, frameBottom, frame.clientHeight, top, bottom, bottom - top);
      const diffX = eAlignH === null ? 0 : calcAlignEdge(eAlignH, left, right) - calcAlignEdge(eAlignH, frameLeft, frameRight);
      const diffY = eAlignV === null ? 0 : calcAlignEdge(eAlignV, top, bottom) - calcAlignEdge(eAlignV, frameTop, frameBottom);
      const moveX = isXReversed(frameStyle) ? clamp(diffX, -frame.scrollWidth + frame.clientWidth - frame.scrollLeft, -frame.scrollLeft) : clamp(diffX, -frame.scrollLeft, frame.scrollWidth - frame.clientWidth - frame.scrollLeft);
      const moveY = clamp(diffY, -frame.scrollTop, frame.scrollHeight - frame.clientHeight - frame.scrollTop);
      actions.push([
        frame,
        { left: frame.scrollLeft + moveX, top: frame.scrollTop + moveY, behavior: options.behavior }
      ]);
      top = Math.max(top - moveY, frameTop);
      right = Math.min(right - moveX, frameRight);
      bottom = Math.min(bottom - moveY, frameBottom);
      left = Math.max(left - moveX, frameLeft);
    }
    return actions;
  };
  var scrollIntoView = (element, scrollIntoViewOptions, config) => {
    const options = scrollIntoViewOptions || {};
    if (!checkBehavior(options.behavior)) {
      throw new TypeError(failedExecuteInvalidEnumValue("scrollIntoView", "Element", options.behavior));
    }
    const actions = computeScrollIntoView(element, options);
    actions.forEach(([frame, scrollToOptions]) => {
      elementScroll(frame, scrollToOptions, config);
    });
  };
  var elementScrollIntoView = scrollIntoView;

  // node_modules/seamless-scroll-polyfill/lib/scroll.polyfill.js
  var createPolyfill = (scrollName, patch) => (config) => {
    if (isScrollBehaviorSupported()) {
      return;
    }
    const scrollMethod = {
      scroll,
      scrollTo,
      scrollBy
    }[scrollName];
    patch(scrollName, function() {
      const args = arguments;
      if (arguments.length === 1) {
        scrollMethod(this, args[0], config);
        return;
      }
      const left = args[0];
      const top = args[1];
      scrollMethod(this, { left, top });
    });
  };
  var elementScrollPolyfill = createPolyfill("scroll", modifyPrototypes);
  var elementScrollToPolyfill = createPolyfill("scrollTo", modifyPrototypes);
  var elementScrollByPolyfill = createPolyfill("scrollBy", modifyPrototypes);
  var modifyWindow = (prop, func) => {
    markPolyfill(func);
    backupMethod(window, prop);
    window[prop] = func;
  };
  var windowScrollPolyfill = createPolyfill("scroll", modifyWindow);
  var windowScrollToPolyfill = createPolyfill("scrollTo", modifyWindow);
  var windowScrollByPolyfill = createPolyfill("scrollBy", modifyWindow);

  // node_modules/seamless-scroll-polyfill/lib/scrollIntoView.polyfill.js
  function elementScrollIntoViewBoolean(alignToTop) {
    elementScrollIntoView(this, {
      block: (alignToTop != null ? alignToTop : true) ? "start" : "end",
      inline: "nearest"
    });
  }
  var elementScrollIntoViewPolyfill = (config) => {
    if (isScrollBehaviorSupported()) {
      return;
    }
    const originalFunc = backupMethod(window.HTMLElement.prototype, "scrollIntoView", elementScrollIntoViewBoolean);
    modifyPrototypes("scrollIntoView", function scrollIntoView2() {
      const args = arguments;
      const options = args[0];
      if (args.length === 1 && isObject(options)) {
        elementScrollIntoView(this, options, config);
        return;
      }
      originalFunc.apply(this, args);
    });
  };

  // js/vendor.js
  elementScrollIntoViewPolyfill();
  elementScrollToPolyfill();
  elementScrollByPolyfill();
})();
/*! (c) Andrea Giammarchi @webreflection ISC */
/*! instant.page v5.1.0 - (C) 2019-2020 Alexandre Dieulot - https://instant.page/license */
