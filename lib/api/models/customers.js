var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var CustomerSchema = new mongoose.Schema({
    title: String,
    firstname: String,
    middlename: String,
    lastname: String,
    phone: String,
    email: String,
    gender: String,
    nationality: '',
    idType: '',
    idNo: String,
    dob: '',
    address: {
        street: String,
        country: String,
        state: String,
        city: String,
        zip: String
    },
    cardInfo: {
        cardNo: String,
        cardType: String,
        expiryDate: String,
        cvv: String
    }
});


mongoose.model('Customers', CustomerSchema);
