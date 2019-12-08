var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountCodeSchema = new mongoose.Schema({
       account_name: {
         type: String,
         required : true
       },
       account_code: {
        type: String,
        required : true,
        unique:true
       },
       hotelCode: {
        type : Number,
        required: true
       }
     },{strict:false}
);
mongoose.model('accountcode', AccountCodeSchema);
AccountCodeSchema.index({account_name:1,account_code:1,hotelCode:1})