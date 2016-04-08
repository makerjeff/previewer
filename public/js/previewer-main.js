/**
 * Created by jefferson.wu on 4/7/16.
 */

/*------------------- vars -------------------*/
var uploadForm = $id('uploadForm');
var fileInput = $id('file-id');
var submitButton = $id('submitButton');

/*------------------- defaults -------------------*/
submitButton.style.visibility = 'hidden';



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
    submitButton.style.visibility = 'visible';
});

//submit file
uploadForm.addEventListener('submit', function(event){
    console.log('Encoding type: ' + this.enctype);

    drawProgress();

    //hide upload button
    submitButton.style.visibility = 'hidden';
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

        //TODO: this is horribly inefficient as it destroys and redraws every call.  FIx this.
        drawProgress().val.style.width = (event.loaded / event.total * 100) + '%';

        //progressValue.style.width = (event.loaded/event.total*100) + '%';
    });

    xhr.send(file);
}

function drawProgress(){
    var output = {};
    var oldDiv = document.getElementsByClassName('container')[0];
    oldDiv.innerHTML = '';


    var progressBar = document.createElement('div');
    var progressValue = document.createElement('div');

    progressBar.appendChild(progressValue);

    progressBar.classList.add('progressBar');
    progressValue.classList.add('progressValue');

    oldDiv.appendChild(progressBar);

    output.bar = progressBar;
    output.val = progressValue;

    return output;

}