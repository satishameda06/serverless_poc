var mongoose = require('mongoose');
const Productkeys=new mongoose.Schema({
    _id: { type: String ,default:'prodkey'},
    productIdSequence: { type: Number, default: 10000 }
}, { strict: false });

mongoose.model('productkey',Productkeys);
Productkeys.index({productIdSequence:1});