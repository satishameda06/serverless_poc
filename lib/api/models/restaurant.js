var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var restaurantSchema = new mongoose.Schema({
  name: {
    type: String,

  },
  location: {
    type: String,

  },
  property: {
    type: Schema.Types.ObjectId,

  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },

  hotelCode: {
    type: Number,
    ref: 'users'
  },

  manager: [{
    type: Schema.Types.ObjectId,
    ref: 'manager',
  }],
  cashier: [{
    type: Schema.Types.ObjectId,
    ref: 'cashier',
  }],
  noOfTables: {
    type: Number
  },
  openingTime: {
    type: String
  },
  closingTime: {
    type: String
  },
  orderId: { type: Number }
}, { strict: false });


mongoose.model('Restaurant', restaurantSchema);
