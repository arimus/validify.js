/*jshint maxlen: 130 */

module.exports = [
  {
    name: 'number',
    aliases: ['isNumber'],
    description: 'Determine if a value is a number',
    type: 'mixed',
    evaluate: function(v) {
      return typeof v === 'number';
    }
  },
  {
    name: 'integer',
    aliases: ['int', 'isInt', 'isInteger'],
    description: 'Determine if a value is an integer',
    type: 'number',
    args: [
      {
        name: 'radix',
        description: 'The radix for the number to parse',
        type: 'number',
        default: 10
      }
    ],
    evaluate: function (v, radix) {
      return !isNaN(v) && parseInt(Number(v), radix) === v && (v + '').replace(/ /g, '') !== '';
    }
  },
  {
    name: 'float',
    aliases: ['isFloat'],
    description: 'Determine if a value is a float',
    type: 'number',
    evaluate: function (v) {
      //console.log(v, typeof v, Number(v), parseFloat(Number(v)));
      return !isNaN(v) && parseInt(Number(v), 10) !== v && (v + '').replace(/ /g, '') !== '';
    }
  },
  {
    name: 'between',
    aliases: ['range', 'min', 'max', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
    description: 'Determine if a numeric value is within the specified range',
    type: 'number',
    failureMessages: {
      default: {
        between: 'The value \'%{value}\' is not %{name} %{min} and %{max} (inclusive %{inclusive})',
        range: 'The value \'%{value}\' is not %{name} %{min} and %{max} (inclusive %{inclusive})',
        min: 'The value \'%{value}\' is not %{name} %{min}',
        greaterThan: 'The value \'%{value}\' is not %{name} %{min}',
        greaterThanOrEqualTo: 'The value \'%{value}\' is not %{name} %{min}',
        max: 'The value \'%{value}\' is not %{name} %{max}',
        lessThan: 'The value \'%{value}\' is not %{name} %{max}',
        lessThanOrEqualTo: 'The value \'%{value}\' is not %{name} %{max}'
      }
    },
    args: [
      {
        name: 'min',
        aliases: ['minimum'],
        description: 'The number the value must be greater than or equal to',
        type: 'number'
      },
      {
        name: 'max',
        aliases: ['maximum'],
        description: 'The number the value must be less than or equal to',
        type: 'number'
      },
      {
        name: 'inclusive',
        description: 'Whether or not the min & max are inclusive as valid values',
        default: true,
        aliasDefaults: {
          'greaterThan': false,
          'lessThan': false
        },
        type: 'boolean'
      }
    ],
    evaluate: function (v, min, max, inclusive) {
      //console.log('between value', v, 'min', min, 'max', max, 'inclusive', inclusive);
      return ((min == null || (inclusive && v >= min) || (!inclusive && v > min)) &&
              (max == null || (inclusive && v <= max) || (!inclusive && v < max)));
    }
  },
  {
    name: 'odd',
    description: 'Determine if a value is an odd integer',
    type: 'number',
    evaluate: function (v) {
      return !isNaN(v) && v != null && v % 2 === 1;
    }
  },
  {
    name: 'even',
    description: 'Determine if a value is an even integer',
    type: 'number',
    evaluate: function (v) {
      return !isNaN(v) && v != null && v % 2 === 0;
    }
  },
  {
    name: 'multipleOf',
    description: 'Determine if a value is a multiple of another integer',
    type: 'number',
    args: [
      {
        name: 'factor',
        description: 'The number the value must be a multiple of',
        type: 'number'
      }
    ],
    evaluate: function (v, factor) {
      return !isNaN(v) && v % factor === 0;
    }
  },
  {
    name: 'factor',
    description: 'Determine if a value is a factor of another integer',
    type: 'number',
    args: [
      {
        name: 'multiple',
        description: 'The number the value must be a factor of',
        type: 'number'
      }
    ],
    evaluate: function (v, multiple) {
      return !isNaN(v) && multiple % v === 0;
    }
  }
];