'use strict';

const http = require('http');

// requestParser will dissect the URL and return an object with path, query, params, etc...
const requestParser = require('./lib/parse-request');
// bodyParser reads all of the post data in packets and puts the resulting JSON object (if exists) on req.body
const bodyParser = require('./lib/parse-body');

const requestHandler = (req, res) => {

  // console.log(req.method);
  // console.log(req.headers);
  // console.log(req.url);

  // parse the URL
  requestParser.execute(req);

  if(req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.write(`<!DOCTYPE html><html><body><h1>${req.url.query.you}</h1></body></html>`);

    // instead of manual HTML, you could instead use 'fs' module to read a file and res.write() the contents of that file

    res.end();
    return;
  } 
  

  // will always return a JSON object. The object will either be the JSON that you posted in or an error object formatted as JSON

  else if(req.method === 'POST') {
    bodyParser.execute(req)
      .then((req) => {
        res.setHeader('Content-Type', 'text/json');
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.write(JSON.stringify(req.body));
        res.end();
        return;
      })
      .catch((err) => {
        let errorObject = {error:err};
        res.setHeader('Content-Type', 'text/json');
        res.statusCode = 500;
        res.statusMessage = 'Server Error';
        res.write(JSON.stringify(errorObject));
        res.end();
        return;
      });
  }
};

// Server callback
const app = http.createServer(requestHandler);

// Expose the start/stop methods to be called in index.js
module.exports = {
  start: (port, callback) => app.listen(port, callback),
  stop: (callback) => app.close(callback),
};