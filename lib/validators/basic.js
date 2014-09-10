/*jshint maxlen: 130 */

module.exports = [
  {
    name: 'present',
    aliases: ['notNull'],
    description: 'Determine if a value is present/not null',
    type: 'mixed',
    args: [
      {
        name: 'test',
        description: 'The test for presence should match this (e.g. present==true)',
        type: 'boolean',
        default: true
      }
    ],
    evaluate: function(v, test) {
      //console.log('present()', v, test);
      return test ? v != null : v == null;
    }
  },
  {
    name: 'defined',
    description: 'Determine if a value is defined (may still be null)',
    type: 'mixed',
    evaluate: function(v) {
      return v !== undefined;
    }
  },
  {
    name: 'empty',
    aliases: ['blank'],
    description: 'Determine if a value is empty/blank (includes null & undefined)',
    type: 'mixed',
    evaluate: function(v) {
      return (v == null || (v + '').replace(/ /g, '') === '');
    }
  },
  {
    name: 'null',
    description: 'Determine if a value is null',
    type: 'mixed',
    evaluate: function(v) {
      return v == null;
    }
  },
  {
    name: 'undefined',
    description: 'Determine if a value is undefined',
    type: 'mixed',
    evaluate: function(v) {
      return v === undefined;
    }
  },
  {
    name: 'equals',
    aliases: ['eq'],
    description: 'Determine if a value is equal to the specified value.  Equivalent to a simple === javascript comparison.',
    type: 'mixed',
    args: [
      {
        name: 'value',
        aliases: ['val'],
        description: 'The target value to match the provided value against',
        type: 'mixed'
      }
    ],
    evaluate: function(v, value) {
      // TODO - provide a robust eq comparison for objects as well
      //console.log('equals() comparing', v, value);
      return v === value;
    }
  },
  {
    name: 'in',
    description: 'Determine if a value is in the specified array',
    type: 'mixed',
    args: [
      {
        name: 'list',
        aliases: ['array', 'val', 'value'],
        description: 'The target list to lookup the value in',
        type: 'mixed'
      }
    ],
    evaluate: function(v, list) {
      // TODO - provide a robust eq comparison for objects as well
      //console.log('in() finding', v, 'in', list);

      if (list == null || list.length === 0) {
        return false;
      }

      for (var i=0; i < list.length; i++) {
        if (v === list[i]) {
          return true;
        }
      }
      return false;
    }
  }
];