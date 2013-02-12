var arrayOfJsStrings = [
  '\' var xss=true;',  //break out of single quotes
  '" var xss=true;',  //break out of double quotes
  'var d = function{){',
  '};',
  'debugger',
  'console.log(\'something here\')',
  'eval(\'bad\')',
  'return'
];
module.exports = arrayOfJsStrings;
