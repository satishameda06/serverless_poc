var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var shortid = require('shortid'); 

var MenuItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  rate: {
      type: Number
  }, 
  featured: {
      type: Boolean
  },
  productcode: {
    type: String
  },
  adultquantity: {
    type: String
  },
  childquantity: {
    type: String
  },
  roomquantity: {
    type: String
  },
  img: {
    type: String
  },
  id: {
    type: String,
  },
  price: {
    type: Number
  },
  tax: {
    type: Number,
  },
  taxAmount: {
    type: Number,
  },
  totalAmount:{
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  hotelCode:{
    type: Number,
    required: true
  }
},{strict: false });

MenuItemsSchema.pre('save', function (next) {
  var menuit = this;
  menuit.id = 'menuit-' + shortid.generate();
  next();
});

mongoose.model('MenuItems', MenuItemsSchema);
