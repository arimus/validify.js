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