/*jshint maxlen: 130 */

module.exports = [
  {
    name: 'length',
    aliases: ['strlen'],
    description: 'Ensure the length of the string is within range',
    type: 'string',
    args: [
      {
        name: 'length',
        aliases: ['len'],
        description: 'The length must be exactly this many characters long',
        type: 'number'
      },
      {
        name: 'min',
        description: 'The length must be at least min characters long',
        type: 'number'
      },
      {
        name: 'max',
        description: 'The length must be at least max characters long',
        type: 'number'
      },
      {
        name: 'inclusive',
        description: 'Whether or not the min & max length are inclusive as valid values',
        default: true,
        type: 'boolean'
      }
    ],
    /*jshint -W074 */
    /*jshint -W072 */
    evaluate: function (v, length, min, max, inclusive) {
      //console.log('length value', v, 'length', length, 'min', min, 'max', max, 'inclusive', inclusive);
      // empty is length 0, set to empty string to prevent undefined errors
      if (v == null) {
        v = '';
      }

      // if length is specified, set min and max & inclusive must be true
      if (length != null) {
        min = max = length;
        inclusive = true;
      }

      return ((min == null || (inclusive && v.toString().length >= min) || (!inclusive && v.toString().length > min)) &&
              (max == null || (inclusive && v.toString().length <= max) || (!inclusive && v.toString().length < max)));
    }
  },
  {
    name: 'matches',
    aliases: ['format'],
    description: 'Ensure the string matches the given pattern',
    type: 'string',
    args: [
      {
        name: 'pattern',
        aliases: ['format'],
        description: 'The pattern the string must match',
        type: 'string'
      }
    ],
    evaluate: function (v, pattern) {
      if (v == null) {
        v = '';
      }

      return v.match(pattern) == null ? false : true;
    }
  }
];