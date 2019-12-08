const multer = require('multer') // import library
const moment = require('moment')
const q = require('q')
const _ = require('underscore')
const fs = require('fs')
const dir = './uploads'

/** Store file on local folder */
let storage = multer.diskStorage({
destination: function (req, file, cb) {
    console.log("destination @@@@@@@file@@@@@@@@@@",file);
    cb(null, 'uploads')
},
filename: function (req, file, cb) {
    console.log("filename @@@@@@@@@@@@@@@@@",file);
    let date = moment(moment.now()).format('YYYYMMDDHHMMSS');
    console.log("filename @@@@@@@@@@date@@@@@@@",date);
    cb(null, date + '_' + file.originalname.replace(/-/g, '_').replace(/ /g,     '_'));
}
})

/** Upload files  */
let upload = multer({ storage: storage }).array('files')

/** Exports fileUpload function */
module.exports = {
fileUpload: function (req, res) {
    console.log("fileUpload is calling");
    let deferred = q.defer()

    /** Create dir if not exist */
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
        console.log(`\n\n ${dir} dose not exist, hence created \n\n`)
    }

    upload(req, res, function (err) {
        if (req && (_.isEmpty(req.files))) {
            console.log("upload calling if condition",req.files);
            deferred.resolve({ status: 200, message: 'File not attached', data: [] })
        } else {
            console.log("upload calling else condition");
            if (err) {
                console.log("upload calling else condition error",err);
                deferred.reject({ status: 400, message: 'error', data: err })
            } else {
                console.log("upload calling else condition req.files",req.files);
                deferred.resolve({
                    status: 200,
                    message: 'File attached',
                    filename: _.pluck(req.files,
                        'filename'),
                    data: req.files
                })
            }
        }
    })
    return deferred.promise
}
}

