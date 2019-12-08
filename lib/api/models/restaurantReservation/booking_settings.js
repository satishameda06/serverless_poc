const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const shortid=require('shortid');

const BookingSettingSchema=mongoose.Schema({
    hotelCode:{type:Number,required:true,unique:true},
    id:String,
    restuarent_name:{type:String,required:true},
    restuarentId: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Restaurant'
      },
      duration:{
        type:String,
        default:"0:00",
         //required:true  
      },
      empty_seats:{
        type:String,
        default:"0",
         //required:true
      },
      turnaround_time:{
        type:String,
        default:"0:00",
         //required:true  
      },
      contact_method:{
        type:String,
        default:"Phone",
         //required:true  
      },
      E_mail_confirmation:{
        type:Number,
        default:0,
         //required:true 
      },
      Satisfaction_surveys:{
        type:Number,
        default:0,
         //required:true 
      },
      ending_time:{
        type:Number,
        default:0,
         //required:true 
      },
      allow_cancellation:{
        type:Number,
        default:0,
         //required:true
      },
    createdAt:Date,
    storage_personal_data:{
      type:String,
      default:"1 year",
       //required:true  
    },
    min_guests:{
        type:Number,
        default:0,
         //required:true
    },
    max_guests:{
        type:Number,
        default:0,
         //required:true
    }
},{strict:false});

BookingSettingSchema.pre('save', function (next) {
    var restBooking = this;
    restBooking.id = 'rest_booking-' + shortid.generate();
    next();
  });

mongoose.model('rest_booking_setting',BookingSettingSchema);
BookingSettingSchema.index({restuarentId:1})