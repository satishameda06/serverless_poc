const mongoose = require('mongoose');
const shortid = require('shortid');
const payTypeSchema=new mongoose.Schema({
    id: String,
    payType:{
        type:String,
        required: true,
        unique:true,
    },
    payTypeShortName:{
        type:String,
        required: true,
        unique:true,
    },
    Department:{
        type:String,
        default:"Account",
    },
    Accountcode:{
        type:String,
        required: true,
    },
    paymentMode:{
        type:String,
        required: true,
    },
    description:{
        type:String
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
payTypeSchema.pre('save',function(next){
   const paymode=this;
   paymode.id='paytype_'+ shortid.generate();
   next();
})
mongoose.model('paytype',payTypeSchema);
payTypeSchema.index({typeMode:1});