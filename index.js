/*
* Simple rest-api that will respond with a greeting message anytime something is posted to /hello
*
*/
const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder'); //allows for decoding of buffer objects in to strings
const handlers = require('./lib/handlers');

const server = http.createServer( (req, res) => {
    //parse data from the request

    //get key value pairs from the url
    const parsedUrl = url.parse(req.url, true)

    //get the path name in order to route the request
    const pathName = parsedUrl.pathname;
    //remove the beginning and trailing slashes
    const trimmedPath = pathName.replace(/^\/+|\/+$/g, "");

    //get any queries as key/values (e.g.) .../foo?fizz=buzz --> {fizz: "buzz"}
    const queryStringObj = parsedUrl.query;

    //get the http method
    const method = req.method.toLowerCase();

    //get the headers as key/values
    const headers = req.headers;

    //payload will come in as a stream in the "data" event
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => {
        buffer += decoder.write(data); //decode the buffer
    });

    req.on('end', () => {
        //cap off the buffer with whatever the request ended with
        buffer += decoder.end();

        const data = {
            trimmedPath,
            queryStringObj,
            method,
            headers,
            payload: buffer
        };

        //route the request
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        //the chosen route handler takes the parsed data object and a callback
            //the callback responds with a statusCode and a payload if there is one
        chosenHandler(data, (statusCode, payload) => {
            //use the values provided in the handler or use defaults
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);

            //send the response
            res.setHeader('Content-Type', 'application/json'); //tell the browser we're sending json
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
});

server.listen(3000, () => {
    console.log(`Server is listening on port 3000`);
});

//route the request to a handler
const router = {
    "hello": handlers.hello
};