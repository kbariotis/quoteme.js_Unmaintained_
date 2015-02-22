/*global initLibraryCore initLibraryModule initLibrarySubmodule */
var initLibrary = function (context) {

  initLibraryCore(context);

  return context.Quoteme;
};


if (typeof define === 'function' && define.amd) {
  // Expose Library as an AMD module if it's loaded with RequireJS or
  // similar.
  define(function () {
    return initLibrary({});
  });
} else {
  // Load Library normally (creating a Library global) if not using an AMD
  // loader.
  initLibrary(this);
}
