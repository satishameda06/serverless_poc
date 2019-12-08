const mongoose = require('mongoose');
const shortid = require('shortid');
const marketSegmentSchema=new mongoose.Schema({
    id: String,
    title:{
        type:String,
        required: true,
        unique:true,
    },
    description:{
        type:String,
        required: true,
    },
    hotelCode: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdDate:{
      type:Date
    }
},{strict:false});
marketSegmentSchema.pre('save',function(next){
   const mode=this;
   mode.id='mkt_'+ shortid.generate();
   next();
})
mongoose.model('marketsegment',marketSegmentSchema);
marketSegmentSchema.index({Title:1});