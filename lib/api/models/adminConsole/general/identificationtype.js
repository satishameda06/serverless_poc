const mongoose = require('mongoose');
var shortid = require('shortid');
const identificationTypeSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    identificationTypes: {
        type: String,
        required: true,
        unique: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
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

identificationTypeSchema.pre('save', function (next) {
    var identificationType = this;
    identificationType.id = 'identification-' + shortid.generate();
    next();
});

mongoose.model('identificationtype', identificationTypeSchema);

identificationTypeSchema.index({ identificationTypes: 1, shortCode: 1 });
