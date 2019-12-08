var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var shortid = require('shortid');

var RoomRatesSchema = new mongoose.Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  roomName: String,
  rate: Number
});
var daywiserates=new mongoose.Schema({
  date:Date,
  rate:Number,
  updateAt:{type:Date,required:true}
},{strict:false})
var RateWithDateSchema=new mongoose.Schema({
  roomId:{
    type:Schema.Types.ObjectId,
    ref:'Room'
  },
  roomCategory:String,
  daywiserates:[daywiserates],
  createdAt:Date
})
var RateSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  description: {
      type: String,
  },
  value: {
    type: Number,
  },
  type: {
    type: String
  },
  roomRates: [RoomRatesSchema],
  vat: {
    type: Number
  },
  other_tax: {
    type: Number
  },
  alloted_roomid: {
      type: [String]
  },
  property: {
    type: String,
  },
  userId: {
      type: String,
      required: true
  },
  inclusive:{
    type: String,
    required: true
  },
  refundable:{
    cancellationWindow: String,
    insideWindowPenalty: String,
    outsideWindowPenalty:String
  },
  nonRefundable:Boolean,
  policy:{
    type:String
  },
  deviations:{
    type:Number
  },
    hotelCode: {
    type: Number,
    required: true
},
ratewithdate:[RateWithDateSchema],
ratesDays:Number
},{strict:false});

RateSchema.pre('save', function (next) {
  var rate = this;
  rate.id = 'rat-' + shortid.generate();
  next();
});

mongoose.model('Rate', RateSchema);
RateSchema.index({hotelCode:1,roomRates:1,name:1,id:1})
