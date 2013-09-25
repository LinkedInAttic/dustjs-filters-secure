var arrayOfBadStrings = [
    'don\'t AT&T "double quotes", semicolon; !@#$%^&*()_+=?.:', // not so special symbols
    '\u1234\u3434\x4534\x2324\u2028\u2029', // utf-8 characters
    ' ' //
    ];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = arrayOfBadStrings;
}
