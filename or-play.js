/**
 * Created by jeffersonwu on 4/9/16.
 */

var colors = require('colors');

var value1, value2, value3;
var processMe;

// console.log(value1);
// console.log(value2);
// console.log(value3);

value1 = null;
value2 = 200;

processMe = value1 || value2 || value3;

console.log(processMe);