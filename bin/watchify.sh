#!/usr/bin/env bash

# This script assumes that watchify is installed globally. To do that execute
# npm install -g watchify

# Three watchify processes are started in the background. Use
# pkill -f watchify or pkill -f "node.*watchify"
# to stop them.

bin_path=`dirname $0`
pushd $bin_path/.. > /dev/null

watchify \
  --entry validify.js \
  --outfile browser/dist/validify.standalone.js \
  --standalone validify \
  --verbose \
  &

watchify \
  --entry validify.js \
  --outfile browser/dist/validify.require.js \
  --require ./validify \
  --verbose \
  &

watchify \
  --entry browser/test/suite.js \
  --outfile browser/test/browserified_tests.js \
  --external ./validify.js \
  --verbose \
  &

popd > /dev/null
