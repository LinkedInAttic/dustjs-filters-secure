var contextTests = [
  {
    name:    "HTML encode strings injected to HTML body",
    message: "Should html encode strings injected to HTML body",
    template:"<p id='user-welcome-msg'>Hello {user}</p>",
    data: [
      {
        context:  { user: "<span class='name'>Bill</span>" },
        expected: function(doc){return doc.getElementById("user-welcome-msg").children.length == 0;}
      }
    ]
  },
  {
    name:    "HTML encode strings injected into HTML attributes",
    message: "Should html encode strings injected into HTML attributes",
    template:"<input type='text' name='user-name' value='{user|ha|s}'>",
    data: [
      {
        context:  { user: "Bill'><input type='text' name='password'>" },
        expected: function(doc){return doc.getElementsByTagName("input").length == 1;}
      },
      {
        context:  { user: "Bill'><input type='text' name='password'>" },
        expected: function(doc){return doc.getElementsByTagName("input").length == 1;}
      }
    ]
  },
  {
    name:    "HTML and URL encode data injected into URL parameter",
    message: "Should HTML and URL encode data injected into URL parameter",
    template:"<a href='http://some.web.site.com/{id|u}'>View user {id}</a>",
    data: [
      {
        context:  { id : "'/><script>alert(1);</script>"},
        expected: function(doc){return doc.body.getElementsByTagName("script").length == 0;}
      }
    ]
  },
  {
    name:    "URL encode data injected into URL parameter",
    message: "Should HTML and URL encode data injected into URL parameter",
    template:"<a href='http://some.web.site.com/{id|ul|s}'>View user {id}</a>",
    data: [
      {
        context:  { id : "'/><script>alert(1);</script>"},
        expected: function(doc){return doc.body.getElementsByTagName("script").length == 0;}
      }
    ]
  }, 
  {
    name:    "URL component encode data injected into URL parameter value",
    message: "Should HTML and URL encode data injected into URL parameter",
    template:"<a href='http://some.web.site.com/{id|ul|s}?name={id|uc|s}'>View user {id}</a>",
    data: [
      {
        context:  { id : "'/><script>alert(1);</script>"},
        expected: function(doc){return doc.body.getElementsByTagName("script").length == 0;}
      }
    ]
  }, 
  {
    name:    "URL encode data injected into URL parameter",
    message: "Should HTML and URL encode data injected into URL parameter",
    template:"<a href='{id|ul|s}'>View user {id}</a>",
    data: [
      {
        context:  { id : "'/><script>alert(1);</script>"},
        expected: function(doc){return doc.body.getElementsByTagName("script").length == 0;}
      }
    ]
  }, 
  {
    name:    "JavaScript and html encode data in JavaScript variables that are then inserted into dom",
    message: "Should JavaScript and html encode data in JavaScript variables that are then inserted into dom",
    template:"<script id='test_script'>var js_encode_html_template = '{templ|h|j|s}';</script><p id='container'></p>",
    data: [
      {
        context:  { templ : "There is some data for template's content.<script>alert('with potentially malicious code')</script>"},
        expected: function(doc){
          var test_script = doc.getElementById('test_script'),
              templ_container = doc.getElementById('container');
          if(templ_container){
            eval(test_script.innerHTML);//run the code in the script that was added to dom after page load
            templ_container.innerHTML = js_encode_html_template;
            //make sure no new <script> elements were created and that HTML is not double encoded
            return doc.body.getElementsByTagName("script").length == 1 && templ_container.innerHTML.indexOf("\\u") < 0;
          } else {
            return false;//fail <p id='container' must exist
          }
        }
      }
    ]
  },
  {
    name:    "JavaScript encode data used in JavaScript",
    message: "Should JavaScript encode data used in JavaScript",
    template:"<script id='test_script'>var essential_variable = '{templ|j|s}';</script>",
    data: [
      {
        context:  { templ : "thats the value'; essential_variable = 'other value"},
        expected: function(doc){
          var test_script = doc.getElementById('test_script');
          if(test_script){
            eval(test_script.innerHTML);//run the code in the script that was added to dom after page load
            //make sure malicious script was not executed and value is not HTML encoded
            return essential_variable != "other value" && essential_variable.indexOf("&#") < 0;
          } else {
            return false;//fail <script id='test_script' must exist
          }
        }
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = contextTests;
}
