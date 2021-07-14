

// Gets a filename extension.
function getExtension(filename) {
    return filename.split(".").pop();
}

function isValidFile(filename, mimetype, allowedExts, allowedMimeTypes) {
    // Get file extension.
    const extension = getExtension(filename);

    return allowedExts.indexOf(extension.toLowerCase()) != -1 &&
        allowedMimeTypes.indexOf(mimetype) != -1;
}

// Test if a file is valid based on its extension and mime type.
function isValidFileVideo(filename, mimetype) {
    const allowedExts = ["mp4", "webm", "ogg"];
    const allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg"];

    return isValidFile(filename, mimetype, allowedExts, allowedMimeTypes)
}

// Test if a file is valid based on its extension and mime type.
function isValidFileImage(filename, mimetype) {
    const allowedExts = ["gif", "jpeg", "png", "jpg"];
    const allowedMimeTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];

    return isValidFile(filename, mimetype, allowedExts, allowedMimeTypes)
}

// Test if a file is valid based on its extension and mime type.
function isValidFileDocument(filename, mimetype) {
    const allowedExts = ["pdf", "doc", "txt"];
    const allowedMimeTypes = ["application/pdf", "application/msword", "text/plain"];

    return isValidFile(filename, mimetype, allowedExts, allowedMimeTypes)
}

module.exports = { getExtension, isValidFileVideo, isValidFileImage, isValidFileDocument };