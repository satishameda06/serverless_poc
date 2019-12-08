var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var addressSchema = new mongoose.Schema({
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    zipCode: {
        type: String
    }
    
});

mongoose.model('Address', addressSchema);