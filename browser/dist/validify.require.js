require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
/*jshint maxlen: 130 */

(function () {
  var emailUserRe = '[a-z0-9\\u007F-\\uffff!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9\\u007F-\\uffff!#$%&\'*+\\/=?^_`{|}~-]+)*';
  var emailDomainRe = '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+';
  var emailTldRe = '[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

  module.exports = [{
    name: 'email',
    aliases: ['isEmail'],
    description: 'Determine if a value is a valid email address',
    type: 'string',
    args: [
      {
        name: 'tlds',
        description: 'List of valid Top Level Domains',
        type: '[string]',
        default: []
      }
    ],
    evaluate: function (v, tlds) {
      //console.log('email', value, tlds);
      var re = '^' + emailUserRe + '@' + emailDomainRe;
      /*jshint -W110*/
      if (tlds != null && tlds.length > 0) {
        re += "(" + tlds.join("|") + ")";
      } else {
        re += emailTldRe;
      }
      re += '$';

      //console.log("using email regex", re);
      return v.match(new RegExp(re)) != null;
    }
  }];
})();
},{}],3:[function(require,module,exports){

// Load all validators
exports.basic = require('./basic');
exports.number = require('./number');
exports.string = require('./string');
exports.email = require('./email');

},{"./basic":1,"./email":2,"./number":4,"./string":5}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],"luqztl":[function(require,module,exports){
/*jshint maxlen: 130 */
'use strict';

(function () {
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;

  // shim for testing, since PhantomJS doesn't support bind yet
  Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var fn = this;
    return function () {
      return fn.apply(thisp, arguments);
    };
  };

  /**
   * Helper method to get the list of parameter names for a function
   * @param func the function to introspect and retrieve parameter name for
   * @returns {*}
   */
  function getParamNames(func) {
    if (func) {
      var fnStr = func.toString().replace(STRIP_COMMENTS, '');
      var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if (result === null) {
        result = [];
      }
      return result;
    }
    return [];
  }

  /*jshint -W055 */
  function validify() {
  }

  // reference to the instance we return, so we can pass it into validators that need it
  var validifyInstance;

  /**
   * Class the represents a validator
   * @param validator
   * @constructor
   */
  function Validator(validator) {
    this.name = validator.name;
    this.description = validator.description;
    this.type = validator.type;
    this.args = validator.args;
    this.evaluate = validator.evaluate;
    this.aliases = validator.aliases;
    this.failureMessages = validator.failureMessages;
  }

  /**
   * Prototype that wraps the evaluate call to provide argument injection
   * @param name the name/alias of the function
   * @param value the value being validated
   * @param options the map of named options for the validation.  Refer to the specific validator for details.
   * @returns boolean whether or not the validate
   */
  Validator.prototype.validate = /*jshint -W074*/function (name, value, options) {
    var i, j;

    //console.log('validate(proto): name', name, 'value', value, 'options', options);
    if (this.evaluate == null) {
      //console.error('validate for', name, 'has no evaluate', this.evaluate);
      throw new Error('no evaluate function found for '+name);
    }

    // validator options
    var type = this.type ? this.type : 'mixed';
    var failOnWrongType = (options && options.failOnWrongType != null) ? options.failOnWrongType: this.failOnWrongType;
    var failOnMissing = (options && options.failOnMissing != null) ? options.failOnMissing: this.failOnMissing;
    var failOnEmpty = (options && options.failOnEmpty != null) ? options.failOnEmpty: this.failOnEmpty;
    var trimStrings = (options && options.trimStrings != null) ? options.trimStrings: this.trimStrings;

    // test the value for correct type
    if (failOnWrongType && typeof value !== type) {
      //console.error(failOnWrongType, options, this.failOnWrongType);
      //console.error('invalid type \'' + typeof value + '\' for value \'' + value + '\' (should be \'' + type + '\')');
      //console.log('process failure for invalidType', name);
      processFailure(this, 'invalidType', name, value, options);
      return false;
    }

    // fail of the value is missing
    if (failOnMissing && value === undefined) {
      processFailure(this, 'missingValue', name, value, options);
      return false;
    }

    // fail if the value is empty
    if (failOnEmpty &&
        (value === undefined ||
         value === null ||
         value === '' ||
         (typeof value === 'object' && Object.keys(value).length === 0) ||
         Array.isArray(value) && value.length === 0))
    {

      processFailure(this, 'emptyValue', name, value, options);
      return false;
    }

    // TODO - cache these, so that we don't re-parse every single time we do a validation
    var args = [ trimStrings && type === 'string' && typeof value === 'string' ? value.trim() : value ];
    var params = getParamNames(this.evaluate);

    // start past the value and inject values
    for (i = 1; i < params.length; i++) {
      var param = params[i],
          option = options ? options[param] : undefined;

      if (param === 'validify') {
        option = validifyInstance;
      } else if (this.args[i-1]) {
        // validator arg options
        var arg = this.args[i-1];
        var argType = arg ? arg.type : 'undefined';
        var argFailOnWrongType = arg.failOnWrongType || failOnWrongType;
        var argFailOnMissing = arg.failOnMissing || failOnMissing;
        var argFailOnEmpty = arg.failOnEmpty || failOnEmpty;
        var argTrimStrings = arg.trimStrings || trimStrings;

        // if we have an option, check it against type
        //console.log('option', option, 'expected type', type, 'type', typeof option);
        if (option && argFailOnWrongType && argType !== 'mixed' && typeof option !== argType) {
          //console.log('option', option, 'expected type', type, 'type', typeof option);
          // check to see if perhaps it's a complex type like array of objects
          var match;
          if ((match = argType.match(/^\[([^\]]+)\]$/)) && Array.isArray(option)) {
            var subType = match[1];
            //console.log('found array of', subType);
            /*jshint -W073 */
            if (subType !== 'mixed') {
              // verify the array values are of the right type
              for (j=0; j < option.length; j++) {
                if (typeof option[j] !== subType) {
                  //throw new Error('invalid sub-type \'' + typeof option[j] + '\' for array item \'' +
                  //  param + '[' + j + ']=\'' + option[j] + '\' (should be \'' + subType + '\')');
                  //console.error('invalid sub-type \'' + typeof option[j] + '\' for array item \'' +
                  //  param + '[' + j + ']=\'' + option[j] + '\' (should be \'' + subType + '\')');
                  return false;
                }
              }
            } // else it doesn't matter
          } else {
            /*jshint -W101 */
            //throw new Error('invalid type \'' + typeof option + '\' for param \'' + param + '\' (should be \'' + argType + '\')');
            //console.error('invalid type \'' + typeof option + '\' for param \'' + param + '\' (should be \'' + argType + '\')');
            return false;
          }
        }

        // check aliases for values if not specified as default name (e.g. gt for min)
        var argumentAliases = arg.aliases;
        if (option === undefined && argumentAliases && options != null) {
          for (j=0; j < argumentAliases.length; j++) {
            //console.log('checking argument aliases', argumentAliases[j], options[argumentAliases[j]]);
            // if we find an alias in the options, then use that
            /*jshint -W073 */
            if (options[argumentAliases[j]] !== undefined) {
              option = options[argumentAliases[j]];
              break;
            }
          }
        }

        //console.log('option', param, 'value', option, 'args', arg, 'aliasDefaults', arg.aliasDefaults);

        // if we have alias defaults, use that
        if (option === undefined &&
            arg != null &&
            arg.aliasDefaults != null &&
            arg.aliasDefaults[name] != null)
        {
          // pull from alias defaults
          option = arg.aliasDefaults[name];
          //console.log('using alias default');
        // if we have args, use that
        } else if (option === undefined && arg) {
          //console.log('using default value for param', param);
          option = arg.default;
          //console.log('using arg default');
        }

        if (failOnMissing && option == null) {
          throw new Error('parameter \'' + param + '\' is missing');
        } else if (failOnEmpty && (option === '' || (option + '').replace(/ /g, '') !== '')) {
          throw new Error('parameter \'' + param + '\' is empty');
        }
      }

      args.push(option);
    }

    //console.log('validate', this.evaluate, params, args, options);
    var res = this.evaluate.apply(this, args);
    
    // if result not true, then we have a list of failures
    if (res !== true) {
      //console.log('process failure for method', name);
      processFailures(this, res, name, value, options);
      return false;
    }
    return res;
  };

  var validatorMap = {};

  /**
   * Register a validator with validify
   *
   * Validator definition:
   * {
   *   name: 'equals',                          // name of the validator
   *   aliases: ['eq'],                         // alternate validator names
   *   description: 'Match value against arg1', // helpful description for user
   *   type: 'string',                          // expected JS value type (string, number, boolean, date, array, object)
   *   failOnWrongType: true,                   // error if value is any other JS type
   *   failOnMissing: false,                    // if true, null/undefined values will always be considered invalid
   *   failOnEmpty: false,                      // if true, empty values will be considered invalid ('', "", [])
   *   trimStrings: false,                      // if true, strings with be trimmed before being validated
   *   failureMessages: {                       // contains validator failure messages, keyed by error code
   *     default: 'Validator failed for value '%{value}'
   *   }
   *   args: [                                  // argument definitions (first param, 'value' is ignored
   *    {
   *      name: 'arg1',                         // the name of the argument, which will be matched to evaluate function
   *      aliases: ['arg2'],                    // alternate names for the argument, useful combined with validator aliases
   *      description: 'The first argument',    // helpful description for user
   *      type: 'string',                       // the type of the argument
   *      failOnWrongType: true,                // error if value is any other JS type
   *      failOnMissing: false,                 // if true, null/undefined values will always be considered invalid
   *      failOnEmpty: false,                   // if true, empty values will be considered invalid ('', "", [])
   *      trimStrings: false,                   // if true, strings with be trimmed before being validated
   *      default: null,                        // default value for argument, if none provided
   *      aliasDefaults: {                      // default value for argument when called by alias, and if none provided
   *        eq: 'blah'                          // default for arg1 is 'blah' when validator called as 'eq'
   *      }
   *    }
   *   ]
   *   evaluate: function (value, arg1) {           // a function, which accepts a value and any additional parameters
   *     return value === arg1;
   *   }
   * }
   *
   * @param validator see definition above
   * @api public
   */
  function registerValidator(validator) {
    try {
      var v = new Validator(validator);

      var name = validator.name;
      //console.log('generating validator', name, 'func', v);
      validatorMap[name] = v;

      validify.prototype[name] = function() {
        //console.log('registerValidator(): name', name, 'arguments', arguments);
        var args = [name];
        var value = arguments && arguments.length >= 1 ? arguments[0] : null;
        var options = arguments && arguments.length >= 2 ? arguments[1] : null;

        // add the rest of the arguments to the list
        for (var i=0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        //console.error('running validator', name, 'options', options);

        // validate and get the result
        return Validator.prototype.validate.apply(this, args);
      }.bind(v);

      // process aliases
      if (validator.aliases && validator.aliases.length > 0) {
        for (var j=0; j < validator.aliases.length; j++) {
          var alias = validator.aliases[j];
          validatorMap[alias] = v;

          /*jshint -W083 */
          validify.prototype[alias] = function() {
            //console.log('registerValidator(): alias', this.alias, 'this', this, 'arguments', arguments);
            var args = [this.alias];
            var value = arguments && arguments.length >= 1 ? arguments[0] : null;
            var options = arguments && arguments.length >= 2 ? arguments[1] : null;

            // add the rest of the arguments to the list
            for (var i=0; i < arguments.length; i++) {
              args.push(arguments[i]);
            }

            // validate and get the result
            return Validator.prototype.validate.apply(this.validator, args);
          }.bind({validator: v, alias: alias});
        }
      }
    } catch (ex) {
      //console.error('error generating validator', validator.name);
    }
  }

  function processFailures(/*jshint -W072 */v, failureKeys, name, value, options) {
    // if this validator failed to validate and there are no existing failure messages, generate a default
    if (options && options.failures) {

      // determine if we have a list of failures to loop through or should just use the default
      if (failureKeys !== false && failureKeys && failureKeys.length > 0) {
        // for each of the failures that occurred, we need to determine the right failure message template to use
        for (var i=0; i < failureKeys.length; i++) {
          var failureKey = failureKeys[i];
          //console.log('failure key in list', failureKey);
          processFailure(v, failureKey, name, value, options);
        }
      } else {
        // else we use the default
        //console.log('failure key default');
        processFailure(v, 'default', name, value, options);
      }
    }
  }

  function processFailure(/*jshint -W072 */v, failureKey, name, value, options) {
    //console.log('processFailure(): name', name, 'failureKey', failureKey);

    // set a generic default failure message
    var failureMessage;

    switch (failureKey) {
    case 'invalidType':
      failureMessage = 'Validator %{name} failed for value \'%{value}\' due to invalid type \'%{type}\'';
      break;
    case 'missingValue':
      failureMessage = 'Validator %{name} value missing';
      break;
    case 'emptyValue':
      failureMessage = 'Validator %{name} value empty';
      break;
    default:
      failureMessage = 'Validator %{name} failed for value \'%{value}\'';
    }

    // first, check for failure messages in the options object
    var failureMessages;

    if (options.failureMessages && options.failureMessages[failureKey]) {
      //console.log('using failure messages from options');
      failureMessages = options.failureMessages;
    } else if (v.failureMessages && v.failureMessages[failureKey]) {
      //console.log('using failure messages from validator definition');
      failureMessages = v.failureMessages;
    //} else {
      //console.log('using default failure message');
    }

    // this may be a string or a map of aliases to strings
    if (failureMessages && typeof failureMessages[failureKey] === 'string') {
      failureMessage = failureMessages[failureKey];
      //console.log('using failure message for all aliases');
    } else if (failureMessages && failureMessages[failureKey] && failureMessages[failureKey][name]) {
      failureMessage = failureMessages[failureKey][name];
      //console.log('using failure message for specific alias');
    }
    // else we're sticking with the default

    /*jshint -W101 */
    //console.error('validator failed, validator.args', v.args, 'options', options, 'failureMessage', failureMessage, 'validator', v);

    // substitute value
    failureMessage = failureMessage.replace(new RegExp('%{value}', 'g'), value);

    // substitute validator name
    failureMessage = failureMessage.replace(new RegExp('%{name}', 'g'), name);

    // substitute value
    failureMessage = failureMessage.replace(new RegExp('%{type}', 'g'), typeof value);

    /*jshint -W073 */
    // substitute all arguments
    if (v.args) {
      for (var j=0; j < v.args.length; j++) {
        var arg = v.args[j];
        var val = arg.default;
        // override default with the specified value
        if (options[arg.name]) {
          val = options[arg.name];
        }

        //console.log('replacing', arg.name, 'with', val, 'in failure token');
        failureMessage = failureMessage.replace(new RegExp('%{'+arg.name+'}', 'g'), val);
      }
    }

    if (Array.isArray(options.failures)) {
      var o = {};
      o.validatorName = name;
      o.code = failureKey;
      o.message = failureMessage;
      //console.error('adding failure to list', o);
      options.failures.push(o);
    }
    //console.error('substituted failureMessage', failureMessage);
  }

  /**
   * Register a list of validators.  See registerValidator for more information on validator format
   *
   * @param validators an array of validators
   * @see registerValidator
   */
  function registerValidators(validators) {
    //console.log('have', validators.length, 'validators to register');
    for (var i = 0; i < validators.length; i++) {
      var validator = validators[i];
      //console.log('registering validator', validator);

      registerValidator(validator);
    }
  }

  // validator registration
  validify.prototype.registerValidator = registerValidator;
  validify.prototype.registerValidators = registerValidators;

  // validator retrieval
  function getValidator(name) {
    return validatorMap[name];
  }

  validify.prototype.getValidator = getValidator;

  /**
   * Validation given set of declarative constraints
   * 
   * {
   *   // constraints
   *    boolField: {             // field
   *      equals: true           // validator
   *    },
   *    floatField: {            // field
   *      present: true          // validator
   *    },
   *    intField: {              // field
   *      between: {             // validator
   *        min: 1,              // option
   *        max: 2,              // option
   *        inclusive: true      // option
   *      }
   *    },
   *    objectArrayField.name: { // field 'name' for objects in array objectArrayField, or field 'name' in object
   *      present: true          // validator (if value is not an object, value is the only param for the function)
   *    }
   *  }
   * 
   * @param value the value to validate
   * @param constraints the constraints with which to validate the specified value, array or single object
   * @param [operator] if an array of constraints, require all, some or only one constraint object to be valid (and, or, xor)
   */
  function validate(value, constraints, operator) {
    //console.log('validate(): value', value, 'constraints', constraints, 'operator', operator);

    var invalidCount = 0;

    if (operator == null) {
      operator = 'and';
    }

    // make the constraints an array if not already
    if (!Array.isArray(constraints)) {
      constraints = [constraints];
    }

    // loop through constraints
    for (var i=0; i < constraints.length; i++) {
      var constraint = constraints[i];
      //console.log('validate(): processing constraint', constraint);

      // loop through each property, which will be a field name mapped to a validator config
      for (var field in constraint) {
        if (constraint.hasOwnProperty(field)) {

          // get the validators for the given field
          var validatorMap = constraint[field];

          // get any fields with '.' in them, referencing sub-fields / arrays
          var path;
          if (field.indexOf('.') !== -1) {
            path = field.split('.');
            field = path.shift();
          }

          //console.log('processing constraint with field', field, 'path', path, 'value', value);

          /**
           * 'objectArrayField.name': {
           *   present: true,
           *   length: 7
           * }
           */

          // determine if the field is an array & has complex objects, and if so loop through it
          if (value.hasOwnProperty(field) && Array.isArray(value[field])) {
            //console.log('processing an array field', field);
            // TODO, handle multiple levels of nesting, for now only 1 will really work

            /*jshint -W073 */
            var p = path != null ? path.join('.') : '*';
            var res = true;

            // loop through each of the array elements
            for (var j=0; j < value[field].length; j++) {
              var item = value[field][j];

              // use the validator map wrapped with this field
              var cc = {};
              cc[p] = validatorMap;
              //console.log('validating item', item, cc);

              // and validate them
              if (validate(item, cc) === false) {
                //console.log('failed to validate array element', j, 'item', item, validatorMap);
                res = false;
                break;
              }
            }

            // if any of the items in the array failed, then mark this constraint invalid
            if (res === false) {
              invalidCount++;
              //console.log('invalidCount', invalidCount);
            }
          } else {
            //console.log('processing a simple field', field, 'validatorMap', validatorMap);

            // run all the validators
            for (var validatorName in validatorMap) {
              if (validatorMap.hasOwnProperty(validatorName)) {
                // get the validator constraints
                var validatorConstraints = validatorMap[validatorName];

                // lookup the validator function
                var validator = validifyInstance[validatorName];

                // lookup the validator definition
                var validatorDef = getValidator(validatorName);

                /*jshint -W073 */
                if (validator == null) {
                  throw new Error('Validator ' + validatorName + ' not found');
                }

                // if the constraints are a simple type instead of an object, then simply pass the value through as the
                // first argument
                switch (typeof validatorConstraints) {
                /*jshint -W110 */
                case "boolean":
                case "string":
                case "number":
                case "date":
                  //console.log('validator', validatorName, 'constraints', validatorConstraints, 'type',
                  // typeof validatorConstraints);

                  /*jshint -W073 */
                  // set the first argument to this value
                  if (validatorDef.args && validatorDef.args.length > 0) {
                    var firstArgName = validatorDef.args[0].name;
                    //console.log('populating first arg with primitive', firstArgName, validatorDef.args[0].name);
                    var c = {};
                    c[firstArgName] = validatorConstraints;
                    validatorConstraints = c;
                  }
                  break;
                }

                //console.log('running validator', validatorName, 'constraints', validatorConstraints, 'field', field, 'value',
                //  field === '*' ? value : value[field]);

                /*jshint -W073 */
                if (!validator(field === '*' ? value : value[field], validatorConstraints)) {
                  //console.log('validator failed');
                  invalidCount++;
                  break;
                }
              }
            }
          }
        }
      }
    }

    //console.log('invalid count', invalidCount, 'constraint.length', constraints.length, 'operator', operator);

    if ((invalidCount === 0 && (operator === 'and' || operator === 'all')) ||
        ((invalidCount === 0 || invalidCount < constraints.length) && (operator === 'or' || operator === 'any')) ||
        (invalidCount === constraints.length - 1 && (operator === 'xor' || operator === 'one')))
    {
      return true;
    }

    return false;
  }

  // expose the validate method
  validify.prototype.validate = validate;

    // expose validator class
  validify.prototype.Validator = Validator;

  /*jshint -W055 */
  validifyInstance = new validify();

  // Load all the validator groups
  var validatorGroups = require('./lib/validators');

  // Register all the validators from the groups
  for (var validatorGroupName in validatorGroups) {
    if (validatorGroups.hasOwnProperty(validatorGroupName)) {
      //console.log('validatorGroupName', validatorGroupName);
      var validatorGroup = validatorGroups[validatorGroupName];
      registerValidators(validatorGroup);
    }
  }

  module.exports = validifyInstance;
})();
},{"./lib/validators":3}],"/Users/arimus/workspace/validify.js/validify.js":[function(require,module,exports){
module.exports=require('luqztl');
},{}]},{},["luqztl"])