var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var ItemSchema = new mongoose.Schema({
  category: String,
  description: String,
  id: String,
  img: String,
  name: String,
  qty: Number,
  rate: Number,
  userId: Schema.Types.ObjectId,
  hotelCode:Number,
  _id: Schema.Types.ObjectId,
},{strict:false});

var orderSchema = new mongoose.Schema({
  items: [ItemSchema],
  tableId: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantTable'
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  bookingId:{
    type:Schema.Types.ObjectId,
    ref:'Bookings'
  },
  hotelCode:{
    type:Number,
    required:true
  },
  kitchenId: Schema.Types.ObjectId,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid']
  },
  status: {
    type: String,
    enum: ['unprepared', 'confirmed', 'prepared', 'cancelled', 'completed']
  },
  payedAmt: {
    type: Number,
    default: 0
  },
  pending_balance:{
    type: Number,
    default: 0
  },
  refundAmt: {
    type: Number,
    default: 0
  },
  paymentInfo: [{
    mode: String,
    chequeNo: String,
    receiptNo: String,
    description: String,
    amt: Number
  }],
  refundInfo: [{
    amt: Number
  }],
  orderId:Number,
  OrderDateTime:Date,
  CancelledOn:Date,
  isCancelled:{
    type:Number,
    default:0
  },
  CancelledBy:String
},{strict:false});



mongoose.model('RestaurantOrder', orderSchema);
