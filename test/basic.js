/*jshint -W101:start */

var validify = require('../validify');

var chai = require('chai');
var assert = require('chai').assert;

describe('Basic Tests', function () {
  var definedVal = 1;
  var undefinedVal;
  var emptyVal = '';
  var nullVal = null;

  var testObject = {
    boolField: true,
    intField: 10,
    floatField: 1.1,
    stringField: 'some string',
    boolArrayField: [true, false, true],
    intArrayField: [10, 20, 30],
    floatArrayField: [10.1, 20.1, 30.1],
    stringArrayField: ['string1', 'string2'],
    objectArrayField: [{name: 'object1'}, {name: 'object2'}],
    objectField: {field1: 1, field2: 'bleh', subObject: {subObjectField1: 2}}
  };

  it('basic programmatic tests', function () {
    assert(validify.present(definedVal), 'defined, non-empty val not present');
    assert(validify.present(emptyVal), 'empty val not present');
    assert(validify.present(undefinedVal) === false, 'undefined val present');
    assert(validify.present(nullVal) === false, 'null val present');

    assert(validify.defined(definedVal), 'defined, non-empty val is not defined');
    assert(validify.defined(emptyVal), 'empty val is not defined');
    assert(validify.defined(undefinedVal) === false, 'undefined val is defined');
    assert(validify.defined(nullVal), 'null val is not defined');

    assert(validify.empty(definedVal) === false, 'defined, non-empty val is empty');
    assert(validify.empty(emptyVal), 'empty val is not empty');
    assert(validify.empty(undefinedVal), 'undefined val is not empty');
    assert(validify.empty(nullVal), 'null val is not empty');

    assert(validify.null(definedVal) === false, 'defined, non-empty val is null');
    assert(validify.null(emptyVal) === false, 'empty val is null');
    assert(validify.null(undefinedVal), 'undefined val is not null');
    assert(validify.null(nullVal), 'null val is not null');

    assert(validify.undefined(definedVal) === false, 'defined, non-empty val is undefined');
    assert(validify.undefined(emptyVal) === false, 'empty val is undefined');
    assert(validify.undefined(undefinedVal), 'undefined val is not undefined');
    assert(validify.undefined(nullVal) === false, 'null val is undefined');

    assert(validify.equals(10, { value: 10 }), '10 is not equal to 10');
    assert(validify.equals(10, { val: 10 }), '10 is not equal to 10 #2');

    var o1 = {a: 1, b: '2'};
    var o2 = {a: 1, b: '2'};
    assert(validify.equals(o1, { val: o1 }), 'object is not equal to itself');
    assert(validify.equals(o1, { val: o2 }) === false, 'object is equal to another object, but shouldn\'t be');
  });

  it('simple declarative constraints for object validation', function () {
    assert(validify.validate(testObject, {
      // constraints
      boolField: {             // field
        equals: true           // validator
      },
      floatField: {            // field
        present: true          // validator
      },
      intField: {              // field
        between: {             // validator
          min: 1,              // option
          max: 20,             // option
          inclusive: true      // option
        }
      }
    }), 'object didn\'t pass expected constraints');
  });

  it('find values in lists (in)', function () {
    assert(validify.in(5, {list: [1, 2, 3, 4, 5]}), '5 not found in list [1, 2, 3, 4, 5]');
    assert(validify.in(6, {list: [1, 2, 3, 4, 5]}) === false, '6 found in list [1, 2, 3, 4, 5]');

    assert(validify.in('carrot', {list: ['apple', 'carrot', 'tomato']}), 'carrot not found in list [apple, carrot, tomato]');
  });


  it('arg types not matching', function () {
    assert(validify.isInteger('5', {failOnWrongType: true}) === false, 'function doesn\'t fail on wrong type error and should');
  });

  it('default failure messages', function () {
    var failures = [];
    var res = validify.isInteger('6', {failOnWrongType: true, failures: failures});
    assert(res === false, 'string \'6\' detected as integer, when failOnWrongType==true');
    assert(failures.length === 1, 'failure message not added for invalid integer, when failOnWrongType==true');
    assert(failures[0].message === 'Validator isInteger failed for value \'6\' due to invalid type \'string\'', 'default failure message incorrect');

    // default error message for an aliased validator
    failures = [];
    validify.between('6', {min: 7, max:8, failures: failures});
    assert(failures.length === 1, 'default between failure message not added for number out of range');
    assert(failures[0].message === 'The value \'6\' is not between 7 and 8 (inclusive true)',
      'default failure message is incorrect for number out of range');
  });

  it('custom failure messages', function () {
    // custom invalidType message
    var failures = [];
    var res = validify.isInteger('6', {
      failOnWrongType: true,
      failures: failures,
      failureMessages: {invalidType: 'Value %{value} is invalid type %{type}'}
    });
    assert(failures.length === 1, 'custom failure message not added for invalid type, when failOnWrongType==true');
    assert(failures[0].message === 'Value 6 is invalid type string', 'custom failure message incorrect');

    // custom default message
    failures = [];
    res = validify.isInteger(1.1, {
      failOnWrongType: true,
      failureMessages: {default: 'Value %{value} is not an integer'},
      failures: failures
    });
    //console.error('failures', failures);
    assert(failures.length === 1, 'custom failure message not added for invalid integer, when failOnWrongType==true');
    assert(failures[0].message === 'Value 1.1 is not an integer', 'value detected as an integer or custom failure message incorrect');

    // custom error message for an aliased validator
    failures = [];
    validify.between('6', {min: 7, max:8, failures: failures, failureMessages: {default: '%{value} is not between %{min} and %{max}'}});
    assert(failures.length === 1, 'custom between failure message not added for number out of range');
    assert(failures[0].message === '6 is not between 7 and 8', 'custom failure message is incorrect for number out of range');
  });

});

/*jshint -W101:send */
