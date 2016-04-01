/**
 * Created by jeffersonwu on 4/1/16.
 */

var statusDiv = $gebi('statusDiv');
var myForm = $gebi('uploadForm');
var testButton = $gebi('testButton');
var formDataButton = $gebi('formDataButton');
var testDrop = $gebi('testDrop');
var progressBar = $gebi('progress');

var fileDiv = $gebi('file-id');

//XHR version
myForm.addEventListener('submit', function(event){

    //TODO Make true AJAX uploading with no page refresh: NodeJS side fix required?
    //event.preventDefault();   //preventing default seems to kill the file submission
    console.log('Default prevented. Encoding type: ' + this.enctype);

    uploadFiles('/api/multi', fileDiv.files[0]);   //for some reason, pointing to the first file works for multifiles...
});

//myFiles.files returns 'FileList'
testButton.addEventListener('click', function(event){
    console.log(fileDiv.files);
});




//TODO programatically inject iframe with defined route (socket? or XHR?)

//SCHEMA for DATAOBJECT
//TODO create this object on backend
var dataObject = {
    title: 'Test Banner!',
    version: 'v001',
    id: '1mDs78QbfW',
    src: './creative/1mDs78QbfW/myframe.html',
    widthVal: 300,
    heightVal: 250 ,
    sandbox: "allow-same-origin allow-scripts allow-popups",
    framePadding: 5
};

injectAdBanner('inject-here', dataObject);

// initialize drag and drop
if(window.File && window.FileList && window.FileReader){
    InitFileDrag();
}


/* ========== (dragDrop) =========== */
function InitFileDrag(){
    var fileselect = $gebi('file-id');
    var filedrag = $gebi('filedrag');

    fileselect.addEventListener('change', FileSelectHandler, false);

    //XHR2?
    var xhr = new XMLHttpRequest();
    if(xhr.upload) {
        //enable file drop
        filedrag.addEventListener('dragover', FileDragHover, false);
        filedrag.addEventListener('dragleave', FileDragHover, false);
        filedrag.addEventListener('drop', FileSelectHandler, false);
    };

    //TODO: Pipe dragged input into file input
}

//file drag hover (dragDrop)
function FileDragHover(event){
    //prevent default behavior: browser opening file
    event.stopPropagation();
    event.preventDefault();

    event.target.className = (event.type == 'dragover' ? 'hover': '');
}

//file selection (dragDrop)
function FileSelectHandler(event){
    //cancel event and hover styling
    FileDragHover(event);

    //fetch fileList object
    var files = event.target.files || event.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++){
        //ParseFile(f);
    }

    AddToUpload(event, fileDiv);

    //update drag window
    //TODO REQUIRES FormData to work
    var filedrag = $gebi('filedrag');
    filedrag.innerHTML = files[0].name;

}
// (dragDrop)
function ParseFile(file) {
    console.log(file.name + ', ' + file.type + ', ' + file.size);
}

//TODO (drag drop) (currently dbugging only)
function AddToUpload(evt, targetFileDiv){
    var file = evt.target.files || evt.dataTransfer.files;
    console.log(file);

    //testing singular
    targetFileDiv.files[0] = file[0];
}


// ===== CUSTOM FUNCTIONS =====

/**
 * Inject Banner into the div with the same ID.
 * @param div Div to insert ad banner into.
 * @param dataObject Data object to pass in. This object should be passed from the BACKEND as JSON.
 */
function injectAdBanner(div, dataObject){

    //after page has loaded....
    window.addEventListener('load', function(event){

        var injectDiv = document.getElementById(div);
        var myFrame = document.createElement('iframe');

        myFrame.setAttribute('id', dataObject.id);
        myFrame.setAttribute('src', dataObject.src);
        myFrame.setAttribute('width', dataObject.widthVal + dataObject.framePadding + 'px');
        myFrame.setAttribute('height', dataObject.heightVal + dataObject.framePadding + 'px');
        myFrame.setAttribute('sandbox', dataObject.sandbox);
        myFrame.classList.add('iframer');

        injectDiv.appendChild(myFrame);

    });
}

/**
 * Use this to upload single or multiple files to the node/express/multer backend.
 * @param url Upload API endpoint.
 * @param file File(s) object to upload.
 */
function uploadFiles(url, file){
    //var formData = new FormData();

    //formData.append(file.name, file);

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
        progressBar.value = (event.loaded/event.total*100);
    });

    xhr.send(file);
}

//TODO upload files using FormData
function FormDataUploadFile(url, file) {
    var formData = new FormData();
    formData.append(file.name, file);   //single file

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.addEventListener('error', function(event){
        console.log(Error('something horrible just happened!'));
    });

    xhr.upload.addEventListener('progress', function(event){
        console.log('uploading...' + event.loaded.toString() + '/' + event.total.toString() + ' - ' + (event.loaded/event.total*100).toFixed(2) + '%');
    });

    xhr.send(formData);
}

//helpers
function $gebi(id) {
    return document.getElementById(id);
}
