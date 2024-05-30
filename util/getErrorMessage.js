/**
 * Should accept any type of error and return Formatted error
 *
 * @param {string|Array|Error} error
 *
 * @returns {{title: string, message: string}}
 */
const getErrorMessage = (error) => {
    const errorObject = { title: 'Unknown error', message: 'No message for that error' };
    if (typeof error === 'string') {
        errorObject.title = `${ error.slice(0, 40) }`;
        errorObject.message = error;
    } else if (Array.isArray(error) && error.length > 0 && error[0].key) {
        error.forEach((errorPiece, index) => {// error for form fields
            const isFirst = index === 0;
            // const titlePiece = !errorPiece.key && !errorPiece.value ?
            //     'Unknown Array error' :
            // ((errorPiece.key === 'global' ? errorPiece.value : errorPiece.key) || '');

            const messagePiece = errorPiece.value;

            errorObject.title = isFirst ?
                `${messagePiece}` :
                `${ errorObject.title }; ${messagePiece}`;

            errorObject.message = error;
        });
    } else if (Array.isArray(error) && error.length > 0) {
        error.forEach((errorPiece, index) => {
            const isFirst = index === 0;
            const titlePiece = !errorPiece.message && !errorPiece.debugMessage ?
                'Unknown Array error' :
            ((errorPiece.message === 'global' ? errorPiece.debugMessage : errorPiece.message) || '');

            // if Unknown Array error display all errorPiece as JSON
            const messagePiece = errorPiece.debugMessage || JSON.stringify(errorPiece);

            errorObject.title = isFirst ?
                `${messagePiece}` :
                `${ errorObject.title }; ${messagePiece}`;

            errorObject.message = isFirst ?
                `${ titlePiece }: ${ messagePiece }` :
                `${ errorObject.message }; \n${ titlePiece }: ${ messagePiece }`;
        });
    } else if (error instanceof Error) {
        errorObject.title = error.name;
        errorObject.message = error.message;
    } else if (error.json && error.json.message) { // error for sign in sign up etc
        errorObject.title = error.json.message;
        errorObject.message = error.json.message;
    } else {
        errorObject.message = JSON.stringify(error);
    }

    return errorObject;
};

export default getErrorMessage;
