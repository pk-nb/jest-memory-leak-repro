const https = require('https');

let originalHttpsRequest = https.request

https.request = (options, cb) => {
  return originalHttpsRequest.call(https, options, cb);
};

// If this is uncommented, the leak goes away!
// originalHttpsRequest = null
