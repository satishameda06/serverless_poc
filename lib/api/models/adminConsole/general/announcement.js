const mongoose = require('mongoose');
var shortid = require('shortid');
const announcementSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    announcement: {
        type: String,
        required: true,
        unique: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    visibleTo:{
        frontdesk: {
            type: Boolean,
            default: false
          },
          houseKeeping: {
            type: Boolean,
            default: false,
          },
          restaurant: {
            type: Boolean,
            default: false
          },
          adminConsole: {
            type: Boolean,
            default: false
          }
    },
    userId: {
        type: String,
        required: true
    },
    hotelCode: {
        type: Number,
        required: true
    },
    createdDate: Date
}, { strict: false });

announcementSchema.pre('save', function (next) {
    var announcement = this;
    announcement.id = 'announcement-' + shortid.generate();
    next();
});

mongoose.model('announcement', announcementSchema);

announcementSchema.index({ title: 1 });
