/*jshint -W101:start */

var validify = require('../validify');

var chai = require('chai');
var assert = require('chai').assert;

describe('Number Tests', function () {

  it('number test', function () {
    assert(validify.number(10), 'integer is invalid number');
    assert(validify.number(1.0), 'float is invalid number');
    assert(validify.number(0xf), 'hex is invalid number');
  });

  it('integer test', function () {
    assert(validify.integer(10), 'integer is invalid number');
    assert(validify.integer(1.1) === false, 'float is valid integer');
    assert(validify.int(10), 'integer is invalid number for alias int');
    assert(validify.int(1.1) === false, 'float is valid integer for alias int');
  });

  it('float test', function () {
    assert(validify.float(1.1), 'float is invalid');
    assert(validify.float(10) === false, 'integer is valid float');
  });

  it('between', function () {
    assert(validify.between(2, {min: 1}), '2 is not greater than 1');
    assert(validify.between(1, {min: 2}) === false, '1 is greater than 2');
    assert(validify.between(1), 'no min or max specified, but failed anyways');
    assert(validify.between(1, {min: 1, max: 10}), 'not in range at min');
    assert(validify.between(10, {min: 1, max: 10}), 'not in range at max');
    assert(validify.between(5, {min: 1, max: 10}), 'not in range in middle');

    // with inclusive set to false
    assert(validify.between(1, {min: 1, max: 10, inclusive: false}) === false, 'in range at min when !inclusive');
    assert(validify.between(10, {min: 1, max: 10, inclusive: false}) === false, 'in range at max when !inclusive');
    assert(validify.between(5, {min: 1, max: 10, inclusive: false}), 'in range in middle when !inclusive');

    // using alias min/max
    assert(validify.min(1, {min: 1}), '1 is not >= 1 for alias min');
    assert(validify.min(1, {min: 1, inclusive: false}) === false, '1 is >= 1 with !inclusive for alias min');

    assert(validify.max(10, {max: 10}), '10 is not >= 10 for alias max');
    assert(validify.max(10, {max: 10, inclusive: false}) === false, '10 is >= 10 with !inclusive for alias max');
  });

  it('between aliases', function () {
    assert(validify.greaterThan(2, {min: 1}), '2 > 1 didn\t valdate using greaterThan method');
    assert(validify.greaterThan(1, {min: 1}) === false, '1 > 1 validated using greaterThan method');
    assert(validify.greaterThan(10, {min: 10}) === false, '10 > 10 validated using greaterThan method');
    assert(validify.greaterThanOrEqualTo(10, {min: 10}), '10 >= 10 didn\'t validate using greaterThan method');
  });

  it('between validation using constraints', function () {
    assert(validify.validate(10, {
      // constraints
      '*': {                   // field
        between: {             // validator
          min: 1,              // option
          max: 20,             // option
          inclusive: true      // option
        }
      }
    }), 'simple value didn\'t pass expected constraints');
  });

  it('odd', function () {
    assert(validify.odd(1), '1 is not odd');
    assert(validify.odd(2) === false, '2 is odd');
    assert(validify.odd(null) === false, 'null is odd');
    assert(validify.odd(undefined) === false, 'undefined is odd');
  });

  it('even', function () {
    assert(validify.even(1) === false, '1 is not even');
    assert(validify.even(2), '2 is even');
    assert(validify.even(null) === false, 'null is even');
    assert(validify.even(undefined) === false, 'undefined is even');
  });

  it('multipleOf', function () {
    assert(validify.multipleOf(4, {factor: 2}), '4 is not a multiple of 2');
    assert(validify.multipleOf(4, {factor: 1}), '4 is not a multiple of 1');
  });

  it('factor', function () {
    assert(validify.factor(2, {multiple: 4}), '2 is not a factor of 4');
    assert(validify.factor(1, {multiple: 4}), '1 is not a factor of 4');
  });

});

/*jshint -W101:send */
