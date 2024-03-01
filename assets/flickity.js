(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/ev-emitter/ev-emitter.js
  var require_ev_emitter = __commonJS({
    "node_modules/ev-emitter/ev-emitter.js"(exports, module) {
      (function(global, factory) {
        if (typeof define == "function" && define.amd) {
          define(factory);
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory();
        } else {
          global.EvEmitter = factory();
        }
      })(typeof window != "undefined" ? window : exports, function() {
        "use strict";
        function EvEmitter() {
        }
        var proto = EvEmitter.prototype;
        proto.on = function(eventName, listener) {
          if (!eventName || !listener) {
            return;
          }
          var events = this._events = this._events || {};
          var listeners = events[eventName] = events[eventName] || [];
          if (listeners.indexOf(listener) == -1) {
            listeners.push(listener);
          }
          return this;
        };
        proto.once = function(eventName, listener) {
          if (!eventName || !listener) {
            return;
          }
          this.on(eventName, listener);
          var onceEvents = this._onceEvents = this._onceEvents || {};
          var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
          onceListeners[listener] = true;
          return this;
        };
        proto.off = function(eventName, listener) {
          var listeners = this._events && this._events[eventName];
          if (!listeners || !listeners.length) {
            return;
          }
          var index = listeners.indexOf(listener);
          if (index != -1) {
            listeners.splice(index, 1);
          }
          return this;
        };
        proto.emitEvent = function(eventName, args) {
          var listeners = this._events && this._events[eventName];
          if (!listeners || !listeners.length) {
            return;
          }
          listeners = listeners.slice(0);
          args = args || [];
          var onceListeners = this._onceEvents && this._onceEvents[eventName];
          for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            var isOnce = onceListeners && onceListeners[listener];
            if (isOnce) {
              this.off(eventName, listener);
              delete onceListeners[listener];
            }
            listener.apply(this, args);
          }
          return this;
        };
        proto.allOff = function() {
          delete this._events;
          delete this._onceEvents;
        };
        return EvEmitter;
      });
    }
  });

  // node_modules/get-size/get-size.js
  var require_get_size = __commonJS({
    "node_modules/get-size/get-size.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define(factory);
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory();
        } else {
          window2.getSize = factory();
        }
      })(window, function factory() {
        "use strict";
        function getStyleSize(value) {
          var num = parseFloat(value);
          var isValid = value.indexOf("%") == -1 && !isNaN(num);
          return isValid && num;
        }
        function noop() {
        }
        var logError = typeof console == "undefined" ? noop : function(message) {
          console.error(message);
        };
        var measurements = [
          "paddingLeft",
          "paddingRight",
          "paddingTop",
          "paddingBottom",
          "marginLeft",
          "marginRight",
          "marginTop",
          "marginBottom",
          "borderLeftWidth",
          "borderRightWidth",
          "borderTopWidth",
          "borderBottomWidth"
        ];
        var measurementsLength = measurements.length;
        function getZeroSize() {
          var size = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
          };
          for (var i = 0; i < measurementsLength; i++) {
            var measurement = measurements[i];
            size[measurement] = 0;
          }
          return size;
        }
        function getStyle(elem) {
          var style = getComputedStyle(elem);
          if (!style) {
            logError("Style returned " + style + ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1");
          }
          return style;
        }
        var isSetup = false;
        var isBoxSizeOuter;
        function setup() {
          if (isSetup) {
            return;
          }
          isSetup = true;
          var div = document.createElement("div");
          div.style.width = "200px";
          div.style.padding = "1px 2px 3px 4px";
          div.style.borderStyle = "solid";
          div.style.borderWidth = "1px 2px 3px 4px";
          div.style.boxSizing = "border-box";
          var body = document.body || document.documentElement;
          body.appendChild(div);
          var style = getStyle(div);
          isBoxSizeOuter = Math.round(getStyleSize(style.width)) == 200;
          getSize.isBoxSizeOuter = isBoxSizeOuter;
          body.removeChild(div);
        }
        function getSize(elem) {
          setup();
          if (typeof elem == "string") {
            elem = document.querySelector(elem);
          }
          if (!elem || typeof elem != "object" || !elem.nodeType) {
            return;
          }
          var style = getStyle(elem);
          if (style.display == "none") {
            return getZeroSize();
          }
          var size = {};
          size.width = elem.offsetWidth;
          size.height = elem.offsetHeight;
          var isBorderBox = size.isBorderBox = style.boxSizing == "border-box";
          for (var i = 0; i < measurementsLength; i++) {
            var measurement = measurements[i];
            var value = style[measurement];
            var num = parseFloat(value);
            size[measurement] = !isNaN(num) ? num : 0;
          }
          var paddingWidth = size.paddingLeft + size.paddingRight;
          var paddingHeight = size.paddingTop + size.paddingBottom;
          var marginWidth = size.marginLeft + size.marginRight;
          var marginHeight = size.marginTop + size.marginBottom;
          var borderWidth = size.borderLeftWidth + size.borderRightWidth;
          var borderHeight = size.borderTopWidth + size.borderBottomWidth;
          var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
          var styleWidth = getStyleSize(style.width);
          if (styleWidth !== false) {
            size.width = styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
          }
          var styleHeight = getStyleSize(style.height);
          if (styleHeight !== false) {
            size.height = styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
          }
          size.innerWidth = size.width - (paddingWidth + borderWidth);
          size.innerHeight = size.height - (paddingHeight + borderHeight);
          size.outerWidth = size.width + marginWidth;
          size.outerHeight = size.height + marginHeight;
          return size;
        }
        return getSize;
      });
    }
  });

  // node_modules/desandro-matches-selector/matches-selector.js
  var require_matches_selector = __commonJS({
    "node_modules/desandro-matches-selector/matches-selector.js"(exports, module) {
      (function(window2, factory) {
        "use strict";
        if (typeof define == "function" && define.amd) {
          define(factory);
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory();
        } else {
          window2.matchesSelector = factory();
        }
      })(window, function factory() {
        "use strict";
        var matchesMethod = function() {
          var ElemProto = window.Element.prototype;
          if (ElemProto.matches) {
            return "matches";
          }
          if (ElemProto.matchesSelector) {
            return "matchesSelector";
          }
          var prefixes = ["webkit", "moz", "ms", "o"];
          for (var i = 0; i < prefixes.length; i++) {
            var prefix = prefixes[i];
            var method = prefix + "MatchesSelector";
            if (ElemProto[method]) {
              return method;
            }
          }
        }();
        return function matchesSelector(elem, selector) {
          return elem[matchesMethod](selector);
        };
      });
    }
  });

  // node_modules/fizzy-ui-utils/utils.js
  var require_utils = __commonJS({
    "node_modules/fizzy-ui-utils/utils.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "desandro-matches-selector/matches-selector"
          ], function(matchesSelector) {
            return factory(window2, matchesSelector);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_matches_selector());
        } else {
          window2.fizzyUIUtils = factory(window2, window2.matchesSelector);
        }
      })(window, function factory(window2, matchesSelector) {
        "use strict";
        var utils = {};
        utils.extend = function(a, b) {
          for (var prop in b) {
            a[prop] = b[prop];
          }
          return a;
        };
        utils.modulo = function(num, div) {
          return (num % div + div) % div;
        };
        var arraySlice = Array.prototype.slice;
        utils.makeArray = function(obj) {
          if (Array.isArray(obj)) {
            return obj;
          }
          if (obj === null || obj === void 0) {
            return [];
          }
          var isArrayLike = typeof obj == "object" && typeof obj.length == "number";
          if (isArrayLike) {
            return arraySlice.call(obj);
          }
          return [obj];
        };
        utils.removeFrom = function(ary, obj) {
          var index = ary.indexOf(obj);
          if (index != -1) {
            ary.splice(index, 1);
          }
        };
        utils.getParent = function(elem, selector) {
          while (elem.parentNode && elem != document.body) {
            elem = elem.parentNode;
            if (matchesSelector(elem, selector)) {
              return elem;
            }
          }
        };
        utils.getQueryElement = function(elem) {
          if (typeof elem == "string") {
            return document.querySelector(elem);
          }
          return elem;
        };
        utils.handleEvent = function(event) {
          var method = "on" + event.type;
          if (this[method]) {
            this[method](event);
          }
        };
        utils.filterFindElements = function(elems, selector) {
          elems = utils.makeArray(elems);
          var ffElems = [];
          elems.forEach(function(elem) {
            if (!(elem instanceof HTMLElement)) {
              return;
            }
            if (!selector) {
              ffElems.push(elem);
              return;
            }
            if (matchesSelector(elem, selector)) {
              ffElems.push(elem);
            }
            var childElems = elem.querySelectorAll(selector);
            for (var i = 0; i < childElems.length; i++) {
              ffElems.push(childElems[i]);
            }
          });
          return ffElems;
        };
        utils.debounceMethod = function(_class, methodName, threshold) {
          threshold = threshold || 100;
          var method = _class.prototype[methodName];
          var timeoutName = methodName + "Timeout";
          _class.prototype[methodName] = function() {
            var timeout = this[timeoutName];
            clearTimeout(timeout);
            var args = arguments;
            var _this = this;
            this[timeoutName] = setTimeout(function() {
              method.apply(_this, args);
              delete _this[timeoutName];
            }, threshold);
          };
        };
        utils.docReady = function(callback) {
          var readyState = document.readyState;
          if (readyState == "complete" || readyState == "interactive") {
            setTimeout(callback);
          } else {
            document.addEventListener("DOMContentLoaded", callback);
          }
        };
        utils.toDashed = function(str) {
          return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
            return $1 + "-" + $2;
          }).toLowerCase();
        };
        var console2 = window2.console;
        utils.htmlInit = function(WidgetClass, namespace) {
          utils.docReady(function() {
            var dashedNamespace = utils.toDashed(namespace);
            var dataAttr = "data-" + dashedNamespace;
            var dataAttrElems = document.querySelectorAll("[" + dataAttr + "]");
            var jsDashElems = document.querySelectorAll(".js-" + dashedNamespace);
            var elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems));
            var dataOptionsAttr = dataAttr + "-options";
            var jQuery = window2.jQuery;
            elems.forEach(function(elem) {
              var attr = elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr);
              var options;
              try {
                options = attr && JSON.parse(attr);
              } catch (error) {
                if (console2) {
                  console2.error("Error parsing " + dataAttr + " on " + elem.className + ": " + error);
                }
                return;
              }
              var instance = new WidgetClass(elem, options);
              if (jQuery) {
                jQuery.data(elem, namespace, instance);
              }
            });
          });
        };
        return utils;
      });
    }
  });

  // node_modules/flickity/js/cell.js
  var require_cell = __commonJS({
    "node_modules/flickity/js/cell.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "get-size/get-size"
          ], function(getSize) {
            return factory(window2, getSize);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_get_size());
        } else {
          window2.Flickity = window2.Flickity || {};
          window2.Flickity.Cell = factory(window2, window2.getSize);
        }
      })(window, function factory(window2, getSize) {
        "use strict";
        function Cell(elem, parent) {
          this.element = elem;
          this.parent = parent;
          this.create();
        }
        var proto = Cell.prototype;
        proto.create = function() {
          this.element.style.position = "absolute";
          this.element.setAttribute("aria-hidden", "true");
          this.x = 0;
          this.shift = 0;
          this.element.style[this.parent.originSide] = 0;
        };
        proto.destroy = function() {
          this.unselect();
          this.element.style.position = "";
          var side = this.parent.originSide;
          this.element.style[side] = "";
          this.element.style.transform = "";
          this.element.removeAttribute("aria-hidden");
        };
        proto.getSize = function() {
          this.size = getSize(this.element);
        };
        proto.setPosition = function(x) {
          this.x = x;
          this.updateTarget();
          this.renderPosition(x);
        };
        proto.updateTarget = proto.setDefaultTarget = function() {
          var marginProperty = this.parent.originSide == "left" ? "marginLeft" : "marginRight";
          this.target = this.x + this.size[marginProperty] + this.size.width * this.parent.cellAlign;
        };
        proto.renderPosition = function(x) {
          var sideOffset = this.parent.originSide === "left" ? 1 : -1;
          var adjustedX = this.parent.options.percentPosition ? x * sideOffset * (this.parent.size.innerWidth / this.size.width) : x * sideOffset;
          this.element.style.transform = "translateX(" + this.parent.getPositionValue(adjustedX) + ")";
        };
        proto.select = function() {
          this.element.classList.add("is-selected");
          this.element.removeAttribute("aria-hidden");
        };
        proto.unselect = function() {
          this.element.classList.remove("is-selected");
          this.element.setAttribute("aria-hidden", "true");
        };
        proto.wrapShift = function(shift) {
          this.shift = shift;
          this.renderPosition(this.x + this.parent.slideableWidth * shift);
        };
        proto.remove = function() {
          this.element.parentNode.removeChild(this.element);
        };
        return Cell;
      });
    }
  });

  // node_modules/flickity/js/slide.js
  var require_slide = __commonJS({
    "node_modules/flickity/js/slide.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define(factory);
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory();
        } else {
          window2.Flickity = window2.Flickity || {};
          window2.Flickity.Slide = factory();
        }
      })(window, function factory() {
        "use strict";
        function Slide(parent) {
          this.parent = parent;
          this.isOriginLeft = parent.originSide == "left";
          this.cells = [];
          this.outerWidth = 0;
          this.height = 0;
        }
        var proto = Slide.prototype;
        proto.addCell = function(cell) {
          this.cells.push(cell);
          this.outerWidth += cell.size.outerWidth;
          this.height = Math.max(cell.size.outerHeight, this.height);
          if (this.cells.length == 1) {
            this.x = cell.x;
            var beginMargin = this.isOriginLeft ? "marginLeft" : "marginRight";
            this.firstMargin = cell.size[beginMargin];
          }
        };
        proto.updateTarget = function() {
          var endMargin = this.isOriginLeft ? "marginRight" : "marginLeft";
          var lastCell = this.getLastCell();
          var lastMargin = lastCell ? lastCell.size[endMargin] : 0;
          var slideWidth = this.outerWidth - (this.firstMargin + lastMargin);
          this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
        };
        proto.getLastCell = function() {
          return this.cells[this.cells.length - 1];
        };
        proto.select = function() {
          this.cells.forEach(function(cell) {
            cell.select();
          });
        };
        proto.unselect = function() {
          this.cells.forEach(function(cell) {
            cell.unselect();
          });
        };
        proto.getCellElements = function() {
          return this.cells.map(function(cell) {
            return cell.element;
          });
        };
        return Slide;
      });
    }
  });

  // node_modules/flickity/js/animate.js
  var require_animate = __commonJS({
    "node_modules/flickity/js/animate.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "fizzy-ui-utils/utils"
          ], function(utils) {
            return factory(window2, utils);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_utils());
        } else {
          window2.Flickity = window2.Flickity || {};
          window2.Flickity.animatePrototype = factory(window2, window2.fizzyUIUtils);
        }
      })(window, function factory(window2, utils) {
        "use strict";
        var proto = {};
        proto.startAnimation = function() {
          if (this.isAnimating) {
            return;
          }
          this.isAnimating = true;
          this.restingFrames = 0;
          this.animate();
        };
        proto.animate = function() {
          this.applyDragForce();
          this.applySelectedAttraction();
          var previousX = this.x;
          this.integratePhysics();
          this.positionSlider();
          this.settle(previousX);
          if (this.isAnimating) {
            var _this = this;
            requestAnimationFrame(function animateFrame() {
              _this.animate();
            });
          }
        };
        proto.positionSlider = function() {
          var x = this.x;
          if (this.options.wrapAround && this.cells.length > 1) {
            x = utils.modulo(x, this.slideableWidth);
            x -= this.slideableWidth;
            this.shiftWrapCells(x);
          }
          this.setTranslateX(x, this.isAnimating);
          this.dispatchScrollEvent();
        };
        proto.setTranslateX = function(x, is3d) {
          x += this.cursorPosition;
          x = this.options.rightToLeft ? -x : x;
          var translateX = this.getPositionValue(x);
          this.slider.style.transform = is3d ? "translate3d(" + translateX + ",0,0)" : "translateX(" + translateX + ")";
        };
        proto.dispatchScrollEvent = function() {
          var firstSlide = this.slides[0];
          if (!firstSlide) {
            return;
          }
          var positionX = -this.x - firstSlide.target;
          var progress = positionX / this.slidesWidth;
          this.dispatchEvent("scroll", null, [progress, positionX]);
        };
        proto.positionSliderAtSelected = function() {
          if (!this.cells.length) {
            return;
          }
          this.x = -this.selectedSlide.target;
          this.velocity = 0;
          this.positionSlider();
        };
        proto.getPositionValue = function(position) {
          if (this.options.percentPosition) {
            return Math.round(position / this.size.innerWidth * 1e4) * 0.01 + "%";
          } else {
            return Math.round(position) + "px";
          }
        };
        proto.settle = function(previousX) {
          var isResting = !this.isPointerDown && Math.round(this.x * 100) == Math.round(previousX * 100);
          if (isResting) {
            this.restingFrames++;
          }
          if (this.restingFrames > 2) {
            this.isAnimating = false;
            delete this.isFreeScrolling;
            this.positionSlider();
            this.dispatchEvent("settle", null, [this.selectedIndex]);
          }
        };
        proto.shiftWrapCells = function(x) {
          var beforeGap = this.cursorPosition + x;
          this._shiftCells(this.beforeShiftCells, beforeGap, -1);
          var afterGap = this.size.innerWidth - (x + this.slideableWidth + this.cursorPosition);
          this._shiftCells(this.afterShiftCells, afterGap, 1);
        };
        proto._shiftCells = function(cells, gap, shift) {
          for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var cellShift = gap > 0 ? shift : 0;
            cell.wrapShift(cellShift);
            gap -= cell.size.outerWidth;
          }
        };
        proto._unshiftCells = function(cells) {
          if (!cells || !cells.length) {
            return;
          }
          for (var i = 0; i < cells.length; i++) {
            cells[i].wrapShift(0);
          }
        };
        proto.integratePhysics = function() {
          this.x += this.velocity;
          this.velocity *= this.getFrictionFactor();
        };
        proto.applyForce = function(force) {
          this.velocity += force;
        };
        proto.getFrictionFactor = function() {
          return 1 - this.options[this.isFreeScrolling ? "freeScrollFriction" : "friction"];
        };
        proto.getRestingPosition = function() {
          return this.x + this.velocity / (1 - this.getFrictionFactor());
        };
        proto.applyDragForce = function() {
          if (!this.isDraggable || !this.isPointerDown) {
            return;
          }
          var dragVelocity = this.dragX - this.x;
          var dragForce = dragVelocity - this.velocity;
          this.applyForce(dragForce);
        };
        proto.applySelectedAttraction = function() {
          var dragDown = this.isDraggable && this.isPointerDown;
          if (dragDown || this.isFreeScrolling || !this.slides.length) {
            return;
          }
          var distance = this.selectedSlide.target * -1 - this.x;
          var force = distance * this.options.selectedAttraction;
          this.applyForce(force);
        };
        return proto;
      });
    }
  });

  // node_modules/flickity/js/flickity.js
  var require_flickity = __commonJS({
    "node_modules/flickity/js/flickity.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "ev-emitter/ev-emitter",
            "get-size/get-size",
            "fizzy-ui-utils/utils",
            "./cell",
            "./slide",
            "./animate"
          ], function(EvEmitter, getSize, utils, Cell, Slide, animatePrototype) {
            return factory(window2, EvEmitter, getSize, utils, Cell, Slide, animatePrototype);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_ev_emitter(), require_get_size(), require_utils(), require_cell(), require_slide(), require_animate());
        } else {
          var _Flickity = window2.Flickity;
          window2.Flickity = factory(window2, window2.EvEmitter, window2.getSize, window2.fizzyUIUtils, _Flickity.Cell, _Flickity.Slide, _Flickity.animatePrototype);
        }
      })(window, function factory(window2, EvEmitter, getSize, utils, Cell, Slide, animatePrototype) {
        "use strict";
        var jQuery = window2.jQuery;
        var getComputedStyle2 = window2.getComputedStyle;
        var console2 = window2.console;
        function moveElements(elems, toElem) {
          elems = utils.makeArray(elems);
          while (elems.length) {
            toElem.appendChild(elems.shift());
          }
        }
        var GUID = 0;
        var instances = {};
        function Flickity2(element, options) {
          var queryElement = utils.getQueryElement(element);
          if (!queryElement) {
            if (console2) {
              console2.error("Bad element for Flickity: " + (queryElement || element));
            }
            return;
          }
          this.element = queryElement;
          if (this.element.flickityGUID) {
            var instance = instances[this.element.flickityGUID];
            if (instance)
              instance.option(options);
            return instance;
          }
          if (jQuery) {
            this.$element = jQuery(this.element);
          }
          this.options = utils.extend({}, this.constructor.defaults);
          this.option(options);
          this._create();
        }
        Flickity2.defaults = {
          accessibility: true,
          cellAlign: "center",
          freeScrollFriction: 0.075,
          friction: 0.28,
          namespaceJQueryEvents: true,
          percentPosition: true,
          resize: true,
          selectedAttraction: 0.025,
          setGallerySize: true
        };
        Flickity2.createMethods = [];
        var proto = Flickity2.prototype;
        utils.extend(proto, EvEmitter.prototype);
        proto._create = function() {
          var id = this.guid = ++GUID;
          this.element.flickityGUID = id;
          instances[id] = this;
          this.selectedIndex = 0;
          this.restingFrames = 0;
          this.x = 0;
          this.velocity = 0;
          this.originSide = this.options.rightToLeft ? "right" : "left";
          this.viewport = document.createElement("div");
          this.viewport.className = "flickity-viewport";
          this._createSlider();
          if (this.options.resize || this.options.watchCSS) {
            window2.addEventListener("resize", this);
          }
          for (var eventName in this.options.on) {
            var listener = this.options.on[eventName];
            this.on(eventName, listener);
          }
          Flickity2.createMethods.forEach(function(method) {
            this[method]();
          }, this);
          if (this.options.watchCSS) {
            this.watchCSS();
          } else {
            this.activate();
          }
        };
        proto.option = function(opts) {
          utils.extend(this.options, opts);
        };
        proto.activate = function() {
          if (this.isActive) {
            return;
          }
          this.isActive = true;
          this.element.classList.add("flickity-enabled");
          if (this.options.rightToLeft) {
            this.element.classList.add("flickity-rtl");
          }
          this.getSize();
          var cellElems = this._filterFindCellElements(this.element.children);
          moveElements(cellElems, this.slider);
          this.viewport.appendChild(this.slider);
          this.element.appendChild(this.viewport);
          this.reloadCells();
          if (this.options.accessibility) {
            this.element.tabIndex = 0;
            this.element.addEventListener("keydown", this);
          }
          this.emitEvent("activate");
          this.selectInitialIndex();
          this.isInitActivated = true;
          this.dispatchEvent("ready");
        };
        proto._createSlider = function() {
          var slider = document.createElement("div");
          slider.className = "flickity-slider";
          slider.style[this.originSide] = 0;
          this.slider = slider;
        };
        proto._filterFindCellElements = function(elems) {
          return utils.filterFindElements(elems, this.options.cellSelector);
        };
        proto.reloadCells = function() {
          this.cells = this._makeCells(this.slider.children);
          this.positionCells();
          this._getWrapShiftCells();
          this.setGallerySize();
        };
        proto._makeCells = function(elems) {
          var cellElems = this._filterFindCellElements(elems);
          var cells = cellElems.map(function(cellElem) {
            return new Cell(cellElem, this);
          }, this);
          return cells;
        };
        proto.getLastCell = function() {
          return this.cells[this.cells.length - 1];
        };
        proto.getLastSlide = function() {
          return this.slides[this.slides.length - 1];
        };
        proto.positionCells = function() {
          this._sizeCells(this.cells);
          this._positionCells(0);
        };
        proto._positionCells = function(index) {
          index = index || 0;
          this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
          var cellX = 0;
          if (index > 0) {
            var startCell = this.cells[index - 1];
            cellX = startCell.x + startCell.size.outerWidth;
          }
          var len = this.cells.length;
          for (var i = index; i < len; i++) {
            var cell = this.cells[i];
            cell.setPosition(cellX);
            cellX += cell.size.outerWidth;
            this.maxCellHeight = Math.max(cell.size.outerHeight, this.maxCellHeight);
          }
          this.slideableWidth = cellX;
          this.updateSlides();
          this._containSlides();
          this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
        };
        proto._sizeCells = function(cells) {
          cells.forEach(function(cell) {
            cell.getSize();
          });
        };
        proto.updateSlides = function() {
          this.slides = [];
          if (!this.cells.length) {
            return;
          }
          var slide = new Slide(this);
          this.slides.push(slide);
          var isOriginLeft = this.originSide == "left";
          var nextMargin = isOriginLeft ? "marginRight" : "marginLeft";
          var canCellFit = this._getCanCellFit();
          this.cells.forEach(function(cell, i) {
            if (!slide.cells.length) {
              slide.addCell(cell);
              return;
            }
            var slideWidth = slide.outerWidth - slide.firstMargin + (cell.size.outerWidth - cell.size[nextMargin]);
            if (canCellFit.call(this, i, slideWidth)) {
              slide.addCell(cell);
            } else {
              slide.updateTarget();
              slide = new Slide(this);
              this.slides.push(slide);
              slide.addCell(cell);
            }
          }, this);
          slide.updateTarget();
          this.updateSelectedSlide();
        };
        proto._getCanCellFit = function() {
          var groupCells = this.options.groupCells;
          if (!groupCells) {
            return function() {
              return false;
            };
          } else if (typeof groupCells == "number") {
            var number = parseInt(groupCells, 10);
            return function(i) {
              return i % number !== 0;
            };
          }
          var percentMatch = typeof groupCells == "string" && groupCells.match(/^(\d+)%$/);
          var percent = percentMatch ? parseInt(percentMatch[1], 10) / 100 : 1;
          return function(i, slideWidth) {
            return slideWidth <= (this.size.innerWidth + 1) * percent;
          };
        };
        proto._init = proto.reposition = function() {
          this.positionCells();
          this.positionSliderAtSelected();
        };
        proto.getSize = function() {
          this.size = getSize(this.element);
          this.setCellAlign();
          this.cursorPosition = this.size.innerWidth * this.cellAlign;
        };
        var cellAlignShorthands = {
          center: {
            left: 0.5,
            right: 0.5
          },
          left: {
            left: 0,
            right: 1
          },
          right: {
            right: 0,
            left: 1
          }
        };
        proto.setCellAlign = function() {
          var shorthand = cellAlignShorthands[this.options.cellAlign];
          this.cellAlign = shorthand ? shorthand[this.originSide] : this.options.cellAlign;
        };
        proto.setGallerySize = function() {
          if (this.options.setGallerySize) {
            var height = this.options.adaptiveHeight && this.selectedSlide ? this.selectedSlide.height : this.maxCellHeight;
            this.viewport.style.height = height + "px";
          }
        };
        proto._getWrapShiftCells = function() {
          if (!this.options.wrapAround) {
            return;
          }
          this._unshiftCells(this.beforeShiftCells);
          this._unshiftCells(this.afterShiftCells);
          var gapX = this.cursorPosition;
          var cellIndex = this.cells.length - 1;
          this.beforeShiftCells = this._getGapCells(gapX, cellIndex, -1);
          gapX = this.size.innerWidth - this.cursorPosition;
          this.afterShiftCells = this._getGapCells(gapX, 0, 1);
        };
        proto._getGapCells = function(gapX, cellIndex, increment) {
          var cells = [];
          while (gapX > 0) {
            var cell = this.cells[cellIndex];
            if (!cell) {
              break;
            }
            cells.push(cell);
            cellIndex += increment;
            gapX -= cell.size.outerWidth;
          }
          return cells;
        };
        proto._containSlides = function() {
          if (!this.options.contain || this.options.wrapAround || !this.cells.length) {
            return;
          }
          var isRightToLeft = this.options.rightToLeft;
          var beginMargin = isRightToLeft ? "marginRight" : "marginLeft";
          var endMargin = isRightToLeft ? "marginLeft" : "marginRight";
          var contentWidth = this.slideableWidth - this.getLastCell().size[endMargin];
          var isContentSmaller = contentWidth < this.size.innerWidth;
          var beginBound = this.cursorPosition + this.cells[0].size[beginMargin];
          var endBound = contentWidth - this.size.innerWidth * (1 - this.cellAlign);
          this.slides.forEach(function(slide) {
            if (isContentSmaller) {
              slide.target = contentWidth * this.cellAlign;
            } else {
              slide.target = Math.max(slide.target, beginBound);
              slide.target = Math.min(slide.target, endBound);
            }
          }, this);
        };
        proto.dispatchEvent = function(type, event, args) {
          var emitArgs = event ? [event].concat(args) : args;
          this.emitEvent(type, emitArgs);
          if (jQuery && this.$element) {
            type += this.options.namespaceJQueryEvents ? ".flickity" : "";
            var $event = type;
            if (event) {
              var jQEvent = new jQuery.Event(event);
              jQEvent.type = type;
              $event = jQEvent;
            }
            this.$element.trigger($event, args);
          }
        };
        proto.select = function(index, isWrap, isInstant) {
          if (!this.isActive) {
            return;
          }
          index = parseInt(index, 10);
          this._wrapSelect(index);
          if (this.options.wrapAround || isWrap) {
            index = utils.modulo(index, this.slides.length);
          }
          if (!this.slides[index]) {
            return;
          }
          var prevIndex = this.selectedIndex;
          this.selectedIndex = index;
          this.updateSelectedSlide();
          if (isInstant) {
            this.positionSliderAtSelected();
          } else {
            this.startAnimation();
          }
          if (this.options.adaptiveHeight) {
            this.setGallerySize();
          }
          this.dispatchEvent("select", null, [index]);
          if (index != prevIndex) {
            this.dispatchEvent("change", null, [index]);
          }
          this.dispatchEvent("cellSelect");
        };
        proto._wrapSelect = function(index) {
          var len = this.slides.length;
          var isWrapping = this.options.wrapAround && len > 1;
          if (!isWrapping) {
            return index;
          }
          var wrapIndex = utils.modulo(index, len);
          var delta = Math.abs(wrapIndex - this.selectedIndex);
          var backWrapDelta = Math.abs(wrapIndex + len - this.selectedIndex);
          var forewardWrapDelta = Math.abs(wrapIndex - len - this.selectedIndex);
          if (!this.isDragSelect && backWrapDelta < delta) {
            index += len;
          } else if (!this.isDragSelect && forewardWrapDelta < delta) {
            index -= len;
          }
          if (index < 0) {
            this.x -= this.slideableWidth;
          } else if (index >= len) {
            this.x += this.slideableWidth;
          }
        };
        proto.previous = function(isWrap, isInstant) {
          this.select(this.selectedIndex - 1, isWrap, isInstant);
        };
        proto.next = function(isWrap, isInstant) {
          this.select(this.selectedIndex + 1, isWrap, isInstant);
        };
        proto.updateSelectedSlide = function() {
          var slide = this.slides[this.selectedIndex];
          if (!slide) {
            return;
          }
          this.unselectSelectedSlide();
          this.selectedSlide = slide;
          slide.select();
          this.selectedCells = slide.cells;
          this.selectedElements = slide.getCellElements();
          this.selectedCell = slide.cells[0];
          this.selectedElement = this.selectedElements[0];
        };
        proto.unselectSelectedSlide = function() {
          if (this.selectedSlide) {
            this.selectedSlide.unselect();
          }
        };
        proto.selectInitialIndex = function() {
          var initialIndex = this.options.initialIndex;
          if (this.isInitActivated) {
            this.select(this.selectedIndex, false, true);
            return;
          }
          if (initialIndex && typeof initialIndex == "string") {
            var cell = this.queryCell(initialIndex);
            if (cell) {
              this.selectCell(initialIndex, false, true);
              return;
            }
          }
          var index = 0;
          if (initialIndex && this.slides[initialIndex]) {
            index = initialIndex;
          }
          this.select(index, false, true);
        };
        proto.selectCell = function(value, isWrap, isInstant) {
          var cell = this.queryCell(value);
          if (!cell) {
            return;
          }
          var index = this.getCellSlideIndex(cell);
          this.select(index, isWrap, isInstant);
        };
        proto.getCellSlideIndex = function(cell) {
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides[i];
            var index = slide.cells.indexOf(cell);
            if (index != -1) {
              return i;
            }
          }
        };
        proto.getCell = function(elem) {
          for (var i = 0; i < this.cells.length; i++) {
            var cell = this.cells[i];
            if (cell.element == elem) {
              return cell;
            }
          }
        };
        proto.getCells = function(elems) {
          elems = utils.makeArray(elems);
          var cells = [];
          elems.forEach(function(elem) {
            var cell = this.getCell(elem);
            if (cell) {
              cells.push(cell);
            }
          }, this);
          return cells;
        };
        proto.getCellElements = function() {
          return this.cells.map(function(cell) {
            return cell.element;
          });
        };
        proto.getParentCell = function(elem) {
          var cell = this.getCell(elem);
          if (cell) {
            return cell;
          }
          elem = utils.getParent(elem, ".flickity-slider > *");
          return this.getCell(elem);
        };
        proto.getAdjacentCellElements = function(adjCount, index) {
          if (!adjCount) {
            return this.selectedSlide.getCellElements();
          }
          index = index === void 0 ? this.selectedIndex : index;
          var len = this.slides.length;
          if (1 + adjCount * 2 >= len) {
            return this.getCellElements();
          }
          var cellElems = [];
          for (var i = index - adjCount; i <= index + adjCount; i++) {
            var slideIndex = this.options.wrapAround ? utils.modulo(i, len) : i;
            var slide = this.slides[slideIndex];
            if (slide) {
              cellElems = cellElems.concat(slide.getCellElements());
            }
          }
          return cellElems;
        };
        proto.queryCell = function(selector) {
          if (typeof selector == "number") {
            return this.cells[selector];
          }
          if (typeof selector == "string") {
            if (selector.match(/^[#.]?[\d/]/)) {
              return;
            }
            selector = this.element.querySelector(selector);
          }
          return this.getCell(selector);
        };
        proto.uiChange = function() {
          this.emitEvent("uiChange");
        };
        proto.childUIPointerDown = function(event) {
          if (event.type != "touchstart") {
            event.preventDefault();
          }
          this.focus();
        };
        proto.onresize = function() {
          this.watchCSS();
          this.resize();
        };
        utils.debounceMethod(Flickity2, "onresize", 150);
        proto.resize = function() {
          if (!this.isActive || this.isAnimating || this.isDragging) {
            return;
          }
          this.getSize();
          if (this.options.wrapAround) {
            this.x = utils.modulo(this.x, this.slideableWidth);
          }
          this.positionCells();
          this._getWrapShiftCells();
          this.setGallerySize();
          this.emitEvent("resize");
          var selectedElement = this.selectedElements && this.selectedElements[0];
          this.selectCell(selectedElement, false, true);
        };
        proto.watchCSS = function() {
          var watchOption = this.options.watchCSS;
          if (!watchOption) {
            return;
          }
          var afterContent = getComputedStyle2(this.element, ":after").content;
          if (afterContent.indexOf("flickity") != -1) {
            this.activate();
          } else {
            this.deactivate();
          }
        };
        proto.onkeydown = function(event) {
          var isNotFocused = document.activeElement && document.activeElement != this.element;
          if (!this.options.accessibility || isNotFocused) {
            return;
          }
          var handler = Flickity2.keyboardHandlers[event.keyCode];
          if (handler) {
            handler.call(this);
          }
        };
        Flickity2.keyboardHandlers = {
          37: function() {
            var leftMethod = this.options.rightToLeft ? "next" : "previous";
            this.uiChange();
            this[leftMethod]();
          },
          39: function() {
            var rightMethod = this.options.rightToLeft ? "previous" : "next";
            this.uiChange();
            this[rightMethod]();
          }
        };
        proto.focus = function() {
          var prevScrollY = window2.pageYOffset;
          this.element.focus({ preventScroll: true });
          if (window2.pageYOffset != prevScrollY) {
            window2.scrollTo(window2.pageXOffset, prevScrollY);
          }
        };
        proto.deactivate = function() {
          if (!this.isActive) {
            return;
          }
          this.element.classList.remove("flickity-enabled");
          this.element.classList.remove("flickity-rtl");
          this.unselectSelectedSlide();
          this.cells.forEach(function(cell) {
            cell.destroy();
          });
          this.element.removeChild(this.viewport);
          moveElements(this.slider.children, this.element);
          if (this.options.accessibility) {
            this.element.removeAttribute("tabIndex");
            this.element.removeEventListener("keydown", this);
          }
          this.isActive = false;
          this.emitEvent("deactivate");
        };
        proto.destroy = function() {
          this.deactivate();
          window2.removeEventListener("resize", this);
          this.allOff();
          this.emitEvent("destroy");
          if (jQuery && this.$element) {
            jQuery.removeData(this.element, "flickity");
          }
          delete this.element.flickityGUID;
          delete instances[this.guid];
        };
        utils.extend(proto, animatePrototype);
        Flickity2.data = function(elem) {
          elem = utils.getQueryElement(elem);
          var id = elem && elem.flickityGUID;
          return id && instances[id];
        };
        utils.htmlInit(Flickity2, "flickity");
        if (jQuery && jQuery.bridget) {
          jQuery.bridget("flickity", Flickity2);
        }
        Flickity2.setJQuery = function(jq) {
          jQuery = jq;
        };
        Flickity2.Cell = Cell;
        Flickity2.Slide = Slide;
        return Flickity2;
      });
    }
  });

  // node_modules/unipointer/unipointer.js
  var require_unipointer = __commonJS({
    "node_modules/unipointer/unipointer.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "ev-emitter/ev-emitter"
          ], function(EvEmitter) {
            return factory(window2, EvEmitter);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_ev_emitter());
        } else {
          window2.Unipointer = factory(window2, window2.EvEmitter);
        }
      })(window, function factory(window2, EvEmitter) {
        "use strict";
        function noop() {
        }
        function Unipointer() {
        }
        var proto = Unipointer.prototype = Object.create(EvEmitter.prototype);
        proto.bindStartEvent = function(elem) {
          this._bindStartEvent(elem, true);
        };
        proto.unbindStartEvent = function(elem) {
          this._bindStartEvent(elem, false);
        };
        proto._bindStartEvent = function(elem, isAdd) {
          isAdd = isAdd === void 0 ? true : isAdd;
          var bindMethod = isAdd ? "addEventListener" : "removeEventListener";
          var startEvent = "mousedown";
          if ("ontouchstart" in window2) {
            startEvent = "touchstart";
          } else if (window2.PointerEvent) {
            startEvent = "pointerdown";
          }
          elem[bindMethod](startEvent, this);
        };
        proto.handleEvent = function(event) {
          var method = "on" + event.type;
          if (this[method]) {
            this[method](event);
          }
        };
        proto.getTouch = function(touches) {
          for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            if (touch.identifier == this.pointerIdentifier) {
              return touch;
            }
          }
        };
        proto.onmousedown = function(event) {
          var button = event.button;
          if (button && (button !== 0 && button !== 1)) {
            return;
          }
          this._pointerDown(event, event);
        };
        proto.ontouchstart = function(event) {
          this._pointerDown(event, event.changedTouches[0]);
        };
        proto.onpointerdown = function(event) {
          this._pointerDown(event, event);
        };
        proto._pointerDown = function(event, pointer) {
          if (event.button || this.isPointerDown) {
            return;
          }
          this.isPointerDown = true;
          this.pointerIdentifier = pointer.pointerId !== void 0 ? pointer.pointerId : pointer.identifier;
          this.pointerDown(event, pointer);
        };
        proto.pointerDown = function(event, pointer) {
          this._bindPostStartEvents(event);
          this.emitEvent("pointerDown", [event, pointer]);
        };
        var postStartEvents = {
          mousedown: ["mousemove", "mouseup"],
          touchstart: ["touchmove", "touchend", "touchcancel"],
          pointerdown: ["pointermove", "pointerup", "pointercancel"]
        };
        proto._bindPostStartEvents = function(event) {
          if (!event) {
            return;
          }
          var events = postStartEvents[event.type];
          events.forEach(function(eventName) {
            window2.addEventListener(eventName, this);
          }, this);
          this._boundPointerEvents = events;
        };
        proto._unbindPostStartEvents = function() {
          if (!this._boundPointerEvents) {
            return;
          }
          this._boundPointerEvents.forEach(function(eventName) {
            window2.removeEventListener(eventName, this);
          }, this);
          delete this._boundPointerEvents;
        };
        proto.onmousemove = function(event) {
          this._pointerMove(event, event);
        };
        proto.onpointermove = function(event) {
          if (event.pointerId == this.pointerIdentifier) {
            this._pointerMove(event, event);
          }
        };
        proto.ontouchmove = function(event) {
          var touch = this.getTouch(event.changedTouches);
          if (touch) {
            this._pointerMove(event, touch);
          }
        };
        proto._pointerMove = function(event, pointer) {
          this.pointerMove(event, pointer);
        };
        proto.pointerMove = function(event, pointer) {
          this.emitEvent("pointerMove", [event, pointer]);
        };
        proto.onmouseup = function(event) {
          this._pointerUp(event, event);
        };
        proto.onpointerup = function(event) {
          if (event.pointerId == this.pointerIdentifier) {
            this._pointerUp(event, event);
          }
        };
        proto.ontouchend = function(event) {
          var touch = this.getTouch(event.changedTouches);
          if (touch) {
            this._pointerUp(event, touch);
          }
        };
        proto._pointerUp = function(event, pointer) {
          this._pointerDone();
          this.pointerUp(event, pointer);
        };
        proto.pointerUp = function(event, pointer) {
          this.emitEvent("pointerUp", [event, pointer]);
        };
        proto._pointerDone = function() {
          this._pointerReset();
          this._unbindPostStartEvents();
          this.pointerDone();
        };
        proto._pointerReset = function() {
          this.isPointerDown = false;
          delete this.pointerIdentifier;
        };
        proto.pointerDone = noop;
        proto.onpointercancel = function(event) {
          if (event.pointerId == this.pointerIdentifier) {
            this._pointerCancel(event, event);
          }
        };
        proto.ontouchcancel = function(event) {
          var touch = this.getTouch(event.changedTouches);
          if (touch) {
            this._pointerCancel(event, touch);
          }
        };
        proto._pointerCancel = function(event, pointer) {
          this._pointerDone();
          this.pointerCancel(event, pointer);
        };
        proto.pointerCancel = function(event, pointer) {
          this.emitEvent("pointerCancel", [event, pointer]);
        };
        Unipointer.getPointerPoint = function(pointer) {
          return {
            x: pointer.pageX,
            y: pointer.pageY
          };
        };
        return Unipointer;
      });
    }
  });

  // node_modules/unidragger/unidragger.js
  var require_unidragger = __commonJS({
    "node_modules/unidragger/unidragger.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "unipointer/unipointer"
          ], function(Unipointer) {
            return factory(window2, Unipointer);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_unipointer());
        } else {
          window2.Unidragger = factory(window2, window2.Unipointer);
        }
      })(window, function factory(window2, Unipointer) {
        "use strict";
        function Unidragger() {
        }
        var proto = Unidragger.prototype = Object.create(Unipointer.prototype);
        proto.bindHandles = function() {
          this._bindHandles(true);
        };
        proto.unbindHandles = function() {
          this._bindHandles(false);
        };
        proto._bindHandles = function(isAdd) {
          isAdd = isAdd === void 0 ? true : isAdd;
          var bindMethod = isAdd ? "addEventListener" : "removeEventListener";
          var touchAction = isAdd ? this._touchActionValue : "";
          for (var i = 0; i < this.handles.length; i++) {
            var handle = this.handles[i];
            this._bindStartEvent(handle, isAdd);
            handle[bindMethod]("click", this);
            if (window2.PointerEvent) {
              handle.style.touchAction = touchAction;
            }
          }
        };
        proto._touchActionValue = "none";
        proto.pointerDown = function(event, pointer) {
          var isOkay = this.okayPointerDown(event);
          if (!isOkay) {
            return;
          }
          this.pointerDownPointer = {
            pageX: pointer.pageX,
            pageY: pointer.pageY
          };
          event.preventDefault();
          this.pointerDownBlur();
          this._bindPostStartEvents(event);
          this.emitEvent("pointerDown", [event, pointer]);
        };
        var cursorNodes = {
          TEXTAREA: true,
          INPUT: true,
          SELECT: true,
          OPTION: true
        };
        var clickTypes = {
          radio: true,
          checkbox: true,
          button: true,
          submit: true,
          image: true,
          file: true
        };
        proto.okayPointerDown = function(event) {
          var isCursorNode = cursorNodes[event.target.nodeName];
          var isClickType = clickTypes[event.target.type];
          var isOkay = !isCursorNode || isClickType;
          if (!isOkay) {
            this._pointerReset();
          }
          return isOkay;
        };
        proto.pointerDownBlur = function() {
          var focused = document.activeElement;
          var canBlur = focused && focused.blur && focused != document.body;
          if (canBlur) {
            focused.blur();
          }
        };
        proto.pointerMove = function(event, pointer) {
          var moveVector = this._dragPointerMove(event, pointer);
          this.emitEvent("pointerMove", [event, pointer, moveVector]);
          this._dragMove(event, pointer, moveVector);
        };
        proto._dragPointerMove = function(event, pointer) {
          var moveVector = {
            x: pointer.pageX - this.pointerDownPointer.pageX,
            y: pointer.pageY - this.pointerDownPointer.pageY
          };
          if (!this.isDragging && this.hasDragStarted(moveVector)) {
            this._dragStart(event, pointer);
          }
          return moveVector;
        };
        proto.hasDragStarted = function(moveVector) {
          return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
        };
        proto.pointerUp = function(event, pointer) {
          this.emitEvent("pointerUp", [event, pointer]);
          this._dragPointerUp(event, pointer);
        };
        proto._dragPointerUp = function(event, pointer) {
          if (this.isDragging) {
            this._dragEnd(event, pointer);
          } else {
            this._staticClick(event, pointer);
          }
        };
        proto._dragStart = function(event, pointer) {
          this.isDragging = true;
          this.isPreventingClicks = true;
          this.dragStart(event, pointer);
        };
        proto.dragStart = function(event, pointer) {
          this.emitEvent("dragStart", [event, pointer]);
        };
        proto._dragMove = function(event, pointer, moveVector) {
          if (!this.isDragging) {
            return;
          }
          this.dragMove(event, pointer, moveVector);
        };
        proto.dragMove = function(event, pointer, moveVector) {
          event.preventDefault();
          this.emitEvent("dragMove", [event, pointer, moveVector]);
        };
        proto._dragEnd = function(event, pointer) {
          this.isDragging = false;
          setTimeout(function() {
            delete this.isPreventingClicks;
          }.bind(this));
          this.dragEnd(event, pointer);
        };
        proto.dragEnd = function(event, pointer) {
          this.emitEvent("dragEnd", [event, pointer]);
        };
        proto.onclick = function(event) {
          if (this.isPreventingClicks) {
            event.preventDefault();
          }
        };
        proto._staticClick = function(event, pointer) {
          if (this.isIgnoringMouseUp && event.type == "mouseup") {
            return;
          }
          this.staticClick(event, pointer);
          if (event.type != "mouseup") {
            this.isIgnoringMouseUp = true;
            setTimeout(function() {
              delete this.isIgnoringMouseUp;
            }.bind(this), 400);
          }
        };
        proto.staticClick = function(event, pointer) {
          this.emitEvent("staticClick", [event, pointer]);
        };
        Unidragger.getPointerPoint = Unipointer.getPointerPoint;
        return Unidragger;
      });
    }
  });

  // node_modules/flickity/js/drag.js
  var require_drag = __commonJS({
    "node_modules/flickity/js/drag.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "./flickity",
            "unidragger/unidragger",
            "fizzy-ui-utils/utils"
          ], function(Flickity2, Unidragger, utils) {
            return factory(window2, Flickity2, Unidragger, utils);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_flickity(), require_unidragger(), require_utils());
        } else {
          window2.Flickity = factory(window2, window2.Flickity, window2.Unidragger, window2.fizzyUIUtils);
        }
      })(window, function factory(window2, Flickity2, Unidragger, utils) {
        "use strict";
        utils.extend(Flickity2.defaults, {
          draggable: ">1",
          dragThreshold: 3
        });
        Flickity2.createMethods.push("_createDrag");
        var proto = Flickity2.prototype;
        utils.extend(proto, Unidragger.prototype);
        proto._touchActionValue = "pan-y";
        proto._createDrag = function() {
          this.on("activate", this.onActivateDrag);
          this.on("uiChange", this._uiChangeDrag);
          this.on("deactivate", this.onDeactivateDrag);
          this.on("cellChange", this.updateDraggable);
        };
        proto.onActivateDrag = function() {
          this.handles = [this.viewport];
          this.bindHandles();
          this.updateDraggable();
        };
        proto.onDeactivateDrag = function() {
          this.unbindHandles();
          this.element.classList.remove("is-draggable");
        };
        proto.updateDraggable = function() {
          if (this.options.draggable == ">1") {
            this.isDraggable = this.slides.length > 1;
          } else {
            this.isDraggable = this.options.draggable;
          }
          if (this.isDraggable) {
            this.element.classList.add("is-draggable");
          } else {
            this.element.classList.remove("is-draggable");
          }
        };
        proto.bindDrag = function() {
          this.options.draggable = true;
          this.updateDraggable();
        };
        proto.unbindDrag = function() {
          this.options.draggable = false;
          this.updateDraggable();
        };
        proto._uiChangeDrag = function() {
          delete this.isFreeScrolling;
        };
        proto.pointerDown = function(event, pointer) {
          if (!this.isDraggable) {
            this._pointerDownDefault(event, pointer);
            return;
          }
          var isOkay = this.okayPointerDown(event);
          if (!isOkay) {
            return;
          }
          this._pointerDownPreventDefault(event);
          this.pointerDownFocus(event);
          if (document.activeElement != this.element) {
            this.pointerDownBlur();
          }
          this.dragX = this.x;
          this.viewport.classList.add("is-pointer-down");
          this.pointerDownScroll = getScrollPosition();
          window2.addEventListener("scroll", this);
          this._pointerDownDefault(event, pointer);
        };
        proto._pointerDownDefault = function(event, pointer) {
          this.pointerDownPointer = {
            pageX: pointer.pageX,
            pageY: pointer.pageY
          };
          this._bindPostStartEvents(event);
          this.dispatchEvent("pointerDown", event, [pointer]);
        };
        var focusNodes = {
          INPUT: true,
          TEXTAREA: true,
          SELECT: true
        };
        proto.pointerDownFocus = function(event) {
          var isFocusNode = focusNodes[event.target.nodeName];
          if (!isFocusNode) {
            this.focus();
          }
        };
        proto._pointerDownPreventDefault = function(event) {
          var isTouchStart = event.type == "touchstart";
          var isTouchPointer = event.pointerType == "touch";
          var isFocusNode = focusNodes[event.target.nodeName];
          if (!isTouchStart && !isTouchPointer && !isFocusNode) {
            event.preventDefault();
          }
        };
        proto.hasDragStarted = function(moveVector) {
          return Math.abs(moveVector.x) > this.options.dragThreshold;
        };
        proto.pointerUp = function(event, pointer) {
          delete this.isTouchScrolling;
          this.viewport.classList.remove("is-pointer-down");
          this.dispatchEvent("pointerUp", event, [pointer]);
          this._dragPointerUp(event, pointer);
        };
        proto.pointerDone = function() {
          window2.removeEventListener("scroll", this);
          delete this.pointerDownScroll;
        };
        proto.dragStart = function(event, pointer) {
          if (!this.isDraggable) {
            return;
          }
          this.dragStartPosition = this.x;
          this.startAnimation();
          window2.removeEventListener("scroll", this);
          this.dispatchEvent("dragStart", event, [pointer]);
        };
        proto.pointerMove = function(event, pointer) {
          var moveVector = this._dragPointerMove(event, pointer);
          this.dispatchEvent("pointerMove", event, [pointer, moveVector]);
          this._dragMove(event, pointer, moveVector);
        };
        proto.dragMove = function(event, pointer, moveVector) {
          if (!this.isDraggable) {
            return;
          }
          event.preventDefault();
          this.previousDragX = this.dragX;
          var direction = this.options.rightToLeft ? -1 : 1;
          if (this.options.wrapAround) {
            moveVector.x %= this.slideableWidth;
          }
          var dragX = this.dragStartPosition + moveVector.x * direction;
          if (!this.options.wrapAround && this.slides.length) {
            var originBound = Math.max(-this.slides[0].target, this.dragStartPosition);
            dragX = dragX > originBound ? (dragX + originBound) * 0.5 : dragX;
            var endBound = Math.min(-this.getLastSlide().target, this.dragStartPosition);
            dragX = dragX < endBound ? (dragX + endBound) * 0.5 : dragX;
          }
          this.dragX = dragX;
          this.dragMoveTime = new Date();
          this.dispatchEvent("dragMove", event, [pointer, moveVector]);
        };
        proto.dragEnd = function(event, pointer) {
          if (!this.isDraggable) {
            return;
          }
          if (this.options.freeScroll) {
            this.isFreeScrolling = true;
          }
          var index = this.dragEndRestingSelect();
          if (this.options.freeScroll && !this.options.wrapAround) {
            var restingX = this.getRestingPosition();
            this.isFreeScrolling = -restingX > this.slides[0].target && -restingX < this.getLastSlide().target;
          } else if (!this.options.freeScroll && index == this.selectedIndex) {
            index += this.dragEndBoostSelect();
          }
          delete this.previousDragX;
          this.isDragSelect = this.options.wrapAround;
          this.select(index);
          delete this.isDragSelect;
          this.dispatchEvent("dragEnd", event, [pointer]);
        };
        proto.dragEndRestingSelect = function() {
          var restingX = this.getRestingPosition();
          var distance = Math.abs(this.getSlideDistance(-restingX, this.selectedIndex));
          var positiveResting = this._getClosestResting(restingX, distance, 1);
          var negativeResting = this._getClosestResting(restingX, distance, -1);
          var index = positiveResting.distance < negativeResting.distance ? positiveResting.index : negativeResting.index;
          return index;
        };
        proto._getClosestResting = function(restingX, distance, increment) {
          var index = this.selectedIndex;
          var minDistance = Infinity;
          var condition = this.options.contain && !this.options.wrapAround ? function(dist, minDist) {
            return dist <= minDist;
          } : function(dist, minDist) {
            return dist < minDist;
          };
          while (condition(distance, minDistance)) {
            index += increment;
            minDistance = distance;
            distance = this.getSlideDistance(-restingX, index);
            if (distance === null) {
              break;
            }
            distance = Math.abs(distance);
          }
          return {
            distance: minDistance,
            index: index - increment
          };
        };
        proto.getSlideDistance = function(x, index) {
          var len = this.slides.length;
          var isWrapAround = this.options.wrapAround && len > 1;
          var slideIndex = isWrapAround ? utils.modulo(index, len) : index;
          var slide = this.slides[slideIndex];
          if (!slide) {
            return null;
          }
          var wrap = isWrapAround ? this.slideableWidth * Math.floor(index / len) : 0;
          return x - (slide.target + wrap);
        };
        proto.dragEndBoostSelect = function() {
          if (this.previousDragX === void 0 || !this.dragMoveTime || new Date() - this.dragMoveTime > 100) {
            return 0;
          }
          var distance = this.getSlideDistance(-this.dragX, this.selectedIndex);
          var delta = this.previousDragX - this.dragX;
          if (distance > 0 && delta > 0) {
            return 1;
          } else if (distance < 0 && delta < 0) {
            return -1;
          }
          return 0;
        };
        proto.staticClick = function(event, pointer) {
          var clickedCell = this.getParentCell(event.target);
          var cellElem = clickedCell && clickedCell.element;
          var cellIndex = clickedCell && this.cells.indexOf(clickedCell);
          this.dispatchEvent("staticClick", event, [pointer, cellElem, cellIndex]);
        };
        proto.onscroll = function() {
          var scroll = getScrollPosition();
          var scrollMoveX = this.pointerDownScroll.x - scroll.x;
          var scrollMoveY = this.pointerDownScroll.y - scroll.y;
          if (Math.abs(scrollMoveX) > 3 || Math.abs(scrollMoveY) > 3) {
            this._pointerDone();
          }
        };
        function getScrollPosition() {
          return {
            x: window2.pageXOffset,
            y: window2.pageYOffset
          };
        }
        return Flickity2;
      });
    }
  });

  // node_modules/flickity/js/prev-next-button.js
  var require_prev_next_button = __commonJS({
    "node_modules/flickity/js/prev-next-button.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "./flickity",
            "unipointer/unipointer",
            "fizzy-ui-utils/utils"
          ], function(Flickity2, Unipointer, utils) {
            return factory(window2, Flickity2, Unipointer, utils);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_flickity(), require_unipointer(), require_utils());
        } else {
          factory(window2, window2.Flickity, window2.Unipointer, window2.fizzyUIUtils);
        }
      })(window, function factory(window2, Flickity2, Unipointer, utils) {
        "use strict";
        var svgURI = "http://www.w3.org/2000/svg";
        function PrevNextButton(direction, parent) {
          this.direction = direction;
          this.parent = parent;
          this._create();
        }
        PrevNextButton.prototype = Object.create(Unipointer.prototype);
        PrevNextButton.prototype._create = function() {
          this.isEnabled = true;
          this.isPrevious = this.direction == -1;
          var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
          this.isLeft = this.direction == leftDirection;
          var element = this.element = document.createElement("button");
          element.className = "flickity-button flickity-prev-next-button";
          element.className += this.isPrevious ? " previous" : " next";
          element.setAttribute("type", "button");
          this.disable();
          element.setAttribute("aria-label", this.isPrevious ? "Previous" : "Next");
          var svg = this.createSVG();
          element.appendChild(svg);
          this.parent.on("select", this.update.bind(this));
          this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent));
        };
        PrevNextButton.prototype.activate = function() {
          this.bindStartEvent(this.element);
          this.element.addEventListener("click", this);
          this.parent.element.appendChild(this.element);
        };
        PrevNextButton.prototype.deactivate = function() {
          this.parent.element.removeChild(this.element);
          this.unbindStartEvent(this.element);
          this.element.removeEventListener("click", this);
        };
        PrevNextButton.prototype.createSVG = function() {
          var svg = document.createElementNS(svgURI, "svg");
          svg.setAttribute("class", "flickity-button-icon");
          svg.setAttribute("viewBox", "0 0 100 100");
          var path = document.createElementNS(svgURI, "path");
          var pathMovements = getArrowMovements(this.parent.options.arrowShape);
          path.setAttribute("d", pathMovements);
          path.setAttribute("class", "arrow");
          if (!this.isLeft) {
            path.setAttribute("transform", "translate(100, 100) rotate(180) ");
          }
          svg.appendChild(path);
          return svg;
        };
        function getArrowMovements(shape) {
          if (typeof shape == "string") {
            return shape;
          }
          return "M " + shape.x0 + ",50 L " + shape.x1 + "," + (shape.y1 + 50) + " L " + shape.x2 + "," + (shape.y2 + 50) + " L " + shape.x3 + ",50  L " + shape.x2 + "," + (50 - shape.y2) + " L " + shape.x1 + "," + (50 - shape.y1) + " Z";
        }
        PrevNextButton.prototype.handleEvent = utils.handleEvent;
        PrevNextButton.prototype.onclick = function() {
          if (!this.isEnabled) {
            return;
          }
          this.parent.uiChange();
          var method = this.isPrevious ? "previous" : "next";
          this.parent[method]();
        };
        PrevNextButton.prototype.enable = function() {
          if (this.isEnabled) {
            return;
          }
          this.element.disabled = false;
          this.isEnabled = true;
        };
        PrevNextButton.prototype.disable = function() {
          if (!this.isEnabled) {
            return;
          }
          this.element.disabled = true;
          this.isEnabled = false;
        };
        PrevNextButton.prototype.update = function() {
          var slides = this.parent.slides;
          if (this.parent.options.wrapAround && slides.length > 1) {
            this.enable();
            return;
          }
          var lastIndex = slides.length ? slides.length - 1 : 0;
          var boundIndex = this.isPrevious ? 0 : lastIndex;
          var method = this.parent.selectedIndex == boundIndex ? "disable" : "enable";
          this[method]();
        };
        PrevNextButton.prototype.destroy = function() {
          this.deactivate();
          this.allOff();
        };
        utils.extend(Flickity2.defaults, {
          prevNextButtons: true,
          arrowShape: {
            x0: 10,
            x1: 60,
            y1: 50,
            x2: 70,
            y2: 40,
            x3: 30
          }
        });
        Flickity2.createMethods.push("_createPrevNextButtons");
        var proto = Flickity2.prototype;
        proto._createPrevNextButtons = function() {
          if (!this.options.prevNextButtons) {
            return;
          }
          this.prevButton = new PrevNextButton(-1, this);
          this.nextButton = new PrevNextButton(1, this);
          this.on("activate", this.activatePrevNextButtons);
        };
        proto.activatePrevNextButtons = function() {
          this.prevButton.activate();
          this.nextButton.activate();
          this.on("deactivate", this.deactivatePrevNextButtons);
        };
        proto.deactivatePrevNextButtons = function() {
          this.prevButton.deactivate();
          this.nextButton.deactivate();
          this.off("deactivate", this.deactivatePrevNextButtons);
        };
        Flickity2.PrevNextButton = PrevNextButton;
        return Flickity2;
      });
    }
  });

  // node_modules/flickity/js/page-dots.js
  var require_page_dots = __commonJS({
    "node_modules/flickity/js/page-dots.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "./flickity",
            "unipointer/unipointer",
            "fizzy-ui-utils/utils"
          ], function(Flickity2, Unipointer, utils) {
            return factory(window2, Flickity2, Unipointer, utils);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_flickity(), require_unipointer(), require_utils());
        } else {
          factory(window2, window2.Flickity, window2.Unipointer, window2.fizzyUIUtils);
        }
      })(window, function factory(window2, Flickity2, Unipointer, utils) {
        "use strict";
        function PageDots(parent) {
          this.parent = parent;
          this._create();
        }
        PageDots.prototype = Object.create(Unipointer.prototype);
        PageDots.prototype._create = function() {
          this.holder = document.createElement("ol");
          this.holder.className = "flickity-page-dots";
          this.dots = [];
          this.handleClick = this.onClick.bind(this);
          this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent));
        };
        PageDots.prototype.activate = function() {
          this.setDots();
          this.holder.addEventListener("click", this.handleClick);
          this.bindStartEvent(this.holder);
          this.parent.element.appendChild(this.holder);
        };
        PageDots.prototype.deactivate = function() {
          this.holder.removeEventListener("click", this.handleClick);
          this.unbindStartEvent(this.holder);
          this.parent.element.removeChild(this.holder);
        };
        PageDots.prototype.setDots = function() {
          var delta = this.parent.slides.length - this.dots.length;
          if (delta > 0) {
            this.addDots(delta);
          } else if (delta < 0) {
            this.removeDots(-delta);
          }
        };
        PageDots.prototype.addDots = function(count) {
          var fragment = document.createDocumentFragment();
          var newDots = [];
          var length = this.dots.length;
          var max = length + count;
          for (var i = length; i < max; i++) {
            var dot = document.createElement("li");
            dot.className = "dot";
            dot.setAttribute("aria-label", "Page dot " + (i + 1));
            fragment.appendChild(dot);
            newDots.push(dot);
          }
          this.holder.appendChild(fragment);
          this.dots = this.dots.concat(newDots);
        };
        PageDots.prototype.removeDots = function(count) {
          var removeDots = this.dots.splice(this.dots.length - count, count);
          removeDots.forEach(function(dot) {
            this.holder.removeChild(dot);
          }, this);
        };
        PageDots.prototype.updateSelected = function() {
          if (this.selectedDot) {
            this.selectedDot.className = "dot";
            this.selectedDot.removeAttribute("aria-current");
          }
          if (!this.dots.length) {
            return;
          }
          this.selectedDot = this.dots[this.parent.selectedIndex];
          this.selectedDot.className = "dot is-selected";
          this.selectedDot.setAttribute("aria-current", "step");
        };
        PageDots.prototype.onTap = PageDots.prototype.onClick = function(event) {
          var target = event.target;
          if (target.nodeName != "LI") {
            return;
          }
          this.parent.uiChange();
          var index = this.dots.indexOf(target);
          this.parent.select(index);
        };
        PageDots.prototype.destroy = function() {
          this.deactivate();
          this.allOff();
        };
        Flickity2.PageDots = PageDots;
        utils.extend(Flickity2.defaults, {
          pageDots: true
        });
        Flickity2.createMethods.push("_createPageDots");
        var proto = Flickity2.prototype;
        proto._createPageDots = function() {
          if (!this.options.pageDots) {
            return;
          }
          this.pageDots = new PageDots(this);
          this.on("activate", this.activatePageDots);
          this.on("select", this.updateSelectedPageDots);
          this.on("cellChange", this.updatePageDots);
          this.on("resize", this.updatePageDots);
          this.on("deactivate", this.deactivatePageDots);
        };
        proto.activatePageDots = function() {
          this.pageDots.activate();
        };
        proto.updateSelectedPageDots = function() {
          this.pageDots.updateSelected();
        };
        proto.updatePageDots = function() {
          this.pageDots.setDots();
        };
        proto.deactivatePageDots = function() {
          this.pageDots.deactivate();
        };
        Flickity2.PageDots = PageDots;
        return Flickity2;
      });
    }
  });

  // node_modules/flickity/js/player.js
  var require_player = __commonJS({
    "node_modules/flickity/js/player.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "ev-emitter/ev-emitter",
            "fizzy-ui-utils/utils",
            "./flickity"
          ], function(EvEmitter, utils, Flickity2) {
            return factory(EvEmitter, utils, Flickity2);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(require_ev_emitter(), require_utils(), require_flickity());
        } else {
          factory(window2.EvEmitter, window2.fizzyUIUtils, window2.Flickity);
        }
      })(window, function factory(EvEmitter, utils, Flickity2) {
        "use strict";
        function Player(parent) {
          this.parent = parent;
          this.state = "stopped";
          this.onVisibilityChange = this.visibilityChange.bind(this);
          this.onVisibilityPlay = this.visibilityPlay.bind(this);
        }
        Player.prototype = Object.create(EvEmitter.prototype);
        Player.prototype.play = function() {
          if (this.state == "playing") {
            return;
          }
          var isPageHidden = document.hidden;
          if (isPageHidden) {
            document.addEventListener("visibilitychange", this.onVisibilityPlay);
            return;
          }
          this.state = "playing";
          document.addEventListener("visibilitychange", this.onVisibilityChange);
          this.tick();
        };
        Player.prototype.tick = function() {
          if (this.state != "playing") {
            return;
          }
          var time = this.parent.options.autoPlay;
          time = typeof time == "number" ? time : 3e3;
          var _this = this;
          this.clear();
          this.timeout = setTimeout(function() {
            _this.parent.next(true);
            _this.tick();
          }, time);
        };
        Player.prototype.stop = function() {
          this.state = "stopped";
          this.clear();
          document.removeEventListener("visibilitychange", this.onVisibilityChange);
        };
        Player.prototype.clear = function() {
          clearTimeout(this.timeout);
        };
        Player.prototype.pause = function() {
          if (this.state == "playing") {
            this.state = "paused";
            this.clear();
          }
        };
        Player.prototype.unpause = function() {
          if (this.state == "paused") {
            this.play();
          }
        };
        Player.prototype.visibilityChange = function() {
          var isPageHidden = document.hidden;
          this[isPageHidden ? "pause" : "unpause"]();
        };
        Player.prototype.visibilityPlay = function() {
          this.play();
          document.removeEventListener("visibilitychange", this.onVisibilityPlay);
        };
        utils.extend(Flickity2.defaults, {
          pauseAutoPlayOnHover: true
        });
        Flickity2.createMethods.push("_createPlayer");
        var proto = Flickity2.prototype;
        proto._createPlayer = function() {
          this.player = new Player(this);
          this.on("activate", this.activatePlayer);
          this.on("uiChange", this.stopPlayer);
          this.on("pointerDown", this.stopPlayer);
          this.on("deactivate", this.deactivatePlayer);
        };
        proto.activatePlayer = function() {
          if (!this.options.autoPlay) {
            return;
          }
          this.player.play();
          this.element.addEventListener("mouseenter", this);
        };
        proto.playPlayer = function() {
          this.player.play();
        };
        proto.stopPlayer = function() {
          this.player.stop();
        };
        proto.pausePlayer = function() {
          this.player.pause();
        };
        proto.unpausePlayer = function() {
          this.player.unpause();
        };
        proto.deactivatePlayer = function() {
          this.player.stop();
          this.element.removeEventListener("mouseenter", this);
        };
        proto.onmouseenter = function() {
          if (!this.options.pauseAutoPlayOnHover) {
            return;
          }
          this.player.pause();
          this.element.addEventListener("mouseleave", this);
        };
        proto.onmouseleave = function() {
          this.player.unpause();
          this.element.removeEventListener("mouseleave", this);
        };
        Flickity2.Player = Player;
        return Flickity2;
      });
    }
  });

  // node_modules/flickity/js/add-remove-cell.js
  var require_add_remove_cell = __commonJS({
    "node_modules/flickity/js/add-remove-cell.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "./flickity",
            "fizzy-ui-utils/utils"
          ], function(Flickity2, utils) {
            return factory(window2, Flickity2, utils);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_flickity(), require_utils());
        } else {
          factory(window2, window2.Flickity, window2.fizzyUIUtils);
        }
      })(window, function factory(window2, Flickity2, utils) {
        "use strict";
        function getCellsFragment(cells) {
          var fragment = document.createDocumentFragment();
          cells.forEach(function(cell) {
            fragment.appendChild(cell.element);
          });
          return fragment;
        }
        var proto = Flickity2.prototype;
        proto.insert = function(elems, index) {
          var cells = this._makeCells(elems);
          if (!cells || !cells.length) {
            return;
          }
          var len = this.cells.length;
          index = index === void 0 ? len : index;
          var fragment = getCellsFragment(cells);
          var isAppend = index == len;
          if (isAppend) {
            this.slider.appendChild(fragment);
          } else {
            var insertCellElement = this.cells[index].element;
            this.slider.insertBefore(fragment, insertCellElement);
          }
          if (index === 0) {
            this.cells = cells.concat(this.cells);
          } else if (isAppend) {
            this.cells = this.cells.concat(cells);
          } else {
            var endCells = this.cells.splice(index, len - index);
            this.cells = this.cells.concat(cells).concat(endCells);
          }
          this._sizeCells(cells);
          this.cellChange(index, true);
        };
        proto.append = function(elems) {
          this.insert(elems, this.cells.length);
        };
        proto.prepend = function(elems) {
          this.insert(elems, 0);
        };
        proto.remove = function(elems) {
          var cells = this.getCells(elems);
          if (!cells || !cells.length) {
            return;
          }
          var minCellIndex = this.cells.length - 1;
          cells.forEach(function(cell) {
            cell.remove();
            var index = this.cells.indexOf(cell);
            minCellIndex = Math.min(index, minCellIndex);
            utils.removeFrom(this.cells, cell);
          }, this);
          this.cellChange(minCellIndex, true);
        };
        proto.cellSizeChange = function(elem) {
          var cell = this.getCell(elem);
          if (!cell) {
            return;
          }
          cell.getSize();
          var index = this.cells.indexOf(cell);
          this.cellChange(index);
        };
        proto.cellChange = function(changedCellIndex, isPositioningSlider) {
          var prevSelectedElem = this.selectedElement;
          this._positionCells(changedCellIndex);
          this._getWrapShiftCells();
          this.setGallerySize();
          var cell = this.getCell(prevSelectedElem);
          if (cell) {
            this.selectedIndex = this.getCellSlideIndex(cell);
          }
          this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex);
          this.emitEvent("cellChange", [changedCellIndex]);
          this.select(this.selectedIndex);
          if (isPositioningSlider) {
            this.positionSliderAtSelected();
          }
        };
        return Flickity2;
      });
    }
  });

  // node_modules/flickity/js/lazyload.js
  var require_lazyload = __commonJS({
    "node_modules/flickity/js/lazyload.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "./flickity",
            "fizzy-ui-utils/utils"
          ], function(Flickity2, utils) {
            return factory(window2, Flickity2, utils);
          });
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(window2, require_flickity(), require_utils());
        } else {
          factory(window2, window2.Flickity, window2.fizzyUIUtils);
        }
      })(window, function factory(window2, Flickity2, utils) {
        "use strict";
        Flickity2.createMethods.push("_createLazyload");
        var proto = Flickity2.prototype;
        proto._createLazyload = function() {
          this.on("select", this.lazyLoad);
        };
        proto.lazyLoad = function() {
          var lazyLoad = this.options.lazyLoad;
          if (!lazyLoad) {
            return;
          }
          var adjCount = typeof lazyLoad == "number" ? lazyLoad : 0;
          var cellElems = this.getAdjacentCellElements(adjCount);
          var lazyImages = [];
          cellElems.forEach(function(cellElem) {
            var lazyCellImages = getCellLazyImages(cellElem);
            lazyImages = lazyImages.concat(lazyCellImages);
          });
          lazyImages.forEach(function(img) {
            new LazyLoader(img, this);
          }, this);
        };
        function getCellLazyImages(cellElem) {
          if (cellElem.nodeName == "IMG") {
            var lazyloadAttr = cellElem.getAttribute("data-flickity-lazyload");
            var srcAttr = cellElem.getAttribute("data-flickity-lazyload-src");
            var srcsetAttr = cellElem.getAttribute("data-flickity-lazyload-srcset");
            if (lazyloadAttr || srcAttr || srcsetAttr) {
              return [cellElem];
            }
          }
          var lazySelector = "img[data-flickity-lazyload], img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]";
          var imgs = cellElem.querySelectorAll(lazySelector);
          return utils.makeArray(imgs);
        }
        function LazyLoader(img, flickity) {
          this.img = img;
          this.flickity = flickity;
          this.load();
        }
        LazyLoader.prototype.handleEvent = utils.handleEvent;
        LazyLoader.prototype.load = function() {
          this.img.addEventListener("load", this);
          this.img.addEventListener("error", this);
          var src = this.img.getAttribute("data-flickity-lazyload") || this.img.getAttribute("data-flickity-lazyload-src");
          var srcset = this.img.getAttribute("data-flickity-lazyload-srcset");
          this.img.src = src;
          if (srcset) {
            this.img.setAttribute("srcset", srcset);
          }
          this.img.removeAttribute("data-flickity-lazyload");
          this.img.removeAttribute("data-flickity-lazyload-src");
          this.img.removeAttribute("data-flickity-lazyload-srcset");
        };
        LazyLoader.prototype.onload = function(event) {
          this.complete(event, "flickity-lazyloaded");
        };
        LazyLoader.prototype.onerror = function(event) {
          this.complete(event, "flickity-lazyerror");
        };
        LazyLoader.prototype.complete = function(event, className) {
          this.img.removeEventListener("load", this);
          this.img.removeEventListener("error", this);
          var cell = this.flickity.getParentCell(this.img);
          var cellElem = cell && cell.element;
          this.flickity.cellSizeChange(cellElem);
          this.img.classList.add(className);
          this.flickity.dispatchEvent("lazyLoad", event, cellElem);
        };
        Flickity2.LazyLoader = LazyLoader;
        return Flickity2;
      });
    }
  });

  // node_modules/flickity/js/index.js
  var require_js = __commonJS({
    "node_modules/flickity/js/index.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "./flickity",
            "./drag",
            "./prev-next-button",
            "./page-dots",
            "./player",
            "./add-remove-cell",
            "./lazyload"
          ], factory);
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(require_flickity(), require_drag(), require_prev_next_button(), require_page_dots(), require_player(), require_add_remove_cell(), require_lazyload());
        }
      })(window, function factory(Flickity2) {
        return Flickity2;
      });
    }
  });

  // node_modules/flickity-fade/flickity-fade.js
  var require_flickity_fade = __commonJS({
    "node_modules/flickity-fade/flickity-fade.js"(exports, module) {
      (function(window2, factory) {
        if (typeof define == "function" && define.amd) {
          define([
            "flickity/js/index",
            "fizzy-ui-utils/utils"
          ], factory);
        } else if (typeof module == "object" && module.exports) {
          module.exports = factory(require_js(), require_utils());
        } else {
          factory(window2.Flickity, window2.fizzyUIUtils);
        }
      })(exports, function factory(Flickity2, utils) {
        var Slide = Flickity2.Slide;
        var slideUpdateTarget = Slide.prototype.updateTarget;
        Slide.prototype.updateTarget = function() {
          slideUpdateTarget.apply(this, arguments);
          if (!this.parent.options.fade) {
            return;
          }
          var slideTargetX = this.target - this.x;
          var firstCellX = this.cells[0].x;
          this.cells.forEach(function(cell) {
            var targetX = cell.x - firstCellX - slideTargetX;
            cell.renderPosition(targetX);
          });
        };
        Slide.prototype.setOpacity = function(alpha) {
          this.cells.forEach(function(cell) {
            cell.element.style.opacity = alpha;
          });
        };
        var proto = Flickity2.prototype;
        Flickity2.createMethods.push("_createFade");
        proto._createFade = function() {
          this.fadeIndex = this.selectedIndex;
          this.prevSelectedIndex = this.selectedIndex;
          this.on("select", this.onSelectFade);
          this.on("dragEnd", this.onDragEndFade);
          this.on("settle", this.onSettleFade);
          this.on("activate", this.onActivateFade);
          this.on("deactivate", this.onDeactivateFade);
        };
        var updateSlides = proto.updateSlides;
        proto.updateSlides = function() {
          updateSlides.apply(this, arguments);
          if (!this.options.fade) {
            return;
          }
          this.slides.forEach(function(slide, i) {
            var alpha = i == this.selectedIndex ? 1 : 0;
            slide.setOpacity(alpha);
          }, this);
        };
        proto.onSelectFade = function() {
          this.fadeIndex = Math.min(this.prevSelectedIndex, this.slides.length - 1);
          this.prevSelectedIndex = this.selectedIndex;
        };
        proto.onSettleFade = function() {
          delete this.didDragEnd;
          if (!this.options.fade) {
            return;
          }
          this.selectedSlide.setOpacity(1);
          var fadedSlide = this.slides[this.fadeIndex];
          if (fadedSlide && this.fadeIndex != this.selectedIndex) {
            this.slides[this.fadeIndex].setOpacity(0);
          }
        };
        proto.onDragEndFade = function() {
          this.didDragEnd = true;
        };
        proto.onActivateFade = function() {
          if (this.options.fade) {
            this.element.classList.add("is-fade");
          }
        };
        proto.onDeactivateFade = function() {
          if (!this.options.fade) {
            return;
          }
          this.element.classList.remove("is-fade");
          this.slides.forEach(function(slide) {
            slide.setOpacity("");
          });
        };
        var positionSlider = proto.positionSlider;
        proto.positionSlider = function() {
          if (!this.options.fade) {
            positionSlider.apply(this, arguments);
            return;
          }
          this.fadeSlides();
          this.dispatchScrollEvent();
        };
        var positionSliderAtSelected = proto.positionSliderAtSelected;
        proto.positionSliderAtSelected = function() {
          if (this.options.fade) {
            this.setTranslateX(0);
          }
          positionSliderAtSelected.apply(this, arguments);
        };
        proto.fadeSlides = function() {
          if (this.slides.length < 2) {
            return;
          }
          var indexes = this.getFadeIndexes();
          var fadeSlideA = this.slides[indexes.a];
          var fadeSlideB = this.slides[indexes.b];
          var distance = this.wrapDifference(fadeSlideA.target, fadeSlideB.target);
          var progress = this.wrapDifference(fadeSlideA.target, -this.x);
          progress = progress / distance;
          fadeSlideA.setOpacity(1 - progress);
          fadeSlideB.setOpacity(progress);
          var fadeHideIndex = indexes.a;
          if (this.isDragging) {
            fadeHideIndex = progress > 0.5 ? indexes.a : indexes.b;
          }
          var isNewHideIndex = this.fadeHideIndex != void 0 && this.fadeHideIndex != fadeHideIndex && this.fadeHideIndex != indexes.a && this.fadeHideIndex != indexes.b;
          if (isNewHideIndex) {
            this.slides[this.fadeHideIndex].setOpacity(0);
          }
          this.fadeHideIndex = fadeHideIndex;
        };
        proto.getFadeIndexes = function() {
          if (!this.isDragging && !this.didDragEnd) {
            return {
              a: this.fadeIndex,
              b: this.selectedIndex
            };
          }
          if (this.options.wrapAround) {
            return this.getFadeDragWrapIndexes();
          } else {
            return this.getFadeDragLimitIndexes();
          }
        };
        proto.getFadeDragWrapIndexes = function() {
          var distances = this.slides.map(function(slide, i) {
            return this.getSlideDistance(-this.x, i);
          }, this);
          var absDistances = distances.map(function(distance2) {
            return Math.abs(distance2);
          });
          var minDistance = Math.min.apply(Math, absDistances);
          var closestIndex = absDistances.indexOf(minDistance);
          var distance = distances[closestIndex];
          var len = this.slides.length;
          var delta = distance >= 0 ? 1 : -1;
          return {
            a: closestIndex,
            b: utils.modulo(closestIndex + delta, len)
          };
        };
        proto.getFadeDragLimitIndexes = function() {
          var dragIndex = 0;
          for (var i = 0; i < this.slides.length - 1; i++) {
            var slide = this.slides[i];
            if (-this.x < slide.target) {
              break;
            }
            dragIndex = i;
          }
          return {
            a: dragIndex,
            b: dragIndex + 1
          };
        };
        proto.wrapDifference = function(a, b) {
          var diff = b - a;
          if (!this.options.wrapAround) {
            return diff;
          }
          var diffPlus = diff + this.slideableWidth;
          var diffMinus = diff - this.slideableWidth;
          if (Math.abs(diffPlus) < Math.abs(diff)) {
            diff = diffPlus;
          }
          if (Math.abs(diffMinus) < Math.abs(diff)) {
            diff = diffMinus;
          }
          return diff;
        };
        var _getWrapShiftCells = proto._getWrapShiftCells;
        proto._getWrapShiftCells = function() {
          if (!this.options.fade) {
            _getWrapShiftCells.apply(this, arguments);
          }
        };
        var shiftWrapCells = proto.shiftWrapCells;
        proto.shiftWrapCells = function() {
          if (!this.options.fade) {
            shiftWrapCells.apply(this, arguments);
          }
        };
        return Flickity2;
      });
    }
  });

  // js/flickity.js
  var import_flickity_fade = __toModule(require_flickity_fade());
  (() => {
    let touchingCarousel = false, touchStartCoords;
    document.body.addEventListener("touchstart", function(e) {
      let flickitySliderElement = e.target.closest(".flickity-slider");
      if (flickitySliderElement) {
        let flickity = import_flickity_fade.default.data(flickitySliderElement.closest(".flickity-enabled"));
        if (flickity.isDraggable) {
          touchingCarousel = true;
        } else {
          touchingCarousel = false;
          return;
        }
      } else {
        touchingCarousel = false;
        return;
      }
      touchStartCoords = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    });
    document.body.addEventListener("touchmove", function(e) {
      if (!(touchingCarousel && e.cancelable)) {
        return;
      }
      let moveVector = {
        x: e.touches[0].pageX - touchStartCoords.x,
        y: e.touches[0].pageY - touchStartCoords.y
      };
      if (Math.abs(moveVector.x) > 8)
        e.preventDefault();
    }, { passive: false });
  })();
  window.ThemeFlickity = import_flickity_fade.default;
})();
/*!
 * Flickity v2.3.0
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2021 Metafizzy
 */
/*!
 * Unidragger v2.4.0
 * Draggable base class
 * MIT license
 */
/*!
 * Unipointer v2.4.0
 * base class for doing one thing with pointer event
 * MIT license
 */
/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */
