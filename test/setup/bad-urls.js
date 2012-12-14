var arrayofUrls = [
  'scp://foo', // not an nice protocol
  '" foo="bar"' //trying to bust out of an href
];
module.exports = arrayofUrls;
