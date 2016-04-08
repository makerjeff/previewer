/**
 * 180 Previewer (transporter)
 */

/* ============ MODULES ============ */
var express = require('express');
var multer = require('multer');
var jade = require('jade');
var colors = require('colors');
var fileType = require('file-type');
var bodyParser = require('body-parser');
var fs = require('fs');
var bcrypt = require('bcrypt');

// === custom modules ===
var helpers = require('./previewer-helpers');
/* ============ GLOBALS ============ */

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

/* ============ MIDDLEWARE ============ */
//use jade
app.set('view engine', 'jade');
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
    response.render('index', dataHolder);
});

/*----------------------- BCRYPT -----------------------*/
/*----------------------- JADE -----------------------*/

var dataHolder = {
    app: 'Previewer',
    version: '0.0.2',
    author: {
        name: 'Jefferson Wu',
        title: 'Creative Technologist'
    }
};

app.post('/upload', function(request, response){


    multi(request, response, function(error){

        var fileInfo = {
            name: request.files[0].filename,
            path: request.files[0].path
        };

        if(error){
            return response.end('Rut Roh! File failed on upload!');
        } else {
            dataHolder.name = fileInfo.name;
            dataHolder.path = fileInfo.path;

            response.render('upload', dataHolder);
            console.log(request.files[0].filename + ' uploaded to: ' + request.files[0].path);
        }
    });
});


/*========================= UPLOADING =========================*/
/* AJAX multiple file upload route */
app.post('/api/multi', function(request, response){

    multi(request, response, function(error){
        if(error){
            return response.end('error uploading files!');
        } else {
            response.type('text/html');
            response.end('Files have been uploaded. ' + '<a href="/multi-upload.html">Upload again! </a>');
            console.log(request.files);
        }
    });
});


/* AJAX multi-file upload with auto unzip and folder creation */
// TODO dev
app.post('/api/upload', function(request, response){
    multi(request, response, function(error){
        if(error){
            return response.end('error uploading files!');
        }
        response.type('text/html');
        response.end('Files have been uploaded and unzipped to root/public/unzipped');
    });
});


// basic 404 catch-all middleware
app.get('*', function(request, response){
    response.sendFile(__dirname + '/public/404.html');
});

/* ===== START SERVER ===== */
app.listen(3000, function(){
    console.log('Working on Port 3000'.blue);
});

/* ============ HELPER FUNCTIONS ============ */
