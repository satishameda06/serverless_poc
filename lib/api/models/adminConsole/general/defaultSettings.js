const mongoose=require('mongoose');
const shortid=require('shortid');
const defaultSettingSchema=new mongoose.Schema({
    id:{
        type:String
    },
language:{
    type:String,
    default:"English"
},
currency:{
    type:String,
    default:"Dollor"
},
financialYear:{
  to:{
    type:String
  },
  from:{
    type:String
  }
},
currencyConversionRate:{
    type:String  
},
currencyDecimalPlaces:{
    type:Number
},
adjustmentinInvoiceOrFolios:{
    type:String
},
accountFolioDate:{
    type:String
},
showDepositAlertOnCheckIn:{
    type:String
},
dateFormat:{
    type:String
},
timeZoneLocation:{
    type:String   
},
timeFormat:{
    type:String  
},
checkInTime:{
    type:String    
},
checkOutTime:{
    type:String
},
isChild:{
    type:Boolean
},
minimumChildAge:{
    type:Number
},
guestAge:{
    type:Number
},
agenciesName:{
    type:String
},
agencyCommision:{
    type:Number
},
hoteCode:{
    type:Number,
    required:true,
}
},{strict:false});
defaultSettingSchema.pre('save', function (next) {
    var defaultSetting = this;
    defaultSetting.id = 'defaultsetting-' + shortid.generate();
    next();
});
mongoose.model('defaultsetting', defaultSettingSchema);
// .create({financialYear:{
//     to:"5 January ",
//     from:"31 December"
// },
// currencyConversionRate:"manual",
// currencyDecimalPlaces:2,
// adjustmentinInvoiceOrFolios:"Yes",
// accountFolioDate:"Close",
// showDepositAlertOnCheckIn:"Yes",
// dateFormat:'mm/dd/yy',
// timeZoneLocation:"IST",
// timeFormat:'mm/hh',
// checkInTime:"2:30 AM",
// checkOutTime:"4:30 PM",
// isChild:true,
// minimumChildAge:13,
// guestAge:30,
// agenciesName:"YAhoo",
// agencyCommision:30,
// hoteCode:10108,
// });
