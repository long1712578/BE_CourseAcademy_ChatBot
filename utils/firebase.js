const firebase = require('firebase');
require('firebase/storage');
const { getExtension } = require('./upload');

const firebaseConfig = {
    apiKey: "AIzaSyDPqhy4ElRlhhNAbJThw3MRB16PRhfPahY",
    authDomain: "becourseacademy.firebaseapp.com",
    projectId: "becourseacademy",
    storageBucket: "becourseacademy.appspot.com",
    messagingSenderId: "6712336773",
    appId: "1:6712336773:web:93f754cfe6d7cd6da2a4ec",
    measurementId: "G-2FETRDS3RW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a root reference
const storageRef = firebase.storage().ref();
const uploadFileToFirebase = (file) => {
    return new Promise((resolve, reject) => {
        const filename = file.fieldname + "-" + new Date().getTime() + "." + getExtension(file.originalname);
        const fileRef = storageRef.child(file.fieldname + '/' + filename);
        const uploadTask = fileRef.put(file.buffer, { contentType: file.mime });

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        throw new Error('User doesn\'t have permission to access the object');
                    case 'storage/canceled':
                        // User canceled the upload
                        throw new Error('User canceled the upload');

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                });
            }
        );
    })
}

module.exports = uploadFileToFirebase;
