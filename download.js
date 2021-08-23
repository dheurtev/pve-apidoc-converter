// regarding apidoc.js https://forum.proxmox.com/threads/api-questions.37581/
// inspired by :
// https://www.geeksforgeeks.org/how-to-download-a-file-using-node-js/
//https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries

var https = require('https');
var fs = require('fs');

// Where apidoc.js is located on the proxmox server
var url = 'https://pve.proxmox.com/pve-docs/api-viewer/apidoc.js';

// Where to save it
var dest = './output/proxmoxsrc/apidoc.js';

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
  // if not callback, it's successful
  return 'Download completed';
};

//perform the download
var state = download(url, dest);

//put meaningful log message
let res = state.concat(' from: ').concat(url).concat(' and saved to file: ').concat(dest);
console.log(res)
