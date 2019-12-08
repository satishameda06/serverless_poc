var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    hotelCode:{type:Number,required:true,ref:'User'},
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
},{strict:false});

mongoose.model('tokens', tokenSchema);