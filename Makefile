#
# Run jasmine-test
#
test:
	node test/server/specRunner.js  --color test/specs/ 
	# node node_modules/mocha/bin/mocha test/specs/ 

test-verbose:
	node test/server/specRunner.js  --color --verbose test/specs/ 
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

.PHONY: test bench parser
