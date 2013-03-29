var arrayOfBadUrls = [
  'scp://foo', // not an nice protocol
  '" foo="bar"' //trying to bust out of an href
];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = arrayOfBadUrls;
}
