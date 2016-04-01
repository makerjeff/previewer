/**
 * PREVIEWER MODULE
 * Created by jefferson.wu on 3/23/16.
 */

//previewer-module.js

var fs = require('fs');

/**
 * Log server responses to a log file called 'server-log.txt'.
 * @param textString Text string to log.
 */
module.exports.logToFile = function(textString){

    var logObject = {};

    logObject.timestamp = new Date().toString();
    logObject.content = ': ' + '"' + textString + '"\n';

    fs.appendFile('server-log.txt', logObject.timestamp + logObject.content, function(error){
        if(error){
            return console.log(Error(error));
        }
    });
};

/**
 * Make an ID.
 * @param chars Number of characters to generate.
 * @returns {string} Returns a random string of characters based on 'chars'.
 */
module.exports.createRandomString = function(chars){
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i = 0; i < chars; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

/**
 * Make a folder with a random string as a name.
 * @returns {string} Returns an error.
 */
module.exports.createRandomFolder = function() {
    fs.mkdir(__dirname + '/public/creative/' + this.createRandomString(10), function(error){
        if(error){
            return console.log(Error(error));
        }
    });
};

/**
 * Create a folder with the current EPOCH time as the name
 */
module.exports.createTimestampFolder = function() {
    fs.mkdir(__dirname + '/public/creative/' + Date.now(), function(error){
        if(error) {
            return console.log(Error(error));
        }
    });
};