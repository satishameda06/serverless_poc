const mongoose = require('mongoose');
const InvoiceNumberSettings = mongoose.model('frontdesk_invoicenumber_setting');


module.exports.editInvoiceSerialNumber = function (req, res) {
    const copyInvoice = { ...req.body };
    const Id = req.params.type;
    InvoiceNumberSettings.findOne({ type: Id }, function (err, invoiceData) {
        if (err) {
            
            errCode(res,err);
        }
        if (invoiceData == null) {
            const InvoiceNumberSettingsDb = new InvoiceNumberSettings(copyInvoice);
            InvoiceNumberSettingsDb.save(function (err, data) {
                if (err) {
                    errCode(res,err);
                }
                if (data) {
                    res.json({ code: 2002, message: "record created" });
                    return;
                }
            })
        }
        if (invoiceData) {
            InvoiceNumberSettings.updateOne({ type: Id }, { $set: copyInvoice }, function (err, updatedInVoice) {
                if (err) {
                    errCode(res,err);
                }
                if (updatedInVoice) {
                    res.json({ code: 2001, message: "record updated successffuly" });
                    return;
                }
            })
        }
    })
}
module.exports.getInvoice=function(req,res){
    InvoiceNumberSettings.find({},{prefix:1,serialNumber:1,type:1},function(err,invoiceData){
      if(err){
        errCode(res);
      } if(invoiceData){
        res.json({code:3000,result:invoiceData});
      }
    })
}
function errCode(res,err) {
    console.log("errCode function is calling ",err);
    res.json({ code: 2000, message: "something went wrong" });
    return;
}