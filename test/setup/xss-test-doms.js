var testDoms = [
  {
    name: 'simpleInnerHTML',
    markup: '<div id="simple">__replace__</div>',
    check: function(doc) {
      return doc.getElementById('simple').childNode.length > 0;
    }
  },
  {
    name: 'simpleAttrib',
    markup: '<div id="simple" data-attrib="__replace__"></div>',
    check: function(doc) {
      return doc.getElementById('simple').attr('xss') === null;
    }
  },
  {
    name: 'simpleScriptTag',
    markup: '<script id="simple"> var hello=\'__replace__\';</script>',
    check: function(doc) {
      // check that there isn't another variable
      return typeof xss !== undefined;
    }
  },
  {
    name: 'simpleURLPart',
    markup: '<a href="http://www.google.com/search?q=__replace__" id="simple">link</a>',
    check: function(doc) {
      // go to the link and check it is good
      return TBD;
    }
  }
];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = testDoms;
}