/*jshint -W101:start */

var validify = require('../validify');

var chai = require('chai');
var assert = require('chai').assert;

describe('Advanced Tests', function () {
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

  it('advanced declarative constraints for object validation', function () {
    assert(validify.validate(testObject, {
      // TODO - constraints for additional property levels (e.g. objectField.field1: {})
      'objectArrayField.name': { // field
        present: true,
        length: 7
      }
    }), 'name not detected as present for each object');

    assert(validify.validate(testObject, {
      'intArrayField': {  // field
        greaterThan: {
          min: 5
        }
      }
    }), 'intArrayField values not greater than 5');

    assert(validify.validate(testObject, {
      'objectArrayField.blah': { // field
        present: true
      }
    }) === false, 'blah detected as present for some objects');

  });

  it('advanced declarative constraints using AND operators', function () {
    // AND rules
    assert(validify.validate(testObject, [{
      intField: {
        present: true
      }
    }, {
      floatField: {
        present: false
      }
    }]) === false, 'both fields we\'re not detected when they should have been');

    assert(validify.validate(testObject, [{
      intField: {
        present: true
      }
    }, {
      nonExistentField: {
        present: false
      }
    }]), 'both fields we\'re detected when they shouldn\'t have been');
  });

  it('advanced declarative constraints using OR operators', function () {
    // OR rules
    assert(validify.validate(testObject, [{
      intField: {
        eq: 10
      }
    }, {
      floatField: {
        eq: 1.1
      }
    }], 'or'), 'both fields should have detected as eq, but didn\'t');

    assert(validify.validate(testObject, [{
      intField: {
        eq: 5
      }
    }, {
      floatField: {
        eq: 1.1
      }
    }], 'or'), 'one of fields should have detected as eq, but didn\'t');

    assert(validify.validate(testObject, [{
      intField: {
        eq: 5
      }
    }, {
      floatField: {
        eq: 2.2
      }
    }], 'or') === false, 'none of fields should have detected as eq, but didn\'t');

  });

  it('advanced declarative constraints using XOR operators', function () {
    // OR rules
    assert(validify.validate(testObject, [{
      intField: {
        eq: 10
      }
    }, {
      floatField: {
        eq: 1.1
      }
    }], 'xor') === false, 'both of the fields should validate, but only one did');

    assert(validify.validate(testObject, [{
      intField: {
        eq: 5
      }
    }, {
      floatField: {
        eq: 1.1
      }
    }], 'xor'), 'only one of the fields should have validated, but one or both did');

    assert(validify.validate(testObject, [{
      intField: {
        eq: 5
      }
    }, {
      floatField: {
        eq: 2.2
      }
    }], 'xor') === false, 'none of fields should have validated, but one of them did');

  });
});

/*jshint -W101:send */
