//
// Dust-filters-secure - Additional functionality for dustjs-linkedin package v0.0.1
//
// Copyright (c) 2012, LinkedIn
// Released under the MIT License.
//

/*
 * Uses CommonJS, Node, AMD or browser globals to create a module
 * per pattern of UMD
 * https://github.com/umdjs/umd/
 * */
(function (root, factory) {
  if (typeof exports === 'object') {
    //CommonJS
    factory(require('dustjs-linkedin'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['dustjs-linkedin'], factory);
  } else {
    // Browser globals (root is window)
    factory(root.dust);
  }
}(this, function(dust) {

  /*
   * A modules that adds secure filters to Dust
   * @module dustjs-filters-secure
   * @require dustjs-linkedin
   * @return undefined
   */

  var filters = {
    temp: function(value) { return value; }
    // h: function(value) { return dust.escapeHtml(value); },
    // j: function(value) { return dust.escapeJs(value); },
    // url: function(value) { return dust.sanitizeURL(value); },
    // uc: function(value) { return dust.encodeURIComponent(value); },
    // js: function(value) { return dust.JSONstringify(value); },
  };

  /* Be nice if filters is already defined, but not too nice ... clobber over what there */
  if (dust.filters){
    for (var filterName in filters){
      if (filters.hasOwnProperty(filterName)){
        dust.filters[filterName] = filters[filterName];
      }
    }
  } else {
    dust.filters = filters;
  }

  /* We are writing to the `dust` object so we don't need to return anything */
}));
