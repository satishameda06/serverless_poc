const mongoose = require('mongoose');
var shortid = require('shortid');
const currencySchema = new mongoose.Schema({
    id: {
        type: String,
    },
    currencyName: {
        type: String,
        required: true,
        unique: true
    },
    abreviation: {
        type: String,
        required: true,
        unique: true
    },
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    conversionRate: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
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

currencySchema.pre('save', function (next) {
    var currency = this;
    currency.id = 'currency-' + shortid.generate();
    next();
});

mongoose.model('currency', currencySchema);

currencySchema.index({ currencyName: 1, abreviation: 1 });
