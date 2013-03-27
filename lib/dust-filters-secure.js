// Copyright (c) 2013, LinkedIn Corp.
// Released under the MIT License.

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

  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }

  /* private helper functions */

  /* setup escapeHTML and unescapeHTML */
  var escapeHTML, unescapeHTML;
  (function(undefined) {
    
    var index = {
      '\t': '\t',
      '\r': '\r',
      '\n': '\n',
      '\u00a0': '&nbsp;',
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      '\u007f': '&#xfffd;', //map delete to unknown
      '\u2028': '&#x2028;', //line separator
      '\u2029': '&#x2029;' //paragraph separator
    }, i, c;
    
    // replace all control chars with the unknown replacement character
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

    escapeHTML = function(s) {
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

    unescapeHTML = function(s) {
      if (s === null || s === undefined) {
        return null;
      }
      var type = typeof s;
      if (type === 'number' || type === 'boolean') {
        return s + '';
      }
      return (s + '').
          replace( /&nbsp;/g, '\u00a0').
          replace(/&lt;/g, '<').
          replace(/&gt;/g, '>').
          replace(/&quot;/g, '"').
          replace(/&#xfffd;/g, '\u007f').
          replace(/&#x2028;/, '\u2028').
          replace(/&#x2029;/, '\u2029').
          replace(/&#39;/g, '\'').
          replace(/&#40;/g, '(').
          replace(/&#41;/g, ')').
          replace(/&#43;/g, '+').
          replace(/&#44;/g, ',').
          replace(/&#45;/g, '-').
          replace(/&#46;/g, '.').
          replace(/&#47;/g, '/').
          replace(/&#58;/g, ':').
          replace(/&#59;/g, ';').
          replace(/&#61;/g, '=').
          replace(/&#91;/g, '[').
          replace(/&#92;/g, '\\').
          replace(/&#93;/g, ']').
          replace(/&#96;/g, '`').
          replace(/&#123;/g, '{').
          replace(/&#125;/g, '}').
          replace(/&amp;/g, '&'); // replace & last
    };
  }());

  /* setup both escapeJS and JSONStringify */
  var escapeJS, customJsonStringify = (JSON && JSON.stringify)? JSON.stringify : function() { throw new Error('JSON.stringify not found'); } ;
  (function(undefined) {
    // {}[],:-+. can be outside of JSON strings
    // \u2028\u2029 can break JavaScript strings: eval('("\u2028")')
    var jsonRE = /[\/<>&%\u0000\u2028\u2029*()'=!?`#]/g; // chars additionaly encoded by JSON.stringify
    var jsRE = /[^a-z0-9_\u0080-\u2027\u202a-\uffff]/ig; // chars encoded by jsEncode
    // if you change any of jsonRE or jsRE, check that this char in index
    var index = {
          '\t': '\\t',
          '\n': '\\n',
          '\r': '\\r',
          '\u2028': '\\u2028',
          '\u2029': '\\u2029'
        };

    // precache chars for jsRE
    // jsRE includes jsonRE
    for (var i = 0; i < 128; i++) {
      var c = String.fromCharCode(i);
      if (index[c] === undefined && c.match(jsRE)) {
        index[c] = '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4);
      }
    }


    /* escapeJS */
    escapeJS = function(s) {
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

    /* custom Stringify */
    // check that JSON.stringify is native
    if (JSON && JSON.stringify && JSON.stringify('\\"\/<>&%\u0000\u2028\u2029*()\'=!?`#') === '"\\\\\\"/<>&%\\u0000\u2028\u2029*()\'=!?`#"') {
      var nativeStringify = JSON.stringify;
      customJsonStringify = function() {
        return nativeStringify.apply(this, arguments).replace(jsonRE, function(c) {
          return index[c];
        });
      };
    }
  })();


  // http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:encodeURIComponent
  // compatible with OAuth signature calculation
  var localEncodeURIComponent = function() {
    return encodeURIComponent.apply(this, arguments).replace(/[!'()]/g, escape).replace(/\*/g, '%2A');
  };
      


  filters = {
    h: function(value) { return escapeHTML(value); },
    j: function(value) { return escapeJS(value); },
    uc: function(value) { return localEncodeURIComponent(value); },
    js: function(value) { return customJsonStringify(value); }
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

  /* expose an unescapeHTML method */
  dust.unescapeHTML = unescapeHTML;

  /* We are writing to the `dust` object so we don't need to return anything */
}));
