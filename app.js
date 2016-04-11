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
var helpers = require('./helpers/previewer-helpers');
/* ============ GLOBALS ============ */

var dataHolder = {
    app: 'Previewer',
    version: '0.0.3',
    author: {
        name: 'Jefferson Wu',
        email: 'jefferson.wu@180la.com'
    }
};

//start port
var port = process.argv[2];

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

/*========================= UPLOADING =========================*/

// upload route
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

            //TODO need to check MD5 hash to verify completion of file.  No error checking yet.
            //TODO MD5 hash check on frontend + backend
        }
    });
});

// basic 404 catch-all route
app.get('*', function(request, response){
    response.sendFile(__dirname + '/public/404.html');
});

/* ===== START SERVER ===== */
initServer(port);


/* ===== FUNCTIONS ===== */

/**
 * Initialize the server.
 * @param port Port number to use. Defaults to 3000 if no port is specified.
 */
function initServer(port) {
    //if no port selected, default to 3000
    port = port || 3000;
    app.listen(port, function(){
        console.log(dataHolder.app + ' version ' + dataHolder.version + ' running on port ' + process.argv[2] + '.' );
    });
}