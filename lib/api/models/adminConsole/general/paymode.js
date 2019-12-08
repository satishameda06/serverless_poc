const mongoose = require('mongoose');
const shortid = require('shortid');
const paymodeSchema=new mongoose.Schema({
    id: String,
    typeMode:{
        type:String,
        required: true,
        unique:true,
    },
    typeTitle:{
        type:String,
        required: true,
        unique:true,
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
paymodeSchema.pre('save',function(next){
   const paymode=this;
   paymode.id='paymode_'+ shortid.generate();
   next();
})
mongoose.model('paymode',paymodeSchema);
paymodeSchema.index({typeMode:1});