// Compiler directive for UglifyJS.  See library.const.js for more info.
if (typeof DEBUG === 'undefined') {
  DEBUG = true;
}

// LIBRARY-GLOBAL CONSTANTS
//
// These constants are exposed to all library modules.


// GLOBAL is a reference to the global Object.
var Fn = Function, GLOBAL = new Fn('return this')();


// LIBRARY-GLOBAL METHODS
//
// The methods here are exposed to all library modules.  Because all of the
// source files are wrapped within a closure at build time, they are not
// exposed globally in the distributable binaries.


/**
 * A no-op function.  Useful for passing around as a default callback.
 */
function noop() { }


/**
 * Init wrapper for the core module.
 * @param {Object} context The Object that the library gets attached to in
 * library.init.js.  If the library was not loaded with an AMD loader such as
 * require.js, this is the global Object.
 */
function initLibraryCore(context) {

  'use strict';

// PRIVATE MODULE CONSTANTS
//


// An example of a CONSTANT variable;
  var TWITTER_SHARE_URL = "https://twitter.com/intent/tweet?";


// PRIVATE MODULE METHODS
//
// These do not get attached to a prototype.  They are private utility
// functions.

  /* Events Binding Method */
  function bindEvent(element, type, handler) {
    if (element.addEventListener)
      element.addEventListener(type, handler, false);
    else
      element.attachEvent('on' + type, handler);
  }

  /* Display the Share Button and position it in the screen */
  function displayShareButton(t) {
    var floatElementHeight = parseInt(this.config.floatElement.style.height);

    this.config.floatElement.style.left = (this.config.mouseDownXPosition + this.config.mouseUpXPosition) / 2
                                          - floatElementHeight / 2 + "px";

    this.config.floatElement.style.top = Math.min(
      t.anchorNode.parentElement.offsetTop,
      t.focusNode.parentElement.offsetTop) - floatElementHeight + "px";

    this.config.floatElement.style.display = "block";
  }

  /* Create and open a popup */
  function openPopup(e) {
    e.preventDefault();

    var width = 575,
      height = 400,
      left = (window.innerWidth - width) / 2,
      top = (window.innerHeight - height) / 2,
      url = config.shareUrl,
      opts = 'status=1' +
             ',width=' + width +
             ',height=' + height +
             ',top=' + top +
             ',left=' + left;

    window.open(url, 'twitter', opts);
  }

  /**
   * This is the constructor for the Library Object.  Please rename it to
   * whatever your library's name is.  Note that the constructor is also being
   * attached to the context that the library was loaded in.
   * @param {Object} opt_config Contains any properties that should be used to
   * configure this instance of the library.
   * @constructor
   */
  var Library = context.Quoteme = function (opt_config) {

    this.mouseUpXPosition = null;
    this.mouseDownXPosition = null;

    this.config = {
      "container": ".article",
      /**
       * /path/to/tw.png | leave it blank for Github's raw img on
       * https://raw.githubusercontent.com/kbariotis/quoteme.js/master/example/tw.png
       * @type {string}
       */
      "pathToImg": "",
      "viaParam": "kbariotis", /* via param on twitter post */
      "shareUrl": ""
    };

    opt_config = opt_config || {};

    for (var key in opt_config)
      if (opt_config.hasOwnProperty(key) && this.config.hasOwnProperty(key))
        this.config[key] = opt_config[key];

    if (!document.querySelector(this.config.container))
      throw new Error("No containers found on");

    this.floatElement = this.createShareElement();
    this.floatElement = this.styleShareElement(this.floatElement);

    this.bindUIEvents();

    return this;
  };

  Library.prototype.bindUIEvents = function () {
    bindEvent(document.querySelector(this.config.container), "mouseup", this.getSelection.bind(this));
    bindEvent(document.querySelector(this.config.container), "mousedown", this._setMouseDownPosition);
    bindEvent(this.floatElement, "click", openPopup);
  };

  Library.prototype.getSelection = function (e) {

    /* Keep track of where selection ended */
    this._setMouseUpPosition(e);

    var t = document.getSelection();

    if (!t.toString() || e.target.tagName === "A") {
      this.floatElement.style.display = "none";
      return false;
    }

    var selectedText = t.toString();

    /*
     * First, calculate the length of link and via nickname,
     * then cut the selected on the remaining characters
     */
    var length = parseInt(this.config.viaParam.length) +
                 parseInt(document.location.href.length) + 7;
    /* 7 for the `via` word, some spaces and @*/

    if (parseInt(selectedText.length) + length > 140) {
      /* Remove new lines */
      selectedText = selectedText.substring(0, 135 - parseInt(length));
    }

    /* add `...` and `"` */
    selectedText = "\"" + selectedText.replace(/(\r\n|\n|\r)/gm, "") + "...\"";

    /* Glue the pieces together */
    this.config.shareUrl = TWITTER_SHARE_URL;
    this.config.shareUrl += "text=" + encodeURIComponent(selectedText);
    this.config.shareUrl += "&via=" + encodeURIComponent(this.config.viaParam);
    this.config.shareUrl += "&url=" + document.location;

    displayShareButton(t);

    return true;
  };

  /**
   * Create an Anchor Element
   * @returns {HTMLElement}
   */
  Library.prototype.createShareElement = function () {
    var e = document.createElement("a");
    e.href = "#";
    document.body.appendChild(e);

    return e;
  };

  /**
   * @returns {HTMLElement}
   */
  Library.prototype.getFloatElement = function () {
    return this.floatElement;
  };

  /**
   * Keep track of where selection started
   * @param e Event
   * @returns {context.Quoteme}
   * @private
   */
  Library.prototype._setMouseDownPosition = function (e) {
    this.mouseDownXPosition = e.pageX;

    return this;
  };

  /**
   * Keep track of where selection ended
   * @param e Event
   * @returns {context.Quoteme}
   * @private
   */
  Library.prototype._setMouseUpPosition = function (e) {
    this.mouseUpXPosition = e.pageX;

    return this;
  };

  /**
   * @returns {HTMLElement}
   */
  Library.prototype.styleShareElement = function (e) {
    e.style.position = "absolute";
    e.style.display = "none";
    e.style.width = "40px";
    e.style.height = "40px";
    e.style.background = "rgba(0,0,0,0.5)";
    var pathToImg = !!this.config.pathToImg ?
                    this.config.pathToImg :
                    "https://raw.githubusercontent.com/kbariotis/quoteme.js/master/example/tw.png";
    e.style.backgroundImage = "url(" + pathToImg + ")";
    e.style.backgroundRepeat = "no-repeat";
    e.style.backgroundPosition = "center";
    e.style.borderRadius = "4%";
    e.style.pointer = "cursor";

    return e;
  };

// DEBUG CODE
//
// With compiler directives, you can wrap code in a conditional check to
// ensure that it does not get included in the compiled binaries.  This is
// useful for exposing certain properties and methods that are needed during
// development and testing, but should be private in the compiled binaries.


  if (DEBUG) {
//    GLOBAL.corePrivateMethod = corePrivateMethod;
  }

}
