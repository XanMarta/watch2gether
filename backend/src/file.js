const fs = require('fs');

// function read(filePath) {
//     const readableStream = fs.createReadStream(filePath);

//     readableStream.on('open', function () {
//         res.writeHead(206, {
//             "Content-Range": "bytes " + start + "-" + end + "/" + total,
//                 "Accept-Ranges": "bytes",
//                 "Content-Length": chunksize,
//                 "Content-Type": "video/mp4"
//         });
//         // This just pipes the read stream to the response object (which goes 
//         // to the client)
//         movieStream.pipe(res);
//     })

//     readableStream.on('error', function (err) {
//         console.log(`error: ${err.message}`)
//     })

//     readableStream.on('data', (chunk) => {
//         console.log(chunk)
//     })
// }

function uploadFile() {
    // TODO: Upload file to server 
}

