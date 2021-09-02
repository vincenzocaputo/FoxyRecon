
/**
 * Replace the placeholders in the URL with the appropriate string
 * @param {originalURL} URL to modify
 * @param {paramString} string to use to replace the placeholder
 * @return {finalURL} resulting URL
 */
function cookURL(originalURL, paramString) {
    var finalURL = originalURL;
    // plaintext parameter
    if(originalURL.includes('\%s')){
        finalURL = originalURL.replace('\%s',encodeURIComponent(paramString));
    } else if(originalURL.includes('\%r')){
        // Do not encode the input string
        finalURL = originalURL.replace('\%r',paramString);
    }     
    return finalURL;
}
