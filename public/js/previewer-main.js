/**
 * Created by jefferson.wu on 4/7/16.
 */

/*------------------- vars -------------------*/
var uploadForm = $id('uploadForm');
var fileInput = $id('file-id');
var submitButton = $id('submitButton');
var progressBar = $id('progressBar');

/*------------------- defaults -------------------*/
submitButton.hidden = true;


/*------------------- events listeners -------------------*/
//show upload button
fileInput.addEventListener('change', function(event){
    //console.log(event.type);

    //if there's a file
    if(this.files.length != 0){
        console.log('You\'ve attached: ' + this.files[0].name);
    }

    //DEBUG
    console.log(fileInput.files);

    //show upload button
    submitButton.hidden = false;
});

//submit file
uploadForm.addEventListener('submit', function(event){
    console.log('Encoding type: ' + this.enctype);

    uploadFiles('/upload', fileInput.files[0]);
});

/**
 * UPLOAD FILES
 * @param url Upload API endpoint.
 * @param file FileObject to upload.
 */
function uploadFiles(url, file){

    var xhr = new XMLHttpRequest();
    //can xhr.open(<method>, <url>, async);
    xhr.open('POST', url, true);

    xhr.upload.addEventListener('load', function(event){
        console.log('file transfer has started!');
    });
    // error handler
    xhr.upload.addEventListener('error', function(event){
        console.log(Error('something horrible just happened!'));
    });
    // progress handler
    xhr.upload.addEventListener('progress', function(event){
        console.log('uploading... ' + event.loaded.toString() + '/' + event.total.toString() + ' - ' + (event.loaded/event.total*100).toFixed(2) + '%');
        //progressBar.value = (event.loaded/event.total*100);
    });

    xhr.send(file);
}