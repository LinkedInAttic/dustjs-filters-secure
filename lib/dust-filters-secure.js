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
          replace( '&nbsp;', '\u00a0').
          replace('&lt;', '<').
          replace('&gt;', '>').
          replace('&amp;', '&').
          replace('&quot;', '"').
          replace('&#xfffd;', '\u007f').
          replace('&#x2028;', '\u2028').
          replace('&#x2029;', '\u2029').
          replace('&#39;', '"').
          replace('&#40;', '\'').
          replace('&#41;', '(').
          replace('&#43;', ')').
          replace('&#44;', '+').
          replace('&#45;', ',').
          replace('&#46;', '-').
          replace('&#47;', '.').
          replace('&#58;', '/').
          replace('&#59;', ':').
          replace('&#61;', ';').
          replace('&#91;', '=').
          replace('&#92;', '[').
          replace('&#93;', '\\').
          replace('&#96;', ']').
          replace('&#123;', '`').
          replace('&#125;', '{');
    };
  }());

  /* setup both escapeJs and JSONStringify */
  var escapeJs, customJsonStringify = (JSON && JSON.stringify)? JSON.stringify : function() { throw new Error('JSON.stringify not found'); } ;
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
    escapeJs = function(s) {
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


  /*
   * This function checks protocol of URL and if it's not safe adds ./ before like ./jAvascript:alert(1)
   * don't use HTML encoded URLs here
   * {website|h|url} is wrong
   * you can use it as <a href="{website|url}">website</a>
   * or <script>var url = '{website|url|j|s}'; a.href = x;</script>
   */
  var sanitizeURL = (function(undefined) {
    // symbols which will be replaced or encoded to URI
    var re = /[\u0000-\u0020\u001f`'"<>()\[\]{}\\,]/g,
        index = {
          '\t': '%09',
          '\r': '%0D',
          '\n': '%0A',
          '\u001f': '\ufffd'
        },
        i, c;
    
    // replace all control chars with safe one
    for (i = 0; i < 0x20; i++) {
      c = String.fromCharCode(i);
      if (index[c] === undefined) {
        index[c] = '\ufffd';
      }
    }
    
    for (i = 0x20; i < 128; i++) {
      c = String.fromCharCode(i);
      if (index[c] === undefined && c.match(re)) {
        index[c] = escape(c); // escape only receives ASCII chars here so it behaves well
      }
    }
    return function(url) {
      if (url === null || url === undefined) {
        return null;
      }
      url = url.trim()  // trim method has been shimmed for IE
        .replace(re, function(c) {
          return index[c];
        })
        .replace(/[\s\u2028\u2029]/g, '%20') // all custom spaces must be URI encoded
        .replace(/&#/g, '#') // in normals URLs this situation possible only for not URI encoded HTML entities http://w3.org/test?a=b&#x3c;
        .replace(/(&[a-zA-Z]+);/g, '$1%3B') // we encode semi-colon if it looks like HTML entity  javascript&NewLine;&Tab;&colon;&apos; but not &quot&lt&gt&amp
        .replace(/^([\s\S]{0,14});/g, '$1%3B') // https://;URL=javascript:alert(1)
        .replace(/(&[quolgQUOLG]{1,3})t/g, '$1%74') // &qUot, &lt, &Gt we encode t and T if it looks like HTML entity, because some of them can be used without semi-colon
        .replace(/(&[quolgQUOLG]{1,3})T/g, '$1%54') // &quoT, &LT, &gT
        .replace(/%(?=[^A-Fa-f0-9]|[A-Fa-f0-9][^A-Fa-f0-9]|[\s\S]?$)/g, '%25'); // encode all not correct URI encoded strings like %%1%g1
  
      var lc = url.toLowerCase();
      // if URL starts not from http, mailto, ftp and #hash, ?search, //UNC, /root, ../relative and have scheme:
      if (!/^(?:http|mailto|ftp|[#\/.?])/.test(lc) && /^[^?\/#:]+?:/.test(lc)) {
        // if URL starts from wrong scheme or have encoded entity
        if (/^(?:about|cdl|dvd|local|mhtml|mk|ms-help|ms-its|tv|res|its|javascript|data|vbs|vbscript|feed|java|jar|file|[a-z]):/.test(lc) || !/^[a-z0-1\-_.]+?:/.test(lc)) {
          url = './' + url;
        }
      }
      
      return url;
    };
  }());

  // http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:encodeURIComponent
  // compatible with OAuth signature calculation
  var localEncodeURIComponent = function() {
    return encodeURIComponent.apply(this, arguments).replace(/[!'()]/g, escape).replace(/\*/g, '%2A');
  };
      


  filters = {
    temp: function(value) { return value; },
    h: function(value) { return escapeHTML(value); },
    j: function(value) { return escapeJs(value); },
    url: function(value) { return sanitizeURL(value); },
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

  /* We are writing to the `dust` object so we don't need to return anything */
}));
