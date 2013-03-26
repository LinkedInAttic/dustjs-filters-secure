var arrayOfUnrecoverableStrings = [
    '\u0000', // non printable utf-8 characters
    '~`{}[]\\|/<>\n\t\v' // special symbols
];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = arrayOfUnrecoverableStrings;
}