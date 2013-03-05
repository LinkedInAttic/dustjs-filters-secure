/* encode with escapeHTML look for 
 *  1. extra tags on the page
 *  2. broken script tags
 */


/*
 * html encoding
 */

// test Doms
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


describe ('HTML encoded strings injected to a DOM', function() {
  // get the array of test strings and create an array of safe strings
  it ('should not have new nodes', function() {
    // expect Number of dom child nodes to equal 0
  });
  it ('should not be double encoded', function() {
    // expect Number of dom child nodes to equal 0
  });
});

describe ('JS encoded strings injected to a DOM', function() {
  // get the array of test strings and create an array of safe strings
  it ('should not have extra JS variables', function() {
    // expect Number of dom child nodes to equal 0
  });
  it ('should not be double encoded', function() {
    // expect Number of dom child nodes to equal 0
  });
});
// for (var i, len=aTestStrings.length; i<len; i++) {
//   // create a DOM
//
//   // 
//   // innerHTML the encode
// }
