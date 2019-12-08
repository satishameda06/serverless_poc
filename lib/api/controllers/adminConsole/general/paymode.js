const mongoose = require("mongoose"),
    Paymode = mongoose.model("paymode"),
    _=require('lodash');
module.exports.getAllPaymode = async (req, res) => {
    try {
        const PaymodeData = await Paymode.find({});
        res.json({ code: 4000, result: PaymodeData });
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createPaymode = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const PaymodeObj = new Paymode(req.body);
        PaymodeObj.hotelCode = req.payload.hotelCode;
        PaymodeObj.userId = req.payload._id;
       
        const PaymodeDb = await PaymodeObj.save(PaymodeObj);
        if (PaymodeDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updatePaymode = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const paymodedata = await Paymode.findOne({ id: req.params.id });
        if (!paymodedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Paymode.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deletePaymode = async (req, res) => {
    try {
        
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const paymodedata = await Paymode.findOne({ id: req.params.id });
        if (!paymodedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Paymode.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}
