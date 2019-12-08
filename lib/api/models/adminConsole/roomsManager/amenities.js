var mongoose = require( 'mongoose' );
var shortid = require('shortid');
var AmenitySchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  description: {
      type: String,
      required: true
  },
  image: {
    type: String
  },
  rate: {
    type: String,
    required: true
  },
  alloted_roomid: {
      type: [String]
  },
  vat: {
    type: Number
  },
  otherTax: {
    type: Number
  },
  userId: {
      type: String,
      required: true
  },
  hotelCode: {
    type : Number,
    required: true
   }
},{strict:false});

AmenitySchema.pre('save', function (next) {
  var Amenity = this;
  Amenity.id = 'amnty-' + shortid.generate();
  next();
});

mongoose.model('Amenity', AmenitySchema);
