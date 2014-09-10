/*jshint -W101:start */

var validify = require('../validify');

var chai = require('chai');
var assert = require('chai').assert;

describe('Email Tests', function () {
  var validEmailAddresses = [
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    'email@123.123.123.123',
    //'email@[123.123.123.123]',
    //'"email"@example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com'
    //'much."more\\ unusual"@example.com',
    //'very.unusual."@".unusual.com@example.com',
    //'very."(),:;<>[]".VERY."very@\\\\\\\\\\\\ \\"very".unusual@strange.example.com'
  ];

  var invalidEmailAddress = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    '.email@example.com',
    'email.@example.com',
    'email..email@example.com',
    //'あいうえお@example.com',
    'email@example.com (Joe Smith)',
    'email@example',
    'email@-example.com',
    //'email@example.web',
    //'email@111.222.333.44444',
    'email@example..com',
    'Abc..123@example.com',

    '"(),:;<>[\\]@example.com',
    'just"not"right@example.com',
    'this\\ is\\"really\\"not\\\\\\\\allowed@example.com'
  ];

  it('basic valid email test', function () {
    for (var i=0; i < validEmailAddresses.length; i++) {
      var email = validEmailAddresses[i];
      assert(validify.email(email), 'email address ' + email + ' is invalid');
    }
  });

  it('basic invalid email test', function () {
    for (var i=0; i < invalidEmailAddress.length; i++) {
      var email = invalidEmailAddress[i];
      //console.log('testing', email);
      assert(validify.email(email) !== true, 'error, email address ' + email + ' is valid and shouldn\'t be');
    }
  });

  var validTldEmailAddresses = [
    'blah@test.com',
    'blah@test.test.com',
    'blah@test.net',
    'blah@test.test.net',
    'blah@test.org',
    'blah@test.test.org'
  ];

  var invalidTldEmailAddresses = [
    'blah@test.blah',
    'blah@test.com.bleh',
    'blah@test.co.uk'
  ];

  it('valid email test with restricted TLDs', function () {
    for (var i=0; i < validTldEmailAddresses.length; i++) {
      var email = validTldEmailAddresses[i];
      assert(validify.email(email, {tlds: ['com', 'net', 'org']}), 'email address ' + email + ' is invalid for restricted domains');
    }
  });

  it('invalid email test with restricted TLDs', function () {
    for (var i=0; i < invalidTldEmailAddresses.length; i++) {
      var email = invalidTldEmailAddresses[i];
      assert(validify.email(email, {tlds: ['com', 'net', 'org']}) === false, 'email address ' + email + ' is valid for restricted domains and shouldn\'t be');
    }
  });
});

/*jshint -W101:send */
