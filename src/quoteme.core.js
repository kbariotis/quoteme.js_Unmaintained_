// Compiler directive for UglifyJS.  See library.const.js for more info.
if ( typeof DEBUG === 'undefined' ) {
  DEBUG = true;
}

var mouseUpXPosition,
  mouseDownXPosition;

// LIBRARY-GLOBAL CONSTANTS
//
// These constants are exposed to all library modules.

// GLOBAL is a reference to the global Object.
var Fn = Function, GLOBAL = new Fn( 'return this' )();


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
function initLibraryCore( context ) {

  'use strict';

// PRIVATE MODULE CONSTANTS
//


// An example of a CONSTANT variable;
  var CORE_CONSTANT = true;


// PRIVATE MODULE METHODS
//
// These do not get attached to a prototype.  They are private utility
// functions.

  /* Events Binding Method */
  function bindEvent( element, type, handler ) {
    if ( element.addEventListener )
      element.addEventListener( type, handler, false );
    else
      element.attachEvent( 'on' + type, handler );
  }

  /**
   * Keep track of where selection started
   * @param e
   */
  function setMouseDownPosition( e ) {
    mouseDownXPosition = e.pageX;
  }

  /* Display the Share Button and position it in the screen */
  function displayShareButton( t ) {
    var floatElementHeight = parseInt( this.config.floatElement.style.height );

    this.config.floatElement.style.left = (this.config.mouseDownXPosition + this.config.mouseUpXPosition) / 2
                                            - floatElementHeight / 2 + "px";

    this.config.floatElement.style.top = Math.min(
      t.anchorNode.parentElement.offsetTop,
      t.focusNode.parentElement.offsetTop ) - floatElementHeight + "px";

    this.config.floatElement.style.display = "block";
  }

  /* Style the Share Button */
  function styleShareElement( config ) {
    config.floatElement.style.position = "absolute";
    config.floatElement.style.display = "none";
    config.floatElement.style.width = "40px";
    config.floatElement.style.height = "40px";
    config.floatElement.style.background = "rgba(0,0,0,0.5)";
    var pathToImg = !!config.pathToImg ?
      config.pathToImg :
      "https://raw.githubusercontent.com/kbariotis/quoteme.js/master/example/tw.png";
    config.floatElement.style.backgroundImage = "url(" + pathToImg + ")";
    config.floatElement.style.backgroundRepeat = "no-repeat";
    config.floatElement.style.backgroundPosition = "center";
    config.floatElement.style.borderRadius = "4%";
    config.floatElement.style.pointer = "cursor";
  }

  /* Create and open a popup */
  function openPopup( e ) {
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

    window.open( url, 'twitter', opts );
  }

  /**
   * This is the constructor for the Library Object.  Please rename it to
   * whatever your library's name is.  Note that the constructor is also being
   * attached to the context that the library was loaded in.
   * @param {Object} opt_config Contains any properties that should be used to
   * configure this instance of the library.
   * @constructor
   */
  var Library = context.Quoteme = function ( opt_config ) {

      this.config = {
        "container": ".article",
        /**
         * /path/to/tw.png | leave it blank for Github's raw img on
         * https://raw.githubusercontent.com/kbariotis/quoteme.js/master/example/tw.png
         * @type {string}
         */
        "pathToImg": "",
        "viaParam": "kbariotis", /* via param on twitter post */
        "twShareUrl": "https://twitter.com/intent/tweet?",
        "shareUrl": "",
        "floatElement": null, /* Anchor Element represents Share button */
        "mouseUpXPosition": null, /* Keep notes about where selection start and ends */
        "mouseDownXPosition": null
      };


      opt_config = opt_config || {};

      for ( var key in opt_config )
        if ( opt_config.hasOwnProperty( key ) && this.config.hasOwnProperty( key ) )
          this.config[key] = opt_config[key];


      // INSTANCE PROPERTY SETUP
      //
      // Your library likely has some instance-specific properties.  The value of
      // these properties can depend on any number of things, such as properties
      // passed in via opt_config or global state.  Whatever the case, the values
      // should be set in this constructor.

      // Instance variables that have a leading underscore mean that they should
      // not be modified outside of the library.  They can be freely modified
      // internally, however.  If an instance variable will likely be accessed
      // outside of the library, consider making a public getter function for it.
      this._readOnlyVar = 'read only';

      // Instance variables that do not have an underscore prepended are
      // considered to be part of the library's public API.  External code may
      // change the value of these variables freely.
      this.readAndWrite = 'read and write';

      if ( !document.querySelector( this.config.container ) )
        throw new Error( "No containers found on" );

      this.config.floatElement = document.createElement( "a" );
      this.config.floatElement.href = "#";
      document.body.appendChild( this.config.floatElement );

      styleShareElement( this.config );

      this.bindUIEvents();

      return this;
    }
    ;


// LIBRARY PROTOTYPE METHODS
//
// These methods define the public API.


  /**
   * An example of a protoype method.
   * @return {string}
   */
  Library.prototype.getReadOnlyVar = function () {
    return this._readOnlyVar;
  };


  /**
   * This is an example of a chainable method.  That means that the return
   * value of this function is the library instance itself (`this`).  This lets
   * you do chained method calls like this:
   *
   * var myLibrary = new Library();
   * myLibrary
   *   .chainableMethod()
   *   .chainableMethod();
   *
   * @return {Library}
   */
  Library.prototype.chainableMethod = function () {
    return this;
  };

  Library.prototype.bindUIEvents = function () {
    bindEvent( document.querySelector( this.config.container ), "mouseup", this.getSelection.bind(this) );
    bindEvent( document.querySelector( this.config.container ), "mousedown", this.setMouseDownPosition );
    bindEvent( this.config.floatElement, "click", openPopup );
  };

  Library.prototype.getSelection = function ( e ) {

    /* Keep track of where selection ended */
    mouseUpXPosition = e.pageX;

    var t = document.getSelection();

    if ( !t.toString() || e.target.tagName === "A" ) {
      this.config.floatElement.style.display = "none";
      return false;
    }

    var selectedText = t.toString();

    /*
     * First, calculate the length of link and via nickname,
     * then cut the selected on the remaining characters
     */
    var length = parseInt( config.viaParam.length ) +
                 parseInt( document.location.href.length ) + 7;
    /* 7 for the `via` word, some spaces and @*/

    if ( parseInt( selectedText.length ) + length > 140 ) {
      /* Remove new lines */
      selectedText = selectedText.substring( 0, 135 - parseInt( length ) );
    }

    /* add `...` and `"` */
    selectedText = "\"" + selectedText.replace( /(\r\n|\n|\r)/gm, "" ) + "...\"";

    /* Glue the pieces together */
    this.config.shareUrl = twShareUrl;
    this.config.shareUrl += "text=" + encodeURIComponent( selectedText );
    this.config.shareUrl += "&via=" + encodeURIComponent( this.config.viaParam );
    this.config.shareUrl += "&url=" + document.location;

    displayShareButton( t );

    return true;
  }
  ;


// DEBUG CODE
//
// With compiler directives, you can wrap code in a conditional check to
// ensure that it does not get included in the compiled binaries.  This is
// useful for exposing certain properties and methods that are needed during
// development and testing, but should be private in the compiled binaries.


  if ( DEBUG ) {
//    GLOBAL.corePrivateMethod = corePrivateMethod;
  }

}
