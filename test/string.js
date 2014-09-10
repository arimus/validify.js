/*jshint -W101:start */

var validify = require('../validify');

var chai = require('chai');
var assert = require('chai').assert;

describe('String Tests', function () {

  it('length', function () {
    assert(validify.length('a', {min: 1}), 'a length is not >= 1');
    assert(validify.length('a', {min: 1, inclusive: false}) === false, 'a length is not > 1, inclusive false');

    assert(validify.length('abcdefghij', {max: 10}), 'abcdefghij length is not <= 10');
    assert(validify.length('abcdefghij', {max: 10, inclusive: false}) === false, 'abcdefghij length is not < 10, inclusive false');

    assert(validify.length('a', {min: 1, max: 1}), 'a length is not >= 1 and <= 1');
    assert(validify.length('', {min: 1, max: 1}) === false, '"" length is not >= 1 and <= 1');

    // null value
    assert(validify.length(null, {min: 0}), 'null length is not >= 0');
    assert(validify.length(null, {min: 1}) === false , 'null length is >= 1');
    assert(validify.length(null, {min: 0, inclusive: false}) === false, 'null length is > 0');

    // use length arg
    assert(validify.length('a', {length: 1}), '"a" length is not exactly 1');
    assert(validify.length('', {length: 0}), '"" length is not exactly 0');
    assert(validify.length('', {length: 1}) === false, '"" length is exactly 1');

    // use length alias 'strlen' and length arg alias 'len'
    assert(validify.strlen('a', {len: 1}), '"a" length is not exactly 1');
    assert(validify.strlen('', {len: 0}), '"" length is not exactly 0');
    assert(validify.strlen('', {len: 1}) === false, '"" length is exactly 1');
  });

  it('format', function () {
    assert(validify.matches('abcdef', {pattern: /ab/}), 'abcdef does not match ab');
    assert(validify.matches('abcdef', {format: /ab/}), 'abcdef does not match ab');

    assert(validify.matches('abcdef', {pattern: 'ab'}), 'abcdef does not match ab');

    assert(validify.matches('abcdef', {pattern: /^abcdef$/}), 'abcdef does not match ^abcdef$');
    assert(validify.matches('abcdef', {pattern: '^abcdef$'}), 'abcdef does not match ^abcdef$');
    assert(validify.matches('abcdef', {pattern: '^abcde$'}) === false, 'abcdef does not match ^abcde$');
  });

});

/*jshint -W101:send */
