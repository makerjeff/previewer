/**
 * Created by jeffersonwu on 4/9/16.
 */

var fs = require('fs');
var colors = require('colors');


var inputFile = processMe.argv[2];
var outputFile = processMe.argv[3];

// console.log('Source file: ' + inputFile);
// console.log('Destination file: ' + outputFile);

if(inputFile == undefined || outputFile == undefined) {
    console.log(colors.red('Not enough parameters!'));
} else {
    console.log('attempting to rename file...');

    fs.rename(__dirname + '/uploads/' + inputFile, __dirname + '/uploads/renamed/' + outputFile, function(error){
        if(error){
            console.log(Error(error.toString().red));
        } else {
            console.log('successfully renamed file'.green);
        }
    });
}

