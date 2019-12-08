const mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var roomCategories = new mongoose.Schema({
    category: String,
    available_rooms: Number,
    room_status:Number,
    date: Date,
    _id: Schema.Types.ObjectId,
});

const roomInventorySchema = new mongoose.Schema({
    id: {
        type: String
    },
    inventory: {
        room_categories: [roomCategories],
        from: Date,
        to: Date
    },
    hotelCode: {
        type: Number,
        required: true
    }
}, { strict: false });

roomInventorySchema.pre('save', function (next) {
    var inventory = this;
    inventory.id = 'inventory-' + shortid.generate();
    next();
});

mongoose.model('room_inventory', roomInventorySchema);
roomInventorySchema.index({ hotelCode: 1 });
