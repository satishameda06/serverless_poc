const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const shortid=require('shortid');
const resourceGroupSchema=mongoose.Schema({
    id:String,
    group_name:String,
    hotelCode:Number,
    no_of_tables:Number,
    tables:[{
        type: Schema.Types.ObjectId,
        ref: 'RestaurantTable'
    }]
},{strict:false});

resourceGroupSchema.pre('save', function (next) {
    var group = this;
    group.id = 'group-' + shortid.generate();
    next();
  });
mongoose.model('restaurant_group',resourceGroupSchema);