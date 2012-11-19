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
  var filters = {};


  /* private helper functions */
  var escapeHtml = (function(undefined) {
    
    var index = {
      '\t': '\t',
      '\r': '\r',
      '\n': '\n',
      '\u00a0': '&nbsp;',
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      '\u007f': '&#xfffd;',
      '\u2028': '&#x2028;',
      '\u2029': '&#x2029;'
    }, i, c;
    
    // replace all control chars with safe one
    for (i = 0; i < 0x20; i++) {
      c = String.fromCharCode(i);
      if (index[c] === undefined) {
        index[c] = '&#xfffd;';
      }
    }
    
    // this range of chars with will be replaced with HTML entities, if add symbol with code more than 127, check that it in index table
    var re = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u00a0<>'"`\\\[\]+\-=.:(){};,\/&\u007f\u2028\u2029]/g;
    
    // precache index
    for (i = 0x20; i < 128; i++) {
      c = String.fromCharCode(i);
      if (index[c] === undefined && c.match(re)) {
        index[c] = '&#' + i + ';';
      }
    }

    return function(s) {
      if (s === null || s === undefined) {
        return null;
      }
      var type = typeof s;
      if (type === 'number' || type === 'boolean') {
        return s + '';
      }
      return (s + '').replace(re, function(c) {
        return index[c];
      });
    };
  }());



  filters = {
    temp: function(value) { return value; },
    h: function(value) { return escapeHtml(value); }
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
