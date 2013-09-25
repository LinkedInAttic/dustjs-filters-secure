# dustjs-filters-secure
 -----------

This module enhances the existing and adds extra secure filters to `dust` core(dustjs-linkedin) to prevent [XSS (Cross Site Scripting) attacks] (http://en.wikipedia.org/wiki/Cross-site_scripting).
 
According to OWASP standard guidelines for preventing XSS attacks. All the untrusted data (dynamic content goes to outgoing HTML) should be escaped based on the context in which they are being put into the HTML.
 
 Why context based escaping is needed and HTML entitity escaping alone is not sufficient?

HTML entity escaping is okay for untrusted data that you put in the body of the HTML document, such as inside a tag. It even sort of works for untrusted data that goes into attributes, particularly if you're religious about using quotes around your attributes. But HTML entity encoding doesn't work if you're putting untrusted data inside a `<script>` tag anywhere, or an event handler attribute like onmouseover, or inside CSS, or in a URL. So even if you use an HTML entity escaping method everywhere, you are still most likely vulnerable to XSS. You MUST use the escape syntax for the part of the HTML document you're putting untrusted data into.

 
 For escaping the content, please refer the below cheat sheet provided by OWASP to prevent XSS attacks.
 https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
 
According to OWASP standard guidelines all the characters except alphanumeric characters
 In 'dust' core functionality existing filters are performing escaping for certain characters which may not
 be sufficient to prevent all forms of XSS vectors. and the escaping filters for CSS context is missing and no proper filter
 for escaping URL paths.
 
##### This module enhanced the below filter from 'dust' core module

        1) h    :   for HTML/HTML comment data escaping.
                    Few selected characters are escaped with corresponding HTML entities. HTML entities will be in format
                     '&#xHH;' (HH hexadecimal equivalent of character).
 
        2) j    :   for Javascript data escaping.
                     Most of the non alphanumeric characters will be escaped in the format '\uHHHH '  (HHHH hexadecimal equivalent
                     of character).
        3) uc   :   for URI Component data escaping.
                        all non alphanumeric characters will be escaped in the format '%HH' (HH hexadecimal equivalent
                       of character). This will enhance the dust-core filter 'uc' (encodeURIComponent) which is limited
                        to escaping few characters.
 
##### and adds extra filters to 'dust' core
 
         1) ha   : for HTML attribute value escaping.
                     all non alphanumeric characters will be escaped in the format '&#xHH;'  (HH hexadecimal equivalent of character).
         2) x    : for CSS  value escaping.
                    all non alphanumeric characters will be escaped in the format '\HH '  (HH hexadecimal equivalent
                of character).

         3) ul   : for complete URL escaping. This filter is different from encodeURLComponent (uc) which is applicable for
                HTTP URL parameter values, where as this filter will parse the complete URL and do escaping accordingly.
                This filter will identify the HTTP URL parameter values and escape them with percent encoding and
                escape the rest of the URL with html entities.

                For Ex:
                    consider URL : http://www.example.com/url_path?name1=value1&name2=value2&.....&namek=valuek
                        here all the HTML URL parameter values (value1, value2, ... valuek) will be % escaped
                        in the format '%HH' (HH hexadecimal equivalent of character).

                        Rest of the URL will be escaped with html entities in the format '&#xHH;' (HH hexadecimal
                        equivalent of character).
                             Rest of the URL will be escaped with html entities in the format '&#xHH;' (HH hexadecimal
                             equivalent of character).
 
##### Filters to be used based on context :



<center><table>
  <tr>
    <th>Context</th><th>Filter to be used</th>
  </tr>
  <tr>
    <td>HTML/HTML Comment</td><td>h</td>
  </tr>
  <tr>
    <td>HTML Attribute</td><td>ha</td>
  </tr>
  <tr>
    <td>JavaScript</td><td>j</td>
  </tr>
  <tr>
    <td>URL</td><td>ul</td>
  </tr>
  <tr>
    <td>URL Parameter Value</td><td>u/uc</td>
  </tr>
  <tr>
    <td>JSON</td><td>js/jp</td>
  </tr>
</table></center>
 
## Usage
 ------------
 include the dustjs-filters-secure.js file after including dust.js
```
<script src="script/dust-core-1.1.1.js"></script>
<script src="script/dust-filters-secure-0.0.1.js"></script>
```
in CommonJS/AMD/node environments
 ```
 var dust = require('dustjs-linkedin');
 require('dustjs-filters-secure');
```
