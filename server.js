/**
 * 180 Previewer (transporter)
 */

/* ============ MODULES ============ */
var express = require('express');
var multer = require('multer');
var colors = require('colors');
var fileType = require('file-type');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');

// === custom modules ===
var previewer = require('./previewer-module');
var User = require('./models/user');

/* ============ GLOBALS ============ */
var done = false;

/* ============ INSTANCES ============ */
var app = express();
var storage = multer.diskStorage({
    destination: function(request, response, callback) {
        callback(null, './uploads');
    },
    filename: function(request, file, callback){
        callback(null, file.originalname);
    }
});

//== Multer upload module ==
var upload = multer({storage: storage}).single('uploadFile');
var multi = multer({storage: storage}).array('uploadFiles');

// == mongoDB ==
mongoose.connect('mongodb://localhost/mongerd');

/* ============ MIDDLEWARE ============ */

//server static files
app.use(express.static(__dirname + "/public/"));

//enable bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended: true
 }));

//enable CORS
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// = logs to node console with every transaction
app.use(function(request, response, next){
    console.log('%s %s %s %s', request.method, request.url, request.path, colors.yellow(Date().toString()));
    next();
});

/* ============ ROUTES ============ */

//default route
app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/index.html');
});


/* Standard form POST route */
app.post('/api/signup', function(request, response){

    var bString = '';

    //request.body.<variable> comes across unresolved according to webstorm, but works.
    bString = request.body.firstname + ' ' + request.body.lastname + ' pin: ' + request.body.pin;

    console.dir(bString);

    //createRandomFolder();
    previewer.logToFile(bString);

    response.type('text/html');
    response.end(bString);
});


/* AJAX single file upload route */
app.post('/api/upload', function(request, response){

    // multer singleFile upload
    upload(request, response, function(error){

        if(error) {
            return response.end("error uploading file!");
        }

        response.type('text/html');
        response.end('File is uploaded. ' + '<a href="/upload.html">Upload more!</a>');
        //console.log(request.body);
        console.log('file uploaded.');
    });
});

/* AJAX multiple file upload route */
app.post('/api/multi', function(request, response){

    multi(request, response, function(error){
        if(error){
            return response.end('error uploading files!');
        }

        response.type('text/html');
        response.end('Files have been uploaded. ' + '<a href="/multi-upload.html">Upload again! </a>');

        console.log(request.files);
    });
});


/* AJAX multi-file upload with auto unzip and folder creation */
// TODO dev
app.post('/api/unzip', function(request, response){

    multi(request, response, function(error){
        if(error){
            return response.end('error uploading files!');
        }

        response.type('text/html');
        response.end('Files have been uploaded and unzipped to root/public/unzipped');
    });
});

// check to see if db is responding
//default route
app.get('/api/databasedebug/', function(request, response){

    var chris = new User({
        name: 'chris',
        username: 'sevilayha',
        password: 'password'
    });

    //dudify
    chris.dudify(function(error, name){
        if(error){
            return console.log(Error(error));
        } else {
            console.log('adding ' + name);
        }
    });

    chris.save(function(error){
        if(error){
            console.log(Error(error));
        } else {
            console.log('User saved');
        }
    });

    response.type('text/html');
    response.end('attempting to add a user');
});

//custom query route
//TODO custom get-route for querying DB
// get for queries, post for updates

app.get('/api/databasedebug/:user', function(request, response){
    console.log(request.params.user);

    response.type('text/html');
    response.end('You are trying to find ' + request.params.user);
});




// basic 404 catch-all middleware
app.get('*', function(request, response){
    response.sendFile(__dirname + '/public/404.html');
});

/* ===== START SERVER ===== */
app.listen(3000, function(){
    console.log('Working on Port 3000'.blue);
});

//TODO auto-unzip

//TODO create folderArray of existing folders


/* ============ HELPER FUNCTIONS ============ */
