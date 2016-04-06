/**
 * BCRYPT PLAY
 * Created by jeffersonwu on 4/3/16.
 */

var message = process.argv[2];

//load the module
var bcrypt = require('bcrypt');
var colors = require('colors');

var hash = '$2a$10$95MgrujRlU3XusHH7bN2s.DhCOqasrKynVTJyT2QUw/aqTqkMGtgu';


//test
var authenticate = bcrypt.compareSync(message, hash);

if(authenticate == true) {
    console.log('the password matches!');
} else {
    console.log('the password failed authentication!');
}