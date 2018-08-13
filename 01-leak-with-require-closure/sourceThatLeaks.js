const https = require('https');

let buffer = Buffer.alloc(1000000000)

https.request = (options, cb) => {
  console.log(buffer.byteOffset, nodeBuffer.length);
  return cb(buffer.byteOffset);
};
