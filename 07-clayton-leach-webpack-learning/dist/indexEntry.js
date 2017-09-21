/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(10);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./font-awesome.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./font-awesome.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./float-grid.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./float-grid.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./base-styles.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./base-styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate, module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! Browser bundle of nunjucks 3.0.1  */
(function webpackUniversalModuleDefinition(root, factory) {
	if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["nunjucks"] = factory();else root["nunjucks"] = factory();
})(undefined, function () {
	return (/******/function (modules) {
			// webpackBootstrap
			/******/ // The module cache
			/******/var installedModules = {};

			/******/ // The require function
			/******/function __webpack_require__(moduleId) {

				/******/ // Check if module is in cache
				/******/if (installedModules[moduleId])
					/******/return installedModules[moduleId].exports;

				/******/ // Create a new module (and put it into the cache)
				/******/var module = installedModules[moduleId] = {
					/******/exports: {},
					/******/id: moduleId,
					/******/loaded: false
					/******/ };

				/******/ // Execute the module function
				/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

				/******/ // Flag the module as loaded
				/******/module.loaded = true;

				/******/ // Return the exports of the module
				/******/return module.exports;
				/******/
			}

			/******/ // expose the modules object (__webpack_modules__)
			/******/__webpack_require__.m = modules;

			/******/ // expose the module cache
			/******/__webpack_require__.c = installedModules;

			/******/ // __webpack_public_path__
			/******/__webpack_require__.p = "";

			/******/ // Load entry module and return exports
			/******/return __webpack_require__(0);
			/******/
		}(
		/************************************************************************/
		/******/[
		/* 0 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var lib = __webpack_require__(1);
			var env = __webpack_require__(2);
			var Loader = __webpack_require__(16);
			var loaders = __webpack_require__(15);
			var precompile = __webpack_require__(3);

			module.exports = {};
			module.exports.Environment = env.Environment;
			module.exports.Template = env.Template;

			module.exports.Loader = Loader;
			module.exports.FileSystemLoader = loaders.FileSystemLoader;
			module.exports.PrecompiledLoader = loaders.PrecompiledLoader;
			module.exports.WebLoader = loaders.WebLoader;

			module.exports.compiler = __webpack_require__(7);
			module.exports.parser = __webpack_require__(8);
			module.exports.lexer = __webpack_require__(9);
			module.exports.runtime = __webpack_require__(13);
			module.exports.lib = lib;
			module.exports.nodes = __webpack_require__(10);

			module.exports.installJinjaCompat = __webpack_require__(22);

			// A single instance of an environment, since this is so commonly used

			var e;
			module.exports.configure = function (templatesPath, opts) {
				opts = opts || {};
				if (lib.isObject(templatesPath)) {
					opts = templatesPath;
					templatesPath = null;
				}

				var TemplateLoader;
				if (loaders.FileSystemLoader) {
					TemplateLoader = new loaders.FileSystemLoader(templatesPath, {
						watch: opts.watch,
						noCache: opts.noCache
					});
				} else if (loaders.WebLoader) {
					TemplateLoader = new loaders.WebLoader(templatesPath, {
						useCache: opts.web && opts.web.useCache,
						async: opts.web && opts.web.async
					});
				}

				e = new env.Environment(TemplateLoader, opts);

				if (opts && opts.express) {
					e.express(opts.express);
				}

				return e;
			};

			module.exports.compile = function (src, env, path, eagerCompile) {
				if (!e) {
					module.exports.configure();
				}
				return new module.exports.Template(src, env, path, eagerCompile);
			};

			module.exports.render = function (name, ctx, cb) {
				if (!e) {
					module.exports.configure();
				}

				return e.render(name, ctx, cb);
			};

			module.exports.renderString = function (src, ctx, cb) {
				if (!e) {
					module.exports.configure();
				}

				return e.renderString(src, ctx, cb);
			};

			if (precompile) {
				module.exports.precompile = precompile.precompile;
				module.exports.precompileString = precompile.precompileString;
			}

			/***/
		},
		/* 1 */
		/***/function (module, exports) {

			'use strict';

			var ArrayProto = Array.prototype;
			var ObjProto = Object.prototype;

			var escapeMap = {
				'&': '&amp;',
				'"': '&quot;',
				'\'': '&#39;',
				'<': '&lt;',
				'>': '&gt;'
			};

			var escapeRegex = /[&"'<>]/g;

			var lookupEscape = function lookupEscape(ch) {
				return escapeMap[ch];
			};

			var exports = module.exports = {};

			exports.prettifyError = function (path, withInternals, err) {
				// jshint -W022
				// http://jslinterrors.com/do-not-assign-to-the-exception-parameter
				if (!err.Update) {
					// not one of ours, cast it
					err = new exports.TemplateError(err);
				}
				err.Update(path);

				// Unless they marked the dev flag, show them a trace from here
				if (!withInternals) {
					var old = err;
					err = new Error(old.message);
					err.name = old.name;
				}

				return err;
			};

			exports.TemplateError = function (message, lineno, colno) {
				var err = this;

				if (message instanceof Error) {
					// for casting regular js errors
					err = message;
					message = message.name + ': ' + message.message;

					try {
						if (err.name = '') {}
					} catch (e) {
						// If we can't set the name of the error object in this
						// environment, don't use it
						err = this;
					}
				} else {
					if (Error.captureStackTrace) {
						Error.captureStackTrace(err);
					}
				}

				err.name = 'Template render error';
				err.message = message;
				err.lineno = lineno;
				err.colno = colno;
				err.firstUpdate = true;

				err.Update = function (path) {
					var message = '(' + (path || 'unknown path') + ')';

					// only show lineno + colno next to path of template
					// where error occurred
					if (this.firstUpdate) {
						if (this.lineno && this.colno) {
							message += ' [Line ' + this.lineno + ', Column ' + this.colno + ']';
						} else if (this.lineno) {
							message += ' [Line ' + this.lineno + ']';
						}
					}

					message += '\n ';
					if (this.firstUpdate) {
						message += ' ';
					}

					this.message = message + (this.message || '');
					this.firstUpdate = false;
					return this;
				};

				return err;
			};

			exports.TemplateError.prototype = Error.prototype;

			exports.escape = function (val) {
				return val.replace(escapeRegex, lookupEscape);
			};

			exports.isFunction = function (obj) {
				return ObjProto.toString.call(obj) === '[object Function]';
			};

			exports.isArray = Array.isArray || function (obj) {
				return ObjProto.toString.call(obj) === '[object Array]';
			};

			exports.isString = function (obj) {
				return ObjProto.toString.call(obj) === '[object String]';
			};

			exports.isObject = function (obj) {
				return ObjProto.toString.call(obj) === '[object Object]';
			};

			exports.groupBy = function (obj, val) {
				var result = {};
				var iterator = exports.isFunction(val) ? val : function (obj) {
					return obj[val];
				};
				for (var i = 0; i < obj.length; i++) {
					var value = obj[i];
					var key = iterator(value, i);
					(result[key] || (result[key] = [])).push(value);
				}
				return result;
			};

			exports.toArray = function (obj) {
				return Array.prototype.slice.call(obj);
			};

			exports.without = function (array) {
				var result = [];
				if (!array) {
					return result;
				}
				var index = -1,
				    length = array.length,
				    contains = exports.toArray(arguments).slice(1);

				while (++index < length) {
					if (exports.indexOf(contains, array[index]) === -1) {
						result.push(array[index]);
					}
				}
				return result;
			};

			exports.extend = function (obj, obj2) {
				for (var k in obj2) {
					obj[k] = obj2[k];
				}
				return obj;
			};

			exports.repeat = function (char_, n) {
				var str = '';
				for (var i = 0; i < n; i++) {
					str += char_;
				}
				return str;
			};

			exports.each = function (obj, func, context) {
				if (obj == null) {
					return;
				}

				if (ArrayProto.each && obj.each === ArrayProto.each) {
					obj.forEach(func, context);
				} else if (obj.length === +obj.length) {
					for (var i = 0, l = obj.length; i < l; i++) {
						func.call(context, obj[i], i, obj);
					}
				}
			};

			exports.map = function (obj, func) {
				var results = [];
				if (obj == null) {
					return results;
				}

				if (ArrayProto.map && obj.map === ArrayProto.map) {
					return obj.map(func);
				}

				for (var i = 0; i < obj.length; i++) {
					results[results.length] = func(obj[i], i);
				}

				if (obj.length === +obj.length) {
					results.length = obj.length;
				}

				return results;
			};

			exports.asyncIter = function (arr, iter, cb) {
				var i = -1;

				function next() {
					i++;

					if (i < arr.length) {
						iter(arr[i], i, next, cb);
					} else {
						cb();
					}
				}

				next();
			};

			exports.asyncFor = function (obj, iter, cb) {
				var keys = exports.keys(obj);
				var len = keys.length;
				var i = -1;

				function next() {
					i++;
					var k = keys[i];

					if (i < len) {
						iter(k, obj[k], i, len, next);
					} else {
						cb();
					}
				}

				next();
			};

			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
			exports.indexOf = Array.prototype.indexOf ? function (arr, searchElement, fromIndex) {
				return Array.prototype.indexOf.call(arr, searchElement, fromIndex);
			} : function (arr, searchElement, fromIndex) {
				var length = this.length >>> 0; // Hack to convert object.length to a UInt32

				fromIndex = +fromIndex || 0;

				if (Math.abs(fromIndex) === Infinity) {
					fromIndex = 0;
				}

				if (fromIndex < 0) {
					fromIndex += length;
					if (fromIndex < 0) {
						fromIndex = 0;
					}
				}

				for (; fromIndex < length; fromIndex++) {
					if (arr[fromIndex] === searchElement) {
						return fromIndex;
					}
				}

				return -1;
			};

			if (!Array.prototype.map) {
				Array.prototype.map = function () {
					throw new Error('map is unimplemented for this js engine');
				};
			}

			exports.keys = function (obj) {
				if (Object.prototype.keys) {
					return obj.keys();
				} else {
					var keys = [];
					for (var k in obj) {
						if (obj.hasOwnProperty(k)) {
							keys.push(k);
						}
					}
					return keys;
				}
			};

			exports.inOperator = function (key, val) {
				if (exports.isArray(val)) {
					return exports.indexOf(val, key) !== -1;
				} else if (exports.isObject(val)) {
					return key in val;
				} else if (exports.isString(val)) {
					return val.indexOf(key) !== -1;
				} else {
					throw new Error('Cannot use "in" operator to search for "' + key + '" in unexpected types.');
				}
			};

			/***/
		},
		/* 2 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var path = __webpack_require__(3);
			var asap = __webpack_require__(4);
			var lib = __webpack_require__(1);
			var Obj = __webpack_require__(6);
			var compiler = __webpack_require__(7);
			var builtin_filters = __webpack_require__(14);
			var builtin_loaders = __webpack_require__(15);
			var runtime = __webpack_require__(13);
			var globals = __webpack_require__(18);
			var waterfall = __webpack_require__(19);
			var Frame = runtime.Frame;
			var Template;

			// Unconditionally load in this loader, even if no other ones are
			// included (possible in the slim browser build)
			builtin_loaders.PrecompiledLoader = __webpack_require__(17);

			// If the user is using the async API, *always* call it
			// asynchronously even if the template was synchronous.
			function callbackAsap(cb, err, res) {
				asap(function () {
					cb(err, res);
				});
			}

			var Environment = Obj.extend({
				init: function init(loaders, opts) {
					// The dev flag determines the trace that'll be shown on errors.
					// If set to true, returns the full trace from the error point,
					// otherwise will return trace starting from Template.render
					// (the full trace from within nunjucks may confuse developers using
					//  the library)
					// defaults to false
					opts = this.opts = opts || {};
					this.opts.dev = !!opts.dev;

					// The autoescape flag sets global autoescaping. If true,
					// every string variable will be escaped by default.
					// If false, strings can be manually escaped using the `escape` filter.
					// defaults to true
					this.opts.autoescape = opts.autoescape != null ? opts.autoescape : true;

					// If true, this will make the system throw errors if trying
					// to output a null or undefined value
					this.opts.throwOnUndefined = !!opts.throwOnUndefined;
					this.opts.trimBlocks = !!opts.trimBlocks;
					this.opts.lstripBlocks = !!opts.lstripBlocks;

					this.loaders = [];

					if (!loaders) {
						// The filesystem loader is only available server-side
						if (builtin_loaders.FileSystemLoader) {
							this.loaders = [new builtin_loaders.FileSystemLoader('views')];
						} else if (builtin_loaders.WebLoader) {
							this.loaders = [new builtin_loaders.WebLoader('/views')];
						}
					} else {
						this.loaders = lib.isArray(loaders) ? loaders : [loaders];
					}

					// It's easy to use precompiled templates: just include them
					// before you configure nunjucks and this will automatically
					// pick it up and use it
					if (true && window.nunjucksPrecompiled) {
						this.loaders.unshift(new builtin_loaders.PrecompiledLoader(window.nunjucksPrecompiled));
					}

					this.initCache();

					this.globals = globals();
					this.filters = {};
					this.asyncFilters = [];
					this.extensions = {};
					this.extensionsList = [];

					for (var name in builtin_filters) {
						this.addFilter(name, builtin_filters[name]);
					}
				},

				initCache: function initCache() {
					// Caching and cache busting
					lib.each(this.loaders, function (loader) {
						loader.cache = {};

						if (typeof loader.on === 'function') {
							loader.on('update', function (template) {
								loader.cache[template] = null;
							});
						}
					});
				},

				addExtension: function addExtension(name, extension) {
					extension._name = name;
					this.extensions[name] = extension;
					this.extensionsList.push(extension);
					return this;
				},

				removeExtension: function removeExtension(name) {
					var extension = this.getExtension(name);
					if (!extension) return;

					this.extensionsList = lib.without(this.extensionsList, extension);
					delete this.extensions[name];
				},

				getExtension: function getExtension(name) {
					return this.extensions[name];
				},

				hasExtension: function hasExtension(name) {
					return !!this.extensions[name];
				},

				addGlobal: function addGlobal(name, value) {
					this.globals[name] = value;
					return this;
				},

				getGlobal: function getGlobal(name) {
					if (typeof this.globals[name] === 'undefined') {
						throw new Error('global not found: ' + name);
					}
					return this.globals[name];
				},

				addFilter: function addFilter(name, func, async) {
					var wrapped = func;

					if (async) {
						this.asyncFilters.push(name);
					}
					this.filters[name] = wrapped;
					return this;
				},

				getFilter: function getFilter(name) {
					if (!this.filters[name]) {
						throw new Error('filter not found: ' + name);
					}
					return this.filters[name];
				},

				resolveTemplate: function resolveTemplate(loader, parentName, filename) {
					var isRelative = loader.isRelative && parentName ? loader.isRelative(filename) : false;
					return isRelative && loader.resolve ? loader.resolve(parentName, filename) : filename;
				},

				getTemplate: function getTemplate(name, eagerCompile, parentName, ignoreMissing, cb) {
					var that = this;
					var tmpl = null;
					if (name && name.raw) {
						// this fixes autoescape for templates referenced in symbols
						name = name.raw;
					}

					if (lib.isFunction(parentName)) {
						cb = parentName;
						parentName = null;
						eagerCompile = eagerCompile || false;
					}

					if (lib.isFunction(eagerCompile)) {
						cb = eagerCompile;
						eagerCompile = false;
					}

					if (name instanceof Template) {
						tmpl = name;
					} else if (typeof name !== 'string') {
						throw new Error('template names must be a string: ' + name);
					} else {
						for (var i = 0; i < this.loaders.length; i++) {
							var _name = this.resolveTemplate(this.loaders[i], parentName, name);
							tmpl = this.loaders[i].cache[_name];
							if (tmpl) break;
						}
					}

					if (tmpl) {
						if (eagerCompile) {
							tmpl.compile();
						}

						if (cb) {
							cb(null, tmpl);
						} else {
							return tmpl;
						}
					} else {
						var syncResult;
						var _this = this;

						var createTemplate = function createTemplate(err, info) {
							if (!info && !err) {
								if (!ignoreMissing) {
									err = new Error('template not found: ' + name);
								}
							}

							if (err) {
								if (cb) {
									cb(err);
								} else {
									throw err;
								}
							} else {
								var tmpl;
								if (info) {
									tmpl = new Template(info.src, _this, info.path, eagerCompile);

									if (!info.noCache) {
										info.loader.cache[name] = tmpl;
									}
								} else {
									tmpl = new Template('', _this, '', eagerCompile);
								}

								if (cb) {
									cb(null, tmpl);
								} else {
									syncResult = tmpl;
								}
							}
						};

						lib.asyncIter(this.loaders, function (loader, i, next, done) {
							function handle(err, src) {
								if (err) {
									done(err);
								} else if (src) {
									src.loader = loader;
									done(null, src);
								} else {
									next();
								}
							}

							// Resolve name relative to parentName
							name = that.resolveTemplate(loader, parentName, name);

							if (loader.async) {
								loader.getSource(name, handle);
							} else {
								handle(null, loader.getSource(name));
							}
						}, createTemplate);

						return syncResult;
					}
				},

				express: function express(app) {
					var env = this;

					function NunjucksView(name, opts) {
						this.name = name;
						this.path = name;
						this.defaultEngine = opts.defaultEngine;
						this.ext = path.extname(name);
						if (!this.ext && !this.defaultEngine) throw new Error('No default engine was specified and no extension was provided.');
						if (!this.ext) this.name += this.ext = ('.' !== this.defaultEngine[0] ? '.' : '') + this.defaultEngine;
					}

					NunjucksView.prototype.render = function (opts, cb) {
						env.render(this.name, opts, cb);
					};

					app.set('view', NunjucksView);
					app.set('nunjucksEnv', this);
					return this;
				},

				render: function render(name, ctx, cb) {
					if (lib.isFunction(ctx)) {
						cb = ctx;
						ctx = null;
					}

					// We support a synchronous API to make it easier to migrate
					// existing code to async. This works because if you don't do
					// anything async work, the whole thing is actually run
					// synchronously.
					var syncResult = null;

					this.getTemplate(name, function (err, tmpl) {
						if (err && cb) {
							callbackAsap(cb, err);
						} else if (err) {
							throw err;
						} else {
							syncResult = tmpl.render(ctx, cb);
						}
					});

					return syncResult;
				},

				renderString: function renderString(src, ctx, opts, cb) {
					if (lib.isFunction(opts)) {
						cb = opts;
						opts = {};
					}
					opts = opts || {};

					var tmpl = new Template(src, this, opts.path);
					return tmpl.render(ctx, cb);
				},

				waterfall: waterfall
			});

			var Context = Obj.extend({
				init: function init(ctx, blocks, env) {
					// Has to be tied to an environment so we can tap into its globals.
					this.env = env || new Environment();

					// Make a duplicate of ctx
					this.ctx = {};
					for (var k in ctx) {
						if (ctx.hasOwnProperty(k)) {
							this.ctx[k] = ctx[k];
						}
					}

					this.blocks = {};
					this.exported = [];

					for (var name in blocks) {
						this.addBlock(name, blocks[name]);
					}
				},

				lookup: function lookup(name) {
					// This is one of the most called functions, so optimize for
					// the typical case where the name isn't in the globals
					if (name in this.env.globals && !(name in this.ctx)) {
						return this.env.globals[name];
					} else {
						return this.ctx[name];
					}
				},

				setVariable: function setVariable(name, val) {
					this.ctx[name] = val;
				},

				getVariables: function getVariables() {
					return this.ctx;
				},

				addBlock: function addBlock(name, block) {
					this.blocks[name] = this.blocks[name] || [];
					this.blocks[name].push(block);
					return this;
				},

				getBlock: function getBlock(name) {
					if (!this.blocks[name]) {
						throw new Error('unknown block "' + name + '"');
					}

					return this.blocks[name][0];
				},

				getSuper: function getSuper(env, name, block, frame, runtime, cb) {
					var idx = lib.indexOf(this.blocks[name] || [], block);
					var blk = this.blocks[name][idx + 1];
					var context = this;

					if (idx === -1 || !blk) {
						throw new Error('no super block available for "' + name + '"');
					}

					blk(env, context, frame, runtime, cb);
				},

				addExport: function addExport(name) {
					this.exported.push(name);
				},

				getExported: function getExported() {
					var exported = {};
					for (var i = 0; i < this.exported.length; i++) {
						var name = this.exported[i];
						exported[name] = this.ctx[name];
					}
					return exported;
				}
			});

			Template = Obj.extend({
				init: function init(src, env, path, eagerCompile) {
					this.env = env || new Environment();

					if (lib.isObject(src)) {
						switch (src.type) {
							case 'code':
								this.tmplProps = src.obj;break;
							case 'string':
								this.tmplStr = src.obj;break;
						}
					} else if (lib.isString(src)) {
						this.tmplStr = src;
					} else {
						throw new Error('src must be a string or an object describing ' + 'the source');
					}

					this.path = path;

					if (eagerCompile) {
						var _this = this;
						try {
							_this._compile();
						} catch (err) {
							throw lib.prettifyError(this.path, this.env.opts.dev, err);
						}
					} else {
						this.compiled = false;
					}
				},

				render: function render(ctx, parentFrame, cb) {
					if (typeof ctx === 'function') {
						cb = ctx;
						ctx = {};
					} else if (typeof parentFrame === 'function') {
						cb = parentFrame;
						parentFrame = null;
					}

					var forceAsync = true;
					if (parentFrame) {
						// If there is a frame, we are being called from internal
						// code of another template, and the internal system
						// depends on the sync/async nature of the parent template
						// to be inherited, so force an async callback
						forceAsync = false;
					}

					var _this = this;
					// Catch compile errors for async rendering
					try {
						_this.compile();
					} catch (_err) {
						var err = lib.prettifyError(this.path, this.env.opts.dev, _err);
						if (cb) return callbackAsap(cb, err);else throw err;
					}

					var context = new Context(ctx || {}, _this.blocks, _this.env);
					var frame = parentFrame ? parentFrame.push(true) : new Frame();
					frame.topLevel = true;
					var syncResult = null;

					_this.rootRenderFunc(_this.env, context, frame || new Frame(), runtime, function (err, res) {
						if (err) {
							err = lib.prettifyError(_this.path, _this.env.opts.dev, err);
						}

						if (cb) {
							if (forceAsync) {
								callbackAsap(cb, err, res);
							} else {
								cb(err, res);
							}
						} else {
							if (err) {
								throw err;
							}
							syncResult = res;
						}
					});

					return syncResult;
				},

				getExported: function getExported(ctx, parentFrame, cb) {
					if (typeof ctx === 'function') {
						cb = ctx;
						ctx = {};
					}

					if (typeof parentFrame === 'function') {
						cb = parentFrame;
						parentFrame = null;
					}

					// Catch compile errors for async rendering
					try {
						this.compile();
					} catch (e) {
						if (cb) return cb(e);else throw e;
					}

					var frame = parentFrame ? parentFrame.push() : new Frame();
					frame.topLevel = true;

					// Run the rootRenderFunc to populate the context with exported vars
					var context = new Context(ctx || {}, this.blocks, this.env);
					this.rootRenderFunc(this.env, context, frame, runtime, function (err) {
						if (err) {
							cb(err, null);
						} else {
							cb(null, context.getExported());
						}
					});
				},

				compile: function compile() {
					if (!this.compiled) {
						this._compile();
					}
				},

				_compile: function _compile() {
					var props;

					if (this.tmplProps) {
						props = this.tmplProps;
					} else {
						var source = compiler.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts);

						/* jslint evil: true */
						var func = new Function(source);
						props = func();
					}

					this.blocks = this._getBlocks(props);
					this.rootRenderFunc = props.root;
					this.compiled = true;
				},

				_getBlocks: function _getBlocks(props) {
					var blocks = {};

					for (var k in props) {
						if (k.slice(0, 2) === 'b_') {
							blocks[k.slice(2)] = props[k];
						}
					}

					return blocks;
				}
			});

			module.exports = {
				Environment: Environment,
				Template: Template
			};

			/***/
		},
		/* 3 */
		/***/function (module, exports) {

			/***/},
		/* 4 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";

			// rawAsap provides everything we need except exception management.

			var rawAsap = __webpack_require__(5);
			// RawTasks are recycled to reduce GC churn.
			var freeTasks = [];
			// We queue errors to ensure they are thrown in right order (FIFO).
			// Array-as-queue is good enough here, since we are just dealing with exceptions.
			var pendingErrors = [];
			var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

			function throwFirstError() {
				if (pendingErrors.length) {
					throw pendingErrors.shift();
				}
			}

			/**
    * Calls a task as soon as possible after returning, in its own event, with priority
    * over other events like animation, reflow, and repaint. An error thrown from an
    * event will not interrupt, nor even substantially slow down the processing of
    * other events, but will be rather postponed to a lower priority event.
    * @param {{call}} task A callable object, typically a function that takes no
    * arguments.
    */
			module.exports = asap;
			function asap(task) {
				var rawTask;
				if (freeTasks.length) {
					rawTask = freeTasks.pop();
				} else {
					rawTask = new RawTask();
				}
				rawTask.task = task;
				rawAsap(rawTask);
			}

			// We wrap tasks with recyclable task objects.  A task object implements
			// `call`, just like a function.
			function RawTask() {
				this.task = null;
			}

			// The sole purpose of wrapping the task is to catch the exception and recycle
			// the task object after its single use.
			RawTask.prototype.call = function () {
				try {
					this.task.call();
				} catch (error) {
					if (asap.onerror) {
						// This hook exists purely for testing purposes.
						// Its name will be periodically randomized to break any code that
						// depends on its existence.
						asap.onerror(error);
					} else {
						// In a web browser, exceptions are not fatal. However, to avoid
						// slowing down the queue of pending tasks, we rethrow the error in a
						// lower priority turn.
						pendingErrors.push(error);
						requestErrorThrow();
					}
				} finally {
					this.task = null;
					freeTasks[freeTasks.length] = this;
				}
			};

			/***/
		},
		/* 5 */
		/***/function (module, exports) {

			/* WEBPACK VAR INJECTION */(function (global) {
				"use strict";

				// Use the fastest means possible to execute a task in its own turn, with
				// priority over other events including IO, animation, reflow, and redraw
				// events in browsers.
				//
				// An exception thrown by a task will permanently interrupt the processing of
				// subsequent tasks. The higher level `asap` function ensures that if an
				// exception is thrown by a task, that the task queue will continue flushing as
				// soon as possible, but if you use `rawAsap` directly, you are responsible to
				// either ensure that no exceptions are thrown from your task, or to manually
				// call `rawAsap.requestFlush` if an exception is thrown.

				module.exports = rawAsap;
				function rawAsap(task) {
					if (!queue.length) {
						requestFlush();
						flushing = true;
					}
					// Equivalent to push, but avoids a function call.
					queue[queue.length] = task;
				}

				var queue = [];
				// Once a flush has been requested, no further calls to `requestFlush` are
				// necessary until the next `flush` completes.
				var flushing = false;
				// `requestFlush` is an implementation-specific method that attempts to kick
				// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
				// the event queue before yielding to the browser's own event loop.
				var requestFlush;
				// The position of the next task to execute in the task queue. This is
				// preserved between calls to `flush` so that it can be resumed if
				// a task throws an exception.
				var index = 0;
				// If a task schedules additional tasks recursively, the task queue can grow
				// unbounded. To prevent memory exhaustion, the task queue will periodically
				// truncate already-completed tasks.
				var capacity = 1024;

				// The flush function processes all tasks that have been scheduled with
				// `rawAsap` unless and until one of those tasks throws an exception.
				// If a task throws an exception, `flush` ensures that its state will remain
				// consistent and will resume where it left off when called again.
				// However, `flush` does not make any arrangements to be called again if an
				// exception is thrown.
				function flush() {
					while (index < queue.length) {
						var currentIndex = index;
						// Advance the index before calling the task. This ensures that we will
						// begin flushing on the next task the task throws an error.
						index = index + 1;
						queue[currentIndex].call();
						// Prevent leaking memory for long chains of recursive calls to `asap`.
						// If we call `asap` within tasks scheduled by `asap`, the queue will
						// grow, but to avoid an O(n) walk for every task we execute, we don't
						// shift tasks off the queue after they have been executed.
						// Instead, we periodically shift 1024 tasks off the queue.
						if (index > capacity) {
							// Manually shift all values starting at the index back to the
							// beginning of the queue.
							for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
								queue[scan] = queue[scan + index];
							}
							queue.length -= index;
							index = 0;
						}
					}
					queue.length = 0;
					index = 0;
					flushing = false;
				}

				// `requestFlush` is implemented using a strategy based on data collected from
				// every available SauceLabs Selenium web driver worker at time of writing.
				// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

				// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
				// have WebKitMutationObserver but not un-prefixed MutationObserver.
				// Must use `global` or `self` instead of `window` to work in both frames and web
				// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

				/* globals self */
				var scope = typeof global !== "undefined" ? global : self;
				var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

				// MutationObservers are desirable because they have high priority and work
				// reliably everywhere they are implemented.
				// They are implemented in all modern browsers.
				//
				// - Android 4-4.3
				// - Chrome 26-34
				// - Firefox 14-29
				// - Internet Explorer 11
				// - iPad Safari 6-7.1
				// - iPhone Safari 7-7.1
				// - Safari 6-7
				if (typeof BrowserMutationObserver === "function") {
					requestFlush = makeRequestCallFromMutationObserver(flush);

					// MessageChannels are desirable because they give direct access to the HTML
					// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
					// 11-12, and in web workers in many engines.
					// Although message channels yield to any queued rendering and IO tasks, they
					// would be better than imposing the 4ms delay of timers.
					// However, they do not work reliably in Internet Explorer or Safari.

					// Internet Explorer 10 is the only browser that has setImmediate but does
					// not have MutationObservers.
					// Although setImmediate yields to the browser's renderer, it would be
					// preferrable to falling back to setTimeout since it does not have
					// the minimum 4ms penalty.
					// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
					// Desktop to a lesser extent) that renders both setImmediate and
					// MessageChannel useless for the purposes of ASAP.
					// https://github.com/kriskowal/q/issues/396

					// Timers are implemented universally.
					// We fall back to timers in workers in most engines, and in foreground
					// contexts in the following browsers.
					// However, note that even this simple case requires nuances to operate in a
					// broad spectrum of browsers.
					//
					// - Firefox 3-13
					// - Internet Explorer 6-9
					// - iPad Safari 4.3
					// - Lynx 2.8.7
				} else {
					requestFlush = makeRequestCallFromTimer(flush);
				}

				// `requestFlush` requests that the high priority event queue be flushed as
				// soon as possible.
				// This is useful to prevent an error thrown in a task from stalling the event
				// queue if the exception handled by Node.js’s
				// `process.on("uncaughtException")` or by a domain.
				rawAsap.requestFlush = requestFlush;

				// To request a high priority event, we induce a mutation observer by toggling
				// the text of a text node between "1" and "-1".
				function makeRequestCallFromMutationObserver(callback) {
					var toggle = 1;
					var observer = new BrowserMutationObserver(callback);
					var node = document.createTextNode("");
					observer.observe(node, { characterData: true });
					return function requestCall() {
						toggle = -toggle;
						node.data = toggle;
					};
				}

				// The message channel technique was discovered by Malte Ubl and was the
				// original foundation for this library.
				// http://www.nonblocking.io/2011/06/windownexttick.html

				// Safari 6.0.5 (at least) intermittently fails to create message ports on a
				// page's first load. Thankfully, this version of Safari supports
				// MutationObservers, so we don't need to fall back in that case.

				// function makeRequestCallFromMessageChannel(callback) {
				//     var channel = new MessageChannel();
				//     channel.port1.onmessage = callback;
				//     return function requestCall() {
				//         channel.port2.postMessage(0);
				//     };
				// }

				// For reasons explained above, we are also unable to use `setImmediate`
				// under any circumstances.
				// Even if we were, there is another bug in Internet Explorer 10.
				// It is not sufficient to assign `setImmediate` to `requestFlush` because
				// `setImmediate` must be called *by name* and therefore must be wrapped in a
				// closure.
				// Never forget.

				// function makeRequestCallFromSetImmediate(callback) {
				//     return function requestCall() {
				//         setImmediate(callback);
				//     };
				// }

				// Safari 6.0 has a problem where timers will get lost while the user is
				// scrolling. This problem does not impact ASAP because Safari 6.0 supports
				// mutation observers, so that implementation is used instead.
				// However, if we ever elect to use timers in Safari, the prevalent work-around
				// is to add a scroll event listener that calls for a flush.

				// `setTimeout` does not call the passed callback if the delay is less than
				// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
				// even then.

				function makeRequestCallFromTimer(callback) {
					return function requestCall() {
						// We dispatch a timeout with a specified delay of 0 for engines that
						// can reliably accommodate that request. This will usually be snapped
						// to a 4 milisecond delay, but once we're flushing, there's no delay
						// between events.
						var timeoutHandle = setTimeout(handleTimer, 0);
						// However, since this timer gets frequently dropped in Firefox
						// workers, we enlist an interval handle that will try to fire
						// an event 20 times per second until it succeeds.
						var intervalHandle = setInterval(handleTimer, 50);

						function handleTimer() {
							// Whichever timer succeeds will cancel both timers and
							// execute the callback.
							clearTimeout(timeoutHandle);
							clearInterval(intervalHandle);
							callback();
						}
					};
				}

				// This is for `asap.js` only.
				// Its name will be periodically randomized to break any code that depends on
				// its existence.
				rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

				// ASAP was originally a nextTick shim included in Q. This was factored out
				// into this ASAP package. It was later adapted to RSVP which made further
				// amendments. These decisions, particularly to marginalize MessageChannel and
				// to capture the MutationObserver implementation in a closure, were integrated
				// back into ASAP proper.
				// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

				/* WEBPACK VAR INJECTION */
			}).call(exports, function () {
				return this;
			}());

			/***/
		},
		/* 6 */
		/***/function (module, exports) {

			'use strict';

			// A simple class system, more documentation to come

			function extend(cls, name, props) {
				// This does that same thing as Object.create, but with support for IE8
				var F = function F() {};
				F.prototype = cls.prototype;
				var prototype = new F();

				// jshint undef: false
				var fnTest = /xyz/.test(function () {
					xyz;
				}) ? /\bparent\b/ : /.*/;
				props = props || {};

				for (var k in props) {
					var src = props[k];
					var parent = prototype[k];

					if (typeof parent === 'function' && typeof src === 'function' && fnTest.test(src)) {
						/*jshint -W083 */
						prototype[k] = function (src, parent) {
							return function () {
								// Save the current parent method
								var tmp = this.parent;

								// Set parent to the previous method, call, and restore
								this.parent = parent;
								var res = src.apply(this, arguments);
								this.parent = tmp;

								return res;
							};
						}(src, parent);
					} else {
						prototype[k] = src;
					}
				}

				prototype.typename = name;

				var new_cls = function new_cls() {
					if (prototype.init) {
						prototype.init.apply(this, arguments);
					}
				};

				new_cls.prototype = prototype;
				new_cls.prototype.constructor = new_cls;

				new_cls.extend = function (name, props) {
					if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
						props = name;
						name = 'anonymous';
					}
					return extend(new_cls, name, props);
				};

				return new_cls;
			}

			module.exports = extend(Object, 'Object', {});

			/***/
		},
		/* 7 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var lib = __webpack_require__(1);
			var parser = __webpack_require__(8);
			var transformer = __webpack_require__(12);
			var nodes = __webpack_require__(10);
			// jshint -W079
			var Object = __webpack_require__(6);
			var Frame = __webpack_require__(13).Frame;

			// These are all the same for now, but shouldn't be passed straight
			// through
			var compareOps = {
				'==': '==',
				'===': '===',
				'!=': '!=',
				'!==': '!==',
				'<': '<',
				'>': '>',
				'<=': '<=',
				'>=': '>='
			};

			// A common pattern is to emit binary operators
			function binOpEmitter(str) {
				return function (node, frame) {
					this.compile(node.left, frame);
					this.emit(str);
					this.compile(node.right, frame);
				};
			}

			var Compiler = Object.extend({
				init: function init(templateName, throwOnUndefined) {
					this.templateName = templateName;
					this.codebuf = [];
					this.lastId = 0;
					this.buffer = null;
					this.bufferStack = [];
					this.scopeClosers = '';
					this.inBlock = false;
					this.throwOnUndefined = throwOnUndefined;
				},

				fail: function fail(msg, lineno, colno) {
					if (lineno !== undefined) lineno += 1;
					if (colno !== undefined) colno += 1;

					throw new lib.TemplateError(msg, lineno, colno);
				},

				pushBufferId: function pushBufferId(id) {
					this.bufferStack.push(this.buffer);
					this.buffer = id;
					this.emit('var ' + this.buffer + ' = "";');
				},

				popBufferId: function popBufferId() {
					this.buffer = this.bufferStack.pop();
				},

				emit: function emit(code) {
					this.codebuf.push(code);
				},

				emitLine: function emitLine(code) {
					this.emit(code + '\n');
				},

				emitLines: function emitLines() {
					lib.each(lib.toArray(arguments), function (line) {
						this.emitLine(line);
					}, this);
				},

				emitFuncBegin: function emitFuncBegin(name) {
					this.buffer = 'output';
					this.scopeClosers = '';
					this.emitLine('function ' + name + '(env, context, frame, runtime, cb) {');
					this.emitLine('var lineno = null;');
					this.emitLine('var colno = null;');
					this.emitLine('var ' + this.buffer + ' = "";');
					this.emitLine('try {');
				},

				emitFuncEnd: function emitFuncEnd(noReturn) {
					if (!noReturn) {
						this.emitLine('cb(null, ' + this.buffer + ');');
					}

					this.closeScopeLevels();
					this.emitLine('} catch (e) {');
					this.emitLine('  cb(runtime.handleError(e, lineno, colno));');
					this.emitLine('}');
					this.emitLine('}');
					this.buffer = null;
				},

				addScopeLevel: function addScopeLevel() {
					this.scopeClosers += '})';
				},

				closeScopeLevels: function closeScopeLevels() {
					this.emitLine(this.scopeClosers + ';');
					this.scopeClosers = '';
				},

				withScopedSyntax: function withScopedSyntax(func) {
					var scopeClosers = this.scopeClosers;
					this.scopeClosers = '';

					func.call(this);

					this.closeScopeLevels();
					this.scopeClosers = scopeClosers;
				},

				makeCallback: function makeCallback(res) {
					var err = this.tmpid();

					return 'function(' + err + (res ? ',' + res : '') + ') {\n' + 'if(' + err + ') { cb(' + err + '); return; }';
				},

				tmpid: function tmpid() {
					this.lastId++;
					return 't_' + this.lastId;
				},

				_templateName: function _templateName() {
					return this.templateName == null ? 'undefined' : JSON.stringify(this.templateName);
				},

				_compileChildren: function _compileChildren(node, frame) {
					var children = node.children;
					for (var i = 0, l = children.length; i < l; i++) {
						this.compile(children[i], frame);
					}
				},

				_compileAggregate: function _compileAggregate(node, frame, startChar, endChar) {
					if (startChar) {
						this.emit(startChar);
					}

					for (var i = 0; i < node.children.length; i++) {
						if (i > 0) {
							this.emit(',');
						}

						this.compile(node.children[i], frame);
					}

					if (endChar) {
						this.emit(endChar);
					}
				},

				_compileExpression: function _compileExpression(node, frame) {
					// TODO: I'm not really sure if this type check is worth it or
					// not.
					this.assertType(node, nodes.Literal, nodes.Symbol, nodes.Group, nodes.Array, nodes.Dict, nodes.FunCall, nodes.Caller, nodes.Filter, nodes.LookupVal, nodes.Compare, nodes.InlineIf, nodes.In, nodes.And, nodes.Or, nodes.Not, nodes.Add, nodes.Concat, nodes.Sub, nodes.Mul, nodes.Div, nodes.FloorDiv, nodes.Mod, nodes.Pow, nodes.Neg, nodes.Pos, nodes.Compare, nodes.NodeList);
					this.compile(node, frame);
				},

				assertType: function assertType(node /*, types */) {
					var types = lib.toArray(arguments).slice(1);
					var success = false;

					for (var i = 0; i < types.length; i++) {
						if (node instanceof types[i]) {
							success = true;
						}
					}

					if (!success) {
						this.fail('assertType: invalid type: ' + node.typename, node.lineno, node.colno);
					}
				},

				compileCallExtension: function compileCallExtension(node, frame, async) {
					var args = node.args;
					var contentArgs = node.contentArgs;
					var autoescape = typeof node.autoescape === 'boolean' ? node.autoescape : true;

					if (!async) {
						this.emit(this.buffer + ' += runtime.suppressValue(');
					}

					this.emit('env.getExtension("' + node.extName + '")["' + node.prop + '"](');
					this.emit('context');

					if (args || contentArgs) {
						this.emit(',');
					}

					if (args) {
						if (!(args instanceof nodes.NodeList)) {
							this.fail('compileCallExtension: arguments must be a NodeList, ' + 'use `parser.parseSignature`');
						}

						lib.each(args.children, function (arg, i) {
							// Tag arguments are passed normally to the call. Note
							// that keyword arguments are turned into a single js
							// object as the last argument, if they exist.
							this._compileExpression(arg, frame);

							if (i !== args.children.length - 1 || contentArgs.length) {
								this.emit(',');
							}
						}, this);
					}

					if (contentArgs.length) {
						lib.each(contentArgs, function (arg, i) {
							if (i > 0) {
								this.emit(',');
							}

							if (arg) {
								var id = this.tmpid();

								this.emitLine('function(cb) {');
								this.emitLine('if(!cb) { cb = function(err) { if(err) { throw err; }}}');
								this.pushBufferId(id);

								this.withScopedSyntax(function () {
									this.compile(arg, frame);
									this.emitLine('cb(null, ' + id + ');');
								});

								this.popBufferId();
								this.emitLine('return ' + id + ';');
								this.emitLine('}');
							} else {
								this.emit('null');
							}
						}, this);
					}

					if (async) {
						var res = this.tmpid();
						this.emitLine(', ' + this.makeCallback(res));
						this.emitLine(this.buffer + ' += runtime.suppressValue(' + res + ', ' + autoescape + ' && env.opts.autoescape);');
						this.addScopeLevel();
					} else {
						this.emit(')');
						this.emit(', ' + autoescape + ' && env.opts.autoescape);\n');
					}
				},

				compileCallExtensionAsync: function compileCallExtensionAsync(node, frame) {
					this.compileCallExtension(node, frame, true);
				},

				compileNodeList: function compileNodeList(node, frame) {
					this._compileChildren(node, frame);
				},

				compileLiteral: function compileLiteral(node) {
					if (typeof node.value === 'string') {
						var val = node.value.replace(/\\/g, '\\\\');
						val = val.replace(/"/g, '\\"');
						val = val.replace(/\n/g, '\\n');
						val = val.replace(/\r/g, '\\r');
						val = val.replace(/\t/g, '\\t');
						this.emit('"' + val + '"');
					} else if (node.value === null) {
						this.emit('null');
					} else {
						this.emit(node.value.toString());
					}
				},

				compileSymbol: function compileSymbol(node, frame) {
					var name = node.value;
					var v;

					if (v = frame.lookup(name)) {
						this.emit(v);
					} else {
						this.emit('runtime.contextOrFrameLookup(' + 'context, frame, "' + name + '")');
					}
				},

				compileGroup: function compileGroup(node, frame) {
					this._compileAggregate(node, frame, '(', ')');
				},

				compileArray: function compileArray(node, frame) {
					this._compileAggregate(node, frame, '[', ']');
				},

				compileDict: function compileDict(node, frame) {
					this._compileAggregate(node, frame, '{', '}');
				},

				compilePair: function compilePair(node, frame) {
					var key = node.key;
					var val = node.value;

					if (key instanceof nodes.Symbol) {
						key = new nodes.Literal(key.lineno, key.colno, key.value);
					} else if (!(key instanceof nodes.Literal && typeof key.value === 'string')) {
						this.fail('compilePair: Dict keys must be strings or names', key.lineno, key.colno);
					}

					this.compile(key, frame);
					this.emit(': ');
					this._compileExpression(val, frame);
				},

				compileInlineIf: function compileInlineIf(node, frame) {
					this.emit('(');
					this.compile(node.cond, frame);
					this.emit('?');
					this.compile(node.body, frame);
					this.emit(':');
					if (node.else_ !== null) this.compile(node.else_, frame);else this.emit('""');
					this.emit(')');
				},

				compileIn: function compileIn(node, frame) {
					this.emit('runtime.inOperator(');
					this.compile(node.left, frame);
					this.emit(',');
					this.compile(node.right, frame);
					this.emit(')');
				},

				compileOr: binOpEmitter(' || '),
				compileAnd: binOpEmitter(' && '),
				compileAdd: binOpEmitter(' + '),
				// ensure concatenation instead of addition
				// by adding empty string in between
				compileConcat: binOpEmitter(' + "" + '),
				compileSub: binOpEmitter(' - '),
				compileMul: binOpEmitter(' * '),
				compileDiv: binOpEmitter(' / '),
				compileMod: binOpEmitter(' % '),

				compileNot: function compileNot(node, frame) {
					this.emit('!');
					this.compile(node.target, frame);
				},

				compileFloorDiv: function compileFloorDiv(node, frame) {
					this.emit('Math.floor(');
					this.compile(node.left, frame);
					this.emit(' / ');
					this.compile(node.right, frame);
					this.emit(')');
				},

				compilePow: function compilePow(node, frame) {
					this.emit('Math.pow(');
					this.compile(node.left, frame);
					this.emit(', ');
					this.compile(node.right, frame);
					this.emit(')');
				},

				compileNeg: function compileNeg(node, frame) {
					this.emit('-');
					this.compile(node.target, frame);
				},

				compilePos: function compilePos(node, frame) {
					this.emit('+');
					this.compile(node.target, frame);
				},

				compileCompare: function compileCompare(node, frame) {
					this.compile(node.expr, frame);

					for (var i = 0; i < node.ops.length; i++) {
						var n = node.ops[i];
						this.emit(' ' + compareOps[n.type] + ' ');
						this.compile(n.expr, frame);
					}
				},

				compileLookupVal: function compileLookupVal(node, frame) {
					this.emit('runtime.memberLookup((');
					this._compileExpression(node.target, frame);
					this.emit('),');
					this._compileExpression(node.val, frame);
					this.emit(')');
				},

				_getNodeName: function _getNodeName(node) {
					switch (node.typename) {
						case 'Symbol':
							return node.value;
						case 'FunCall':
							return 'the return value of (' + this._getNodeName(node.name) + ')';
						case 'LookupVal':
							return this._getNodeName(node.target) + '["' + this._getNodeName(node.val) + '"]';
						case 'Literal':
							return node.value.toString();
						default:
							return '--expression--';
					}
				},

				compileFunCall: function compileFunCall(node, frame) {
					// Keep track of line/col info at runtime by settings
					// variables within an expression. An expression in javascript
					// like (x, y, z) returns the last value, and x and y can be
					// anything
					this.emit('(lineno = ' + node.lineno + ', colno = ' + node.colno + ', ');

					this.emit('runtime.callWrap(');
					// Compile it as normal.
					this._compileExpression(node.name, frame);

					// Output the name of what we're calling so we can get friendly errors
					// if the lookup fails.
					this.emit(', "' + this._getNodeName(node.name).replace(/"/g, '\\"') + '", context, ');

					this._compileAggregate(node.args, frame, '[', '])');

					this.emit(')');
				},

				compileFilter: function compileFilter(node, frame) {
					var name = node.name;
					this.assertType(name, nodes.Symbol);
					this.emit('env.getFilter("' + name.value + '").call(context, ');
					this._compileAggregate(node.args, frame);
					this.emit(')');
				},

				compileFilterAsync: function compileFilterAsync(node, frame) {
					var name = node.name;
					this.assertType(name, nodes.Symbol);

					var symbol = node.symbol.value;
					frame.set(symbol, symbol);

					this.emit('env.getFilter("' + name.value + '").call(context, ');
					this._compileAggregate(node.args, frame);
					this.emitLine(', ' + this.makeCallback(symbol));

					this.addScopeLevel();
				},

				compileKeywordArgs: function compileKeywordArgs(node, frame) {
					var names = [];

					lib.each(node.children, function (pair) {
						names.push(pair.key.value);
					});

					this.emit('runtime.makeKeywordArgs(');
					this.compileDict(node, frame);
					this.emit(')');
				},

				compileSet: function compileSet(node, frame) {
					var ids = [];

					// Lookup the variable names for each identifier and create
					// new ones if necessary
					lib.each(node.targets, function (target) {
						var name = target.value;
						var id = frame.lookup(name);

						if (id === null || id === undefined) {
							id = this.tmpid();

							// Note: This relies on js allowing scope across
							// blocks, in case this is created inside an `if`
							this.emitLine('var ' + id + ';');
						}

						ids.push(id);
					}, this);

					if (node.value) {
						this.emit(ids.join(' = ') + ' = ');
						this._compileExpression(node.value, frame);
						this.emitLine(';');
					} else {
						this.emit(ids.join(' = ') + ' = ');
						this.compile(node.body, frame);
						this.emitLine(';');
					}

					lib.each(node.targets, function (target, i) {
						var id = ids[i];
						var name = target.value;

						// We are running this for every var, but it's very
						// uncommon to assign to multiple vars anyway
						this.emitLine('frame.set("' + name + '", ' + id + ', true);');

						this.emitLine('if(frame.topLevel) {');
						this.emitLine('context.setVariable("' + name + '", ' + id + ');');
						this.emitLine('}');

						if (name.charAt(0) !== '_') {
							this.emitLine('if(frame.topLevel) {');
							this.emitLine('context.addExport("' + name + '", ' + id + ');');
							this.emitLine('}');
						}
					}, this);
				},

				compileIf: function compileIf(node, frame, async) {
					this.emit('if(');
					this._compileExpression(node.cond, frame);
					this.emitLine(') {');

					this.withScopedSyntax(function () {
						this.compile(node.body, frame);

						if (async) {
							this.emit('cb()');
						}
					});

					if (node.else_) {
						this.emitLine('}\nelse {');

						this.withScopedSyntax(function () {
							this.compile(node.else_, frame);

							if (async) {
								this.emit('cb()');
							}
						});
					} else if (async) {
						this.emitLine('}\nelse {');
						this.emit('cb()');
					}

					this.emitLine('}');
				},

				compileIfAsync: function compileIfAsync(node, frame) {
					this.emit('(function(cb) {');
					this.compileIf(node, frame, true);
					this.emit('})(' + this.makeCallback());
					this.addScopeLevel();
				},

				emitLoopBindings: function emitLoopBindings(node, arr, i, len) {
					var bindings = {
						index: i + ' + 1',
						index0: i,
						revindex: len + ' - ' + i,
						revindex0: len + ' - ' + i + ' - 1',
						first: i + ' === 0',
						last: i + ' === ' + len + ' - 1',
						length: len
					};

					for (var name in bindings) {
						this.emitLine('frame.set("loop.' + name + '", ' + bindings[name] + ');');
					}
				},

				compileFor: function compileFor(node, frame) {
					// Some of this code is ugly, but it keeps the generated code
					// as fast as possible. ForAsync also shares some of this, but
					// not much.

					var v;
					var i = this.tmpid();
					var len = this.tmpid();
					var arr = this.tmpid();
					frame = frame.push();

					this.emitLine('frame = frame.push();');

					this.emit('var ' + arr + ' = ');
					this._compileExpression(node.arr, frame);
					this.emitLine(';');

					this.emit('if(' + arr + ') {');

					// If multiple names are passed, we need to bind them
					// appropriately
					if (node.name instanceof nodes.Array) {
						this.emitLine('var ' + i + ';');

						// The object could be an arroy or object. Note that the
						// body of the loop is duplicated for each condition, but
						// we are optimizing for speed over size.
						this.emitLine('if(runtime.isArray(' + arr + ')) {');{
							this.emitLine('var ' + len + ' = ' + arr + '.length;');
							this.emitLine('for(' + i + '=0; ' + i + ' < ' + arr + '.length; ' + i + '++) {');

							// Bind each declared var
							for (var u = 0; u < node.name.children.length; u++) {
								var tid = this.tmpid();
								this.emitLine('var ' + tid + ' = ' + arr + '[' + i + '][' + u + ']');
								this.emitLine('frame.set("' + node.name.children[u].value + '", ' + arr + '[' + i + '][' + u + ']' + ');');
								frame.set(node.name.children[u].value, tid);
							}

							this.emitLoopBindings(node, arr, i, len);
							this.withScopedSyntax(function () {
								this.compile(node.body, frame);
							});
							this.emitLine('}');
						}

						this.emitLine('} else {');{
							// Iterate over the key/values of an object
							var key = node.name.children[0];
							var val = node.name.children[1];
							var k = this.tmpid();
							v = this.tmpid();
							frame.set(key.value, k);
							frame.set(val.value, v);

							this.emitLine(i + ' = -1;');
							this.emitLine('var ' + len + ' = runtime.keys(' + arr + ').length;');
							this.emitLine('for(var ' + k + ' in ' + arr + ') {');
							this.emitLine(i + '++;');
							this.emitLine('var ' + v + ' = ' + arr + '[' + k + '];');
							this.emitLine('frame.set("' + key.value + '", ' + k + ');');
							this.emitLine('frame.set("' + val.value + '", ' + v + ');');

							this.emitLoopBindings(node, arr, i, len);
							this.withScopedSyntax(function () {
								this.compile(node.body, frame);
							});
							this.emitLine('}');
						}

						this.emitLine('}');
					} else {
						// Generate a typical array iteration
						v = this.tmpid();
						frame.set(node.name.value, v);

						this.emitLine('var ' + len + ' = ' + arr + '.length;');
						this.emitLine('for(var ' + i + '=0; ' + i + ' < ' + arr + '.length; ' + i + '++) {');
						this.emitLine('var ' + v + ' = ' + arr + '[' + i + '];');
						this.emitLine('frame.set("' + node.name.value + '", ' + v + ');');

						this.emitLoopBindings(node, arr, i, len);

						this.withScopedSyntax(function () {
							this.compile(node.body, frame);
						});

						this.emitLine('}');
					}

					this.emitLine('}');
					if (node.else_) {
						this.emitLine('if (!' + len + ') {');
						this.compile(node.else_, frame);
						this.emitLine('}');
					}

					this.emitLine('frame = frame.pop();');
				},

				_compileAsyncLoop: function _compileAsyncLoop(node, frame, parallel) {
					// This shares some code with the For tag, but not enough to
					// worry about. This iterates across an object asynchronously,
					// but not in parallel.

					var i = this.tmpid();
					var len = this.tmpid();
					var arr = this.tmpid();
					var asyncMethod = parallel ? 'asyncAll' : 'asyncEach';
					frame = frame.push();

					this.emitLine('frame = frame.push();');

					this.emit('var ' + arr + ' = ');
					this._compileExpression(node.arr, frame);
					this.emitLine(';');

					if (node.name instanceof nodes.Array) {
						this.emit('runtime.' + asyncMethod + '(' + arr + ', ' + node.name.children.length + ', function(');

						lib.each(node.name.children, function (name) {
							this.emit(name.value + ',');
						}, this);

						this.emit(i + ',' + len + ',next) {');

						lib.each(node.name.children, function (name) {
							var id = name.value;
							frame.set(id, id);
							this.emitLine('frame.set("' + id + '", ' + id + ');');
						}, this);
					} else {
						var id = node.name.value;
						this.emitLine('runtime.' + asyncMethod + '(' + arr + ', 1, function(' + id + ', ' + i + ', ' + len + ',next) {');
						this.emitLine('frame.set("' + id + '", ' + id + ');');
						frame.set(id, id);
					}

					this.emitLoopBindings(node, arr, i, len);

					this.withScopedSyntax(function () {
						var buf;
						if (parallel) {
							buf = this.tmpid();
							this.pushBufferId(buf);
						}

						this.compile(node.body, frame);
						this.emitLine('next(' + i + (buf ? ',' + buf : '') + ');');

						if (parallel) {
							this.popBufferId();
						}
					});

					var output = this.tmpid();
					this.emitLine('}, ' + this.makeCallback(output));
					this.addScopeLevel();

					if (parallel) {
						this.emitLine(this.buffer + ' += ' + output + ';');
					}

					if (node.else_) {
						this.emitLine('if (!' + arr + '.length) {');
						this.compile(node.else_, frame);
						this.emitLine('}');
					}

					this.emitLine('frame = frame.pop();');
				},

				compileAsyncEach: function compileAsyncEach(node, frame) {
					this._compileAsyncLoop(node, frame);
				},

				compileAsyncAll: function compileAsyncAll(node, frame) {
					this._compileAsyncLoop(node, frame, true);
				},

				_compileMacro: function _compileMacro(node, frame) {
					var args = [];
					var kwargs = null;
					var funcId = 'macro_' + this.tmpid();
					var keepFrame = frame !== undefined;

					// Type check the definition of the args
					lib.each(node.args.children, function (arg, i) {
						if (i === node.args.children.length - 1 && arg instanceof nodes.Dict) {
							kwargs = arg;
						} else {
							this.assertType(arg, nodes.Symbol);
							args.push(arg);
						}
					}, this);

					var realNames = lib.map(args, function (n) {
						return 'l_' + n.value;
					});
					realNames.push('kwargs');

					// Quoted argument names
					var argNames = lib.map(args, function (n) {
						return '"' + n.value + '"';
					});
					var kwargNames = lib.map(kwargs && kwargs.children || [], function (n) {
						return '"' + n.key.value + '"';
					});

					// We pass a function to makeMacro which destructures the
					// arguments so support setting positional args with keywords
					// args and passing keyword args as positional args
					// (essentially default values). See runtime.js.
					if (keepFrame) {
						frame = frame.push(true);
					} else {
						frame = new Frame();
					}
					this.emitLines('var ' + funcId + ' = runtime.makeMacro(', '[' + argNames.join(', ') + '], ', '[' + kwargNames.join(', ') + '], ', 'function (' + realNames.join(', ') + ') {', 'var callerFrame = frame;', 'frame = ' + (keepFrame ? 'frame.push(true);' : 'new runtime.Frame();'), 'kwargs = kwargs || {};', 'if (kwargs.hasOwnProperty("caller")) {', 'frame.set("caller", kwargs.caller); }');

					// Expose the arguments to the template. Don't need to use
					// random names because the function
					// will create a new run-time scope for us
					lib.each(args, function (arg) {
						this.emitLine('frame.set("' + arg.value + '", ' + 'l_' + arg.value + ');');
						frame.set(arg.value, 'l_' + arg.value);
					}, this);

					// Expose the keyword arguments
					if (kwargs) {
						lib.each(kwargs.children, function (pair) {
							var name = pair.key.value;
							this.emit('frame.set("' + name + '", ' + 'kwargs.hasOwnProperty("' + name + '") ? ' + 'kwargs["' + name + '"] : ');
							this._compileExpression(pair.value, frame);
							this.emitLine(');');
						}, this);
					}

					var bufferId = this.tmpid();
					this.pushBufferId(bufferId);

					this.withScopedSyntax(function () {
						this.compile(node.body, frame);
					});

					this.emitLine('frame = ' + (keepFrame ? 'frame.pop();' : 'callerFrame;'));
					this.emitLine('return new runtime.SafeString(' + bufferId + ');');
					this.emitLine('});');
					this.popBufferId();

					return funcId;
				},

				compileMacro: function compileMacro(node, frame) {
					var funcId = this._compileMacro(node);

					// Expose the macro to the templates
					var name = node.name.value;
					frame.set(name, funcId);

					if (frame.parent) {
						this.emitLine('frame.set("' + name + '", ' + funcId + ');');
					} else {
						if (node.name.value.charAt(0) !== '_') {
							this.emitLine('context.addExport("' + name + '");');
						}
						this.emitLine('context.setVariable("' + name + '", ' + funcId + ');');
					}
				},

				compileCaller: function compileCaller(node, frame) {
					// basically an anonymous "macro expression"
					this.emit('(function (){');
					var funcId = this._compileMacro(node, frame);
					this.emit('return ' + funcId + ';})()');
				},

				compileImport: function compileImport(node, frame) {
					var id = this.tmpid();
					var target = node.target.value;

					this.emit('env.getTemplate(');
					this._compileExpression(node.template, frame);
					this.emitLine(', false, ' + this._templateName() + ', false, ' + this.makeCallback(id));
					this.addScopeLevel();

					this.emitLine(id + '.getExported(' + (node.withContext ? 'context.getVariables(), frame, ' : '') + this.makeCallback(id));
					this.addScopeLevel();

					frame.set(target, id);

					if (frame.parent) {
						this.emitLine('frame.set("' + target + '", ' + id + ');');
					} else {
						this.emitLine('context.setVariable("' + target + '", ' + id + ');');
					}
				},

				compileFromImport: function compileFromImport(node, frame) {
					var importedId = this.tmpid();

					this.emit('env.getTemplate(');
					this._compileExpression(node.template, frame);
					this.emitLine(', false, ' + this._templateName() + ', false, ' + this.makeCallback(importedId));
					this.addScopeLevel();

					this.emitLine(importedId + '.getExported(' + (node.withContext ? 'context.getVariables(), frame, ' : '') + this.makeCallback(importedId));
					this.addScopeLevel();

					lib.each(node.names.children, function (nameNode) {
						var name;
						var alias;
						var id = this.tmpid();

						if (nameNode instanceof nodes.Pair) {
							name = nameNode.key.value;
							alias = nameNode.value.value;
						} else {
							name = nameNode.value;
							alias = name;
						}

						this.emitLine('if(' + importedId + '.hasOwnProperty("' + name + '")) {');
						this.emitLine('var ' + id + ' = ' + importedId + '.' + name + ';');
						this.emitLine('} else {');
						this.emitLine('cb(new Error("cannot import \'' + name + '\'")); return;');
						this.emitLine('}');

						frame.set(alias, id);

						if (frame.parent) {
							this.emitLine('frame.set("' + alias + '", ' + id + ');');
						} else {
							this.emitLine('context.setVariable("' + alias + '", ' + id + ');');
						}
					}, this);
				},

				compileBlock: function compileBlock(node) {
					var id = this.tmpid();

					// If we are executing outside a block (creating a top-level
					// block), we really don't want to execute its code because it
					// will execute twice: once when the child template runs and
					// again when the parent template runs. Note that blocks
					// within blocks will *always* execute immediately *and*
					// wherever else they are invoked (like used in a parent
					// template). This may have behavioral differences from jinja
					// because blocks can have side effects, but it seems like a
					// waste of performance to always execute huge top-level
					// blocks twice
					if (!this.inBlock) {
						this.emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : ');
					}
					this.emit('context.getBlock("' + node.name.value + '")');
					if (!this.inBlock) {
						this.emit(')');
					}
					this.emitLine('(env, context, frame, runtime, ' + this.makeCallback(id));
					this.emitLine(this.buffer + ' += ' + id + ';');
					this.addScopeLevel();
				},

				compileSuper: function compileSuper(node, frame) {
					var name = node.blockName.value;
					var id = node.symbol.value;

					this.emitLine('context.getSuper(env, ' + '"' + name + '", ' + 'b_' + name + ', ' + 'frame, runtime, ' + this.makeCallback(id));
					this.emitLine(id + ' = runtime.markSafe(' + id + ');');
					this.addScopeLevel();
					frame.set(id, id);
				},

				compileExtends: function compileExtends(node, frame) {
					var k = this.tmpid();

					this.emit('env.getTemplate(');
					this._compileExpression(node.template, frame);
					this.emitLine(', true, ' + this._templateName() + ', false, ' + this.makeCallback('_parentTemplate'));

					// extends is a dynamic tag and can occur within a block like
					// `if`, so if this happens we need to capture the parent
					// template in the top-level scope
					this.emitLine('parentTemplate = _parentTemplate');

					this.emitLine('for(var ' + k + ' in parentTemplate.blocks) {');
					this.emitLine('context.addBlock(' + k + ', parentTemplate.blocks[' + k + ']);');
					this.emitLine('}');

					this.addScopeLevel();
				},

				compileInclude: function compileInclude(node, frame) {
					var id = this.tmpid();
					var id2 = this.tmpid();

					this.emitLine('var tasks = [];');
					this.emitLine('tasks.push(');
					this.emitLine('function(callback) {');
					this.emit('env.getTemplate(');
					this._compileExpression(node.template, frame);
					this.emitLine(', false, ' + this._templateName() + ', ' + node.ignoreMissing + ', ' + this.makeCallback(id));
					this.emitLine('callback(null,' + id + ');});');
					this.emitLine('});');

					this.emitLine('tasks.push(');
					this.emitLine('function(template, callback){');
					this.emitLine('template.render(' + 'context.getVariables(), frame, ' + this.makeCallback(id2));
					this.emitLine('callback(null,' + id2 + ');});');
					this.emitLine('});');

					this.emitLine('tasks.push(');
					this.emitLine('function(result, callback){');
					this.emitLine(this.buffer + ' += result;');
					this.emitLine('callback(null);');
					this.emitLine('});');
					this.emitLine('env.waterfall(tasks, function(){');
					this.addScopeLevel();
				},

				compileTemplateData: function compileTemplateData(node, frame) {
					this.compileLiteral(node, frame);
				},

				compileCapture: function compileCapture(node, frame) {
					// we need to temporarily override the current buffer id as 'output'
					// so the set block writes to the capture output instead of the buffer
					var buffer = this.buffer;
					this.buffer = 'output';
					this.emitLine('(function() {');
					this.emitLine('var output = "";');
					this.withScopedSyntax(function () {
						this.compile(node.body, frame);
					});
					this.emitLine('return output;');
					this.emitLine('})()');
					// and of course, revert back to the old buffer id
					this.buffer = buffer;
				},

				compileOutput: function compileOutput(node, frame) {
					var children = node.children;
					for (var i = 0, l = children.length; i < l; i++) {
						// TemplateData is a special case because it is never
						// autoescaped, so simply output it for optimization
						if (children[i] instanceof nodes.TemplateData) {
							if (children[i].value) {
								this.emit(this.buffer + ' += ');
								this.compileLiteral(children[i], frame);
								this.emitLine(';');
							}
						} else {
							this.emit(this.buffer + ' += runtime.suppressValue(');
							if (this.throwOnUndefined) {
								this.emit('runtime.ensureDefined(');
							}
							this.compile(children[i], frame);
							if (this.throwOnUndefined) {
								this.emit(',' + node.lineno + ',' + node.colno + ')');
							}
							this.emit(', env.opts.autoescape);\n');
						}
					}
				},

				compileRoot: function compileRoot(node, frame) {
					if (frame) {
						this.fail('compileRoot: root node can\'t have frame');
					}

					frame = new Frame();

					this.emitFuncBegin('root');
					this.emitLine('var parentTemplate = null;');
					this._compileChildren(node, frame);
					this.emitLine('if(parentTemplate) {');
					this.emitLine('parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);');
					this.emitLine('} else {');
					this.emitLine('cb(null, ' + this.buffer + ');');
					this.emitLine('}');
					this.emitFuncEnd(true);

					this.inBlock = true;

					var blockNames = [];

					var i,
					    name,
					    block,
					    blocks = node.findAll(nodes.Block);
					for (i = 0; i < blocks.length; i++) {
						block = blocks[i];
						name = block.name.value;

						if (blockNames.indexOf(name) !== -1) {
							throw new Error('Block "' + name + '" defined more than once.');
						}
						blockNames.push(name);

						this.emitFuncBegin('b_' + name);

						var tmpFrame = new Frame();
						this.emitLine('var frame = frame.push(true);');
						this.compile(block.body, tmpFrame);
						this.emitFuncEnd();
					}

					this.emitLine('return {');
					for (i = 0; i < blocks.length; i++) {
						block = blocks[i];
						name = 'b_' + block.name.value;
						this.emitLine(name + ': ' + name + ',');
					}
					this.emitLine('root: root\n};');
				},

				compile: function compile(node, frame) {
					var _compile = this['compile' + node.typename];
					if (_compile) {
						_compile.call(this, node, frame);
					} else {
						this.fail('compile: Cannot compile node: ' + node.typename, node.lineno, node.colno);
					}
				},

				getCode: function getCode() {
					return this.codebuf.join('');
				}
			});

			// var c = new Compiler();
			// var src = 'hello {% filter title %}' +
			//     'Hello madam how are you' +
			//     '{% endfilter %}'
			// var ast = transformer.transform(parser.parse(src));
			// nodes.printNodes(ast);
			// c.compile(ast);
			// var tmpl = c.getCode();
			// console.log(tmpl);

			module.exports = {
				compile: function compile(src, asyncFilters, extensions, name, opts) {
					var c = new Compiler(name, opts.throwOnUndefined);

					// Run the extension preprocessors against the source.
					if (extensions && extensions.length) {
						for (var i = 0; i < extensions.length; i++) {
							if ('preprocess' in extensions[i]) {
								src = extensions[i].preprocess(src, name);
							}
						}
					}

					c.compile(transformer.transform(parser.parse(src, extensions, opts), asyncFilters, name));
					return c.getCode();
				},

				Compiler: Compiler
			};

			/***/
		},
		/* 8 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var lexer = __webpack_require__(9);
			var nodes = __webpack_require__(10);
			// jshint -W079
			var Object = __webpack_require__(6);
			var lib = __webpack_require__(1);

			var Parser = Object.extend({
				init: function init(tokens) {
					this.tokens = tokens;
					this.peeked = null;
					this.breakOnBlocks = null;
					this.dropLeadingWhitespace = false;

					this.extensions = [];
				},

				nextToken: function nextToken(withWhitespace) {
					var tok;

					if (this.peeked) {
						if (!withWhitespace && this.peeked.type === lexer.TOKEN_WHITESPACE) {
							this.peeked = null;
						} else {
							tok = this.peeked;
							this.peeked = null;
							return tok;
						}
					}

					tok = this.tokens.nextToken();

					if (!withWhitespace) {
						while (tok && tok.type === lexer.TOKEN_WHITESPACE) {
							tok = this.tokens.nextToken();
						}
					}

					return tok;
				},

				peekToken: function peekToken() {
					this.peeked = this.peeked || this.nextToken();
					return this.peeked;
				},

				pushToken: function pushToken(tok) {
					if (this.peeked) {
						throw new Error('pushToken: can only push one token on between reads');
					}
					this.peeked = tok;
				},

				fail: function fail(msg, lineno, colno) {
					if ((lineno === undefined || colno === undefined) && this.peekToken()) {
						var tok = this.peekToken();
						lineno = tok.lineno;
						colno = tok.colno;
					}
					if (lineno !== undefined) lineno += 1;
					if (colno !== undefined) colno += 1;

					throw new lib.TemplateError(msg, lineno, colno);
				},

				skip: function skip(type) {
					var tok = this.nextToken();
					if (!tok || tok.type !== type) {
						this.pushToken(tok);
						return false;
					}
					return true;
				},

				expect: function expect(type) {
					var tok = this.nextToken();
					if (tok.type !== type) {
						this.fail('expected ' + type + ', got ' + tok.type, tok.lineno, tok.colno);
					}
					return tok;
				},

				skipValue: function skipValue(type, val) {
					var tok = this.nextToken();
					if (!tok || tok.type !== type || tok.value !== val) {
						this.pushToken(tok);
						return false;
					}
					return true;
				},

				skipSymbol: function skipSymbol(val) {
					return this.skipValue(lexer.TOKEN_SYMBOL, val);
				},

				advanceAfterBlockEnd: function advanceAfterBlockEnd(name) {
					var tok;
					if (!name) {
						tok = this.peekToken();

						if (!tok) {
							this.fail('unexpected end of file');
						}

						if (tok.type !== lexer.TOKEN_SYMBOL) {
							this.fail('advanceAfterBlockEnd: expected symbol token or ' + 'explicit name to be passed');
						}

						name = this.nextToken().value;
					}

					tok = this.nextToken();

					if (tok && tok.type === lexer.TOKEN_BLOCK_END) {
						if (tok.value.charAt(0) === '-') {
							this.dropLeadingWhitespace = true;
						}
					} else {
						this.fail('expected block end in ' + name + ' statement');
					}

					return tok;
				},

				advanceAfterVariableEnd: function advanceAfterVariableEnd() {
					var tok = this.nextToken();

					if (tok && tok.type === lexer.TOKEN_VARIABLE_END) {
						this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.VARIABLE_END.length - 1) === '-';
					} else {
						this.pushToken(tok);
						this.fail('expected variable end');
					}
				},

				parseFor: function parseFor() {
					var forTok = this.peekToken();
					var node;
					var endBlock;

					if (this.skipSymbol('for')) {
						node = new nodes.For(forTok.lineno, forTok.colno);
						endBlock = 'endfor';
					} else if (this.skipSymbol('asyncEach')) {
						node = new nodes.AsyncEach(forTok.lineno, forTok.colno);
						endBlock = 'endeach';
					} else if (this.skipSymbol('asyncAll')) {
						node = new nodes.AsyncAll(forTok.lineno, forTok.colno);
						endBlock = 'endall';
					} else {
						this.fail('parseFor: expected for{Async}', forTok.lineno, forTok.colno);
					}

					node.name = this.parsePrimary();

					if (!(node.name instanceof nodes.Symbol)) {
						this.fail('parseFor: variable name expected for loop');
					}

					var type = this.peekToken().type;
					if (type === lexer.TOKEN_COMMA) {
						// key/value iteration
						var key = node.name;
						node.name = new nodes.Array(key.lineno, key.colno);
						node.name.addChild(key);

						while (this.skip(lexer.TOKEN_COMMA)) {
							var prim = this.parsePrimary();
							node.name.addChild(prim);
						}
					}

					if (!this.skipSymbol('in')) {
						this.fail('parseFor: expected "in" keyword for loop', forTok.lineno, forTok.colno);
					}

					node.arr = this.parseExpression();
					this.advanceAfterBlockEnd(forTok.value);

					node.body = this.parseUntilBlocks(endBlock, 'else');

					if (this.skipSymbol('else')) {
						this.advanceAfterBlockEnd('else');
						node.else_ = this.parseUntilBlocks(endBlock);
					}

					this.advanceAfterBlockEnd();

					return node;
				},

				parseMacro: function parseMacro() {
					var macroTok = this.peekToken();
					if (!this.skipSymbol('macro')) {
						this.fail('expected macro');
					}

					var name = this.parsePrimary(true);
					var args = this.parseSignature();
					var node = new nodes.Macro(macroTok.lineno, macroTok.colno, name, args);

					this.advanceAfterBlockEnd(macroTok.value);
					node.body = this.parseUntilBlocks('endmacro');
					this.advanceAfterBlockEnd();

					return node;
				},

				parseCall: function parseCall() {
					// a call block is parsed as a normal FunCall, but with an added
					// 'caller' kwarg which is a Caller node.
					var callTok = this.peekToken();
					if (!this.skipSymbol('call')) {
						this.fail('expected call');
					}

					var callerArgs = this.parseSignature(true) || new nodes.NodeList();
					var macroCall = this.parsePrimary();

					this.advanceAfterBlockEnd(callTok.value);
					var body = this.parseUntilBlocks('endcall');
					this.advanceAfterBlockEnd();

					var callerName = new nodes.Symbol(callTok.lineno, callTok.colno, 'caller');
					var callerNode = new nodes.Caller(callTok.lineno, callTok.colno, callerName, callerArgs, body);

					// add the additional caller kwarg, adding kwargs if necessary
					var args = macroCall.args.children;
					if (!(args[args.length - 1] instanceof nodes.KeywordArgs)) {
						args.push(new nodes.KeywordArgs());
					}
					var kwargs = args[args.length - 1];
					kwargs.addChild(new nodes.Pair(callTok.lineno, callTok.colno, callerName, callerNode));

					return new nodes.Output(callTok.lineno, callTok.colno, [macroCall]);
				},

				parseWithContext: function parseWithContext() {
					var tok = this.peekToken();

					var withContext = null;

					if (this.skipSymbol('with')) {
						withContext = true;
					} else if (this.skipSymbol('without')) {
						withContext = false;
					}

					if (withContext !== null) {
						if (!this.skipSymbol('context')) {
							this.fail('parseFrom: expected context after with/without', tok.lineno, tok.colno);
						}
					}

					return withContext;
				},

				parseImport: function parseImport() {
					var importTok = this.peekToken();
					if (!this.skipSymbol('import')) {
						this.fail('parseImport: expected import', importTok.lineno, importTok.colno);
					}

					var template = this.parseExpression();

					if (!this.skipSymbol('as')) {
						this.fail('parseImport: expected "as" keyword', importTok.lineno, importTok.colno);
					}

					var target = this.parseExpression();

					var withContext = this.parseWithContext();

					var node = new nodes.Import(importTok.lineno, importTok.colno, template, target, withContext);

					this.advanceAfterBlockEnd(importTok.value);

					return node;
				},

				parseFrom: function parseFrom() {
					var fromTok = this.peekToken();
					if (!this.skipSymbol('from')) {
						this.fail('parseFrom: expected from');
					}

					var template = this.parseExpression();

					if (!this.skipSymbol('import')) {
						this.fail('parseFrom: expected import', fromTok.lineno, fromTok.colno);
					}

					var names = new nodes.NodeList(),
					    withContext;

					while (1) {
						var nextTok = this.peekToken();
						if (nextTok.type === lexer.TOKEN_BLOCK_END) {
							if (!names.children.length) {
								this.fail('parseFrom: Expected at least one import name', fromTok.lineno, fromTok.colno);
							}

							// Since we are manually advancing past the block end,
							// need to keep track of whitespace control (normally
							// this is done in `advanceAfterBlockEnd`
							if (nextTok.value.charAt(0) === '-') {
								this.dropLeadingWhitespace = true;
							}

							this.nextToken();
							break;
						}

						if (names.children.length > 0 && !this.skip(lexer.TOKEN_COMMA)) {
							this.fail('parseFrom: expected comma', fromTok.lineno, fromTok.colno);
						}

						var name = this.parsePrimary();
						if (name.value.charAt(0) === '_') {
							this.fail('parseFrom: names starting with an underscore ' + 'cannot be imported', name.lineno, name.colno);
						}

						if (this.skipSymbol('as')) {
							var alias = this.parsePrimary();
							names.addChild(new nodes.Pair(name.lineno, name.colno, name, alias));
						} else {
							names.addChild(name);
						}

						withContext = this.parseWithContext();
					}

					return new nodes.FromImport(fromTok.lineno, fromTok.colno, template, names, withContext);
				},

				parseBlock: function parseBlock() {
					var tag = this.peekToken();
					if (!this.skipSymbol('block')) {
						this.fail('parseBlock: expected block', tag.lineno, tag.colno);
					}

					var node = new nodes.Block(tag.lineno, tag.colno);

					node.name = this.parsePrimary();
					if (!(node.name instanceof nodes.Symbol)) {
						this.fail('parseBlock: variable name expected', tag.lineno, tag.colno);
					}

					this.advanceAfterBlockEnd(tag.value);

					node.body = this.parseUntilBlocks('endblock');
					this.skipSymbol('endblock');
					this.skipSymbol(node.name.value);

					var tok = this.peekToken();
					if (!tok) {
						this.fail('parseBlock: expected endblock, got end of file');
					}

					this.advanceAfterBlockEnd(tok.value);

					return node;
				},

				parseExtends: function parseExtends() {
					var tagName = 'extends';
					var tag = this.peekToken();
					if (!this.skipSymbol(tagName)) {
						this.fail('parseTemplateRef: expected ' + tagName);
					}

					var node = new nodes.Extends(tag.lineno, tag.colno);
					node.template = this.parseExpression();

					this.advanceAfterBlockEnd(tag.value);
					return node;
				},

				parseInclude: function parseInclude() {
					var tagName = 'include';
					var tag = this.peekToken();
					if (!this.skipSymbol(tagName)) {
						this.fail('parseInclude: expected ' + tagName);
					}

					var node = new nodes.Include(tag.lineno, tag.colno);
					node.template = this.parseExpression();

					if (this.skipSymbol('ignore') && this.skipSymbol('missing')) {
						node.ignoreMissing = true;
					}

					this.advanceAfterBlockEnd(tag.value);
					return node;
				},

				parseIf: function parseIf() {
					var tag = this.peekToken();
					var node;

					if (this.skipSymbol('if') || this.skipSymbol('elif') || this.skipSymbol('elseif')) {
						node = new nodes.If(tag.lineno, tag.colno);
					} else if (this.skipSymbol('ifAsync')) {
						node = new nodes.IfAsync(tag.lineno, tag.colno);
					} else {
						this.fail('parseIf: expected if, elif, or elseif', tag.lineno, tag.colno);
					}

					node.cond = this.parseExpression();
					this.advanceAfterBlockEnd(tag.value);

					node.body = this.parseUntilBlocks('elif', 'elseif', 'else', 'endif');
					var tok = this.peekToken();

					switch (tok && tok.value) {
						case 'elseif':
						case 'elif':
							node.else_ = this.parseIf();
							break;
						case 'else':
							this.advanceAfterBlockEnd();
							node.else_ = this.parseUntilBlocks('endif');
							this.advanceAfterBlockEnd();
							break;
						case 'endif':
							node.else_ = null;
							this.advanceAfterBlockEnd();
							break;
						default:
							this.fail('parseIf: expected elif, else, or endif, ' + 'got end of file');
					}

					return node;
				},

				parseSet: function parseSet() {
					var tag = this.peekToken();
					if (!this.skipSymbol('set')) {
						this.fail('parseSet: expected set', tag.lineno, tag.colno);
					}

					var node = new nodes.Set(tag.lineno, tag.colno, []);

					var target;
					while (target = this.parsePrimary()) {
						node.targets.push(target);

						if (!this.skip(lexer.TOKEN_COMMA)) {
							break;
						}
					}

					if (!this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
						if (!this.skip(lexer.TOKEN_BLOCK_END)) {
							this.fail('parseSet: expected = or block end in set tag', tag.lineno, tag.colno);
						} else {
							node.body = new nodes.Capture(tag.lineno, tag.colno, this.parseUntilBlocks('endset'));
							node.value = null;
							this.advanceAfterBlockEnd();
						}
					} else {
						node.value = this.parseExpression();
						this.advanceAfterBlockEnd(tag.value);
					}

					return node;
				},

				parseStatement: function parseStatement() {
					var tok = this.peekToken();
					var node;

					if (tok.type !== lexer.TOKEN_SYMBOL) {
						this.fail('tag name expected', tok.lineno, tok.colno);
					}

					if (this.breakOnBlocks && lib.indexOf(this.breakOnBlocks, tok.value) !== -1) {
						return null;
					}

					switch (tok.value) {
						case 'raw':
							return this.parseRaw();
						case 'verbatim':
							return this.parseRaw('verbatim');
						case 'if':
						case 'ifAsync':
							return this.parseIf();
						case 'for':
						case 'asyncEach':
						case 'asyncAll':
							return this.parseFor();
						case 'block':
							return this.parseBlock();
						case 'extends':
							return this.parseExtends();
						case 'include':
							return this.parseInclude();
						case 'set':
							return this.parseSet();
						case 'macro':
							return this.parseMacro();
						case 'call':
							return this.parseCall();
						case 'import':
							return this.parseImport();
						case 'from':
							return this.parseFrom();
						case 'filter':
							return this.parseFilterStatement();
						default:
							if (this.extensions.length) {
								for (var i = 0; i < this.extensions.length; i++) {
									var ext = this.extensions[i];
									if (lib.indexOf(ext.tags || [], tok.value) !== -1) {
										return ext.parse(this, nodes, lexer);
									}
								}
							}
							this.fail('unknown block tag: ' + tok.value, tok.lineno, tok.colno);
					}

					return node;
				},

				parseRaw: function parseRaw(tagName) {
					tagName = tagName || 'raw';
					var endTagName = 'end' + tagName;
					// Look for upcoming raw blocks (ignore all other kinds of blocks)
					var rawBlockRegex = new RegExp('([\\s\\S]*?){%\\s*(' + tagName + '|' + endTagName + ')\\s*(?=%})%}');
					var rawLevel = 1;
					var str = '';
					var matches = null;

					// Skip opening raw token
					// Keep this token to track line and column numbers
					var begun = this.advanceAfterBlockEnd();

					// Exit when there's nothing to match
					// or when we've found the matching "endraw" block
					while ((matches = this.tokens._extractRegex(rawBlockRegex)) && rawLevel > 0) {
						var all = matches[0];
						var pre = matches[1];
						var blockName = matches[2];

						// Adjust rawlevel
						if (blockName === tagName) {
							rawLevel += 1;
						} else if (blockName === endTagName) {
							rawLevel -= 1;
						}

						// Add to str
						if (rawLevel === 0) {
							// We want to exclude the last "endraw"
							str += pre;
							// Move tokenizer to beginning of endraw block
							this.tokens.backN(all.length - pre.length);
						} else {
							str += all;
						}
					}

					return new nodes.Output(begun.lineno, begun.colno, [new nodes.TemplateData(begun.lineno, begun.colno, str)]);
				},

				parsePostfix: function parsePostfix(node) {
					var lookup,
					    tok = this.peekToken();

					while (tok) {
						if (tok.type === lexer.TOKEN_LEFT_PAREN) {
							// Function call
							node = new nodes.FunCall(tok.lineno, tok.colno, node, this.parseSignature());
						} else if (tok.type === lexer.TOKEN_LEFT_BRACKET) {
							// Reference
							lookup = this.parseAggregate();
							if (lookup.children.length > 1) {
								this.fail('invalid index');
							}

							node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup.children[0]);
						} else if (tok.type === lexer.TOKEN_OPERATOR && tok.value === '.') {
							// Reference
							this.nextToken();
							var val = this.nextToken();

							if (val.type !== lexer.TOKEN_SYMBOL) {
								this.fail('expected name as lookup value, got ' + val.value, val.lineno, val.colno);
							}

							// Make a literal string because it's not a variable
							// reference
							lookup = new nodes.Literal(val.lineno, val.colno, val.value);

							node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup);
						} else {
							break;
						}

						tok = this.peekToken();
					}

					return node;
				},

				parseExpression: function parseExpression() {
					var node = this.parseInlineIf();
					return node;
				},

				parseInlineIf: function parseInlineIf() {
					var node = this.parseOr();
					if (this.skipSymbol('if')) {
						var cond_node = this.parseOr();
						var body_node = node;
						node = new nodes.InlineIf(node.lineno, node.colno);
						node.body = body_node;
						node.cond = cond_node;
						if (this.skipSymbol('else')) {
							node.else_ = this.parseOr();
						} else {
							node.else_ = null;
						}
					}

					return node;
				},

				parseOr: function parseOr() {
					var node = this.parseAnd();
					while (this.skipSymbol('or')) {
						var node2 = this.parseAnd();
						node = new nodes.Or(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseAnd: function parseAnd() {
					var node = this.parseNot();
					while (this.skipSymbol('and')) {
						var node2 = this.parseNot();
						node = new nodes.And(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseNot: function parseNot() {
					var tok = this.peekToken();
					if (this.skipSymbol('not')) {
						return new nodes.Not(tok.lineno, tok.colno, this.parseNot());
					}
					return this.parseIn();
				},

				parseIn: function parseIn() {
					var node = this.parseCompare();
					while (1) {
						// check if the next token is 'not'
						var tok = this.nextToken();
						if (!tok) {
							break;
						}
						var invert = tok.type === lexer.TOKEN_SYMBOL && tok.value === 'not';
						// if it wasn't 'not', put it back
						if (!invert) {
							this.pushToken(tok);
						}
						if (this.skipSymbol('in')) {
							var node2 = this.parseCompare();
							node = new nodes.In(node.lineno, node.colno, node, node2);
							if (invert) {
								node = new nodes.Not(node.lineno, node.colno, node);
							}
						} else {
							// if we'd found a 'not' but this wasn't an 'in', put back the 'not'
							if (invert) {
								this.pushToken(tok);
							}
							break;
						}
					}
					return node;
				},

				parseCompare: function parseCompare() {
					var compareOps = ['==', '===', '!=', '!==', '<', '>', '<=', '>='];
					var expr = this.parseConcat();
					var ops = [];

					while (1) {
						var tok = this.nextToken();

						if (!tok) {
							break;
						} else if (lib.indexOf(compareOps, tok.value) !== -1) {
							ops.push(new nodes.CompareOperand(tok.lineno, tok.colno, this.parseConcat(), tok.value));
						} else {
							this.pushToken(tok);
							break;
						}
					}

					if (ops.length) {
						return new nodes.Compare(ops[0].lineno, ops[0].colno, expr, ops);
					} else {
						return expr;
					}
				},

				// finds the '~' for string concatenation
				parseConcat: function parseConcat() {
					var node = this.parseAdd();
					while (this.skipValue(lexer.TOKEN_TILDE, '~')) {
						var node2 = this.parseAdd();
						node = new nodes.Concat(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseAdd: function parseAdd() {
					var node = this.parseSub();
					while (this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
						var node2 = this.parseSub();
						node = new nodes.Add(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseSub: function parseSub() {
					var node = this.parseMul();
					while (this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
						var node2 = this.parseMul();
						node = new nodes.Sub(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseMul: function parseMul() {
					var node = this.parseDiv();
					while (this.skipValue(lexer.TOKEN_OPERATOR, '*')) {
						var node2 = this.parseDiv();
						node = new nodes.Mul(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseDiv: function parseDiv() {
					var node = this.parseFloorDiv();
					while (this.skipValue(lexer.TOKEN_OPERATOR, '/')) {
						var node2 = this.parseFloorDiv();
						node = new nodes.Div(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseFloorDiv: function parseFloorDiv() {
					var node = this.parseMod();
					while (this.skipValue(lexer.TOKEN_OPERATOR, '//')) {
						var node2 = this.parseMod();
						node = new nodes.FloorDiv(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseMod: function parseMod() {
					var node = this.parsePow();
					while (this.skipValue(lexer.TOKEN_OPERATOR, '%')) {
						var node2 = this.parsePow();
						node = new nodes.Mod(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parsePow: function parsePow() {
					var node = this.parseUnary();
					while (this.skipValue(lexer.TOKEN_OPERATOR, '**')) {
						var node2 = this.parseUnary();
						node = new nodes.Pow(node.lineno, node.colno, node, node2);
					}
					return node;
				},

				parseUnary: function parseUnary(noFilters) {
					var tok = this.peekToken();
					var node;

					if (this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
						node = new nodes.Neg(tok.lineno, tok.colno, this.parseUnary(true));
					} else if (this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
						node = new nodes.Pos(tok.lineno, tok.colno, this.parseUnary(true));
					} else {
						node = this.parsePrimary();
					}

					if (!noFilters) {
						node = this.parseFilter(node);
					}

					return node;
				},

				parsePrimary: function parsePrimary(noPostfix) {
					var tok = this.nextToken();
					var val;
					var node = null;

					if (!tok) {
						this.fail('expected expression, got end of file');
					} else if (tok.type === lexer.TOKEN_STRING) {
						val = tok.value;
					} else if (tok.type === lexer.TOKEN_INT) {
						val = parseInt(tok.value, 10);
					} else if (tok.type === lexer.TOKEN_FLOAT) {
						val = parseFloat(tok.value);
					} else if (tok.type === lexer.TOKEN_BOOLEAN) {
						if (tok.value === 'true') {
							val = true;
						} else if (tok.value === 'false') {
							val = false;
						} else {
							this.fail('invalid boolean: ' + tok.value, tok.lineno, tok.colno);
						}
					} else if (tok.type === lexer.TOKEN_NONE) {
						val = null;
					} else if (tok.type === lexer.TOKEN_REGEX) {
						val = new RegExp(tok.value.body, tok.value.flags);
					}

					if (val !== undefined) {
						node = new nodes.Literal(tok.lineno, tok.colno, val);
					} else if (tok.type === lexer.TOKEN_SYMBOL) {
						node = new nodes.Symbol(tok.lineno, tok.colno, tok.value);
					} else {
						// See if it's an aggregate type, we need to push the
						// current delimiter token back on
						this.pushToken(tok);
						node = this.parseAggregate();
					}

					if (!noPostfix) {
						node = this.parsePostfix(node);
					}

					if (node) {
						return node;
					} else {
						this.fail('unexpected token: ' + tok.value, tok.lineno, tok.colno);
					}
				},

				parseFilterName: function parseFilterName() {
					var tok = this.expect(lexer.TOKEN_SYMBOL);
					var name = tok.value;

					while (this.skipValue(lexer.TOKEN_OPERATOR, '.')) {
						name += '.' + this.expect(lexer.TOKEN_SYMBOL).value;
					}

					return new nodes.Symbol(tok.lineno, tok.colno, name);
				},

				parseFilterArgs: function parseFilterArgs(node) {
					if (this.peekToken().type === lexer.TOKEN_LEFT_PAREN) {
						// Get a FunCall node and add the parameters to the
						// filter
						var call = this.parsePostfix(node);
						return call.args.children;
					}
					return [];
				},

				parseFilter: function parseFilter(node) {
					while (this.skip(lexer.TOKEN_PIPE)) {
						var name = this.parseFilterName();

						node = new nodes.Filter(name.lineno, name.colno, name, new nodes.NodeList(name.lineno, name.colno, [node].concat(this.parseFilterArgs(node))));
					}

					return node;
				},

				parseFilterStatement: function parseFilterStatement() {
					var filterTok = this.peekToken();
					if (!this.skipSymbol('filter')) {
						this.fail('parseFilterStatement: expected filter');
					}

					var name = this.parseFilterName();
					var args = this.parseFilterArgs(name);

					this.advanceAfterBlockEnd(filterTok.value);
					var body = new nodes.Capture(name.lineno, name.colno, this.parseUntilBlocks('endfilter'));
					this.advanceAfterBlockEnd();

					var node = new nodes.Filter(name.lineno, name.colno, name, new nodes.NodeList(name.lineno, name.colno, [body].concat(args)));

					return new nodes.Output(name.lineno, name.colno, [node]);
				},

				parseAggregate: function parseAggregate() {
					var tok = this.nextToken();
					var node;

					switch (tok.type) {
						case lexer.TOKEN_LEFT_PAREN:
							node = new nodes.Group(tok.lineno, tok.colno);break;
						case lexer.TOKEN_LEFT_BRACKET:
							node = new nodes.Array(tok.lineno, tok.colno);break;
						case lexer.TOKEN_LEFT_CURLY:
							node = new nodes.Dict(tok.lineno, tok.colno);break;
						default:
							return null;
					}

					while (1) {
						var type = this.peekToken().type;
						if (type === lexer.TOKEN_RIGHT_PAREN || type === lexer.TOKEN_RIGHT_BRACKET || type === lexer.TOKEN_RIGHT_CURLY) {
							this.nextToken();
							break;
						}

						if (node.children.length > 0) {
							if (!this.skip(lexer.TOKEN_COMMA)) {
								this.fail('parseAggregate: expected comma after expression', tok.lineno, tok.colno);
							}
						}

						if (node instanceof nodes.Dict) {
							// TODO: check for errors
							var key = this.parsePrimary();

							// We expect a key/value pair for dicts, separated by a
							// colon
							if (!this.skip(lexer.TOKEN_COLON)) {
								this.fail('parseAggregate: expected colon after dict key', tok.lineno, tok.colno);
							}

							// TODO: check for errors
							var value = this.parseExpression();
							node.addChild(new nodes.Pair(key.lineno, key.colno, key, value));
						} else {
							// TODO: check for errors
							var expr = this.parseExpression();
							node.addChild(expr);
						}
					}

					return node;
				},

				parseSignature: function parseSignature(tolerant, noParens) {
					var tok = this.peekToken();
					if (!noParens && tok.type !== lexer.TOKEN_LEFT_PAREN) {
						if (tolerant) {
							return null;
						} else {
							this.fail('expected arguments', tok.lineno, tok.colno);
						}
					}

					if (tok.type === lexer.TOKEN_LEFT_PAREN) {
						tok = this.nextToken();
					}

					var args = new nodes.NodeList(tok.lineno, tok.colno);
					var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
					var checkComma = false;

					while (1) {
						tok = this.peekToken();
						if (!noParens && tok.type === lexer.TOKEN_RIGHT_PAREN) {
							this.nextToken();
							break;
						} else if (noParens && tok.type === lexer.TOKEN_BLOCK_END) {
							break;
						}

						if (checkComma && !this.skip(lexer.TOKEN_COMMA)) {
							this.fail('parseSignature: expected comma after expression', tok.lineno, tok.colno);
						} else {
							var arg = this.parseExpression();

							if (this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
								kwargs.addChild(new nodes.Pair(arg.lineno, arg.colno, arg, this.parseExpression()));
							} else {
								args.addChild(arg);
							}
						}

						checkComma = true;
					}

					if (kwargs.children.length) {
						args.addChild(kwargs);
					}

					return args;
				},

				parseUntilBlocks: function parseUntilBlocks() /* blockNames */{
					var prev = this.breakOnBlocks;
					this.breakOnBlocks = lib.toArray(arguments);

					var ret = this.parse();

					this.breakOnBlocks = prev;
					return ret;
				},

				parseNodes: function parseNodes() {
					var tok;
					var buf = [];

					while (tok = this.nextToken()) {
						if (tok.type === lexer.TOKEN_DATA) {
							var data = tok.value;
							var nextToken = this.peekToken();
							var nextVal = nextToken && nextToken.value;

							// If the last token has "-" we need to trim the
							// leading whitespace of the data. This is marked with
							// the `dropLeadingWhitespace` variable.
							if (this.dropLeadingWhitespace) {
								// TODO: this could be optimized (don't use regex)
								data = data.replace(/^\s*/, '');
								this.dropLeadingWhitespace = false;
							}

							// Same for the succeeding block start token
							if (nextToken && (nextToken.type === lexer.TOKEN_BLOCK_START && nextVal.charAt(nextVal.length - 1) === '-' || nextToken.type === lexer.TOKEN_VARIABLE_START && nextVal.charAt(this.tokens.tags.VARIABLE_START.length) === '-' || nextToken.type === lexer.TOKEN_COMMENT && nextVal.charAt(this.tokens.tags.COMMENT_START.length) === '-')) {
								// TODO: this could be optimized (don't use regex)
								data = data.replace(/\s*$/, '');
							}

							buf.push(new nodes.Output(tok.lineno, tok.colno, [new nodes.TemplateData(tok.lineno, tok.colno, data)]));
						} else if (tok.type === lexer.TOKEN_BLOCK_START) {
							this.dropLeadingWhitespace = false;
							var n = this.parseStatement();
							if (!n) {
								break;
							}
							buf.push(n);
						} else if (tok.type === lexer.TOKEN_VARIABLE_START) {
							var e = this.parseExpression();
							this.dropLeadingWhitespace = false;
							this.advanceAfterVariableEnd();
							buf.push(new nodes.Output(tok.lineno, tok.colno, [e]));
						} else if (tok.type === lexer.TOKEN_COMMENT) {
							this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.COMMENT_END.length - 1) === '-';
						} else {
							// Ignore comments, otherwise this should be an error
							this.fail('Unexpected token at top-level: ' + tok.type, tok.lineno, tok.colno);
						}
					}

					return buf;
				},

				parse: function parse() {
					return new nodes.NodeList(0, 0, this.parseNodes());
				},

				parseAsRoot: function parseAsRoot() {
					return new nodes.Root(0, 0, this.parseNodes());
				}
			});

			// var util = require('util');

			// var l = lexer.lex('{%- if x -%}\n hello {% endif %}');
			// var t;
			// while((t = l.nextToken())) {
			//     console.log(util.inspect(t));
			// }

			// var p = new Parser(lexer.lex('hello {% filter title %}' +
			//                              'Hello madam how are you' +
			//                              '{% endfilter %}'));
			// var n = p.parseAsRoot();
			// nodes.printNodes(n);

			module.exports = {
				parse: function parse(src, extensions, opts) {
					var p = new Parser(lexer.lex(src, opts));
					if (extensions !== undefined) {
						p.extensions = extensions;
					}
					return p.parseAsRoot();
				},
				Parser: Parser
			};

			/***/
		},
		/* 9 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var lib = __webpack_require__(1);

			var whitespaceChars = ' \n\t\r\xA0';
			var delimChars = '()[]{}%*-+~/#,:|.<>=!';
			var intChars = '0123456789';

			var BLOCK_START = '{%';
			var BLOCK_END = '%}';
			var VARIABLE_START = '{{';
			var VARIABLE_END = '}}';
			var COMMENT_START = '{#';
			var COMMENT_END = '#}';

			var TOKEN_STRING = 'string';
			var TOKEN_WHITESPACE = 'whitespace';
			var TOKEN_DATA = 'data';
			var TOKEN_BLOCK_START = 'block-start';
			var TOKEN_BLOCK_END = 'block-end';
			var TOKEN_VARIABLE_START = 'variable-start';
			var TOKEN_VARIABLE_END = 'variable-end';
			var TOKEN_COMMENT = 'comment';
			var TOKEN_LEFT_PAREN = 'left-paren';
			var TOKEN_RIGHT_PAREN = 'right-paren';
			var TOKEN_LEFT_BRACKET = 'left-bracket';
			var TOKEN_RIGHT_BRACKET = 'right-bracket';
			var TOKEN_LEFT_CURLY = 'left-curly';
			var TOKEN_RIGHT_CURLY = 'right-curly';
			var TOKEN_OPERATOR = 'operator';
			var TOKEN_COMMA = 'comma';
			var TOKEN_COLON = 'colon';
			var TOKEN_TILDE = 'tilde';
			var TOKEN_PIPE = 'pipe';
			var TOKEN_INT = 'int';
			var TOKEN_FLOAT = 'float';
			var TOKEN_BOOLEAN = 'boolean';
			var TOKEN_NONE = 'none';
			var TOKEN_SYMBOL = 'symbol';
			var TOKEN_SPECIAL = 'special';
			var TOKEN_REGEX = 'regex';

			function token(type, value, lineno, colno) {
				return {
					type: type,
					value: value,
					lineno: lineno,
					colno: colno
				};
			}

			function Tokenizer(str, opts) {
				this.str = str;
				this.index = 0;
				this.len = str.length;
				this.lineno = 0;
				this.colno = 0;

				this.in_code = false;

				opts = opts || {};

				var tags = opts.tags || {};
				this.tags = {
					BLOCK_START: tags.blockStart || BLOCK_START,
					BLOCK_END: tags.blockEnd || BLOCK_END,
					VARIABLE_START: tags.variableStart || VARIABLE_START,
					VARIABLE_END: tags.variableEnd || VARIABLE_END,
					COMMENT_START: tags.commentStart || COMMENT_START,
					COMMENT_END: tags.commentEnd || COMMENT_END
				};

				this.trimBlocks = !!opts.trimBlocks;
				this.lstripBlocks = !!opts.lstripBlocks;
			}

			Tokenizer.prototype.nextToken = function () {
				var lineno = this.lineno;
				var colno = this.colno;
				var tok;

				if (this.in_code) {
					// Otherwise, if we are in a block parse it as code
					var cur = this.current();

					if (this.is_finished()) {
						// We have nothing else to parse
						return null;
					} else if (cur === '"' || cur === '\'') {
						// We've hit a string
						return token(TOKEN_STRING, this.parseString(cur), lineno, colno);
					} else if (tok = this._extract(whitespaceChars)) {
						// We hit some whitespace
						return token(TOKEN_WHITESPACE, tok, lineno, colno);
					} else if ((tok = this._extractString(this.tags.BLOCK_END)) || (tok = this._extractString('-' + this.tags.BLOCK_END))) {
						// Special check for the block end tag
						//
						// It is a requirement that start and end tags are composed of
						// delimiter characters (%{}[] etc), and our code always
						// breaks on delimiters so we can assume the token parsing
						// doesn't consume these elsewhere
						this.in_code = false;
						if (this.trimBlocks) {
							cur = this.current();
							if (cur === '\n') {
								// Skip newline
								this.forward();
							} else if (cur === '\r') {
								// Skip CRLF newline
								this.forward();
								cur = this.current();
								if (cur === '\n') {
									this.forward();
								} else {
									// Was not a CRLF, so go back
									this.back();
								}
							}
						}
						return token(TOKEN_BLOCK_END, tok, lineno, colno);
					} else if ((tok = this._extractString(this.tags.VARIABLE_END)) || (tok = this._extractString('-' + this.tags.VARIABLE_END))) {
						// Special check for variable end tag (see above)
						this.in_code = false;
						return token(TOKEN_VARIABLE_END, tok, lineno, colno);
					} else if (cur === 'r' && this.str.charAt(this.index + 1) === '/') {
						// Skip past 'r/'.
						this.forwardN(2);

						// Extract until the end of the regex -- / ends it, \/ does not.
						var regexBody = '';
						while (!this.is_finished()) {
							if (this.current() === '/' && this.previous() !== '\\') {
								this.forward();
								break;
							} else {
								regexBody += this.current();
								this.forward();
							}
						}

						// Check for flags.
						// The possible flags are according to https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
						var POSSIBLE_FLAGS = ['g', 'i', 'm', 'y'];
						var regexFlags = '';
						while (!this.is_finished()) {
							var isCurrentAFlag = POSSIBLE_FLAGS.indexOf(this.current()) !== -1;
							if (isCurrentAFlag) {
								regexFlags += this.current();
								this.forward();
							} else {
								break;
							}
						}

						return token(TOKEN_REGEX, { body: regexBody, flags: regexFlags }, lineno, colno);
					} else if (delimChars.indexOf(cur) !== -1) {
						// We've hit a delimiter (a special char like a bracket)
						this.forward();
						var complexOps = ['==', '===', '!=', '!==', '<=', '>=', '//', '**'];
						var curComplex = cur + this.current();
						var type;

						if (lib.indexOf(complexOps, curComplex) !== -1) {
							this.forward();
							cur = curComplex;

							// See if this is a strict equality/inequality comparator
							if (lib.indexOf(complexOps, curComplex + this.current()) !== -1) {
								cur = curComplex + this.current();
								this.forward();
							}
						}

						switch (cur) {
							case '(':
								type = TOKEN_LEFT_PAREN;break;
							case ')':
								type = TOKEN_RIGHT_PAREN;break;
							case '[':
								type = TOKEN_LEFT_BRACKET;break;
							case ']':
								type = TOKEN_RIGHT_BRACKET;break;
							case '{':
								type = TOKEN_LEFT_CURLY;break;
							case '}':
								type = TOKEN_RIGHT_CURLY;break;
							case ',':
								type = TOKEN_COMMA;break;
							case ':':
								type = TOKEN_COLON;break;
							case '~':
								type = TOKEN_TILDE;break;
							case '|':
								type = TOKEN_PIPE;break;
							default:
								type = TOKEN_OPERATOR;
						}

						return token(type, cur, lineno, colno);
					} else {
						// We are not at whitespace or a delimiter, so extract the
						// text and parse it
						tok = this._extractUntil(whitespaceChars + delimChars);

						if (tok.match(/^[-+]?[0-9]+$/)) {
							if (this.current() === '.') {
								this.forward();
								var dec = this._extract(intChars);
								return token(TOKEN_FLOAT, tok + '.' + dec, lineno, colno);
							} else {
								return token(TOKEN_INT, tok, lineno, colno);
							}
						} else if (tok.match(/^(true|false)$/)) {
							return token(TOKEN_BOOLEAN, tok, lineno, colno);
						} else if (tok === 'none') {
							return token(TOKEN_NONE, tok, lineno, colno);
						} else if (tok) {
							return token(TOKEN_SYMBOL, tok, lineno, colno);
						} else {
							throw new Error('Unexpected value while parsing: ' + tok);
						}
					}
				} else {
					// Parse out the template text, breaking on tag
					// delimiters because we need to look for block/variable start
					// tags (don't use the full delimChars for optimization)
					var beginChars = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);

					if (this.is_finished()) {
						return null;
					} else if ((tok = this._extractString(this.tags.BLOCK_START + '-')) || (tok = this._extractString(this.tags.BLOCK_START))) {
						this.in_code = true;
						return token(TOKEN_BLOCK_START, tok, lineno, colno);
					} else if ((tok = this._extractString(this.tags.VARIABLE_START + '-')) || (tok = this._extractString(this.tags.VARIABLE_START))) {
						this.in_code = true;
						return token(TOKEN_VARIABLE_START, tok, lineno, colno);
					} else {
						tok = '';
						var data;
						var in_comment = false;

						if (this._matches(this.tags.COMMENT_START)) {
							in_comment = true;
							tok = this._extractString(this.tags.COMMENT_START);
						}

						// Continually consume text, breaking on the tag delimiter
						// characters and checking to see if it's a start tag.
						//
						// We could hit the end of the template in the middle of
						// our looping, so check for the null return value from
						// _extractUntil
						while ((data = this._extractUntil(beginChars)) !== null) {
							tok += data;

							if ((this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !in_comment) {
								if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= tok.length) {
									var lastLine = tok.slice(-this.colno);
									if (/^\s+$/.test(lastLine)) {
										// Remove block leading whitespace from beginning of the string
										tok = tok.slice(0, -this.colno);
										if (!tok.length) {
											// All data removed, collapse to avoid unnecessary nodes
											// by returning next token (block start)
											return this.nextToken();
										}
									}
								}
								// If it is a start tag, stop looping
								break;
							} else if (this._matches(this.tags.COMMENT_END)) {
								if (!in_comment) {
									throw new Error('unexpected end of comment');
								}
								tok += this._extractString(this.tags.COMMENT_END);
								break;
							} else {
								// It does not match any tag, so add the character and
								// carry on
								tok += this.current();
								this.forward();
							}
						}

						if (data === null && in_comment) {
							throw new Error('expected end of comment, got end of file');
						}

						return token(in_comment ? TOKEN_COMMENT : TOKEN_DATA, tok, lineno, colno);
					}
				}

				throw new Error('Could not parse text');
			};

			Tokenizer.prototype.parseString = function (delimiter) {
				this.forward();

				var str = '';

				while (!this.is_finished() && this.current() !== delimiter) {
					var cur = this.current();

					if (cur === '\\') {
						this.forward();
						switch (this.current()) {
							case 'n':
								str += '\n';break;
							case 't':
								str += '\t';break;
							case 'r':
								str += '\r';break;
							default:
								str += this.current();
						}
						this.forward();
					} else {
						str += cur;
						this.forward();
					}
				}

				this.forward();
				return str;
			};

			Tokenizer.prototype._matches = function (str) {
				if (this.index + str.length > this.len) {
					return null;
				}

				var m = this.str.slice(this.index, this.index + str.length);
				return m === str;
			};

			Tokenizer.prototype._extractString = function (str) {
				if (this._matches(str)) {
					this.index += str.length;
					return str;
				}
				return null;
			};

			Tokenizer.prototype._extractUntil = function (charString) {
				// Extract all non-matching chars, with the default matching set
				// to everything
				return this._extractMatching(true, charString || '');
			};

			Tokenizer.prototype._extract = function (charString) {
				// Extract all matching chars (no default, so charString must be
				// explicit)
				return this._extractMatching(false, charString);
			};

			Tokenizer.prototype._extractMatching = function (breakOnMatch, charString) {
				// Pull out characters until a breaking char is hit.
				// If breakOnMatch is false, a non-matching char stops it.
				// If breakOnMatch is true, a matching char stops it.

				if (this.is_finished()) {
					return null;
				}

				var first = charString.indexOf(this.current());

				// Only proceed if the first character doesn't meet our condition
				if (breakOnMatch && first === -1 || !breakOnMatch && first !== -1) {
					var t = this.current();
					this.forward();

					// And pull out all the chars one at a time until we hit a
					// breaking char
					var idx = charString.indexOf(this.current());

					while ((breakOnMatch && idx === -1 || !breakOnMatch && idx !== -1) && !this.is_finished()) {
						t += this.current();
						this.forward();

						idx = charString.indexOf(this.current());
					}

					return t;
				}

				return '';
			};

			Tokenizer.prototype._extractRegex = function (regex) {
				var matches = this.currentStr().match(regex);
				if (!matches) {
					return null;
				}

				// Move forward whatever was matched
				this.forwardN(matches[0].length);

				return matches;
			};

			Tokenizer.prototype.is_finished = function () {
				return this.index >= this.len;
			};

			Tokenizer.prototype.forwardN = function (n) {
				for (var i = 0; i < n; i++) {
					this.forward();
				}
			};

			Tokenizer.prototype.forward = function () {
				this.index++;

				if (this.previous() === '\n') {
					this.lineno++;
					this.colno = 0;
				} else {
					this.colno++;
				}
			};

			Tokenizer.prototype.backN = function (n) {
				for (var i = 0; i < n; i++) {
					this.back();
				}
			};

			Tokenizer.prototype.back = function () {
				this.index--;

				if (this.current() === '\n') {
					this.lineno--;

					var idx = this.src.lastIndexOf('\n', this.index - 1);
					if (idx === -1) {
						this.colno = this.index;
					} else {
						this.colno = this.index - idx;
					}
				} else {
					this.colno--;
				}
			};

			// current returns current character
			Tokenizer.prototype.current = function () {
				if (!this.is_finished()) {
					return this.str.charAt(this.index);
				}
				return '';
			};

			// currentStr returns what's left of the unparsed string
			Tokenizer.prototype.currentStr = function () {
				if (!this.is_finished()) {
					return this.str.substr(this.index);
				}
				return '';
			};

			Tokenizer.prototype.previous = function () {
				return this.str.charAt(this.index - 1);
			};

			module.exports = {
				lex: function lex(src, opts) {
					return new Tokenizer(src, opts);
				},

				TOKEN_STRING: TOKEN_STRING,
				TOKEN_WHITESPACE: TOKEN_WHITESPACE,
				TOKEN_DATA: TOKEN_DATA,
				TOKEN_BLOCK_START: TOKEN_BLOCK_START,
				TOKEN_BLOCK_END: TOKEN_BLOCK_END,
				TOKEN_VARIABLE_START: TOKEN_VARIABLE_START,
				TOKEN_VARIABLE_END: TOKEN_VARIABLE_END,
				TOKEN_COMMENT: TOKEN_COMMENT,
				TOKEN_LEFT_PAREN: TOKEN_LEFT_PAREN,
				TOKEN_RIGHT_PAREN: TOKEN_RIGHT_PAREN,
				TOKEN_LEFT_BRACKET: TOKEN_LEFT_BRACKET,
				TOKEN_RIGHT_BRACKET: TOKEN_RIGHT_BRACKET,
				TOKEN_LEFT_CURLY: TOKEN_LEFT_CURLY,
				TOKEN_RIGHT_CURLY: TOKEN_RIGHT_CURLY,
				TOKEN_OPERATOR: TOKEN_OPERATOR,
				TOKEN_COMMA: TOKEN_COMMA,
				TOKEN_COLON: TOKEN_COLON,
				TOKEN_TILDE: TOKEN_TILDE,
				TOKEN_PIPE: TOKEN_PIPE,
				TOKEN_INT: TOKEN_INT,
				TOKEN_FLOAT: TOKEN_FLOAT,
				TOKEN_BOOLEAN: TOKEN_BOOLEAN,
				TOKEN_NONE: TOKEN_NONE,
				TOKEN_SYMBOL: TOKEN_SYMBOL,
				TOKEN_SPECIAL: TOKEN_SPECIAL,
				TOKEN_REGEX: TOKEN_REGEX
			};

			/***/
		},
		/* 10 */
		/***/function (module, exports, __webpack_require__) {

			/* WEBPACK VAR INJECTION */(function (process) {
				'use strict';

				var lib = __webpack_require__(1);
				// jshint -W079
				var Object = __webpack_require__(6);

				function traverseAndCheck(obj, type, results) {
					if (obj instanceof type) {
						results.push(obj);
					}

					if (obj instanceof Node) {
						obj.findAll(type, results);
					}
				}

				var Node = Object.extend('Node', {
					init: function init(lineno, colno) {
						this.lineno = lineno;
						this.colno = colno;

						var fields = this.fields;
						for (var i = 0, l = fields.length; i < l; i++) {
							var field = fields[i];

							// The first two args are line/col numbers, so offset by 2
							var val = arguments[i + 2];

							// Fields should never be undefined, but null. It makes
							// testing easier to normalize values.
							if (val === undefined) {
								val = null;
							}

							this[field] = val;
						}
					},

					findAll: function findAll(type, results) {
						results = results || [];

						var i, l;
						if (this instanceof NodeList) {
							var children = this.children;

							for (i = 0, l = children.length; i < l; i++) {
								traverseAndCheck(children[i], type, results);
							}
						} else {
							var fields = this.fields;

							for (i = 0, l = fields.length; i < l; i++) {
								traverseAndCheck(this[fields[i]], type, results);
							}
						}

						return results;
					},

					iterFields: function iterFields(func) {
						lib.each(this.fields, function (field) {
							func(this[field], field);
						}, this);
					}
				});

				// Abstract nodes
				var Value = Node.extend('Value', { fields: ['value'] });

				// Concrete nodes
				var NodeList = Node.extend('NodeList', {
					fields: ['children'],

					init: function init(lineno, colno, nodes) {
						this.parent(lineno, colno, nodes || []);
					},

					addChild: function addChild(node) {
						this.children.push(node);
					}
				});

				var Root = NodeList.extend('Root');
				var Literal = Value.extend('Literal');
				var _Symbol = Value.extend('Symbol');
				var Group = NodeList.extend('Group');
				var Array = NodeList.extend('Array');
				var Pair = Node.extend('Pair', { fields: ['key', 'value'] });
				var Dict = NodeList.extend('Dict');
				var LookupVal = Node.extend('LookupVal', { fields: ['target', 'val'] });
				var If = Node.extend('If', { fields: ['cond', 'body', 'else_'] });
				var IfAsync = If.extend('IfAsync');
				var InlineIf = Node.extend('InlineIf', { fields: ['cond', 'body', 'else_'] });
				var For = Node.extend('For', { fields: ['arr', 'name', 'body', 'else_'] });
				var AsyncEach = For.extend('AsyncEach');
				var AsyncAll = For.extend('AsyncAll');
				var Macro = Node.extend('Macro', { fields: ['name', 'args', 'body'] });
				var Caller = Macro.extend('Caller');
				var Import = Node.extend('Import', { fields: ['template', 'target', 'withContext'] });
				var FromImport = Node.extend('FromImport', {
					fields: ['template', 'names', 'withContext'],

					init: function init(lineno, colno, template, names, withContext) {
						this.parent(lineno, colno, template, names || new NodeList(), withContext);
					}
				});
				var FunCall = Node.extend('FunCall', { fields: ['name', 'args'] });
				var Filter = FunCall.extend('Filter');
				var FilterAsync = Filter.extend('FilterAsync', {
					fields: ['name', 'args', 'symbol']
				});
				var KeywordArgs = Dict.extend('KeywordArgs');
				var Block = Node.extend('Block', { fields: ['name', 'body'] });
				var Super = Node.extend('Super', { fields: ['blockName', 'symbol'] });
				var TemplateRef = Node.extend('TemplateRef', { fields: ['template'] });
				var Extends = TemplateRef.extend('Extends');
				var Include = Node.extend('Include', { fields: ['template', 'ignoreMissing'] });
				var Set = Node.extend('Set', { fields: ['targets', 'value'] });
				var Output = NodeList.extend('Output');
				var Capture = Node.extend('Capture', { fields: ['body'] });
				var TemplateData = Literal.extend('TemplateData');
				var UnaryOp = Node.extend('UnaryOp', { fields: ['target'] });
				var BinOp = Node.extend('BinOp', { fields: ['left', 'right'] });
				var In = BinOp.extend('In');
				var Or = BinOp.extend('Or');
				var And = BinOp.extend('And');
				var Not = UnaryOp.extend('Not');
				var Add = BinOp.extend('Add');
				var Concat = BinOp.extend('Concat');
				var Sub = BinOp.extend('Sub');
				var Mul = BinOp.extend('Mul');
				var Div = BinOp.extend('Div');
				var FloorDiv = BinOp.extend('FloorDiv');
				var Mod = BinOp.extend('Mod');
				var Pow = BinOp.extend('Pow');
				var Neg = UnaryOp.extend('Neg');
				var Pos = UnaryOp.extend('Pos');
				var Compare = Node.extend('Compare', { fields: ['expr', 'ops'] });
				var CompareOperand = Node.extend('CompareOperand', {
					fields: ['expr', 'type']
				});

				var CallExtension = Node.extend('CallExtension', {
					fields: ['extName', 'prop', 'args', 'contentArgs'],

					init: function init(ext, prop, args, contentArgs) {
						this.extName = ext._name || ext;
						this.prop = prop;
						this.args = args || new NodeList();
						this.contentArgs = contentArgs || [];
						this.autoescape = ext.autoescape;
					}
				});

				var CallExtensionAsync = CallExtension.extend('CallExtensionAsync');

				// Print the AST in a nicely formatted tree format for debuggin
				function printNodes(node, indent) {
					indent = indent || 0;

					// This is hacky, but this is just a debugging function anyway
					function print(str, indent, inline) {
						var lines = str.split('\n');

						for (var i = 0; i < lines.length; i++) {
							if (lines[i]) {
								if (inline && i > 0 || !inline) {
									for (var j = 0; j < indent; j++) {
										process.stdout.write(' ');
									}
								}
							}

							if (i === lines.length - 1) {
								process.stdout.write(lines[i]);
							} else {
								process.stdout.write(lines[i] + '\n');
							}
						}
					}

					print(node.typename + ': ', indent);

					if (node instanceof NodeList) {
						print('\n');
						lib.each(node.children, function (n) {
							printNodes(n, indent + 2);
						});
					} else if (node instanceof CallExtension) {
						print(node.extName + '.' + node.prop);
						print('\n');

						if (node.args) {
							printNodes(node.args, indent + 2);
						}

						if (node.contentArgs) {
							lib.each(node.contentArgs, function (n) {
								printNodes(n, indent + 2);
							});
						}
					} else {
						var nodes = null;
						var props = null;

						node.iterFields(function (val, field) {
							if (val instanceof Node) {
								nodes = nodes || {};
								nodes[field] = val;
							} else {
								props = props || {};
								props[field] = val;
							}
						});

						if (props) {
							print(JSON.stringify(props, null, 2) + '\n', null, true);
						} else {
							print('\n');
						}

						if (nodes) {
							for (var k in nodes) {
								printNodes(nodes[k], indent + 2);
							}
						}
					}
				}

				// var t = new NodeList(0, 0,
				//                      [new Value(0, 0, 3),
				//                       new Value(0, 0, 10),
				//                       new Pair(0, 0,
				//                                new Value(0, 0, 'key'),
				//                                new Value(0, 0, 'value'))]);
				// printNodes(t);

				module.exports = {
					Node: Node,
					Root: Root,
					NodeList: NodeList,
					Value: Value,
					Literal: Literal,
					Symbol: _Symbol,
					Group: Group,
					Array: Array,
					Pair: Pair,
					Dict: Dict,
					Output: Output,
					Capture: Capture,
					TemplateData: TemplateData,
					If: If,
					IfAsync: IfAsync,
					InlineIf: InlineIf,
					For: For,
					AsyncEach: AsyncEach,
					AsyncAll: AsyncAll,
					Macro: Macro,
					Caller: Caller,
					Import: Import,
					FromImport: FromImport,
					FunCall: FunCall,
					Filter: Filter,
					FilterAsync: FilterAsync,
					KeywordArgs: KeywordArgs,
					Block: Block,
					Super: Super,
					Extends: Extends,
					Include: Include,
					Set: Set,
					LookupVal: LookupVal,
					BinOp: BinOp,
					In: In,
					Or: Or,
					And: And,
					Not: Not,
					Add: Add,
					Concat: Concat,
					Sub: Sub,
					Mul: Mul,
					Div: Div,
					FloorDiv: FloorDiv,
					Mod: Mod,
					Pow: Pow,
					Neg: Neg,
					Pos: Pos,
					Compare: Compare,
					CompareOperand: CompareOperand,

					CallExtension: CallExtension,
					CallExtensionAsync: CallExtensionAsync,

					printNodes: printNodes
				};

				/* WEBPACK VAR INJECTION */
			}).call(exports, __webpack_require__(11));

			/***/
		},
		/* 11 */
		/***/function (module, exports) {

			/***/},
		/* 12 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var nodes = __webpack_require__(10);
			var lib = __webpack_require__(1);

			var sym = 0;
			function gensym() {
				return 'hole_' + sym++;
			}

			// copy-on-write version of map
			function mapCOW(arr, func) {
				var res = null;

				for (var i = 0; i < arr.length; i++) {
					var item = func(arr[i]);

					if (item !== arr[i]) {
						if (!res) {
							res = arr.slice();
						}

						res[i] = item;
					}
				}

				return res || arr;
			}

			function walk(ast, func, depthFirst) {
				if (!(ast instanceof nodes.Node)) {
					return ast;
				}

				if (!depthFirst) {
					var astT = func(ast);

					if (astT && astT !== ast) {
						return astT;
					}
				}

				if (ast instanceof nodes.NodeList) {
					var children = mapCOW(ast.children, function (node) {
						return walk(node, func, depthFirst);
					});

					if (children !== ast.children) {
						ast = new nodes[ast.typename](ast.lineno, ast.colno, children);
					}
				} else if (ast instanceof nodes.CallExtension) {
					var args = walk(ast.args, func, depthFirst);

					var contentArgs = mapCOW(ast.contentArgs, function (node) {
						return walk(node, func, depthFirst);
					});

					if (args !== ast.args || contentArgs !== ast.contentArgs) {
						ast = new nodes[ast.typename](ast.extName, ast.prop, args, contentArgs);
					}
				} else {
					var props = ast.fields.map(function (field) {
						return ast[field];
					});

					var propsT = mapCOW(props, function (prop) {
						return walk(prop, func, depthFirst);
					});

					if (propsT !== props) {
						ast = new nodes[ast.typename](ast.lineno, ast.colno);

						propsT.forEach(function (prop, i) {
							ast[ast.fields[i]] = prop;
						});
					}
				}

				return depthFirst ? func(ast) || ast : ast;
			}

			function depthWalk(ast, func) {
				return walk(ast, func, true);
			}

			function _liftFilters(node, asyncFilters, prop) {
				var children = [];

				var walked = depthWalk(prop ? node[prop] : node, function (node) {
					if (node instanceof nodes.Block) {
						return node;
					} else if (node instanceof nodes.Filter && lib.indexOf(asyncFilters, node.name.value) !== -1 || node instanceof nodes.CallExtensionAsync) {
						var symbol = new nodes.Symbol(node.lineno, node.colno, gensym());

						children.push(new nodes.FilterAsync(node.lineno, node.colno, node.name, node.args, symbol));
						return symbol;
					}
				});

				if (prop) {
					node[prop] = walked;
				} else {
					node = walked;
				}

				if (children.length) {
					children.push(node);

					return new nodes.NodeList(node.lineno, node.colno, children);
				} else {
					return node;
				}
			}

			function liftFilters(ast, asyncFilters) {
				return depthWalk(ast, function (node) {
					if (node instanceof nodes.Output) {
						return _liftFilters(node, asyncFilters);
					} else if (node instanceof nodes.Set) {
						return _liftFilters(node, asyncFilters, 'value');
					} else if (node instanceof nodes.For) {
						return _liftFilters(node, asyncFilters, 'arr');
					} else if (node instanceof nodes.If) {
						return _liftFilters(node, asyncFilters, 'cond');
					} else if (node instanceof nodes.CallExtension) {
						return _liftFilters(node, asyncFilters, 'args');
					}
				});
			}

			function liftSuper(ast) {
				return walk(ast, function (blockNode) {
					if (!(blockNode instanceof nodes.Block)) {
						return;
					}

					var hasSuper = false;
					var symbol = gensym();

					blockNode.body = walk(blockNode.body, function (node) {
						if (node instanceof nodes.FunCall && node.name.value === 'super') {
							hasSuper = true;
							return new nodes.Symbol(node.lineno, node.colno, symbol);
						}
					});

					if (hasSuper) {
						blockNode.body.children.unshift(new nodes.Super(0, 0, blockNode.name, new nodes.Symbol(0, 0, symbol)));
					}
				});
			}

			function convertStatements(ast) {
				return depthWalk(ast, function (node) {
					if (!(node instanceof nodes.If) && !(node instanceof nodes.For)) {
						return;
					}

					var async = false;
					walk(node, function (node) {
						if (node instanceof nodes.FilterAsync || node instanceof nodes.IfAsync || node instanceof nodes.AsyncEach || node instanceof nodes.AsyncAll || node instanceof nodes.CallExtensionAsync) {
							async = true;
							// Stop iterating by returning the node
							return node;
						}
					});

					if (async) {
						if (node instanceof nodes.If) {
							return new nodes.IfAsync(node.lineno, node.colno, node.cond, node.body, node.else_);
						} else if (node instanceof nodes.For) {
							return new nodes.AsyncEach(node.lineno, node.colno, node.arr, node.name, node.body, node.else_);
						}
					}
				});
			}

			function cps(ast, asyncFilters) {
				return convertStatements(liftSuper(liftFilters(ast, asyncFilters)));
			}

			function transform(ast, asyncFilters) {
				return cps(ast, asyncFilters || []);
			}

			// var parser = require('./parser');
			// var src = 'hello {% foo %}{% endfoo %} end';
			// var ast = transform(parser.parse(src, [new FooExtension()]), ['bar']);
			// nodes.printNodes(ast);

			module.exports = {
				transform: transform
			};

			/***/
		},
		/* 13 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var lib = __webpack_require__(1);
			var Obj = __webpack_require__(6);

			// Frames keep track of scoping both at compile-time and run-time so
			// we know how to access variables. Block tags can introduce special
			// variables, for example.
			var Frame = Obj.extend({
				init: function init(parent, isolateWrites) {
					this.variables = {};
					this.parent = parent;
					this.topLevel = false;
					// if this is true, writes (set) should never propagate upwards past
					// this frame to its parent (though reads may).
					this.isolateWrites = isolateWrites;
				},

				set: function set(name, val, resolveUp) {
					// Allow variables with dots by automatically creating the
					// nested structure
					var parts = name.split('.');
					var obj = this.variables;
					var frame = this;

					if (resolveUp) {
						if (frame = this.resolve(parts[0], true)) {
							frame.set(name, val);
							return;
						}
					}

					for (var i = 0; i < parts.length - 1; i++) {
						var id = parts[i];

						if (!obj[id]) {
							obj[id] = {};
						}
						obj = obj[id];
					}

					obj[parts[parts.length - 1]] = val;
				},

				get: function get(name) {
					var val = this.variables[name];
					if (val !== undefined) {
						return val;
					}
					return null;
				},

				lookup: function lookup(name) {
					var p = this.parent;
					var val = this.variables[name];
					if (val !== undefined) {
						return val;
					}
					return p && p.lookup(name);
				},

				resolve: function resolve(name, forWrite) {
					var p = forWrite && this.isolateWrites ? undefined : this.parent;
					var val = this.variables[name];
					if (val !== undefined) {
						return this;
					}
					return p && p.resolve(name);
				},

				push: function push(isolateWrites) {
					return new Frame(this, isolateWrites);
				},

				pop: function pop() {
					return this.parent;
				}
			});

			function makeMacro(argNames, kwargNames, func) {
				return function () {
					var argCount = numArgs(arguments);
					var args;
					var kwargs = getKeywordArgs(arguments);
					var i;

					if (argCount > argNames.length) {
						args = Array.prototype.slice.call(arguments, 0, argNames.length);

						// Positional arguments that should be passed in as
						// keyword arguments (essentially default values)
						var vals = Array.prototype.slice.call(arguments, args.length, argCount);
						for (i = 0; i < vals.length; i++) {
							if (i < kwargNames.length) {
								kwargs[kwargNames[i]] = vals[i];
							}
						}

						args.push(kwargs);
					} else if (argCount < argNames.length) {
						args = Array.prototype.slice.call(arguments, 0, argCount);

						for (i = argCount; i < argNames.length; i++) {
							var arg = argNames[i];

							// Keyword arguments that should be passed as
							// positional arguments, i.e. the caller explicitly
							// used the name of a positional arg
							args.push(kwargs[arg]);
							delete kwargs[arg];
						}

						args.push(kwargs);
					} else {
						args = arguments;
					}

					return func.apply(this, args);
				};
			}

			function makeKeywordArgs(obj) {
				obj.__keywords = true;
				return obj;
			}

			function getKeywordArgs(args) {
				var len = args.length;
				if (len) {
					var lastArg = args[len - 1];
					if (lastArg && lastArg.hasOwnProperty('__keywords')) {
						return lastArg;
					}
				}
				return {};
			}

			function numArgs(args) {
				var len = args.length;
				if (len === 0) {
					return 0;
				}

				var lastArg = args[len - 1];
				if (lastArg && lastArg.hasOwnProperty('__keywords')) {
					return len - 1;
				} else {
					return len;
				}
			}

			// A SafeString object indicates that the string should not be
			// autoescaped. This happens magically because autoescaping only
			// occurs on primitive string objects.
			function SafeString(val) {
				if (typeof val !== 'string') {
					return val;
				}

				this.val = val;
				this.length = val.length;
			}

			SafeString.prototype = Object.create(String.prototype, {
				length: { writable: true, configurable: true, value: 0 }
			});
			SafeString.prototype.valueOf = function () {
				return this.val;
			};
			SafeString.prototype.toString = function () {
				return this.val;
			};

			function copySafeness(dest, target) {
				if (dest instanceof SafeString) {
					return new SafeString(target);
				}
				return target.toString();
			}

			function markSafe(val) {
				var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);

				if (type === 'string') {
					return new SafeString(val);
				} else if (type !== 'function') {
					return val;
				} else {
					return function () {
						var ret = val.apply(this, arguments);

						if (typeof ret === 'string') {
							return new SafeString(ret);
						}

						return ret;
					};
				}
			}

			function suppressValue(val, autoescape) {
				val = val !== undefined && val !== null ? val : '';

				if (autoescape && !(val instanceof SafeString)) {
					val = lib.escape(val.toString());
				}

				return val;
			}

			function ensureDefined(val, lineno, colno) {
				if (val === null || val === undefined) {
					throw new lib.TemplateError('attempted to output null or undefined value', lineno + 1, colno + 1);
				}
				return val;
			}

			function memberLookup(obj, val) {
				obj = obj || {};

				if (typeof obj[val] === 'function') {
					return function () {
						return obj[val].apply(obj, arguments);
					};
				}

				return obj[val];
			}

			function callWrap(obj, name, context, args) {
				if (!obj) {
					throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
				} else if (typeof obj !== 'function') {
					throw new Error('Unable to call `' + name + '`, which is not a function');
				}

				// jshint validthis: true
				return obj.apply(context, args);
			}

			function contextOrFrameLookup(context, frame, name) {
				var val = frame.lookup(name);
				return val !== undefined ? val : context.lookup(name);
			}

			function handleError(error, lineno, colno) {
				if (error.lineno) {
					return error;
				} else {
					return new lib.TemplateError(error, lineno, colno);
				}
			}

			function asyncEach(arr, dimen, iter, cb) {
				if (lib.isArray(arr)) {
					var len = arr.length;

					lib.asyncIter(arr, function (item, i, next) {
						switch (dimen) {
							case 1:
								iter(item, i, len, next);break;
							case 2:
								iter(item[0], item[1], i, len, next);break;
							case 3:
								iter(item[0], item[1], item[2], i, len, next);break;
							default:
								item.push(i, next);
								iter.apply(this, item);
						}
					}, cb);
				} else {
					lib.asyncFor(arr, function (key, val, i, len, next) {
						iter(key, val, i, len, next);
					}, cb);
				}
			}

			function asyncAll(arr, dimen, func, cb) {
				var finished = 0;
				var len, i;
				var outputArr;

				function done(i, output) {
					finished++;
					outputArr[i] = output;

					if (finished === len) {
						cb(null, outputArr.join(''));
					}
				}

				if (lib.isArray(arr)) {
					len = arr.length;
					outputArr = new Array(len);

					if (len === 0) {
						cb(null, '');
					} else {
						for (i = 0; i < arr.length; i++) {
							var item = arr[i];

							switch (dimen) {
								case 1:
									func(item, i, len, done);break;
								case 2:
									func(item[0], item[1], i, len, done);break;
								case 3:
									func(item[0], item[1], item[2], i, len, done);break;
								default:
									item.push(i, done);
									// jshint validthis: true
									func.apply(this, item);
							}
						}
					}
				} else {
					var keys = lib.keys(arr);
					len = keys.length;
					outputArr = new Array(len);

					if (len === 0) {
						cb(null, '');
					} else {
						for (i = 0; i < keys.length; i++) {
							var k = keys[i];
							func(k, arr[k], i, len, done);
						}
					}
				}
			}

			module.exports = {
				Frame: Frame,
				makeMacro: makeMacro,
				makeKeywordArgs: makeKeywordArgs,
				numArgs: numArgs,
				suppressValue: suppressValue,
				ensureDefined: ensureDefined,
				memberLookup: memberLookup,
				contextOrFrameLookup: contextOrFrameLookup,
				callWrap: callWrap,
				handleError: handleError,
				isArray: lib.isArray,
				keys: lib.keys,
				SafeString: SafeString,
				copySafeness: copySafeness,
				markSafe: markSafe,
				asyncEach: asyncEach,
				asyncAll: asyncAll,
				inOperator: lib.inOperator
			};

			/***/
		},
		/* 14 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var lib = __webpack_require__(1);
			var r = __webpack_require__(13);

			function normalize(value, defaultValue) {
				if (value === null || value === undefined || value === false) {
					return defaultValue;
				}
				return value;
			}

			var filters = {
				abs: Math.abs,

				batch: function batch(arr, linecount, fill_with) {
					var i;
					var res = [];
					var tmp = [];

					for (i = 0; i < arr.length; i++) {
						if (i % linecount === 0 && tmp.length) {
							res.push(tmp);
							tmp = [];
						}

						tmp.push(arr[i]);
					}

					if (tmp.length) {
						if (fill_with) {
							for (i = tmp.length; i < linecount; i++) {
								tmp.push(fill_with);
							}
						}

						res.push(tmp);
					}

					return res;
				},

				capitalize: function capitalize(str) {
					str = normalize(str, '');
					var ret = str.toLowerCase();
					return r.copySafeness(str, ret.charAt(0).toUpperCase() + ret.slice(1));
				},

				center: function center(str, width) {
					str = normalize(str, '');
					width = width || 80;

					if (str.length >= width) {
						return str;
					}

					var spaces = width - str.length;
					var pre = lib.repeat(' ', spaces / 2 - spaces % 2);
					var post = lib.repeat(' ', spaces / 2);
					return r.copySafeness(str, pre + str + post);
				},

				'default': function _default(val, def, bool) {
					if (bool) {
						return val ? val : def;
					} else {
						return val !== undefined ? val : def;
					}
				},

				dictsort: function dictsort(val, case_sensitive, by) {
					if (!lib.isObject(val)) {
						throw new lib.TemplateError('dictsort filter: val must be an object');
					}

					var array = [];
					for (var k in val) {
						// deliberately include properties from the object's prototype
						array.push([k, val[k]]);
					}

					var si;
					if (by === undefined || by === 'key') {
						si = 0;
					} else if (by === 'value') {
						si = 1;
					} else {
						throw new lib.TemplateError('dictsort filter: You can only sort by either key or value');
					}

					array.sort(function (t1, t2) {
						var a = t1[si];
						var b = t2[si];

						if (!case_sensitive) {
							if (lib.isString(a)) {
								a = a.toUpperCase();
							}
							if (lib.isString(b)) {
								b = b.toUpperCase();
							}
						}

						return a > b ? 1 : a === b ? 0 : -1;
					});

					return array;
				},

				dump: function dump(obj, spaces) {
					return JSON.stringify(obj, null, spaces);
				},

				escape: function escape(str) {
					if (str instanceof r.SafeString) {
						return str;
					}
					str = str === null || str === undefined ? '' : str;
					return r.markSafe(lib.escape(str.toString()));
				},

				safe: function safe(str) {
					if (str instanceof r.SafeString) {
						return str;
					}
					str = str === null || str === undefined ? '' : str;
					return r.markSafe(str.toString());
				},

				first: function first(arr) {
					return arr[0];
				},

				groupby: function groupby(arr, attr) {
					return lib.groupBy(arr, attr);
				},

				indent: function indent(str, width, indentfirst) {
					str = normalize(str, '');

					if (str === '') return '';

					width = width || 4;
					var res = '';
					var lines = str.split('\n');
					var sp = lib.repeat(' ', width);

					for (var i = 0; i < lines.length; i++) {
						if (i === 0 && !indentfirst) {
							res += lines[i] + '\n';
						} else {
							res += sp + lines[i] + '\n';
						}
					}

					return r.copySafeness(str, res);
				},

				join: function join(arr, del, attr) {
					del = del || '';

					if (attr) {
						arr = lib.map(arr, function (v) {
							return v[attr];
						});
					}

					return arr.join(del);
				},

				last: function last(arr) {
					return arr[arr.length - 1];
				},

				length: function length(val) {
					var value = normalize(val, '');

					if (value !== undefined) {
						if (typeof Map === 'function' && value instanceof Map || typeof Set === 'function' && value instanceof Set) {
							// ECMAScript 2015 Maps and Sets
							return value.size;
						}
						if (lib.isObject(value) && !(value instanceof r.SafeString)) {
							// Objects (besides SafeStrings), non-primative Arrays
							return Object.keys(value).length;
						}
						return value.length;
					}
					return 0;
				},

				list: function list(val) {
					if (lib.isString(val)) {
						return val.split('');
					} else if (lib.isObject(val)) {
						var keys = [];

						if (Object.keys) {
							keys = Object.keys(val);
						} else {
							for (var k in val) {
								keys.push(k);
							}
						}

						return lib.map(keys, function (k) {
							return { key: k,
								value: val[k] };
						});
					} else if (lib.isArray(val)) {
						return val;
					} else {
						throw new lib.TemplateError('list filter: type not iterable');
					}
				},

				lower: function lower(str) {
					str = normalize(str, '');
					return str.toLowerCase();
				},

				nl2br: function nl2br(str) {
					if (str === null || str === undefined) {
						return '';
					}
					return r.copySafeness(str, str.replace(/\r\n|\n/g, '<br />\n'));
				},

				random: function random(arr) {
					return arr[Math.floor(Math.random() * arr.length)];
				},

				rejectattr: function rejectattr(arr, attr) {
					return arr.filter(function (item) {
						return !item[attr];
					});
				},

				selectattr: function selectattr(arr, attr) {
					return arr.filter(function (item) {
						return !!item[attr];
					});
				},

				replace: function replace(str, old, new_, maxCount) {
					var originalStr = str;

					if (old instanceof RegExp) {
						return str.replace(old, new_);
					}

					if (typeof maxCount === 'undefined') {
						maxCount = -1;
					}

					var res = ''; // Output

					// Cast Numbers in the search term to string
					if (typeof old === 'number') {
						old = old + '';
					} else if (typeof old !== 'string') {
						// If it is something other than number or string,
						// return the original string
						return str;
					}

					// Cast numbers in the replacement to string
					if (typeof str === 'number') {
						str = str + '';
					}

					// If by now, we don't have a string, throw it back
					if (typeof str !== 'string' && !(str instanceof r.SafeString)) {
						return str;
					}

					// ShortCircuits
					if (old === '') {
						// Mimic the python behaviour: empty string is replaced
						// by replacement e.g. "abc"|replace("", ".") -> .a.b.c.
						res = new_ + str.split('').join(new_) + new_;
						return r.copySafeness(str, res);
					}

					var nextIndex = str.indexOf(old);
					// if # of replacements to perform is 0, or the string to does
					// not contain the old value, return the string
					if (maxCount === 0 || nextIndex === -1) {
						return str;
					}

					var pos = 0;
					var count = 0; // # of replacements made

					while (nextIndex > -1 && (maxCount === -1 || count < maxCount)) {
						// Grab the next chunk of src string and add it with the
						// replacement, to the result
						res += str.substring(pos, nextIndex) + new_;
						// Increment our pointer in the src string
						pos = nextIndex + old.length;
						count++;
						// See if there are any more replacements to be made
						nextIndex = str.indexOf(old, pos);
					}

					// We've either reached the end, or done the max # of
					// replacements, tack on any remaining string
					if (pos < str.length) {
						res += str.substring(pos);
					}

					return r.copySafeness(originalStr, res);
				},

				reverse: function reverse(val) {
					var arr;
					if (lib.isString(val)) {
						arr = filters.list(val);
					} else {
						// Copy it
						arr = lib.map(val, function (v) {
							return v;
						});
					}

					arr.reverse();

					if (lib.isString(val)) {
						return r.copySafeness(val, arr.join(''));
					}
					return arr;
				},

				round: function round(val, precision, method) {
					precision = precision || 0;
					var factor = Math.pow(10, precision);
					var rounder;

					if (method === 'ceil') {
						rounder = Math.ceil;
					} else if (method === 'floor') {
						rounder = Math.floor;
					} else {
						rounder = Math.round;
					}

					return rounder(val * factor) / factor;
				},

				slice: function slice(arr, slices, fillWith) {
					var sliceLength = Math.floor(arr.length / slices);
					var extra = arr.length % slices;
					var offset = 0;
					var res = [];

					for (var i = 0; i < slices; i++) {
						var start = offset + i * sliceLength;
						if (i < extra) {
							offset++;
						}
						var end = offset + (i + 1) * sliceLength;

						var slice = arr.slice(start, end);
						if (fillWith && i >= extra) {
							slice.push(fillWith);
						}
						res.push(slice);
					}

					return res;
				},

				sum: function sum(arr, attr, start) {
					var sum = 0;

					if (typeof start === 'number') {
						sum += start;
					}

					if (attr) {
						arr = lib.map(arr, function (v) {
							return v[attr];
						});
					}

					for (var i = 0; i < arr.length; i++) {
						sum += arr[i];
					}

					return sum;
				},

				sort: r.makeMacro(['value', 'reverse', 'case_sensitive', 'attribute'], [], function (arr, reverse, caseSens, attr) {
					// Copy it
					arr = lib.map(arr, function (v) {
						return v;
					});

					arr.sort(function (a, b) {
						var x, y;

						if (attr) {
							x = a[attr];
							y = b[attr];
						} else {
							x = a;
							y = b;
						}

						if (!caseSens && lib.isString(x) && lib.isString(y)) {
							x = x.toLowerCase();
							y = y.toLowerCase();
						}

						if (x < y) {
							return reverse ? 1 : -1;
						} else if (x > y) {
							return reverse ? -1 : 1;
						} else {
							return 0;
						}
					});

					return arr;
				}),

				string: function string(obj) {
					return r.copySafeness(obj, obj);
				},

				striptags: function striptags(input, preserve_linebreaks) {
					input = normalize(input, '');
					preserve_linebreaks = preserve_linebreaks || false;
					var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
					var trimmedInput = filters.trim(input.replace(tags, ''));
					var res = '';
					if (preserve_linebreaks) {
						res = trimmedInput.replace(/^ +| +$/gm, '') // remove leading and trailing spaces
						.replace(/ +/g, ' ') // squash adjacent spaces
						.replace(/(\r\n)/g, '\n') // normalize linebreaks (CRLF -> LF)
						.replace(/\n\n\n+/g, '\n\n'); // squash abnormal adjacent linebreaks
					} else {
						res = trimmedInput.replace(/\s+/gi, ' ');
					}
					return r.copySafeness(input, res);
				},

				title: function title(str) {
					str = normalize(str, '');
					var words = str.split(' ');
					for (var i = 0; i < words.length; i++) {
						words[i] = filters.capitalize(words[i]);
					}
					return r.copySafeness(str, words.join(' '));
				},

				trim: function trim(str) {
					return r.copySafeness(str, str.replace(/^\s*|\s*$/g, ''));
				},

				truncate: function truncate(input, length, killwords, end) {
					var orig = input;
					input = normalize(input, '');
					length = length || 255;

					if (input.length <= length) return input;

					if (killwords) {
						input = input.substring(0, length);
					} else {
						var idx = input.lastIndexOf(' ', length);
						if (idx === -1) {
							idx = length;
						}

						input = input.substring(0, idx);
					}

					input += end !== undefined && end !== null ? end : '...';
					return r.copySafeness(orig, input);
				},

				upper: function upper(str) {
					str = normalize(str, '');
					return str.toUpperCase();
				},

				urlencode: function urlencode(obj) {
					var enc = encodeURIComponent;
					if (lib.isString(obj)) {
						return enc(obj);
					} else {
						var parts;
						if (lib.isArray(obj)) {
							parts = obj.map(function (item) {
								return enc(item[0]) + '=' + enc(item[1]);
							});
						} else {
							parts = [];
							for (var k in obj) {
								if (obj.hasOwnProperty(k)) {
									parts.push(enc(k) + '=' + enc(obj[k]));
								}
							}
						}
						return parts.join('&');
					}
				},

				urlize: function urlize(str, length, nofollow) {
					if (isNaN(length)) length = Infinity;

					var noFollowAttr = nofollow === true ? ' rel="nofollow"' : '';

					// For the jinja regexp, see
					// https://github.com/mitsuhiko/jinja2/blob/f15b814dcba6aa12bc74d1f7d0c881d55f7126be/jinja2/utils.py#L20-L23
					var puncRE = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/;
					// from http://blog.gerv.net/2011/05/html5_email_address_regexp/
					var emailRE = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
					var httpHttpsRE = /^https?:\/\/.*$/;
					var wwwRE = /^www\./;
					var tldRE = /\.(?:org|net|com)(?:\:|\/|$)/;

					var words = str.split(/(\s+)/).filter(function (word) {
						// If the word has no length, bail. This can happen for str with
						// trailing whitespace.
						return word && word.length;
					}).map(function (word) {
						var matches = word.match(puncRE);
						var possibleUrl = matches && matches[1] || word;

						// url that starts with http or https
						if (httpHttpsRE.test(possibleUrl)) return '<a href="' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

						// url that starts with www.
						if (wwwRE.test(possibleUrl)) return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

						// an email address of the form username@domain.tld
						if (emailRE.test(possibleUrl)) return '<a href="mailto:' + possibleUrl + '">' + possibleUrl + '</a>';

						// url that ends in .com, .org or .net that is not an email address
						if (tldRE.test(possibleUrl)) return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

						return word;
					});

					return words.join('');
				},

				wordcount: function wordcount(str) {
					str = normalize(str, '');
					var words = str ? str.match(/\w+/g) : null;
					return words ? words.length : null;
				},

				'float': function float(val, def) {
					var res = parseFloat(val);
					return isNaN(res) ? def : res;
				},

				'int': function int(val, def) {
					var res = parseInt(val, 10);
					return isNaN(res) ? def : res;
				}
			};

			// Aliases
			filters.d = filters['default'];
			filters.e = filters.escape;

			module.exports = filters;

			/***/
		},
		/* 15 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var Loader = __webpack_require__(16);
			var PrecompiledLoader = __webpack_require__(17);

			var WebLoader = Loader.extend({
				init: function init(baseURL, opts) {
					this.baseURL = baseURL || '.';
					opts = opts || {};

					// By default, the cache is turned off because there's no way
					// to "watch" templates over HTTP, so they are re-downloaded
					// and compiled each time. (Remember, PRECOMPILE YOUR
					// TEMPLATES in production!)
					this.useCache = !!opts.useCache;

					// We default `async` to false so that the simple synchronous
					// API can be used when you aren't doing anything async in
					// your templates (which is most of the time). This performs a
					// sync ajax request, but that's ok because it should *only*
					// happen in development. PRECOMPILE YOUR TEMPLATES.
					this.async = !!opts.async;
				},

				resolve: function resolve(from, to) {
					// jshint ignore:line
					throw new Error('relative templates not support in the browser yet');
				},

				getSource: function getSource(name, cb) {
					var useCache = this.useCache;
					var result;
					this.fetch(this.baseURL + '/' + name, function (err, src) {
						if (err) {
							if (cb) {
								cb(err.content);
							} else {
								if (err.status === 404) {
									result = null;
								} else {
									throw err.content;
								}
							}
						} else {
							result = { src: src,
								path: name,
								noCache: !useCache };
							if (cb) {
								cb(null, result);
							}
						}
					});

					// if this WebLoader isn't running asynchronously, the
					// fetch above would actually run sync and we'll have a
					// result here
					return result;
				},

				fetch: function fetch(url, cb) {
					// Only in the browser please
					var ajax;
					var loading = true;

					if (window.XMLHttpRequest) {
						// Mozilla, Safari, ...
						ajax = new XMLHttpRequest();
					} else if (window.ActiveXObject) {
						// IE 8 and older
						/* global ActiveXObject */
						ajax = new ActiveXObject('Microsoft.XMLHTTP');
					}

					ajax.onreadystatechange = function () {
						if (ajax.readyState === 4 && loading) {
							loading = false;
							if (ajax.status === 0 || ajax.status === 200) {
								cb(null, ajax.responseText);
							} else {
								cb({ status: ajax.status, content: ajax.responseText });
							}
						}
					};

					url += (url.indexOf('?') === -1 ? '?' : '&') + 's=' + new Date().getTime();

					ajax.open('GET', url, this.async);
					ajax.send();
				}
			});

			module.exports = {
				WebLoader: WebLoader,
				PrecompiledLoader: PrecompiledLoader
			};

			/***/
		},
		/* 16 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var path = __webpack_require__(3);
			var Obj = __webpack_require__(6);
			var lib = __webpack_require__(1);

			var Loader = Obj.extend({
				on: function on(name, func) {
					this.listeners = this.listeners || {};
					this.listeners[name] = this.listeners[name] || [];
					this.listeners[name].push(func);
				},

				emit: function emit(name /*, arg1, arg2, ...*/) {
					var args = Array.prototype.slice.call(arguments, 1);

					if (this.listeners && this.listeners[name]) {
						lib.each(this.listeners[name], function (listener) {
							listener.apply(null, args);
						});
					}
				},

				resolve: function resolve(from, to) {
					return path.resolve(path.dirname(from), to);
				},

				isRelative: function isRelative(filename) {
					return filename.indexOf('./') === 0 || filename.indexOf('../') === 0;
				}
			});

			module.exports = Loader;

			/***/
		},
		/* 17 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var Loader = __webpack_require__(16);

			var PrecompiledLoader = Loader.extend({
				init: function init(compiledTemplates) {
					this.precompiled = compiledTemplates || {};
				},

				getSource: function getSource(name) {
					if (this.precompiled[name]) {
						return {
							src: { type: 'code',
								obj: this.precompiled[name] },
							path: name
						};
					}
					return null;
				}
			});

			module.exports = PrecompiledLoader;

			/***/
		},
		/* 18 */
		/***/function (module, exports) {

			'use strict';

			function _cycler(items) {
				var index = -1;

				return {
					current: null,
					reset: function reset() {
						index = -1;
						this.current = null;
					},

					next: function next() {
						index++;
						if (index >= items.length) {
							index = 0;
						}

						this.current = items[index];
						return this.current;
					}
				};
			}

			function _joiner(sep) {
				sep = sep || ',';
				var first = true;

				return function () {
					var val = first ? '' : sep;
					first = false;
					return val;
				};
			}

			// Making this a function instead so it returns a new object
			// each time it's called. That way, if something like an environment
			// uses it, they will each have their own copy.
			function globals() {
				return {
					range: function range(start, stop, step) {
						if (typeof stop === 'undefined') {
							stop = start;
							start = 0;
							step = 1;
						} else if (!step) {
							step = 1;
						}

						var arr = [];
						var i;
						if (step > 0) {
							for (i = start; i < stop; i += step) {
								arr.push(i);
							}
						} else {
							for (i = start; i > stop; i += step) {
								arr.push(i);
							}
						}
						return arr;
					},

					// lipsum: function(n, html, min, max) {
					// },

					cycler: function cycler() {
						return _cycler(Array.prototype.slice.call(arguments));
					},

					joiner: function joiner(sep) {
						return _joiner(sep);
					}
				};
			}

			module.exports = globals;

			/***/
		},
		/* 19 */
		/***/function (module, exports, __webpack_require__) {

			var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; /* WEBPACK VAR INJECTION */(function (setImmediate, process) {
				// MIT license (by Elan Shanker).
				(function (globals) {
					'use strict';

					var executeSync = function executeSync() {
						var args = Array.prototype.slice.call(arguments);
						if (typeof args[0] === 'function') {
							args[0].apply(null, args.splice(1));
						}
					};

					var executeAsync = function executeAsync(fn) {
						if (typeof setImmediate === 'function') {
							setImmediate(fn);
						} else if (typeof process !== 'undefined' && process.nextTick) {
							process.nextTick(fn);
						} else {
							setTimeout(fn, 0);
						}
					};

					var makeIterator = function makeIterator(tasks) {
						var makeCallback = function makeCallback(index) {
							var fn = function fn() {
								if (tasks.length) {
									tasks[index].apply(null, arguments);
								}
								return fn.next();
							};
							fn.next = function () {
								return index < tasks.length - 1 ? makeCallback(index + 1) : null;
							};
							return fn;
						};
						return makeCallback(0);
					};

					var _isArray = Array.isArray || function (maybeArray) {
						return Object.prototype.toString.call(maybeArray) === '[object Array]';
					};

					var waterfall = function waterfall(tasks, callback, forceAsync) {
						var nextTick = forceAsync ? executeAsync : executeSync;
						callback = callback || function () {};
						if (!_isArray(tasks)) {
							var err = new Error('First argument to waterfall must be an array of functions');
							return callback(err);
						}
						if (!tasks.length) {
							return callback();
						}
						var wrapIterator = function wrapIterator(iterator) {
							return function (err) {
								if (err) {
									callback.apply(null, arguments);
									callback = function callback() {};
								} else {
									var args = Array.prototype.slice.call(arguments, 1);
									var next = iterator.next();
									if (next) {
										args.push(wrapIterator(next));
									} else {
										args.push(callback);
									}
									nextTick(function () {
										iterator.apply(null, args);
									});
								}
							};
						};
						wrapIterator(makeIterator(tasks))();
					};

					if (true) {
						!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
							return waterfall;
						}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // RequireJS
					} else if (typeof module !== 'undefined' && module.exports) {
						module.exports = waterfall; // CommonJS
					} else {
						globals.waterfall = waterfall; // <script>
					}
				})(this);

				/* WEBPACK VAR INJECTION */
			}).call(exports, __webpack_require__(20).setImmediate, __webpack_require__(11));

			/***/
		},
		/* 20 */
		/***/function (module, exports, __webpack_require__) {

			var apply = Function.prototype.apply;

			// DOM APIs, for completeness

			exports.setTimeout = function () {
				return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
			};
			exports.setInterval = function () {
				return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
			};
			exports.clearTimeout = exports.clearInterval = function (timeout) {
				if (timeout) {
					timeout.close();
				}
			};

			function Timeout(id, clearFn) {
				this._id = id;
				this._clearFn = clearFn;
			}
			Timeout.prototype.unref = Timeout.prototype.ref = function () {};
			Timeout.prototype.close = function () {
				this._clearFn.call(window, this._id);
			};

			// Does not start the time, just sets up the members needed.
			exports.enroll = function (item, msecs) {
				clearTimeout(item._idleTimeoutId);
				item._idleTimeout = msecs;
			};

			exports.unenroll = function (item) {
				clearTimeout(item._idleTimeoutId);
				item._idleTimeout = -1;
			};

			exports._unrefActive = exports.active = function (item) {
				clearTimeout(item._idleTimeoutId);

				var msecs = item._idleTimeout;
				if (msecs >= 0) {
					item._idleTimeoutId = setTimeout(function onTimeout() {
						if (item._onTimeout) item._onTimeout();
					}, msecs);
				}
			};

			// setimmediate attaches itself to the global object
			__webpack_require__(21);
			exports.setImmediate = setImmediate;
			exports.clearImmediate = clearImmediate;

			/***/
		},
		/* 21 */
		/***/function (module, exports, __webpack_require__) {

			/* WEBPACK VAR INJECTION */(function (global, process) {
				(function (global, undefined) {
					"use strict";

					if (global.setImmediate) {
						return;
					}

					var nextHandle = 1; // Spec says greater than zero
					var tasksByHandle = {};
					var currentlyRunningATask = false;
					var doc = global.document;
					var registerImmediate;

					function setImmediate(callback) {
						// Callback can either be a function or a string
						if (typeof callback !== "function") {
							callback = new Function("" + callback);
						}
						// Copy function arguments
						var args = new Array(arguments.length - 1);
						for (var i = 0; i < args.length; i++) {
							args[i] = arguments[i + 1];
						}
						// Store and register the task
						var task = { callback: callback, args: args };
						tasksByHandle[nextHandle] = task;
						registerImmediate(nextHandle);
						return nextHandle++;
					}

					function clearImmediate(handle) {
						delete tasksByHandle[handle];
					}

					function run(task) {
						var callback = task.callback;
						var args = task.args;
						switch (args.length) {
							case 0:
								callback();
								break;
							case 1:
								callback(args[0]);
								break;
							case 2:
								callback(args[0], args[1]);
								break;
							case 3:
								callback(args[0], args[1], args[2]);
								break;
							default:
								callback.apply(undefined, args);
								break;
						}
					}

					function runIfPresent(handle) {
						// From the spec: "Wait until any invocations of this algorithm started before this one have completed."
						// So if we're currently running a task, we'll need to delay this invocation.
						if (currentlyRunningATask) {
							// Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
							// "too much recursion" error.
							setTimeout(runIfPresent, 0, handle);
						} else {
							var task = tasksByHandle[handle];
							if (task) {
								currentlyRunningATask = true;
								try {
									run(task);
								} finally {
									clearImmediate(handle);
									currentlyRunningATask = false;
								}
							}
						}
					}

					function installNextTickImplementation() {
						registerImmediate = function registerImmediate(handle) {
							process.nextTick(function () {
								runIfPresent(handle);
							});
						};
					}

					function canUsePostMessage() {
						// The test against `importScripts` prevents this implementation from being installed inside a web worker,
						// where `global.postMessage` means something completely different and can't be used for this purpose.
						if (global.postMessage && !global.importScripts) {
							var postMessageIsAsynchronous = true;
							var oldOnMessage = global.onmessage;
							global.onmessage = function () {
								postMessageIsAsynchronous = false;
							};
							global.postMessage("", "*");
							global.onmessage = oldOnMessage;
							return postMessageIsAsynchronous;
						}
					}

					function installPostMessageImplementation() {
						// Installs an event handler on `global` for the `message` event: see
						// * https://developer.mozilla.org/en/DOM/window.postMessage
						// * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

						var messagePrefix = "setImmediate$" + Math.random() + "$";
						var onGlobalMessage = function onGlobalMessage(event) {
							if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
								runIfPresent(+event.data.slice(messagePrefix.length));
							}
						};

						if (global.addEventListener) {
							global.addEventListener("message", onGlobalMessage, false);
						} else {
							global.attachEvent("onmessage", onGlobalMessage);
						}

						registerImmediate = function registerImmediate(handle) {
							global.postMessage(messagePrefix + handle, "*");
						};
					}

					function installMessageChannelImplementation() {
						var channel = new MessageChannel();
						channel.port1.onmessage = function (event) {
							var handle = event.data;
							runIfPresent(handle);
						};

						registerImmediate = function registerImmediate(handle) {
							channel.port2.postMessage(handle);
						};
					}

					function installReadyStateChangeImplementation() {
						var html = doc.documentElement;
						registerImmediate = function registerImmediate(handle) {
							// Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
							// into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
							var script = doc.createElement("script");
							script.onreadystatechange = function () {
								runIfPresent(handle);
								script.onreadystatechange = null;
								html.removeChild(script);
								script = null;
							};
							html.appendChild(script);
						};
					}

					function installSetTimeoutImplementation() {
						registerImmediate = function registerImmediate(handle) {
							setTimeout(runIfPresent, 0, handle);
						};
					}

					// If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
					var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
					attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

					// Don't get fooled by e.g. browserify environments.
					if ({}.toString.call(global.process) === "[object process]") {
						// For Node.js before 0.9
						installNextTickImplementation();
					} else if (canUsePostMessage()) {
						// For non-IE10 modern browsers
						installPostMessageImplementation();
					} else if (global.MessageChannel) {
						// For web workers, where supported
						installMessageChannelImplementation();
					} else if (doc && "onreadystatechange" in doc.createElement("script")) {
						// For IE 6–8
						installReadyStateChangeImplementation();
					} else {
						// For older browsers
						installSetTimeoutImplementation();
					}

					attachTo.setImmediate = setImmediate;
					attachTo.clearImmediate = clearImmediate;
				})(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);

				/* WEBPACK VAR INJECTION */
			}).call(exports, function () {
				return this;
			}(), __webpack_require__(11));

			/***/
		},
		/* 22 */
		/***/function (module, exports) {

			function installCompat() {
				'use strict';

				// This must be called like `nunjucks.installCompat` so that `this`
				// references the nunjucks instance

				var runtime = this.runtime; // jshint ignore:line
				var lib = this.lib; // jshint ignore:line
				var Compiler = this.compiler.Compiler; // jshint ignore:line
				var Parser = this.parser.Parser; // jshint ignore:line
				var nodes = this.nodes; // jshint ignore:line
				var lexer = this.lexer; // jshint ignore:line

				var orig_contextOrFrameLookup = runtime.contextOrFrameLookup;
				var orig_Compiler_assertType = Compiler.prototype.assertType;
				var orig_Parser_parseAggregate = Parser.prototype.parseAggregate;
				var orig_memberLookup = runtime.memberLookup;

				function uninstall() {
					runtime.contextOrFrameLookup = orig_contextOrFrameLookup;
					Compiler.prototype.assertType = orig_Compiler_assertType;
					Parser.prototype.parseAggregate = orig_Parser_parseAggregate;
					runtime.memberLookup = orig_memberLookup;
				}

				runtime.contextOrFrameLookup = function (context, frame, key) {
					var val = orig_contextOrFrameLookup.apply(this, arguments);
					if (val === undefined) {
						switch (key) {
							case 'True':
								return true;
							case 'False':
								return false;
							case 'None':
								return null;
						}
					}

					return val;
				};

				var Slice = nodes.Node.extend('Slice', {
					fields: ['start', 'stop', 'step'],
					init: function init(lineno, colno, start, stop, step) {
						start = start || new nodes.Literal(lineno, colno, null);
						stop = stop || new nodes.Literal(lineno, colno, null);
						step = step || new nodes.Literal(lineno, colno, 1);
						this.parent(lineno, colno, start, stop, step);
					}
				});

				Compiler.prototype.assertType = function (node) {
					if (node instanceof Slice) {
						return;
					}
					return orig_Compiler_assertType.apply(this, arguments);
				};
				Compiler.prototype.compileSlice = function (node, frame) {
					this.emit('(');
					this._compileExpression(node.start, frame);
					this.emit('),(');
					this._compileExpression(node.stop, frame);
					this.emit('),(');
					this._compileExpression(node.step, frame);
					this.emit(')');
				};

				function getTokensState(tokens) {
					return {
						index: tokens.index,
						lineno: tokens.lineno,
						colno: tokens.colno
					};
				}

				Parser.prototype.parseAggregate = function () {
					var self = this;
					var origState = getTokensState(this.tokens);
					// Set back one accounting for opening bracket/parens
					origState.colno--;
					origState.index--;
					try {
						return orig_Parser_parseAggregate.apply(this);
					} catch (e) {
						var errState = getTokensState(this.tokens);
						var rethrow = function rethrow() {
							lib.extend(self.tokens, errState);
							return e;
						};

						// Reset to state before original parseAggregate called
						lib.extend(this.tokens, origState);
						this.peeked = false;

						var tok = this.peekToken();
						if (tok.type !== lexer.TOKEN_LEFT_BRACKET) {
							throw rethrow();
						} else {
							this.nextToken();
						}

						var node = new Slice(tok.lineno, tok.colno);

						// If we don't encounter a colon while parsing, this is not a slice,
						// so re-raise the original exception.
						var isSlice = false;

						for (var i = 0; i <= node.fields.length; i++) {
							if (this.skip(lexer.TOKEN_RIGHT_BRACKET)) {
								break;
							}
							if (i === node.fields.length) {
								if (isSlice) {
									this.fail('parseSlice: too many slice components', tok.lineno, tok.colno);
								} else {
									break;
								}
							}
							if (this.skip(lexer.TOKEN_COLON)) {
								isSlice = true;
							} else {
								var field = node.fields[i];
								node[field] = this.parseExpression();
								isSlice = this.skip(lexer.TOKEN_COLON) || isSlice;
							}
						}
						if (!isSlice) {
							throw rethrow();
						}
						return new nodes.Array(tok.lineno, tok.colno, [node]);
					}
				};

				function sliceLookup(obj, start, stop, step) {
					obj = obj || [];
					if (start === null) {
						start = step < 0 ? obj.length - 1 : 0;
					}
					if (stop === null) {
						stop = step < 0 ? -1 : obj.length;
					} else {
						if (stop < 0) {
							stop += obj.length;
						}
					}

					if (start < 0) {
						start += obj.length;
					}

					var results = [];

					for (var i = start;; i += step) {
						if (i < 0 || i > obj.length) {
							break;
						}
						if (step > 0 && i >= stop) {
							break;
						}
						if (step < 0 && i <= stop) {
							break;
						}
						results.push(runtime.memberLookup(obj, i));
					}
					return results;
				}

				var ARRAY_MEMBERS = {
					pop: function pop(index) {
						if (index === undefined) {
							return this.pop();
						}
						if (index >= this.length || index < 0) {
							throw new Error('KeyError');
						}
						return this.splice(index, 1);
					},
					append: function append(element) {
						return this.push(element);
					},
					remove: function remove(element) {
						for (var i = 0; i < this.length; i++) {
							if (this[i] === element) {
								return this.splice(i, 1);
							}
						}
						throw new Error('ValueError');
					},
					count: function count(element) {
						var count = 0;
						for (var i = 0; i < this.length; i++) {
							if (this[i] === element) {
								count++;
							}
						}
						return count;
					},
					index: function index(element) {
						var i;
						if ((i = this.indexOf(element)) === -1) {
							throw new Error('ValueError');
						}
						return i;
					},
					find: function find(element) {
						return this.indexOf(element);
					},
					insert: function insert(index, elem) {
						return this.splice(index, 0, elem);
					}
				};
				var OBJECT_MEMBERS = {
					items: function items() {
						var ret = [];
						for (var k in this) {
							ret.push([k, this[k]]);
						}
						return ret;
					},
					values: function values() {
						var ret = [];
						for (var k in this) {
							ret.push(this[k]);
						}
						return ret;
					},
					keys: function keys() {
						var ret = [];
						for (var k in this) {
							ret.push(k);
						}
						return ret;
					},
					get: function get(key, def) {
						var output = this[key];
						if (output === undefined) {
							output = def;
						}
						return output;
					},
					has_key: function has_key(key) {
						return this.hasOwnProperty(key);
					},
					pop: function pop(key, def) {
						var output = this[key];
						if (output === undefined && def !== undefined) {
							output = def;
						} else if (output === undefined) {
							throw new Error('KeyError');
						} else {
							delete this[key];
						}
						return output;
					},
					popitem: function popitem() {
						for (var k in this) {
							// Return the first object pair.
							var val = this[k];
							delete this[k];
							return [k, val];
						}
						throw new Error('KeyError');
					},
					setdefault: function setdefault(key, def) {
						if (key in this) {
							return this[key];
						}
						if (def === undefined) {
							def = null;
						}
						return this[key] = def;
					},
					update: function update(kwargs) {
						for (var k in kwargs) {
							this[k] = kwargs[k];
						}
						return null; // Always returns None
					}
				};
				OBJECT_MEMBERS.iteritems = OBJECT_MEMBERS.items;
				OBJECT_MEMBERS.itervalues = OBJECT_MEMBERS.values;
				OBJECT_MEMBERS.iterkeys = OBJECT_MEMBERS.keys;
				runtime.memberLookup = function (obj, val, autoescape) {
					// jshint ignore:line
					if (arguments.length === 4) {
						return sliceLookup.apply(this, arguments);
					}
					obj = obj || {};

					// If the object is an object, return any of the methods that Python would
					// otherwise provide.
					if (lib.isArray(obj) && ARRAY_MEMBERS.hasOwnProperty(val)) {
						return function () {
							return ARRAY_MEMBERS[val].apply(obj, arguments);
						};
					}

					if (lib.isObject(obj) && OBJECT_MEMBERS.hasOwnProperty(val)) {
						return function () {
							return OBJECT_MEMBERS[val].apply(obj, arguments);
						};
					}

					return orig_memberLookup.apply(this, arguments);
				};

				return uninstall;
			}

			module.exports = installCompat;

			/***/
		}]
		/******/)
	);
});
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).setImmediate, __webpack_require__(6).clearImmediate, __webpack_require__(27)(module)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(24);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(8);

var _SiteHeader = __webpack_require__(11);

var _SiteHeader2 = _interopRequireDefault(_SiteHeader);

var _SiteFooter = __webpack_require__(28);

var _SiteFooter2 = _interopRequireDefault(_SiteFooter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var siteheader = new _SiteHeader2.default([{ address: '',
  name: 'Home' }, { address: 'product',
  name: 'Product' }, { address: 'about',
  name: 'About' }, { address: 'contact',
  name: 'Contact' }]);
siteheader.render();

var sitefooter = new _SiteFooter2.default();
sitefooter.render();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./normalize.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./normalize.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}\r\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(2);

__webpack_require__(3);

__webpack_require__(4);

__webpack_require__(21);

__webpack_require__(23);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nunjucks = __webpack_require__(5);

nunjucks.configure('./', { autoescape: true });

var SiteHeader = function () {
    function SiteHeader(sections) {
        _classCallCheck(this, SiteHeader);

        this.sections = sections;
    }

    _createClass(SiteHeader, [{
        key: 'render',
        value: function render() {
            var headerAnchor = document.getElementById('site-header');
            headerAnchor.innerHTML = nunjucks.render('./SiteHeader.html', { sections: this.sections });
        }
    }]);

    return SiteHeader;
}();

exports.default = SiteHeader;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url(" + __webpack_require__(13) + ");\n  src: url(" + __webpack_require__(14) + "?#iefix&v=4.7.0) format('embedded-opentype'), url(" + __webpack_require__(15) + ") format('woff2'), url(" + __webpack_require__(16) + ") format('woff'), url(" + __webpack_require__(17) + ") format('truetype'), url(" + __webpack_require__(18) + "#fontawesomeregular) format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333333em;\n  line-height: 0.75em;\n  vertical-align: -15%;\n}\n.fa-2x {\n  font-size: 2em;\n}\n.fa-3x {\n  font-size: 3em;\n}\n.fa-4x {\n  font-size: 4em;\n}\n.fa-5x {\n  font-size: 5em;\n}\n.fa-fw {\n  width: 1.28571429em;\n  text-align: center;\n}\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14285714em;\n  list-style-type: none;\n}\n.fa-ul > li {\n  position: relative;\n}\n.fa-li {\n  position: absolute;\n  left: -2.14285714em;\n  width: 2.14285714em;\n  top: 0.14285714em;\n  text-align: center;\n}\n.fa-li.fa-lg {\n  left: -1.85714286em;\n}\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eeeeee;\n  border-radius: .1em;\n}\n.fa-pull-left {\n  float: left;\n}\n.fa-pull-right {\n  float: right;\n}\n.fa.fa-pull-left {\n  margin-right: .3em;\n}\n.fa.fa-pull-right {\n  margin-left: .3em;\n}\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right;\n}\n.pull-left {\n  float: left;\n}\n.fa.pull-left {\n  margin-right: .3em;\n}\n.fa.pull-right {\n  margin-left: .3em;\n}\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear;\n}\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8);\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1);\n}\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1);\n}\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  filter: none;\n}\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle;\n}\n.fa-stack-1x,\n.fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center;\n}\n.fa-stack-1x {\n  line-height: inherit;\n}\n.fa-stack-2x {\n  font-size: 2em;\n}\n.fa-inverse {\n  color: #ffffff;\n}\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\F000\";\n}\n.fa-music:before {\n  content: \"\\F001\";\n}\n.fa-search:before {\n  content: \"\\F002\";\n}\n.fa-envelope-o:before {\n  content: \"\\F003\";\n}\n.fa-heart:before {\n  content: \"\\F004\";\n}\n.fa-star:before {\n  content: \"\\F005\";\n}\n.fa-star-o:before {\n  content: \"\\F006\";\n}\n.fa-user:before {\n  content: \"\\F007\";\n}\n.fa-film:before {\n  content: \"\\F008\";\n}\n.fa-th-large:before {\n  content: \"\\F009\";\n}\n.fa-th:before {\n  content: \"\\F00A\";\n}\n.fa-th-list:before {\n  content: \"\\F00B\";\n}\n.fa-check:before {\n  content: \"\\F00C\";\n}\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\F00D\";\n}\n.fa-search-plus:before {\n  content: \"\\F00E\";\n}\n.fa-search-minus:before {\n  content: \"\\F010\";\n}\n.fa-power-off:before {\n  content: \"\\F011\";\n}\n.fa-signal:before {\n  content: \"\\F012\";\n}\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\F013\";\n}\n.fa-trash-o:before {\n  content: \"\\F014\";\n}\n.fa-home:before {\n  content: \"\\F015\";\n}\n.fa-file-o:before {\n  content: \"\\F016\";\n}\n.fa-clock-o:before {\n  content: \"\\F017\";\n}\n.fa-road:before {\n  content: \"\\F018\";\n}\n.fa-download:before {\n  content: \"\\F019\";\n}\n.fa-arrow-circle-o-down:before {\n  content: \"\\F01A\";\n}\n.fa-arrow-circle-o-up:before {\n  content: \"\\F01B\";\n}\n.fa-inbox:before {\n  content: \"\\F01C\";\n}\n.fa-play-circle-o:before {\n  content: \"\\F01D\";\n}\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\F01E\";\n}\n.fa-refresh:before {\n  content: \"\\F021\";\n}\n.fa-list-alt:before {\n  content: \"\\F022\";\n}\n.fa-lock:before {\n  content: \"\\F023\";\n}\n.fa-flag:before {\n  content: \"\\F024\";\n}\n.fa-headphones:before {\n  content: \"\\F025\";\n}\n.fa-volume-off:before {\n  content: \"\\F026\";\n}\n.fa-volume-down:before {\n  content: \"\\F027\";\n}\n.fa-volume-up:before {\n  content: \"\\F028\";\n}\n.fa-qrcode:before {\n  content: \"\\F029\";\n}\n.fa-barcode:before {\n  content: \"\\F02A\";\n}\n.fa-tag:before {\n  content: \"\\F02B\";\n}\n.fa-tags:before {\n  content: \"\\F02C\";\n}\n.fa-book:before {\n  content: \"\\F02D\";\n}\n.fa-bookmark:before {\n  content: \"\\F02E\";\n}\n.fa-print:before {\n  content: \"\\F02F\";\n}\n.fa-camera:before {\n  content: \"\\F030\";\n}\n.fa-font:before {\n  content: \"\\F031\";\n}\n.fa-bold:before {\n  content: \"\\F032\";\n}\n.fa-italic:before {\n  content: \"\\F033\";\n}\n.fa-text-height:before {\n  content: \"\\F034\";\n}\n.fa-text-width:before {\n  content: \"\\F035\";\n}\n.fa-align-left:before {\n  content: \"\\F036\";\n}\n.fa-align-center:before {\n  content: \"\\F037\";\n}\n.fa-align-right:before {\n  content: \"\\F038\";\n}\n.fa-align-justify:before {\n  content: \"\\F039\";\n}\n.fa-list:before {\n  content: \"\\F03A\";\n}\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\F03B\";\n}\n.fa-indent:before {\n  content: \"\\F03C\";\n}\n.fa-video-camera:before {\n  content: \"\\F03D\";\n}\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\F03E\";\n}\n.fa-pencil:before {\n  content: \"\\F040\";\n}\n.fa-map-marker:before {\n  content: \"\\F041\";\n}\n.fa-adjust:before {\n  content: \"\\F042\";\n}\n.fa-tint:before {\n  content: \"\\F043\";\n}\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\F044\";\n}\n.fa-share-square-o:before {\n  content: \"\\F045\";\n}\n.fa-check-square-o:before {\n  content: \"\\F046\";\n}\n.fa-arrows:before {\n  content: \"\\F047\";\n}\n.fa-step-backward:before {\n  content: \"\\F048\";\n}\n.fa-fast-backward:before {\n  content: \"\\F049\";\n}\n.fa-backward:before {\n  content: \"\\F04A\";\n}\n.fa-play:before {\n  content: \"\\F04B\";\n}\n.fa-pause:before {\n  content: \"\\F04C\";\n}\n.fa-stop:before {\n  content: \"\\F04D\";\n}\n.fa-forward:before {\n  content: \"\\F04E\";\n}\n.fa-fast-forward:before {\n  content: \"\\F050\";\n}\n.fa-step-forward:before {\n  content: \"\\F051\";\n}\n.fa-eject:before {\n  content: \"\\F052\";\n}\n.fa-chevron-left:before {\n  content: \"\\F053\";\n}\n.fa-chevron-right:before {\n  content: \"\\F054\";\n}\n.fa-plus-circle:before {\n  content: \"\\F055\";\n}\n.fa-minus-circle:before {\n  content: \"\\F056\";\n}\n.fa-times-circle:before {\n  content: \"\\F057\";\n}\n.fa-check-circle:before {\n  content: \"\\F058\";\n}\n.fa-question-circle:before {\n  content: \"\\F059\";\n}\n.fa-info-circle:before {\n  content: \"\\F05A\";\n}\n.fa-crosshairs:before {\n  content: \"\\F05B\";\n}\n.fa-times-circle-o:before {\n  content: \"\\F05C\";\n}\n.fa-check-circle-o:before {\n  content: \"\\F05D\";\n}\n.fa-ban:before {\n  content: \"\\F05E\";\n}\n.fa-arrow-left:before {\n  content: \"\\F060\";\n}\n.fa-arrow-right:before {\n  content: \"\\F061\";\n}\n.fa-arrow-up:before {\n  content: \"\\F062\";\n}\n.fa-arrow-down:before {\n  content: \"\\F063\";\n}\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\F064\";\n}\n.fa-expand:before {\n  content: \"\\F065\";\n}\n.fa-compress:before {\n  content: \"\\F066\";\n}\n.fa-plus:before {\n  content: \"\\F067\";\n}\n.fa-minus:before {\n  content: \"\\F068\";\n}\n.fa-asterisk:before {\n  content: \"\\F069\";\n}\n.fa-exclamation-circle:before {\n  content: \"\\F06A\";\n}\n.fa-gift:before {\n  content: \"\\F06B\";\n}\n.fa-leaf:before {\n  content: \"\\F06C\";\n}\n.fa-fire:before {\n  content: \"\\F06D\";\n}\n.fa-eye:before {\n  content: \"\\F06E\";\n}\n.fa-eye-slash:before {\n  content: \"\\F070\";\n}\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\F071\";\n}\n.fa-plane:before {\n  content: \"\\F072\";\n}\n.fa-calendar:before {\n  content: \"\\F073\";\n}\n.fa-random:before {\n  content: \"\\F074\";\n}\n.fa-comment:before {\n  content: \"\\F075\";\n}\n.fa-magnet:before {\n  content: \"\\F076\";\n}\n.fa-chevron-up:before {\n  content: \"\\F077\";\n}\n.fa-chevron-down:before {\n  content: \"\\F078\";\n}\n.fa-retweet:before {\n  content: \"\\F079\";\n}\n.fa-shopping-cart:before {\n  content: \"\\F07A\";\n}\n.fa-folder:before {\n  content: \"\\F07B\";\n}\n.fa-folder-open:before {\n  content: \"\\F07C\";\n}\n.fa-arrows-v:before {\n  content: \"\\F07D\";\n}\n.fa-arrows-h:before {\n  content: \"\\F07E\";\n}\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\F080\";\n}\n.fa-twitter-square:before {\n  content: \"\\F081\";\n}\n.fa-facebook-square:before {\n  content: \"\\F082\";\n}\n.fa-camera-retro:before {\n  content: \"\\F083\";\n}\n.fa-key:before {\n  content: \"\\F084\";\n}\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\F085\";\n}\n.fa-comments:before {\n  content: \"\\F086\";\n}\n.fa-thumbs-o-up:before {\n  content: \"\\F087\";\n}\n.fa-thumbs-o-down:before {\n  content: \"\\F088\";\n}\n.fa-star-half:before {\n  content: \"\\F089\";\n}\n.fa-heart-o:before {\n  content: \"\\F08A\";\n}\n.fa-sign-out:before {\n  content: \"\\F08B\";\n}\n.fa-linkedin-square:before {\n  content: \"\\F08C\";\n}\n.fa-thumb-tack:before {\n  content: \"\\F08D\";\n}\n.fa-external-link:before {\n  content: \"\\F08E\";\n}\n.fa-sign-in:before {\n  content: \"\\F090\";\n}\n.fa-trophy:before {\n  content: \"\\F091\";\n}\n.fa-github-square:before {\n  content: \"\\F092\";\n}\n.fa-upload:before {\n  content: \"\\F093\";\n}\n.fa-lemon-o:before {\n  content: \"\\F094\";\n}\n.fa-phone:before {\n  content: \"\\F095\";\n}\n.fa-square-o:before {\n  content: \"\\F096\";\n}\n.fa-bookmark-o:before {\n  content: \"\\F097\";\n}\n.fa-phone-square:before {\n  content: \"\\F098\";\n}\n.fa-twitter:before {\n  content: \"\\F099\";\n}\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\F09A\";\n}\n.fa-github:before {\n  content: \"\\F09B\";\n}\n.fa-unlock:before {\n  content: \"\\F09C\";\n}\n.fa-credit-card:before {\n  content: \"\\F09D\";\n}\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\\F09E\";\n}\n.fa-hdd-o:before {\n  content: \"\\F0A0\";\n}\n.fa-bullhorn:before {\n  content: \"\\F0A1\";\n}\n.fa-bell:before {\n  content: \"\\F0F3\";\n}\n.fa-certificate:before {\n  content: \"\\F0A3\";\n}\n.fa-hand-o-right:before {\n  content: \"\\F0A4\";\n}\n.fa-hand-o-left:before {\n  content: \"\\F0A5\";\n}\n.fa-hand-o-up:before {\n  content: \"\\F0A6\";\n}\n.fa-hand-o-down:before {\n  content: \"\\F0A7\";\n}\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\";\n}\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\";\n}\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\";\n}\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\";\n}\n.fa-globe:before {\n  content: \"\\F0AC\";\n}\n.fa-wrench:before {\n  content: \"\\F0AD\";\n}\n.fa-tasks:before {\n  content: \"\\F0AE\";\n}\n.fa-filter:before {\n  content: \"\\F0B0\";\n}\n.fa-briefcase:before {\n  content: \"\\F0B1\";\n}\n.fa-arrows-alt:before {\n  content: \"\\F0B2\";\n}\n.fa-group:before,\n.fa-users:before {\n  content: \"\\F0C0\";\n}\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\F0C1\";\n}\n.fa-cloud:before {\n  content: \"\\F0C2\";\n}\n.fa-flask:before {\n  content: \"\\F0C3\";\n}\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\F0C4\";\n}\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\F0C5\";\n}\n.fa-paperclip:before {\n  content: \"\\F0C6\";\n}\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\F0C7\";\n}\n.fa-square:before {\n  content: \"\\F0C8\";\n}\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\F0C9\";\n}\n.fa-list-ul:before {\n  content: \"\\F0CA\";\n}\n.fa-list-ol:before {\n  content: \"\\F0CB\";\n}\n.fa-strikethrough:before {\n  content: \"\\F0CC\";\n}\n.fa-underline:before {\n  content: \"\\F0CD\";\n}\n.fa-table:before {\n  content: \"\\F0CE\";\n}\n.fa-magic:before {\n  content: \"\\F0D0\";\n}\n.fa-truck:before {\n  content: \"\\F0D1\";\n}\n.fa-pinterest:before {\n  content: \"\\F0D2\";\n}\n.fa-pinterest-square:before {\n  content: \"\\F0D3\";\n}\n.fa-google-plus-square:before {\n  content: \"\\F0D4\";\n}\n.fa-google-plus:before {\n  content: \"\\F0D5\";\n}\n.fa-money:before {\n  content: \"\\F0D6\";\n}\n.fa-caret-down:before {\n  content: \"\\F0D7\";\n}\n.fa-caret-up:before {\n  content: \"\\F0D8\";\n}\n.fa-caret-left:before {\n  content: \"\\F0D9\";\n}\n.fa-caret-right:before {\n  content: \"\\F0DA\";\n}\n.fa-columns:before {\n  content: \"\\F0DB\";\n}\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\F0DC\";\n}\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\F0DD\";\n}\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\F0DE\";\n}\n.fa-envelope:before {\n  content: \"\\F0E0\";\n}\n.fa-linkedin:before {\n  content: \"\\F0E1\";\n}\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\F0E2\";\n}\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\F0E3\";\n}\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\F0E4\";\n}\n.fa-comment-o:before {\n  content: \"\\F0E5\";\n}\n.fa-comments-o:before {\n  content: \"\\F0E6\";\n}\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\F0E7\";\n}\n.fa-sitemap:before {\n  content: \"\\F0E8\";\n}\n.fa-umbrella:before {\n  content: \"\\F0E9\";\n}\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\F0EA\";\n}\n.fa-lightbulb-o:before {\n  content: \"\\F0EB\";\n}\n.fa-exchange:before {\n  content: \"\\F0EC\";\n}\n.fa-cloud-download:before {\n  content: \"\\F0ED\";\n}\n.fa-cloud-upload:before {\n  content: \"\\F0EE\";\n}\n.fa-user-md:before {\n  content: \"\\F0F0\";\n}\n.fa-stethoscope:before {\n  content: \"\\F0F1\";\n}\n.fa-suitcase:before {\n  content: \"\\F0F2\";\n}\n.fa-bell-o:before {\n  content: \"\\F0A2\";\n}\n.fa-coffee:before {\n  content: \"\\F0F4\";\n}\n.fa-cutlery:before {\n  content: \"\\F0F5\";\n}\n.fa-file-text-o:before {\n  content: \"\\F0F6\";\n}\n.fa-building-o:before {\n  content: \"\\F0F7\";\n}\n.fa-hospital-o:before {\n  content: \"\\F0F8\";\n}\n.fa-ambulance:before {\n  content: \"\\F0F9\";\n}\n.fa-medkit:before {\n  content: \"\\F0FA\";\n}\n.fa-fighter-jet:before {\n  content: \"\\F0FB\";\n}\n.fa-beer:before {\n  content: \"\\F0FC\";\n}\n.fa-h-square:before {\n  content: \"\\F0FD\";\n}\n.fa-plus-square:before {\n  content: \"\\F0FE\";\n}\n.fa-angle-double-left:before {\n  content: \"\\F100\";\n}\n.fa-angle-double-right:before {\n  content: \"\\F101\";\n}\n.fa-angle-double-up:before {\n  content: \"\\F102\";\n}\n.fa-angle-double-down:before {\n  content: \"\\F103\";\n}\n.fa-angle-left:before {\n  content: \"\\F104\";\n}\n.fa-angle-right:before {\n  content: \"\\F105\";\n}\n.fa-angle-up:before {\n  content: \"\\F106\";\n}\n.fa-angle-down:before {\n  content: \"\\F107\";\n}\n.fa-desktop:before {\n  content: \"\\F108\";\n}\n.fa-laptop:before {\n  content: \"\\F109\";\n}\n.fa-tablet:before {\n  content: \"\\F10A\";\n}\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\F10B\";\n}\n.fa-circle-o:before {\n  content: \"\\F10C\";\n}\n.fa-quote-left:before {\n  content: \"\\F10D\";\n}\n.fa-quote-right:before {\n  content: \"\\F10E\";\n}\n.fa-spinner:before {\n  content: \"\\F110\";\n}\n.fa-circle:before {\n  content: \"\\F111\";\n}\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\F112\";\n}\n.fa-github-alt:before {\n  content: \"\\F113\";\n}\n.fa-folder-o:before {\n  content: \"\\F114\";\n}\n.fa-folder-open-o:before {\n  content: \"\\F115\";\n}\n.fa-smile-o:before {\n  content: \"\\F118\";\n}\n.fa-frown-o:before {\n  content: \"\\F119\";\n}\n.fa-meh-o:before {\n  content: \"\\F11A\";\n}\n.fa-gamepad:before {\n  content: \"\\F11B\";\n}\n.fa-keyboard-o:before {\n  content: \"\\F11C\";\n}\n.fa-flag-o:before {\n  content: \"\\F11D\";\n}\n.fa-flag-checkered:before {\n  content: \"\\F11E\";\n}\n.fa-terminal:before {\n  content: \"\\F120\";\n}\n.fa-code:before {\n  content: \"\\F121\";\n}\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\F122\";\n}\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\F123\";\n}\n.fa-location-arrow:before {\n  content: \"\\F124\";\n}\n.fa-crop:before {\n  content: \"\\F125\";\n}\n.fa-code-fork:before {\n  content: \"\\F126\";\n}\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\F127\";\n}\n.fa-question:before {\n  content: \"\\F128\";\n}\n.fa-info:before {\n  content: \"\\F129\";\n}\n.fa-exclamation:before {\n  content: \"\\F12A\";\n}\n.fa-superscript:before {\n  content: \"\\F12B\";\n}\n.fa-subscript:before {\n  content: \"\\F12C\";\n}\n.fa-eraser:before {\n  content: \"\\F12D\";\n}\n.fa-puzzle-piece:before {\n  content: \"\\F12E\";\n}\n.fa-microphone:before {\n  content: \"\\F130\";\n}\n.fa-microphone-slash:before {\n  content: \"\\F131\";\n}\n.fa-shield:before {\n  content: \"\\F132\";\n}\n.fa-calendar-o:before {\n  content: \"\\F133\";\n}\n.fa-fire-extinguisher:before {\n  content: \"\\F134\";\n}\n.fa-rocket:before {\n  content: \"\\F135\";\n}\n.fa-maxcdn:before {\n  content: \"\\F136\";\n}\n.fa-chevron-circle-left:before {\n  content: \"\\F137\";\n}\n.fa-chevron-circle-right:before {\n  content: \"\\F138\";\n}\n.fa-chevron-circle-up:before {\n  content: \"\\F139\";\n}\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\";\n}\n.fa-html5:before {\n  content: \"\\F13B\";\n}\n.fa-css3:before {\n  content: \"\\F13C\";\n}\n.fa-anchor:before {\n  content: \"\\F13D\";\n}\n.fa-unlock-alt:before {\n  content: \"\\F13E\";\n}\n.fa-bullseye:before {\n  content: \"\\F140\";\n}\n.fa-ellipsis-h:before {\n  content: \"\\F141\";\n}\n.fa-ellipsis-v:before {\n  content: \"\\F142\";\n}\n.fa-rss-square:before {\n  content: \"\\F143\";\n}\n.fa-play-circle:before {\n  content: \"\\F144\";\n}\n.fa-ticket:before {\n  content: \"\\F145\";\n}\n.fa-minus-square:before {\n  content: \"\\F146\";\n}\n.fa-minus-square-o:before {\n  content: \"\\F147\";\n}\n.fa-level-up:before {\n  content: \"\\F148\";\n}\n.fa-level-down:before {\n  content: \"\\F149\";\n}\n.fa-check-square:before {\n  content: \"\\F14A\";\n}\n.fa-pencil-square:before {\n  content: \"\\F14B\";\n}\n.fa-external-link-square:before {\n  content: \"\\F14C\";\n}\n.fa-share-square:before {\n  content: \"\\F14D\";\n}\n.fa-compass:before {\n  content: \"\\F14E\";\n}\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\F150\";\n}\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\F151\";\n}\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\F152\";\n}\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\F153\";\n}\n.fa-gbp:before {\n  content: \"\\F154\";\n}\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\F155\";\n}\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\F156\";\n}\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\F157\";\n}\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\F158\";\n}\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\F159\";\n}\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\F15A\";\n}\n.fa-file:before {\n  content: \"\\F15B\";\n}\n.fa-file-text:before {\n  content: \"\\F15C\";\n}\n.fa-sort-alpha-asc:before {\n  content: \"\\F15D\";\n}\n.fa-sort-alpha-desc:before {\n  content: \"\\F15E\";\n}\n.fa-sort-amount-asc:before {\n  content: \"\\F160\";\n}\n.fa-sort-amount-desc:before {\n  content: \"\\F161\";\n}\n.fa-sort-numeric-asc:before {\n  content: \"\\F162\";\n}\n.fa-sort-numeric-desc:before {\n  content: \"\\F163\";\n}\n.fa-thumbs-up:before {\n  content: \"\\F164\";\n}\n.fa-thumbs-down:before {\n  content: \"\\F165\";\n}\n.fa-youtube-square:before {\n  content: \"\\F166\";\n}\n.fa-youtube:before {\n  content: \"\\F167\";\n}\n.fa-xing:before {\n  content: \"\\F168\";\n}\n.fa-xing-square:before {\n  content: \"\\F169\";\n}\n.fa-youtube-play:before {\n  content: \"\\F16A\";\n}\n.fa-dropbox:before {\n  content: \"\\F16B\";\n}\n.fa-stack-overflow:before {\n  content: \"\\F16C\";\n}\n.fa-instagram:before {\n  content: \"\\F16D\";\n}\n.fa-flickr:before {\n  content: \"\\F16E\";\n}\n.fa-adn:before {\n  content: \"\\F170\";\n}\n.fa-bitbucket:before {\n  content: \"\\F171\";\n}\n.fa-bitbucket-square:before {\n  content: \"\\F172\";\n}\n.fa-tumblr:before {\n  content: \"\\F173\";\n}\n.fa-tumblr-square:before {\n  content: \"\\F174\";\n}\n.fa-long-arrow-down:before {\n  content: \"\\F175\";\n}\n.fa-long-arrow-up:before {\n  content: \"\\F176\";\n}\n.fa-long-arrow-left:before {\n  content: \"\\F177\";\n}\n.fa-long-arrow-right:before {\n  content: \"\\F178\";\n}\n.fa-apple:before {\n  content: \"\\F179\";\n}\n.fa-windows:before {\n  content: \"\\F17A\";\n}\n.fa-android:before {\n  content: \"\\F17B\";\n}\n.fa-linux:before {\n  content: \"\\F17C\";\n}\n.fa-dribbble:before {\n  content: \"\\F17D\";\n}\n.fa-skype:before {\n  content: \"\\F17E\";\n}\n.fa-foursquare:before {\n  content: \"\\F180\";\n}\n.fa-trello:before {\n  content: \"\\F181\";\n}\n.fa-female:before {\n  content: \"\\F182\";\n}\n.fa-male:before {\n  content: \"\\F183\";\n}\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\F184\";\n}\n.fa-sun-o:before {\n  content: \"\\F185\";\n}\n.fa-moon-o:before {\n  content: \"\\F186\";\n}\n.fa-archive:before {\n  content: \"\\F187\";\n}\n.fa-bug:before {\n  content: \"\\F188\";\n}\n.fa-vk:before {\n  content: \"\\F189\";\n}\n.fa-weibo:before {\n  content: \"\\F18A\";\n}\n.fa-renren:before {\n  content: \"\\F18B\";\n}\n.fa-pagelines:before {\n  content: \"\\F18C\";\n}\n.fa-stack-exchange:before {\n  content: \"\\F18D\";\n}\n.fa-arrow-circle-o-right:before {\n  content: \"\\F18E\";\n}\n.fa-arrow-circle-o-left:before {\n  content: \"\\F190\";\n}\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\F191\";\n}\n.fa-dot-circle-o:before {\n  content: \"\\F192\";\n}\n.fa-wheelchair:before {\n  content: \"\\F193\";\n}\n.fa-vimeo-square:before {\n  content: \"\\F194\";\n}\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\F195\";\n}\n.fa-plus-square-o:before {\n  content: \"\\F196\";\n}\n.fa-space-shuttle:before {\n  content: \"\\F197\";\n}\n.fa-slack:before {\n  content: \"\\F198\";\n}\n.fa-envelope-square:before {\n  content: \"\\F199\";\n}\n.fa-wordpress:before {\n  content: \"\\F19A\";\n}\n.fa-openid:before {\n  content: \"\\F19B\";\n}\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\F19C\";\n}\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\F19D\";\n}\n.fa-yahoo:before {\n  content: \"\\F19E\";\n}\n.fa-google:before {\n  content: \"\\F1A0\";\n}\n.fa-reddit:before {\n  content: \"\\F1A1\";\n}\n.fa-reddit-square:before {\n  content: \"\\F1A2\";\n}\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\";\n}\n.fa-stumbleupon:before {\n  content: \"\\F1A4\";\n}\n.fa-delicious:before {\n  content: \"\\F1A5\";\n}\n.fa-digg:before {\n  content: \"\\F1A6\";\n}\n.fa-pied-piper-pp:before {\n  content: \"\\F1A7\";\n}\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\";\n}\n.fa-drupal:before {\n  content: \"\\F1A9\";\n}\n.fa-joomla:before {\n  content: \"\\F1AA\";\n}\n.fa-language:before {\n  content: \"\\F1AB\";\n}\n.fa-fax:before {\n  content: \"\\F1AC\";\n}\n.fa-building:before {\n  content: \"\\F1AD\";\n}\n.fa-child:before {\n  content: \"\\F1AE\";\n}\n.fa-paw:before {\n  content: \"\\F1B0\";\n}\n.fa-spoon:before {\n  content: \"\\F1B1\";\n}\n.fa-cube:before {\n  content: \"\\F1B2\";\n}\n.fa-cubes:before {\n  content: \"\\F1B3\";\n}\n.fa-behance:before {\n  content: \"\\F1B4\";\n}\n.fa-behance-square:before {\n  content: \"\\F1B5\";\n}\n.fa-steam:before {\n  content: \"\\F1B6\";\n}\n.fa-steam-square:before {\n  content: \"\\F1B7\";\n}\n.fa-recycle:before {\n  content: \"\\F1B8\";\n}\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\F1B9\";\n}\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\F1BA\";\n}\n.fa-tree:before {\n  content: \"\\F1BB\";\n}\n.fa-spotify:before {\n  content: \"\\F1BC\";\n}\n.fa-deviantart:before {\n  content: \"\\F1BD\";\n}\n.fa-soundcloud:before {\n  content: \"\\F1BE\";\n}\n.fa-database:before {\n  content: \"\\F1C0\";\n}\n.fa-file-pdf-o:before {\n  content: \"\\F1C1\";\n}\n.fa-file-word-o:before {\n  content: \"\\F1C2\";\n}\n.fa-file-excel-o:before {\n  content: \"\\F1C3\";\n}\n.fa-file-powerpoint-o:before {\n  content: \"\\F1C4\";\n}\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\F1C5\";\n}\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\F1C6\";\n}\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\F1C7\";\n}\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\F1C8\";\n}\n.fa-file-code-o:before {\n  content: \"\\F1C9\";\n}\n.fa-vine:before {\n  content: \"\\F1CA\";\n}\n.fa-codepen:before {\n  content: \"\\F1CB\";\n}\n.fa-jsfiddle:before {\n  content: \"\\F1CC\";\n}\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\F1CD\";\n}\n.fa-circle-o-notch:before {\n  content: \"\\F1CE\";\n}\n.fa-ra:before,\n.fa-resistance:before,\n.fa-rebel:before {\n  content: \"\\F1D0\";\n}\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\F1D1\";\n}\n.fa-git-square:before {\n  content: \"\\F1D2\";\n}\n.fa-git:before {\n  content: \"\\F1D3\";\n}\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\\F1D4\";\n}\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\";\n}\n.fa-qq:before {\n  content: \"\\F1D6\";\n}\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\F1D7\";\n}\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\F1D8\";\n}\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\F1D9\";\n}\n.fa-history:before {\n  content: \"\\F1DA\";\n}\n.fa-circle-thin:before {\n  content: \"\\F1DB\";\n}\n.fa-header:before {\n  content: \"\\F1DC\";\n}\n.fa-paragraph:before {\n  content: \"\\F1DD\";\n}\n.fa-sliders:before {\n  content: \"\\F1DE\";\n}\n.fa-share-alt:before {\n  content: \"\\F1E0\";\n}\n.fa-share-alt-square:before {\n  content: \"\\F1E1\";\n}\n.fa-bomb:before {\n  content: \"\\F1E2\";\n}\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\F1E3\";\n}\n.fa-tty:before {\n  content: \"\\F1E4\";\n}\n.fa-binoculars:before {\n  content: \"\\F1E5\";\n}\n.fa-plug:before {\n  content: \"\\F1E6\";\n}\n.fa-slideshare:before {\n  content: \"\\F1E7\";\n}\n.fa-twitch:before {\n  content: \"\\F1E8\";\n}\n.fa-yelp:before {\n  content: \"\\F1E9\";\n}\n.fa-newspaper-o:before {\n  content: \"\\F1EA\";\n}\n.fa-wifi:before {\n  content: \"\\F1EB\";\n}\n.fa-calculator:before {\n  content: \"\\F1EC\";\n}\n.fa-paypal:before {\n  content: \"\\F1ED\";\n}\n.fa-google-wallet:before {\n  content: \"\\F1EE\";\n}\n.fa-cc-visa:before {\n  content: \"\\F1F0\";\n}\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\";\n}\n.fa-cc-discover:before {\n  content: \"\\F1F2\";\n}\n.fa-cc-amex:before {\n  content: \"\\F1F3\";\n}\n.fa-cc-paypal:before {\n  content: \"\\F1F4\";\n}\n.fa-cc-stripe:before {\n  content: \"\\F1F5\";\n}\n.fa-bell-slash:before {\n  content: \"\\F1F6\";\n}\n.fa-bell-slash-o:before {\n  content: \"\\F1F7\";\n}\n.fa-trash:before {\n  content: \"\\F1F8\";\n}\n.fa-copyright:before {\n  content: \"\\F1F9\";\n}\n.fa-at:before {\n  content: \"\\F1FA\";\n}\n.fa-eyedropper:before {\n  content: \"\\F1FB\";\n}\n.fa-paint-brush:before {\n  content: \"\\F1FC\";\n}\n.fa-birthday-cake:before {\n  content: \"\\F1FD\";\n}\n.fa-area-chart:before {\n  content: \"\\F1FE\";\n}\n.fa-pie-chart:before {\n  content: \"\\F200\";\n}\n.fa-line-chart:before {\n  content: \"\\F201\";\n}\n.fa-lastfm:before {\n  content: \"\\F202\";\n}\n.fa-lastfm-square:before {\n  content: \"\\F203\";\n}\n.fa-toggle-off:before {\n  content: \"\\F204\";\n}\n.fa-toggle-on:before {\n  content: \"\\F205\";\n}\n.fa-bicycle:before {\n  content: \"\\F206\";\n}\n.fa-bus:before {\n  content: \"\\F207\";\n}\n.fa-ioxhost:before {\n  content: \"\\F208\";\n}\n.fa-angellist:before {\n  content: \"\\F209\";\n}\n.fa-cc:before {\n  content: \"\\F20A\";\n}\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\F20B\";\n}\n.fa-meanpath:before {\n  content: \"\\F20C\";\n}\n.fa-buysellads:before {\n  content: \"\\F20D\";\n}\n.fa-connectdevelop:before {\n  content: \"\\F20E\";\n}\n.fa-dashcube:before {\n  content: \"\\F210\";\n}\n.fa-forumbee:before {\n  content: \"\\F211\";\n}\n.fa-leanpub:before {\n  content: \"\\F212\";\n}\n.fa-sellsy:before {\n  content: \"\\F213\";\n}\n.fa-shirtsinbulk:before {\n  content: \"\\F214\";\n}\n.fa-simplybuilt:before {\n  content: \"\\F215\";\n}\n.fa-skyatlas:before {\n  content: \"\\F216\";\n}\n.fa-cart-plus:before {\n  content: \"\\F217\";\n}\n.fa-cart-arrow-down:before {\n  content: \"\\F218\";\n}\n.fa-diamond:before {\n  content: \"\\F219\";\n}\n.fa-ship:before {\n  content: \"\\F21A\";\n}\n.fa-user-secret:before {\n  content: \"\\F21B\";\n}\n.fa-motorcycle:before {\n  content: \"\\F21C\";\n}\n.fa-street-view:before {\n  content: \"\\F21D\";\n}\n.fa-heartbeat:before {\n  content: \"\\F21E\";\n}\n.fa-venus:before {\n  content: \"\\F221\";\n}\n.fa-mars:before {\n  content: \"\\F222\";\n}\n.fa-mercury:before {\n  content: \"\\F223\";\n}\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\\F224\";\n}\n.fa-transgender-alt:before {\n  content: \"\\F225\";\n}\n.fa-venus-double:before {\n  content: \"\\F226\";\n}\n.fa-mars-double:before {\n  content: \"\\F227\";\n}\n.fa-venus-mars:before {\n  content: \"\\F228\";\n}\n.fa-mars-stroke:before {\n  content: \"\\F229\";\n}\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\";\n}\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\";\n}\n.fa-neuter:before {\n  content: \"\\F22C\";\n}\n.fa-genderless:before {\n  content: \"\\F22D\";\n}\n.fa-facebook-official:before {\n  content: \"\\F230\";\n}\n.fa-pinterest-p:before {\n  content: \"\\F231\";\n}\n.fa-whatsapp:before {\n  content: \"\\F232\";\n}\n.fa-server:before {\n  content: \"\\F233\";\n}\n.fa-user-plus:before {\n  content: \"\\F234\";\n}\n.fa-user-times:before {\n  content: \"\\F235\";\n}\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\F236\";\n}\n.fa-viacoin:before {\n  content: \"\\F237\";\n}\n.fa-train:before {\n  content: \"\\F238\";\n}\n.fa-subway:before {\n  content: \"\\F239\";\n}\n.fa-medium:before {\n  content: \"\\F23A\";\n}\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\\F23B\";\n}\n.fa-optin-monster:before {\n  content: \"\\F23C\";\n}\n.fa-opencart:before {\n  content: \"\\F23D\";\n}\n.fa-expeditedssl:before {\n  content: \"\\F23E\";\n}\n.fa-battery-4:before,\n.fa-battery:before,\n.fa-battery-full:before {\n  content: \"\\F240\";\n}\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\\F241\";\n}\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\\F242\";\n}\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\\F243\";\n}\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\\F244\";\n}\n.fa-mouse-pointer:before {\n  content: \"\\F245\";\n}\n.fa-i-cursor:before {\n  content: \"\\F246\";\n}\n.fa-object-group:before {\n  content: \"\\F247\";\n}\n.fa-object-ungroup:before {\n  content: \"\\F248\";\n}\n.fa-sticky-note:before {\n  content: \"\\F249\";\n}\n.fa-sticky-note-o:before {\n  content: \"\\F24A\";\n}\n.fa-cc-jcb:before {\n  content: \"\\F24B\";\n}\n.fa-cc-diners-club:before {\n  content: \"\\F24C\";\n}\n.fa-clone:before {\n  content: \"\\F24D\";\n}\n.fa-balance-scale:before {\n  content: \"\\F24E\";\n}\n.fa-hourglass-o:before {\n  content: \"\\F250\";\n}\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\\F251\";\n}\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\\F252\";\n}\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\\F253\";\n}\n.fa-hourglass:before {\n  content: \"\\F254\";\n}\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\\F255\";\n}\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\\F256\";\n}\n.fa-hand-scissors-o:before {\n  content: \"\\F257\";\n}\n.fa-hand-lizard-o:before {\n  content: \"\\F258\";\n}\n.fa-hand-spock-o:before {\n  content: \"\\F259\";\n}\n.fa-hand-pointer-o:before {\n  content: \"\\F25A\";\n}\n.fa-hand-peace-o:before {\n  content: \"\\F25B\";\n}\n.fa-trademark:before {\n  content: \"\\F25C\";\n}\n.fa-registered:before {\n  content: \"\\F25D\";\n}\n.fa-creative-commons:before {\n  content: \"\\F25E\";\n}\n.fa-gg:before {\n  content: \"\\F260\";\n}\n.fa-gg-circle:before {\n  content: \"\\F261\";\n}\n.fa-tripadvisor:before {\n  content: \"\\F262\";\n}\n.fa-odnoklassniki:before {\n  content: \"\\F263\";\n}\n.fa-odnoklassniki-square:before {\n  content: \"\\F264\";\n}\n.fa-get-pocket:before {\n  content: \"\\F265\";\n}\n.fa-wikipedia-w:before {\n  content: \"\\F266\";\n}\n.fa-safari:before {\n  content: \"\\F267\";\n}\n.fa-chrome:before {\n  content: \"\\F268\";\n}\n.fa-firefox:before {\n  content: \"\\F269\";\n}\n.fa-opera:before {\n  content: \"\\F26A\";\n}\n.fa-internet-explorer:before {\n  content: \"\\F26B\";\n}\n.fa-tv:before,\n.fa-television:before {\n  content: \"\\F26C\";\n}\n.fa-contao:before {\n  content: \"\\F26D\";\n}\n.fa-500px:before {\n  content: \"\\F26E\";\n}\n.fa-amazon:before {\n  content: \"\\F270\";\n}\n.fa-calendar-plus-o:before {\n  content: \"\\F271\";\n}\n.fa-calendar-minus-o:before {\n  content: \"\\F272\";\n}\n.fa-calendar-times-o:before {\n  content: \"\\F273\";\n}\n.fa-calendar-check-o:before {\n  content: \"\\F274\";\n}\n.fa-industry:before {\n  content: \"\\F275\";\n}\n.fa-map-pin:before {\n  content: \"\\F276\";\n}\n.fa-map-signs:before {\n  content: \"\\F277\";\n}\n.fa-map-o:before {\n  content: \"\\F278\";\n}\n.fa-map:before {\n  content: \"\\F279\";\n}\n.fa-commenting:before {\n  content: \"\\F27A\";\n}\n.fa-commenting-o:before {\n  content: \"\\F27B\";\n}\n.fa-houzz:before {\n  content: \"\\F27C\";\n}\n.fa-vimeo:before {\n  content: \"\\F27D\";\n}\n.fa-black-tie:before {\n  content: \"\\F27E\";\n}\n.fa-fonticons:before {\n  content: \"\\F280\";\n}\n.fa-reddit-alien:before {\n  content: \"\\F281\";\n}\n.fa-edge:before {\n  content: \"\\F282\";\n}\n.fa-credit-card-alt:before {\n  content: \"\\F283\";\n}\n.fa-codiepie:before {\n  content: \"\\F284\";\n}\n.fa-modx:before {\n  content: \"\\F285\";\n}\n.fa-fort-awesome:before {\n  content: \"\\F286\";\n}\n.fa-usb:before {\n  content: \"\\F287\";\n}\n.fa-product-hunt:before {\n  content: \"\\F288\";\n}\n.fa-mixcloud:before {\n  content: \"\\F289\";\n}\n.fa-scribd:before {\n  content: \"\\F28A\";\n}\n.fa-pause-circle:before {\n  content: \"\\F28B\";\n}\n.fa-pause-circle-o:before {\n  content: \"\\F28C\";\n}\n.fa-stop-circle:before {\n  content: \"\\F28D\";\n}\n.fa-stop-circle-o:before {\n  content: \"\\F28E\";\n}\n.fa-shopping-bag:before {\n  content: \"\\F290\";\n}\n.fa-shopping-basket:before {\n  content: \"\\F291\";\n}\n.fa-hashtag:before {\n  content: \"\\F292\";\n}\n.fa-bluetooth:before {\n  content: \"\\F293\";\n}\n.fa-bluetooth-b:before {\n  content: \"\\F294\";\n}\n.fa-percent:before {\n  content: \"\\F295\";\n}\n.fa-gitlab:before {\n  content: \"\\F296\";\n}\n.fa-wpbeginner:before {\n  content: \"\\F297\";\n}\n.fa-wpforms:before {\n  content: \"\\F298\";\n}\n.fa-envira:before {\n  content: \"\\F299\";\n}\n.fa-universal-access:before {\n  content: \"\\F29A\";\n}\n.fa-wheelchair-alt:before {\n  content: \"\\F29B\";\n}\n.fa-question-circle-o:before {\n  content: \"\\F29C\";\n}\n.fa-blind:before {\n  content: \"\\F29D\";\n}\n.fa-audio-description:before {\n  content: \"\\F29E\";\n}\n.fa-volume-control-phone:before {\n  content: \"\\F2A0\";\n}\n.fa-braille:before {\n  content: \"\\F2A1\";\n}\n.fa-assistive-listening-systems:before {\n  content: \"\\F2A2\";\n}\n.fa-asl-interpreting:before,\n.fa-american-sign-language-interpreting:before {\n  content: \"\\F2A3\";\n}\n.fa-deafness:before,\n.fa-hard-of-hearing:before,\n.fa-deaf:before {\n  content: \"\\F2A4\";\n}\n.fa-glide:before {\n  content: \"\\F2A5\";\n}\n.fa-glide-g:before {\n  content: \"\\F2A6\";\n}\n.fa-signing:before,\n.fa-sign-language:before {\n  content: \"\\F2A7\";\n}\n.fa-low-vision:before {\n  content: \"\\F2A8\";\n}\n.fa-viadeo:before {\n  content: \"\\F2A9\";\n}\n.fa-viadeo-square:before {\n  content: \"\\F2AA\";\n}\n.fa-snapchat:before {\n  content: \"\\F2AB\";\n}\n.fa-snapchat-ghost:before {\n  content: \"\\F2AC\";\n}\n.fa-snapchat-square:before {\n  content: \"\\F2AD\";\n}\n.fa-pied-piper:before {\n  content: \"\\F2AE\";\n}\n.fa-first-order:before {\n  content: \"\\F2B0\";\n}\n.fa-yoast:before {\n  content: \"\\F2B1\";\n}\n.fa-themeisle:before {\n  content: \"\\F2B2\";\n}\n.fa-google-plus-circle:before,\n.fa-google-plus-official:before {\n  content: \"\\F2B3\";\n}\n.fa-fa:before,\n.fa-font-awesome:before {\n  content: \"\\F2B4\";\n}\n.fa-handshake-o:before {\n  content: \"\\F2B5\";\n}\n.fa-envelope-open:before {\n  content: \"\\F2B6\";\n}\n.fa-envelope-open-o:before {\n  content: \"\\F2B7\";\n}\n.fa-linode:before {\n  content: \"\\F2B8\";\n}\n.fa-address-book:before {\n  content: \"\\F2B9\";\n}\n.fa-address-book-o:before {\n  content: \"\\F2BA\";\n}\n.fa-vcard:before,\n.fa-address-card:before {\n  content: \"\\F2BB\";\n}\n.fa-vcard-o:before,\n.fa-address-card-o:before {\n  content: \"\\F2BC\";\n}\n.fa-user-circle:before {\n  content: \"\\F2BD\";\n}\n.fa-user-circle-o:before {\n  content: \"\\F2BE\";\n}\n.fa-user-o:before {\n  content: \"\\F2C0\";\n}\n.fa-id-badge:before {\n  content: \"\\F2C1\";\n}\n.fa-drivers-license:before,\n.fa-id-card:before {\n  content: \"\\F2C2\";\n}\n.fa-drivers-license-o:before,\n.fa-id-card-o:before {\n  content: \"\\F2C3\";\n}\n.fa-quora:before {\n  content: \"\\F2C4\";\n}\n.fa-free-code-camp:before {\n  content: \"\\F2C5\";\n}\n.fa-telegram:before {\n  content: \"\\F2C6\";\n}\n.fa-thermometer-4:before,\n.fa-thermometer:before,\n.fa-thermometer-full:before {\n  content: \"\\F2C7\";\n}\n.fa-thermometer-3:before,\n.fa-thermometer-three-quarters:before {\n  content: \"\\F2C8\";\n}\n.fa-thermometer-2:before,\n.fa-thermometer-half:before {\n  content: \"\\F2C9\";\n}\n.fa-thermometer-1:before,\n.fa-thermometer-quarter:before {\n  content: \"\\F2CA\";\n}\n.fa-thermometer-0:before,\n.fa-thermometer-empty:before {\n  content: \"\\F2CB\";\n}\n.fa-shower:before {\n  content: \"\\F2CC\";\n}\n.fa-bathtub:before,\n.fa-s15:before,\n.fa-bath:before {\n  content: \"\\F2CD\";\n}\n.fa-podcast:before {\n  content: \"\\F2CE\";\n}\n.fa-window-maximize:before {\n  content: \"\\F2D0\";\n}\n.fa-window-minimize:before {\n  content: \"\\F2D1\";\n}\n.fa-window-restore:before {\n  content: \"\\F2D2\";\n}\n.fa-times-rectangle:before,\n.fa-window-close:before {\n  content: \"\\F2D3\";\n}\n.fa-times-rectangle-o:before,\n.fa-window-close-o:before {\n  content: \"\\F2D4\";\n}\n.fa-bandcamp:before {\n  content: \"\\F2D5\";\n}\n.fa-grav:before {\n  content: \"\\F2D6\";\n}\n.fa-etsy:before {\n  content: \"\\F2D7\";\n}\n.fa-imdb:before {\n  content: \"\\F2D8\";\n}\n.fa-ravelry:before {\n  content: \"\\F2D9\";\n}\n.fa-eercast:before {\n  content: \"\\F2DA\";\n}\n.fa-microchip:before {\n  content: \"\\F2DB\";\n}\n.fa-snowflake-o:before {\n  content: \"\\F2DC\";\n}\n.fa-superpowers:before {\n  content: \"\\F2DD\";\n}\n.fa-wpexplorer:before {\n  content: \"\\F2DE\";\n}\n.fa-meetup:before {\n  content: \"\\F2E0\";\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "674f50d287a8c48dc19ba404d20fe713.eot";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "674f50d287a8c48dc19ba404d20fe713.eot";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "af7ae505a9eed503f8b8e6982036873e.woff2";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fee66e712a8a08eef5805a46892932ad.woff";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b06871f281fee6b241d60582ae9369b9.ttf";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "912ec66d7572ff821749319396470bde.svg";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*\r\nwe will need to give the margin left right 1% to give us\r\na 2% gutter\r\n*/\r\n.row {\r\n  width: 100%;\r\n}\r\n\r\n.row .column {\r\n  float: left;\r\n  margin: 10px 1%;\r\n}\r\n\r\n.row::after {\r\n\tcontent: \"\";\r\n\tdisplay: table;\r\n\tclear: both;\r\n}\r\n\r\n.small-column-margin{\r\n    height: 100%;\r\n}\r\n\r\n\r\n/*\r\nour percentages also need to be updated to account for the 1% margin\r\n*/\r\n\r\n.small-1 { width: 6.333333333333334%; }\r\n.small-2 { width: 14.666666666666668%; }\r\n.small-3 { width: 23%; }\r\n.small-4 { width: 31.333333333333336%; }\r\n.small-5 { width: 39.66666666666667%; }\r\n.small-6 { width: 48.00000000000001%; }\r\n.small-7 { width: 56.333333333333336%; }\r\n.small-8 { width: 64.66666666666667%; }\r\n.small-9 { width: 73%; }\r\n.small-10 { width: 81.33333333333333%; }\r\n.small-11 { width: 89.66666666666667%; }\r\n.small-12 { width: 98%; }\r\n\r\n\r\n@media only screen and (min-width: 720px) {\r\n    .medium-1 { width: 6.333333333333334%; }\r\n    .medium-2 { width: 14.666666666666668%; }\r\n    .medium-3 { width: 23%; }\r\n    .medium-4 { width: 31.333333333333336%; }\r\n    .medium-5 { width: 39.66666666666667%; }\r\n    .medium-6 { width: 48.00000000000001%; }\r\n    .medium-7 { width: 56.333333333333336%; }\r\n    .medium-8 { width: 64.66666666666667%; }\r\n    .medium-9 { width: 73%; }\r\n    .medium-10 { width: 81.33333333333333%; }\r\n    .medium-11 { width: 89.66666666666667%; }\r\n    .medium-12 { width: 98%; }\r\n}\r\n\r\n@media only screen and (min-width: 1040px) {\r\n    .large-1 { width: 6.333333333333334%; }\r\n    .large-2 { width: 14.666666666666668%; }\r\n    .large-3 { width: 23%; }\r\n    .large-4 { width: 31.333333333333336%; }\r\n    .large-5 { width: 39.66666666666667%; }\r\n    .large-6 { width: 48.00000000000001%; }\r\n    .large-7 { width: 56.333333333333336%; }\r\n    .large-8 { width: 64.66666666666667%; }\r\n    .large-9 { width: 73%; }\r\n    .large-10 { width: 81.33333333333333%; }\r\n    .large-11 { width: 89.66666666666667%; }\r\n    .large-12 { width: 98%; }\r\n}\r\n\r\n\r\n\r\n/* * * * * * * * * * * * * * * * * * *\r\nVisibility Classes\r\n* * * * * * * * * * * * * * * * * * */\r\n\r\n.visible-for-small-only {\r\n    display: block;\r\n}\r\n\r\n.visible-for-small-and-medium-only {\r\n    display: block;\r\n}\r\n\r\n.visible-for-medium-and-up {\r\n    display: none;\r\n}\r\n\r\n.visible-for-large-and-up {\r\n    display: none;\r\n}\r\n\r\n@media only screen and (min-width: 720px) {\r\n    .visible-for-small-only {\r\n        display: none;\r\n    }\r\n\r\n    .visible-for-medium-and-up {\r\n        display: block;\r\n    }\r\n}\r\n\r\n@media only screen and (min-width: 1040px) {\r\n    .visible-for-small-and-medium-only {\r\n        display: none;\r\n    }\r\n\r\n    .visible-for-large-and-up {\r\n        display: block;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(//fonts.googleapis.com/css?family=Open+Sans:300,400);", ""]);

// module
exports.push([module.i, "*{\r\n    font-family: \"Open Sans\", sans-serif;\r\n    font-weight: 300;\r\n}\r\n\r\n.wrapper{\r\n    width: 95%;\r\n    margin: 0 auto;\r\n}\r\n\r\n.align-right{\r\n    text-align: right;\r\n}\r\n\r\n.align-center{\r\n    text-align: center;\r\n}\r\n\r\n.align-left{\r\n    text-align: left;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./SiteHeader.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./SiteHeader.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "*{\r\n    font-family: \"Open Sans\", sans-serif;\r\n    font-weight: 300;\r\n}\r\n\r\nheader{\r\n    width: 95%;\r\n    margin: 0;\r\n    padding: 0 2.5%;\r\n    height: 84px;\r\n    background: black;\r\n}\r\n\r\nheader a{\r\n    color: white;\r\n    text-decoration: none;\r\n    line-height: 64px;\r\n    vertical-align: top;\r\n}\r\n\r\n.mobile-nav, .desktop-nav{\r\n    float: left;\r\n    color: white;\r\n    width: 95%;\r\n    margin: 0 1%;\r\n}\r\n\r\n.mobile-slide-out{\r\n    display: none;\r\n    background: black;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 100%;\r\n    width: 60%;\r\n    height: 100%;\r\n    z-index: 20;\r\n    padding-top: 20px;\r\n    border-left: 1px solid white;\r\n}\r\n\r\n.mobile-slide-out a{\r\n    color: white;\r\n    font-size: 24px;\r\n    text-decoration: none;\r\n    display: block;\r\n    margin: 4px auto;\r\n    border: 1px white solid;\r\n    text-align: center;\r\n    height: 45px;\r\n    line-height: 45px;\r\n    width: 95%;\r\n}\r\n\r\n\r\n.opened {\r\n    display: block;\r\n    left: 40%;\r\n}\r\n\r\n.close-menu-div {\r\n    position: absolute;\r\n    top: 0px;\r\n    left: 0px;\r\n    width: 40%;\r\n    height: 100%;\r\n    background: rgba(0, 0, 0, 0.7);\r\n    z-index: 20;\r\n}\r\n\r\n.burger-button{\r\n    line-height: 64px;\r\n}\r\n\r\n.desktop-nav ul{\r\n    list-style: none;\r\n    color: white;\r\n    padding: 0;\r\n}\r\n\r\n.desktop-nav li{\r\n    display: inline-block;\r\n    vertical-align: top;\r\n}\r\n\r\n.desktop-nav-button{\r\n    color: white;\r\n    background-color: transparent;\r\n    text-decoration: none;\r\n    height: auto;\r\n    line-height: 64px;\r\n    padding: 2px 5px;\r\n    border: 1px solid white;\r\n    border-radius: 12px;\r\n    margin: 0 2px;\r\n}\r\n\r\n.desktop-nav-button:hover{\r\n    color: black;\r\n    background-color: white;\r\n}\r\n\r\n.desktop-nav-social-media{\r\n    line-height: 64px;\r\n    vertical-align: top;\r\n}\r\n\r\n.logo{\r\n    font-weight: bold;\r\n}\r\n\r\n.logo-icon{\r\n    margin-right: 4px;\r\n}\r\n\r\n.mobile-nav .column, .desktop-nav .column{\r\n    float: left;\r\n    margin: 10px 1%;\r\n    height: 64px;\r\n}\r\n\r\n@media only screen and (min-width: 1040px) {\r\n    header{\r\n        width: 80%;\r\n        padding: 0 10%;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row desktop-nav visible-for-large-and-up\" id=\"desktop-nav\"><div class=\"large-3 column\"><a href=\"/\" class=\"logo\"><i class=\"fa fa-space-shuttle fa-4x logo-icon\" aria-hidden=\"true\"></i> Space Co.</a></div><div class=\"large-6 column align-center\"><nav><ul> {% for section in sections %}<li><a href=\"/{{ section.address }}\" class=\"desktop-nav-button\">{{ section.name }}</a></li> {% else %} {% endfor %}</ul></nav></div><div class=\"large-3 column align-right\"><a href=\"\"><i class=\"fa fa-facebook-square fa-3x desktop-nav-social-media\" aria-hidden=\"true\"></i></a><a href=\"\"><i class=\"fa fa-twitter-square fa-3x desktop-nav-social-media\" aria-hidden=\"true\"></i></a><a href=\"\"><i class=\"fa fa-instagram fa-3x desktop-nav-social-media\" aria-hidden=\"true\"></i></a></div></div><div class=\"mobile-slide-out\" id=\"mobile-slide-out\"> {% for section in sections %} <a href=\"/{{ section.address }}\">{{ section.name }}</a> {% else %} {% endfor %}</div><div class=\"row mobile-nav visible-for-small-and-medium-only\" id=\"mobile-nav\"><div class=\"small-2 medium-2 column\"><a href=\"/\"><i class=\"fa fa-space-shuttle fa-4x display-block\" aria-hidden=\"true\"></i></a></div><div class=\"small-8 medium-8 column\"></div><div class=\"small-2 medium-2 column align-right\"><i class=\"fa fa-bars fa-3x burger-button\" aria-hidden=\"true\" id=\"burger-button\"></i></div></div>";

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25), __webpack_require__(26)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(2);

__webpack_require__(3);

__webpack_require__(4);

__webpack_require__(29);

__webpack_require__(31);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nunjucks = __webpack_require__(5);

nunjucks.configure('./', { autoescape: true });

var SiteFooter = function () {
    function SiteFooter() {
        _classCallCheck(this, SiteFooter);
    }

    _createClass(SiteFooter, [{
        key: 'render',
        value: function render() {
            var footer = document.getElementById('site-footer');
            footer.innerHTML = nunjucks.render('./SiteFooter.html');
        }
    }]);

    return SiteFooter;
}();

exports.default = SiteFooter;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./SiteFooter.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./SiteFooter.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "footer{\r\n    height: 200px;\r\n    word-wrap: 100%;\r\n    background: #000;\r\n    color: white;\r\n}\r\n\r\nfooter a{\r\n    color: white;\r\n    text-decoration: none;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<div class=\"wrapper\"><div class=\"row\"><div class=\"small-12 medium-12 large-12 column align-center\"><a href=\"\"><i class=\"fa fa-facebook-square fa-3x\" aria-hidden=\"true\"></i></a><a href=\"\"><i class=\"fa fa-twitter-square fa-3x\" aria-hidden=\"true\"></i></a><a href=\"\"><i class=\"fa fa-instagram fa-3x\" aria-hidden=\"true\"></i></a></div></div></div>";

/***/ })
/******/ ]);