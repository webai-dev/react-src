export default class MutationError extends Error {
    errors = [];
    constructor(errors, msg = 'There was an error applying the change you requested') {
        super(msg);
        this.errors = Array.isArray(errors) ? errors : [errors];
    }
}
