var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var PaymentSchema = new mongoose.Schema({
    bookingID: {
        type: Schema.Types.ObjectId,
        ref: 'BookingHistory',
        required: true
    },
    customerID: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    amount: {
        type: Number
    },
    paid: {
        type: Number
    },
    pay_time: {
        type: Date
    },
    invoice: {
        type: String
    },
    cancelled: {
        type: Boolean
    } 
});


mongoose.model('Payment', PaymentSchema);
