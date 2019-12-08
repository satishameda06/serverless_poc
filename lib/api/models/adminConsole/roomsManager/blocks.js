const mongoose=require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
const blocksSchema=new mongoose.Schema({
    id:{
        type:String
    },
    block_name:{
       type:String,
       unique: true,
       required: true
    },
    status:{
        type:Boolean,
        default:false
    },
    hotelCode: {
        type : Number,
        required: true
       }
},{strict:false});
blocksSchema.pre('save', function (next) {
    var floor = this;
    floor.id = 'block-' + shortid.generate();
    next();
  });

mongoose.model('block',blocksSchema);
blocksSchema.index({block_name:1,hotelCode:1});
