'use strict';

// Expose our interface
const bodyParser = module.exports = {};

bodyParser.execute = (req) => {

  // Because we will be receiving an unknown numbeer of packets/buffers over an unknown period of time,
  // this is going to be asynchronous, so we will be returning a "Promise"
  // Whatever ends up being 'resolved' is the parameter to the then() in the calling block
  // whatever is rejected ends up in the catch() block
  return new Promise((resolve, reject) => {
    let text = '';

    // This event will fire for each packet of data. Can assume that it's always going to be incomplete, so we just build up the 'text' string each time this event fires.
    req.on('data', (buffer) => {
      text = text + buffer.toString();
    });

    // When the last packet of information comes in (the last buffer), the "end" event fires, giving us the
    // opportunity to turn "text" into a JSON object.  If that works, we resolve with that object stuck onto req.body
    // If not, we reject with an error message.

    req.on('end', () => {
      try {
        req.body = JSON.parse(text);
        resolve(req);
      }
      catch(err) {
        reject(err);
      }
    });
  });
};