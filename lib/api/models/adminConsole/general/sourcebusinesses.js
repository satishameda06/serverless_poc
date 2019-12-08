const mongoose = require('mongoose');
var shortid = require('shortid');
const sourcebusinessesSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    source: {
        type: String,
        required: true,
        unique: true
    },
    commission: {
        type:  Number,
        required: true,
      
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

sourcebusinessesSchema.pre('save', function (next) {
    var source = this;
    source.id = 'source-' + shortid.generate();
    next();
});

mongoose.model('sourcebusinesses', sourcebusinessesSchema);

sourcebusinessesSchema.index({ identificationTypes: 1, shortCode: 1 });
