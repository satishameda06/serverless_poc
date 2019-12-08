
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var shortid = require('shortid');
var amenitySchema = new mongoose.Schema({
  amenityId: {
    type: Schema.Types.ObjectId,
    ref: 'Amenity'
  },
  amenityName: String
});
// var ratesSchema=new mongoose.Schema({
//   rateId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Rates'
//   },
//   amenityName: String
// })
var roomCategorySchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String
  },
  image: {
    type: String
  },
  imageCaption: {
    type: String
  },
  description: {
    type: String
  },
  room_numbers: {
    type: [Number],
  },
  base_price: {
    type: Number,
    required: true
  },
  ex_person_charge: {
    type: Number,
    required: true
  },
  ex_bed_charge: {
    type: Number,
    required: true
  },
  no_of_rooms: {
    type: Number,
    required: true
  },
  occup_base: {
    type: Number,
    required: true
  },
  occup_max: {
    type: Number,
    required: true
  },
  occup_ex_beds: {
    type: Number,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  property: {
    type: String,
  },
  amenities: [amenitySchema],
  sold_rooms:{
    type: Number
  },
  hotelCode:{
    type:Number,
    required: true
  }
},{strict:false});

roomCategorySchema.pre('save', function (next) {
  var roomCat = this;
  roomCat.id = 'rcat-' + shortid.generate();
  next();
});


mongoose.model('RoomCategory', roomCategorySchema);
