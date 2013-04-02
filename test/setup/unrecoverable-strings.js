var arrayOfUnrecoverableStrings = [
    '\u0000', // non printable utf-8 characters
    '~`{}[]\\|/<>\n\t\v' // special symbols
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = arrayOfUnrecoverableStrings;
}