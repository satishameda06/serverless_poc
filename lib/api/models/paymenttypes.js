var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var usertypeSchema = new mongoose.Schema({
    payment_titles: {
    	type: String,
        required : true
    },
    status:{
    	type: Boolean,
    	default: Number
    }

});

mongoose.model('PaymentTypes',usertypeSchema);
