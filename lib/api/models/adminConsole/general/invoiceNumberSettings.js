const mongoose = require('mongoose');
const shortid=require('shortid');

const invoiceNumberSettingSchema = new mongoose.Schema({
    id: String,
    prefix: {type:String,default:"PINV"},
    serialNumber: {
        type: Number,
        default: 100
    },
    type: {
        type: String,
        default: "frontdesk"
    },
    hotelCode:{
        type: Number
    }
}, { strict: false });

invoiceNumberSettingSchema.pre('save',function(next){
   const invoice_no=this;
   invoice_no.id='inv_'+shortid.generate();
   next();
});
console.log("model is calling");
mongoose.model('frontdesk_invoicenumber_setting',invoiceNumberSettingSchema);
