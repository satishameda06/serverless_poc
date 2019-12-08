var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var shortid = require('shortid');

var MenuCategoriesSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true

  },
  description: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId
  },
  hotelCode:{
    type: Number,
  }
},{strict: false });

MenuCategoriesSchema.pre('save', function (next) {
  var menucat = this;
  menucat.id = 'menucat-' + shortid.generate();
  next();
});


mongoose.model('MenuCategories', MenuCategoriesSchema, 'menucategories');
