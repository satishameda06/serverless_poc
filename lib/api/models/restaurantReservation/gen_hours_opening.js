const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const shortid=require('shortid');
const openingHoursSchema = new mongoose.Schema({
    day: {type:String,required:true},
    start_time:{type:String,required:true},
    end_time:{type:String,required:true},
    cutoff_time:{type:String,required:true},
    is_closed:{type:Boolean,required:true,default:false},
    updateAt:Date,
  });
const GeneralHoursOpeiningSchema=mongoose.Schema({
    hotelCode:{type:Number,required:true,unique:true},
    id:String,
    restuarent_name:{type:String,required:true},
    restuarentId: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Restaurant'
      },
    opening_hours:[openingHoursSchema],
    createdAt:Date
},{strict:false});

GeneralHoursOpeiningSchema.pre('save', function (next) {
    var opeiningHour = this;
    opeiningHour.id = 'gen-' + shortid.generate();
    next();
  });

mongoose.model('restaurant_gen_opening_hour',GeneralHoursOpeiningSchema);
GeneralHoursOpeiningSchema.index({restuarentId:1})