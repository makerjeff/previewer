/**
 * BCRYPT PLAY
 * Created by jeffersonwu on 4/3/16.
 */

var message = process.argv[2];

//load the module
var bcrypt = require('bcrypt');
var colors = require('colors');

//generate a 10 round salt
var salt = bcrypt.genSaltSync(10);

// //encodeURI the message
// var encodedMessage = encodeURI(message);

//create a hash from the salt
var hash = bcrypt.hashSync(message, salt);

//dump hash to console.
console.log('original message: '.blue + '"' + message.toString().green + '"');
console.log('hashed message: '.blue + hash.toString().green);

//TODO try async