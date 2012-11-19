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

  var escapeJs = (function(undefined) {
    // {}[],:-+. can be outside of JSON strings
    // \u2028\u2029 can break JavaScript strings: eval('("\u2028")')
    var jsonRE = /[\/<>&%\u0000\u2028\u2029*()'=!?`#]/g; // chars additionaly encoded by JSON.stringify
    var jsRE = /[^a-z0-9_\u0080-\u2027\u202a-\uffff]/ig; // chars encoded by jsEncode
    // if you change any of jsonRE or jsRE, check that this char in index
    var index = {
        "\t": "\\t",
        "\n": "\\n",
        "\r": "\\r",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
    };
    
    // precache chars for jsRE
    // jsRE includes jsonRE
    for (var i = 0; i < 128; i++) {
      var c = String.fromCharCode(i);
      if (index[c] === undefined && c.match(jsRE)) {
        index[c] = '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4);
      }
    }

    
    var jsEncode = function(s) {
      if (s === null || s === undefined) {
        return null;
      }
      var type = typeof s;
      if (type === 'number' || type === 'boolean') {
        return s + '';
      }
      return (s + '').replace(jsRE, function(c) {
        return index[c];
      });
    };

    // check that JSON.stringify is native
    if (typeof JSON !== 'undefined' && JSON.stringify && JSON.stringify('\\"\/<>&%\u0000\u2028\u2029*()\'=!?`#') === '"\\\\\\"/<>&%\\u0000\u2028\u2029*()\'=!?`#"') {
      var JSONstringify = JSON.stringify;
      jsEncode.JSONstringify = function() {
        return JSONstringify.apply(this, arguments).replace(jsonRE, function(c) {
          return index[c];
        });
      };
    }

    return jsEncode;
  })();



  filters = {
    temp: function(value) { return value; },
    h: function(value) { return escapeHtml(value); },
    j: function(value) { return escapeJs(value); }
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
