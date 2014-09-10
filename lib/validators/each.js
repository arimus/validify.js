/*jshint maxlen: 130 */

module.exports = [
//  {
//    name: 'each',
//    alias: 'forEach',
//    description: 'For each value in the array, run the specified validators in options',
//    type: 'array',
//    args: [
//      {
//        name: 'constraints',
//        description: 'The constraints to validate the values in the specified array',
//        type: 'object'
//      }
//    ],
//    // request reference to the validity instance, so we can process additional constraints
//    evaluate: function(value, constraints, validify) {
//      //console.log('each', value, constraints, validify);
//      if (!Array.isArray(value)) {
//        throw new Error('each/forEach requires an array of values');
//      }
//
//      //console.log('each looping through validators');
//
//      // every item in the each must meet the specified constraints for success
//      var result = true;
//      try {
//        for (var i=0; i < value.length; i++) {
//          //console.log('each validate', value[i], constraints);
//          if (!validify.validate(value[i], constraints)) {
//            //console.log('each validate failed');
//            result = false;
//          }
//        }
//      } catch (ex) {
//        console.error('error while processing constrains for each', ex);
//        result = false;
//      }
//      return result;
//    }
//  }
//  // TODO - and, or, xor
];
