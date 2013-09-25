// Copyright (c) 2013, LinkedIn Corp.
// Released under the MIT License.
(function (dust) {
    /*
       * A modules that adds secure filters to Dust
       * @module dustjs-filters-secure
       * @require dustjs-linkedin
       * @return {Void}
       */
    "use strict";
    var filters,
        hex = {},
        c;

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    for (c = 0; c < 256; c += 1) {
        if (!((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95)) {
            hex[c] = c.toString(16).toUpperCase();
        }
    }
    hex[8232] = 2028;  //Line Separator
    hex[8233] = 2029;  //Paragraph Separator;

    function encodeString(s, format, skipChars) {
        var hexValue,
            i,
            out = "",
            type = typeof s,
            strlen;

        if (!s) {
            return null;
        }
        if (type === 'number' || type === 'boolean') {
            return s.toString();
        }
        if (type === 'string') {
            for (i = 0, strlen = s.length; i < strlen; i += 1) {
                hexValue = hex[parseInt(s.charCodeAt(i), 10)];
                if (hexValue && skipChars.indexOf(s[i]) === -1) {
                    out += format.replace("HH", hexValue);
                } else {
                    out += s[i];
                }
            }
            return out;
        }
        return s;
    }

    function decodeString(s, re) {

        if (!s) {
            return null;
        }
        var type = typeof s;
        if (type === 'number' || type === 'boolean') {
            return s.toString();
        }
        if (type === 'string') {
            return s.replace(/(&#x|%|\\|\\x)(2028|2029)(;|\s){0,1}/ig, function (match, p1, p2) {
                return String.fromCharCode(parseInt(p2, 16));
            })
                .replace(re, function (matchedStr) {
                    var ex_matched = matchedStr.match(/[A-F0-9]{2}/i);
                    return String.fromCharCode(parseInt(ex_matched, 16));
                });
        }
        return s;
    }

    /* private helper functions */

    /* setup escapeHTML and unescapeHTML */
    var escapeHTML, unescapeHTML;
    (function (undefined) {

        // this range of chars with will be replaced with HTML entities, if add symbol with code more than 127, check that it in index table
        var re = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u00a0<>'"`\\\[\]+\-=.:(){};,\/&\u007f\u2028\u2029]/g,
            index = {
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
            },
            i,
            c;

        // replace all control chars with the unknown replacement character
        for (i = 0; i < 0x20; i += 1) {
            c = String.fromCharCode(i);
            if (!index[c]) {
                index[c] = '&#xfffd;';
            }
        }

        // precache index
        for (i = 0x20; i < 128; i += 1) {
            c = String.fromCharCode(i);
            if (!index[c] && c.match(re)) {
                index[c] = '&#' + i + ';';
            }
        }

        escapeHTML = function (s) {
            if (!s) {
                return null;
            }
            var type = typeof s;
            if (type === 'number' || type === 'boolean') {
                return s.toString();
            }
            return (s.toString()).replace(re, function (c) {
                return index[c];
            });
        };

        unescapeHTML = function (s) {
            if (!s) {
                return null;
            }
            var type = typeof s;
            if (type === 'number' || type === 'boolean') {
                return s.toString();
            }
            return (s.toString()).
                replace(/&nbsp;/g, '\u00a0').
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

    /* setup escapeHTMLAttribute and unescapeHTMLAttribute */
    function escapeHTMLAttribute(s) {
        return encodeString(s, "&#xHH;", "");
    }

    function unescapeHTMLAttribute(s) {
        return decodeString(s, /&#x[A-F0-9]{2};/gi);
    }

    /* setup both escapeJS and JSONStringify */
    var escapeJS, customJsonStringify = (JSON && JSON.stringify) ? JSON.stringify : function () { throw new Error('JSON.stringify not found'); };
    (function (undefined) {
        // {}[],:-+. can be outside of JSON strings
        // \u2028\u2029 can break JavaScript strings: eval('("\u2028")')
        var jsonRE = /[\/<>&%\u0000\u2028\u2029*()'=!?`#]/g, // chars additionally encoded by JSON.stringify
            jsRE = /[^a-z0-9_\u0080-\u2027\u202a-\uffff]/ig, // chars encoded by jsEncode
        // if you change any of jsonRE or jsRE, check that this char in index
            index = {
                '\t': '\\t',
                '\n': '\\n',
                '\r': '\\r',
                '\u2028': '\\u2028',
                '\u2029': '\\u2029'
            },
            nativeStringify,
            i,
            c;

        // precache chars for jsRE
        // jsRE includes jsonRE
        for (i = 0; i < 128; i += 1) {
            c = String.fromCharCode(i);
            if (!index[c] && c.match(jsRE)) {
                index[c] = '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4);
            }
        }


        /* escapeJS */
        escapeJS = function (s) {
            if (s === null || s === undefined) {
                return null;
            }
            var type = typeof s;
            if (type === 'number' || type === 'boolean') {
                return s.toString();
            }
            return (s.toString()).replace(jsRE, function (c) {
                return index[c];
            });
        };

        /* custom Stringify */
        // check that JSON.stringify is native
        if (JSON && JSON.stringify && JSON.stringify('\\"\/<>&%\u0000\u2028\u2029*()\'=!?`#') === '"\\\\\\"/<>&%\\u0000\u2028\u2029*()\'=!?`#"') {
            nativeStringify = JSON.stringify;
            customJsonStringify = function () {
                return nativeStringify.apply(this, arguments).replace(jsonRE, function (c) {
                    return index[c];
                });
            };
        }
    }());

      /* setup escapeCSS, unescapeCSS */
    function escapeCSS(s) {
        return encodeString(s, "\\HH ", "");
    }

    function unescapeCSS(s) {
        return decodeString(s, /\\[A-F0-9]{2} /gi);
    }

    /* setup escapeURIComponent, unescapeURIComponent */
    function escapeURIComponent(s) {
        return encodeString(s, "%HH", "%+");	//added %, +(white space) as skip chars to escape to prevent the double escaping if the string is already escaped by any means
    }

    function unescapeURIComponent(s) {
        return decodeString(s, /%[A-F0-9]{2}/gi);
    }

    /*setup escapeURL */
    function escapeURL(s) {
        var out = '',
            pos,
            pos_equal,
            pos_amps,
            pos_hash,
            temp_str,
            type = typeof s;

        if (!s) {
            return null;
        }
        if (type === 'number' || type === 'boolean') {
            return s.toString();
        }
        if (type === 'string') {
            pos = s.indexOf('?');

            if (pos === -1) {
                return escapeHTMLAttribute(s);
            }
            out += escapeHTMLAttribute(s.substring(0, pos + 1));

            pos_equal = s.indexOf('=', pos);
            pos_amps = s.indexOf('&', pos_equal);
            pos += 1;
            while ((pos_equal < pos_amps) && (pos_equal !== -1 || pos_amps !== -1)) {
                temp_str = s.substring(pos, pos_equal + 1);
                out += escapeHTMLAttribute(temp_str);
                temp_str = s.substring(pos_equal + 1, pos_amps);
                out += escapeURIComponent(temp_str);
                pos = pos_amps;
                pos_equal = s.indexOf('=', pos);
                pos_amps = s.indexOf('&', pos_equal);
            }
            if (pos_equal !== -1) {
                temp_str = s.substring(pos, pos_equal + 1);
                out += escapeHTMLAttribute(temp_str);
                temp_str = s.substring(pos_equal + 1);
                pos_hash = temp_str.indexOf('#'); // Incase of URLs like  www.example.com?name1=value1&name2=value2&.....&namek=valuek#valuen
                if (pos_hash === -1) {
                    out += escapeURIComponent(temp_str);
                } else {
                    out += escapeURIComponent(temp_str.substring(0, pos_hash));
                    out += escapeHTMLAttribute(temp_str.substring(pos_hash));
                }
            }
            return out;
        }
        return s;
    }

    filters = {
        h: function (value) { return escapeHTML(value); },
        ha: function (value) { return escapeHTMLAttribute(value); },  // This filter to be used for escaping HTML Attributes.
        j: function (value) { return escapeJS(value); },
        uc: function (value) { return escapeURIComponent(value); },
        js: function (value) { return customJsonStringify(value); },
        ul: function (value) {return escapeURL(value); },           //filter for URL escaping
        x: function (value) { return escapeCSS(value); }            //filter for CSS content escaping
    };

    /* Be nice if filters is already defined, but not too nice ... clobber over what there */
    if (dust.filters) {
        var filterName;
        for (filterName in filters) {
            if (filters.hasOwnProperty(filterName)) {
                dust.filters[filterName] = filters[filterName];
            }
        }
    } else {
        dust.filters = filters;
    }

    /* expose an unescapeHTML, unescapeHTMLAttribute, escapeURIComponent  methods */
    dust.unescapeHTML = unescapeHTML;
    dust.unescapeHTMLAttribute = unescapeHTMLAttribute;
    dust.unescapeCSS = unescapeCSS;
    dust.unescapeURIComponent = unescapeURIComponent;


    /* We are writing to the `dust` object so we don't need to return anything */
}(typeof exports === 'object' ? require('dustjs-linkedin') : dust));
