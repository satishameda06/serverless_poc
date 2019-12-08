const mongoose = require('mongoose');
var shortid = require('shortid');
const languageSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    languageName: {
        type: String,
        required: true,
        unique: true
    },
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    hotelCode: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdDate: Date
}, { strict: false });

languageSchema.pre('save', function (next) {
    var language = this;
    language.id = 'language-' + shortid.generate();
    next();
});

mongoose.model('language', languageSchema);

languageSchema.index({ languageName: 1, hotelCode: 1 });
