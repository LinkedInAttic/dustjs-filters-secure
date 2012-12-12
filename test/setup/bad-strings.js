var arrayofBadStrings = [
    'don\'t AT&T "double quotes", semicolon; !@#$%^&*()_+=?.:', // not so special symbols
    '~`{}[]\\|/<>\n\t\v', // special symbols
    '\u1234\u3434\x4534\x2324', // utf-8 characters
    '\u0000', // non printable utf-8 characters
    ' ' //
    ];
module.exports = arrayofBadStrings;
