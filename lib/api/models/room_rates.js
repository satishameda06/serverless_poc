var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var Roomrates=new mongoose.Schema({
    date:Date,
    updateAt:{type:Date},
    hotelCode:Number,
    userID:String,
    rates:[]
        
    
},{strict:false});
mongoose.model('room_rates', Roomrates);
Roomrates.index({hotelCode:1,userID:1,roomCategory:1,date:1});