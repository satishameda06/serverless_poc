var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var async = require('async');
var multer  = require('multer'),
    multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
const Busboy = require('busboy');
var s3Controller = require('./s3');

AWS.config.loadFromPath('./s3.config.json');
var s3 = new AWS.S3();


module.exports.add = function(req, res) {
  //console.log(req);
    res.json(req.body);
};

module.exports.getURL = function(req, res) {
 // This grabs the additional parameters so in this case passing     
   // in "element1" with a value.
  //  //console.log(req);
   const element1 = req;

   var busboy = new Busboy({ headers: req.headers });

   // The file upload has completed
   busboy.on('finish', function() {
    //console.log('Upload finished');

    // Your files are stored in req.files. In this case,
    // you only have one and it's req.files.element2:
    // This returns:
    // {
    //    element2: {
    //      data: ...contents of the file...,
    //      name: 'Example.jpg',
    //      encoding: '7bit',
    //      mimetype: 'image/png',
    //      truncated: false,
    //      size: 959480
    //    }
    // }

    // Grabs your file object from the request.
    const file = req.files.photo;
    //console.log(file);
    s3Controller.uploadToS3(file, function(err, fileData){
      if(err) res.status(500).json(err);
      else res.status(200).json(fileData.Location);
    });
   });

   req.pipe(busboy);
  
}


