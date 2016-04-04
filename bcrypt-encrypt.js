/**
 * BCRYPT ENCRYPT
 * Created by jeffersonwu on 4/3/16.
 */

var message = process.argv[2];

//load the module
var bcrypt = require('bcrypt');

//generate a 10 round salt
var salt = bcrypt.genSaltSync(10);

//create a hash from the salt
var hash = bcrypt.hashSync(message, salt);

//dump hash to console.
console.log(hash);

//TODO try async