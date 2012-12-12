var arrayofHTMLStrings = [
  '" class="xss"',  // break out of attributes
  '\' class="xss"',  // break out of attributes
  '</script><a class="xss">xss</a>' //break out of script blocks
];
module.exports = arrayofHTMLStrings;
