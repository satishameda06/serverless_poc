const mongoose = require('mongoose');
var shortid = require('shortid');
var crypto = require('crypto');
const emailConfigSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    smtpHost: {
        type: String,
        required: true,
        unique: true
    },
    smptUsername: {
        type: String,
        required: true,
        unique: true
    },
    smptPassowrd:{
        type: String,
        required: true,
    },
    smtpPort: {
        type: Number,
        required: true,
    },
    smtpEncryption: {
        type: String,
        required: true,
    },
    smtpAuth: {
        type: Boolean,
        default: false,
        required: true
    },
    hash: String,
    salt: String,
    hotelCode: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdDate: Date
},{ usePushEach: true }, { strict: false });
emailConfigSchema.path('smptUsername').validate(function (value, respond) {
    return mongoose.model('email_configuration').countDocuments({ smptUsername: value }).exec().then(function (count) {
        return !count;
    })
        .catch(function (err) {
            throw err;
        });
}, 'Username already exists.');

emailConfigSchema.methods.setPassword = function(password){
    console.log("@@@@@@@@@@@setPassword@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@",password);
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return(this.hash, this.salt);
  };
  
  emailConfigSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};


mongoose.model('email_configuration', emailConfigSchema);

emailConfigSchema.index({ smptUsername: 1 });
