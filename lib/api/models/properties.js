var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;


var propertySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    hotelCode: {
      type: Number,
      ref: 'users',
      required: true
    }
},{strict:false});


mongoose.model('Property', propertySchema);
