/**
 * Get File and converts it to base64 string
 *
 * @param {File} file
 * @returns {Promise} - promise will return base64 string
 */
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default getBase64;
