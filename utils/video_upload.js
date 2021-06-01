// Gets a filename extension.
function getExtension(filename) {
    return filename.split(".").pop();
}

// Test if a file is valid based on its extension and mime type.
function isValidFile(filename, mimetype) {
    const allowedExts = ["mp4", "webm", "ogg"];
    const allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg"];

    // Get file extension.
    const extension = getExtension(filename);

    return allowedExts.indexOf(extension.toLowerCase()) != -1 &&
        allowedMimeTypes.indexOf(mimetype) != -1;
}


module.exports = { getExtension, isValidFile };