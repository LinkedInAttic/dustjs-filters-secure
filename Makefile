#
# Run unit tests
#

* install nodejs 0.6 or greater 
* install npm
* install testing dependencies by running in the package directory:

     npm install

# Running tests with venus

* install venus

Then run this command in terminal:
     venus run -n -t dustjs-filters-secure/test/specs

Venus will print a URL where unit tests are stages. Open that URL in the browser to execute unit tests. Check output in console for the results of the execution.

#Running tests on node server version
Run this command in the terminal
     node test/server/specRunner.js

#
# Build dust.js
#

VERSION = ${shell cat package.json | grep version | grep -o '[0-9]\.[0-9]\.[0-9]\+'}


SRC = lib
VERSION = ${shell cat package.json | grep version | grep -o '[0-9]\.[0-9]\.[0-9]\+'}
FILTERS = dist/dust-filters-secure-${VERSION}.js


define HEADER
//
// Dust-filters-secure - Additional functionality for dustjs-linkedin package v${VERSION}
//
// Copyright (c) 2012, LinkedIn
// Released under the MIT License.
//

endef

export HEADER

filters-secure:
	@@mkdir -p dist
	@@touch ${FILTERS}
	@@echo "$$HEADER" > ${FILTERS}
	@@cat ${SRC}/dust-filters-secure.js >> ${FILTERS}
	@@echo ${FILTERS} built

release: clean min
	git add dist/*
	git commit -a -m "release v${VERSION}"
	git tag -a -m "version v${VERSION}" v${VERSION}
	npm publish

.PHONY: test-jasmine bench parser
