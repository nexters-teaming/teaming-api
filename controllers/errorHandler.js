/**
 * Created by YS on 2016-07-28.
 */

/**
 * Error handler, return error object
 * @param err : error code
 * @param msg : error massage
 * @returns [Object] Error
 */
var errorHandler = function(err) {

    if (err) {
        var error;
        if (typeof err.message != 'undefined') {
            error = new Error(err.message);
            error.status = err;
        } else {
            error = new Error("");
            error.status = err;
        }
        return error;
    }
};

module.exports = errorHandler;