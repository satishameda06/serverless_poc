var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var shortid = require('shortid');

var SubscriptionSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String
  },
  email: {
      type: String
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date
  },
  subscriptionType:String,
  temp_terminate:{type:Number,default:1},
  access:[],
  hotelCode:Number,
  revenue:{
    total_paid:{
        type: Number,
        required: true
    },
    total_balance:{
        type: Number,
        required: true
    }
 },
 userId: {
      type: String
  }
},{strict:false});

SubscriptionSchema.pre('save', function (next) {
  var rate = this;
  rate.id = 'subscribe-' + shortid.generate();
  next();
});

mongoose.model('subscription', SubscriptionSchema);
SubscriptionSchema.index({hotelCode:1,userId:1,id:1})
