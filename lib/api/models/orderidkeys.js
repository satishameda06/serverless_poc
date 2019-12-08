var mongoose = require('mongoose');
const ordeIDKeys =new mongoose.Schema({
    _id: { type: String ,default:'Orderkey'},
    orderIdSequence: { type: Number, default: 10000 }
}, { strict: false });

mongoose.model('orderidkey',ordeIDKeys)
ordeIDKeys.index({orderIdSequence:1});
