var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var Temprates=new mongoose.Schema({
    date:Date,
    rate:Number,
    updateAt:{type:Date},
    hotelCode:Number,
    userID:String,
    roomCategory:String,
    rateCategory:String,
    roomId:{
      type:Schema.Types.ObjectId,
      ref:'Room'
    },
    deviations:Number
  },{strict:false});
mongoose.model('temp_rates', Temprates);
Temprates.index({hotelCode:1,userID:1,roomCategory:1,rateCategory:1,date:1});