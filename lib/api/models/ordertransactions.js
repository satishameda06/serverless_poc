var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var OrderTransactionSchema = new mongoose.Schema({
  amount_paid : Number,
  balance : Number,
  orderId:{
    type:Schema.Types.ObjectId,
    ref:'RestaurantOrder'
  },
  payment_status:String,//refunded,paid,
  payment_type: String,
  folio: Number,
  date: Date,
  time: Date,
  description: String,
  hotelCode:Number,
  id:String,
  chequeNo:String,
  receiptNo:String
},{strict:false});
OrderTransactionSchema.pre('save', function (next) {
    var trans = this;
    trans.id = 'trans-' + shortid.generate();
    next();
  });
mongoose.model('OrderTransaction', OrderTransactionSchema);