/*
* Handle all requests here
*
*/

const handlers = {};

//only accept post right now
handlers.hello = (data, callback) => {
    const acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers.hello[data.method](data, callback);
    } else {
        callback(405); //request not allowed
    }
};

//data is the data parsed from the request in index.js
//callback will respond with a statuscode and a payload if there is one
handlers.hello.post = (data, callback) => {
    callback(200, {"message": 'Hello world!'});
};

handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;