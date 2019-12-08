const mongoose=require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
const floorSchema=new mongoose.Schema({
    id:{
        type:String
    },
   title:{
       type:String,
       required: true
    },
    statue:{
        type:Boolean,
        default:false
    },
    hotelCode:{
        type:Number,
        required: true
    }
},{strict:false});

floorSchema.pre('save', function (next) {
    var floor = this;
    floor.id = 'floor-' + shortid.generate();
    next();
  });

mongoose.model('floor',floorSchema);
floorSchema.index({title:1,hotelCode:1});
