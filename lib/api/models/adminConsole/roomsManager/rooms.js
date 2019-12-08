var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var orderSchema = new mongoose.Schema({
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
});

var PaymentInfo = new mongoose.Schema({
  amt : Number,
  taxes : Number,
  discount: Number,
  chequeNo: String,
  receiptNo: String,
  description: String,
  mode: String
});


var roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    default:null
  },
  block: {
    type: String,
    default:null
  },
  comments: {
    type: String
  },
  housekeepingStatus: {
    type: String,
    default: 'Clean'
  },
  userid: {
    type: String,
    required: true
  },
  property: {
    type: String,
  },
  rates: [{
    type: Schema.Types.ObjectId,
    ref: 'Rate'
  }],

  amenities: [{
    type: Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  remarks: {
    type: String,
    default: ''
  },
  orders: [orderSchema],
  isRestaurantBooked: Boolean,
  restaurantData: {
    tableData: [orderSchema],
    isBooked: {
      type: Boolean,
      default: false
    },
    orderClosed: {
      type: Boolean,
      default: false
    },
    orderPrepared: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending'
    },
    orderId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'RestaurantOrder'
    },
    status: {
      type: String,
      default: 'Vacant'
    },
    orderTotal: {
      qty: Number,
      subTotal: Number,
      discount: Number,
      taxes: Number,
      paid: Number
    },
    paymentInfo: [PaymentInfo]
  },
  hotelCode:{
    type:Number,
    required: true
  }
},{strict:false});

roomSchema.pre('save', function (next) {
  var room = this;
  room.id = 'room-' + shortid.generate();
  next();
});

mongoose.model('Room', roomSchema);