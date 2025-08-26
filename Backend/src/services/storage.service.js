var ImageKit = require("imagekit");
var mongoose = require('mongoose');

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_URL,
    privateKey : process.env.IMAGEKIT_PRIVATE_URL,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

function uploadFile(file){
return new Promise((resolve,reject)=>{
    imagekit.upload({
        file : file.buffer,
        fileName : (new mongoose.Types.ObjectId().toString()),
        folder: "MoodySongs"
    },(error,result)=>{
        if(error) return reject(error);
        resolve(result);
    })
})
}

module.exports = uploadFile;