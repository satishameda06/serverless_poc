var mongoose = require('mongoose');
const hotelCodeSchema =new mongoose.Schema({
    _id: { type: String ,default:'hotelCode'},
    hotelSequenceCode: { type: Number, default: 10000 }
}, { strict: false });

mongoose.model('hotelcodes',hotelCodeSchema)
