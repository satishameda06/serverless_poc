const mongoose = require('mongoose');
const shortid = require('shortid');
const modeOfArrivalSchema=new mongoose.Schema({
    id: String,
    mode:{
        type:String,
        required: true,
        unique:true,
    },
    description:{
        type:String,
        required: true,
    },
    assignTask:{
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
modeOfArrivalSchema.pre('save',function(next){
   const mode=this;
   mode.id='mode_arr_dep'+ shortid.generate();
   next();
})
mongoose.model('modeof_arrival_departure',modeOfArrivalSchema);
modeOfArrivalSchema.index({mode:1});