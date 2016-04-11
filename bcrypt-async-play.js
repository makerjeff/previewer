/**
 * BCRYPT PLAY
 * Created by jeffersonwu on 4/3/16.
 */


var message = process.argv[2];

//load the module
var bcrypt = require('bcrypt');
var colors = require('colors');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bcrypt');

var db = mongoose.connection;

//event listeners
db.on('error', console.error.bind(console, 'connection error:' ));



// once connection occurs,,
db.once('open', function(){
    console.log('connection established!');

    //define a schema
    var messageSchema = mongoose.Schema({message: String, hash: String});

    //define a model using schema
    var messageModel = mongoose.model('message', messageSchema);

    //===== schema methods =====
    messageSchema.methods.bHashSync = function(message, salt){
        return bcrypt.hashSync(message, salt);
    };





    // TODO: turn this into a schema method
    var hash = bcrypt.hashSync(message, 10);

    //create new data to be stored
    var messageObject = new messageModel({message: message, hash: hash});

    console.log(messageObject.message);

});
