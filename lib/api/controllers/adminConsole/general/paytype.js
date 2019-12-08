const mongoose = require("mongoose"),
    Paytype = mongoose.model("paytype"),
    _=require('lodash');
module.exports.getAllPaytype = async (req, res) => {
    try {
        const PaytypeData = await Paytype.find({});
        res.json({ code: 4000, result: PaytypeData });
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createPaytype = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const PaytypeObj = new Paytype(req.body);
        PaytypeObj.hotelCode = req.payload.hotelCode;
        PaytypeObj.userId = req.payload._id;
       
        const PaytypeDb = await PaytypeObj.save(PaytypeObj);
        if (PaytypeDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updatePaytype = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const Paytypedata = await Paytype.findOne({ id: req.params.id });
        if (!Paytypedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Paytype.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deletePaytype = async (req, res) => {
    try {
       
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const Paytypedata = await Paytype.findOne({ id: req.params.id });
        if (!Paytypedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Paytype.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}
