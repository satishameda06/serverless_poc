const mongoose=require("mongoose"),
shortid=require('shortid');
const ReasonForCancellationSchema=new mongoose.Schema({
    id:{
        type:String,
    },
    cancellationTitle:{
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
ReasonForCancellationSchema.pre('save',function(next){
    var reasonForCancel=this;
    reasonForCancel.id="reasonFor_"+shortid.generate();
    next();
})
mongoose.model('reasonforcancellation',ReasonForCancellationSchema);
ReasonForCancellationSchema.index({cancellationTitle:1})

