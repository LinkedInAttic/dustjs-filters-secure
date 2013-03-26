var arrayOfSimpleHTMLStrings = [ 
  '<div id="foo"><h1><b>here</b></h1></div>', 
  '<script type="text/javascript"> var a = 123, path = \'/location/path.url\';</script>' 
];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = arrayOfSimpleHTMLStrings;
}
