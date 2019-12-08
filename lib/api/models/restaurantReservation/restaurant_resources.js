const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const shortid=require('shortid');
const resourceSchema=mongoose.Schema({
    name:String,
    seats:Number,
    hotelCode:Number,
    resource_groupId:{
        type: Schema.Types.ObjectId,
        ref: 'restaurant_group'
    }
},{strict:false});

resourceSchema.pre('save', function (next) {
    var resource = this;
    resource.id = 'resource-' + shortid.generate();
    next();
  });
mongoose.model('restaurant_resource',resourceSchema);