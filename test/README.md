dustjs-filters-secure unit tests
------------------------
This project includes unit tests for secure dust filters. Unit test are written in jasmine and are configured to run with venus or jasmine-node

Get required dependencies
------------------------------------

* install nodejs 0.6 or greater 
* install npm
* install testing dependencies by running in the package directory:


     npm install


Running tests with venus 
------------------------------------

* install venus

Then run this command in terminal:

     venus run -n -t dustjs-filters-secure/test/specs

Venus will print a URL where unit tests are stages. Open that URL in the browser to execute unit tests. Check output in console for the results of the execution.

You can also execute unit tests from one of the files, not the entire folder:

     venus run -n -t dustjs-filters-secure/test/specs/dust-core-plus-filters.spec.js


Running tests on node server version
------------------------------------

Run this command in the terminal

     node test/server/specRunner.js


Running tests with make
-----------------------

In root directory of the project to run 

* venus tests

     make test-venus

* unit tests in jasmine-node

     make test-jasmine

* verbose unit tests in jasmine-node

     make test-verbose

