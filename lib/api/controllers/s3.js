var s3Util = require('../../utils/s3Util');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./s3.config.json');
var s3bucket = new AWS.S3();

module.exports.listBuckets = function(req, res){
    s3Util.listBuckets(req, function(err, data){
        if(err) res.status(500).json(err);
        else res.status(200).json(data);
    })
}

module.exports.uploadFile = function(req, res) {
    //console.log(req);
    res.json(req);
    // s3Util.uploadFile(payload, function(err, data){
    //     if(err) res.status(500).json(err);
    //     else res.status(200).json(data);
    // })
}

module.exports.uploadToS3 = function(file, callback) {
    //console.log("uploadToS3-file",file);
    // let s3bucket = new AWS.S3({
    //   accessKeyId: IAM_USER_KEY,
    //   secretAccessKey: IAM_USER_SECRET,
    //   Bucket: BUCKET_NAME,
    // });
    //s3bucket.createBucket(function () {
      var params = {
       Bucket: 'pms-bucket',
       Key: file.name,
       Body: file.data,
      };
      s3bucket.upload(params, function (err, data) {
       if (err) {
        //console.log('error in callback');
        //console.log(err);
       }
       //console.log('success');
       //console.log(data);
       callback (null, data);
      });
    //});
   }