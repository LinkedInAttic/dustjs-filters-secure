var arrayOfBadStrings = [
    'don\'t AT&T "double quotes", semicolon; !@#$%^&*()_+=?.:', // not so special symbols
    '\u1234\u3434\x4534\x2324', // utf-8 characters
    ' ' //
    ];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = arrayOfBadStrings;
}
