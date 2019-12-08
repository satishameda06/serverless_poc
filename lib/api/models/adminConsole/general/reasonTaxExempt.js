const mongoose=require("mongoose"),
shortid=require('shortid');
const ReasonTaxExemptSchema=new mongoose.Schema({
    id:{
        type:String,
    },
    reason:{
        type:String,
        unique:true,
        required:true
    },
    description:{
       type:String,
    },
    hotelCode: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdDate: Date
},{strict:false});
ReasonTaxExemptSchema.pre('save',function(next){
    var reasonForCancel=this;
    reasonForCancel.id="reason_tax"+shortid.generate();
    next();
})
mongoose.model('reasontaxexempt',ReasonTaxExemptSchema);
ReasonTaxExemptSchema.index({reason:1})

