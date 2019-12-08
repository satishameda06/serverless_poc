const mongoose=require('mongoose');
const shortid=require('shortid');
const eventSchema=mongoose.Schema({
    text:String,
    start:Date,
    end:Date,
    resource:String,
    hotelCode:Number,
    mobile:String,
    ArrivalDate:Date,
    Guest:Number,
    Table:String,
    email:String,
    id:String
},{strict:false});

eventSchema.pre('save', function (next) {
    var event = this;
    event.id = 'event-' + shortid.generate();
    next();
  });

mongoose.model('restaurant_event',eventSchema);
eventSchema.index({start:1,end:1})