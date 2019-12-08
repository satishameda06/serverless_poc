const mongoose = require("mongoose"),
    Currency = mongoose.model("currency"),
    _=require('lodash');
module.exports.getAllCurrencies = async (req, res) => {
    try {
        const currencyData = await Currency.find({});
        res.json({ code: 4000, result: currencyData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createCurrency = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const CurreencyObj = new Currency(req.body);
        CurreencyObj.hotelCode = req.payload.hotelCode;
        CurreencyObj.userId = req.payload._id;
       
        const CurreencyDb = await CurreencyObj.save(CurreencyObj);
        if (CurreencyDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateCurrency = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const currecnydata = await Currency.findOne({ id: req.params.id });
        if (!currecnydata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Currency.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteCurrency = async (req, res) => {
    try {
      
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const currecnydata = await Currency.findOne({ id: req.params.id });
        if (!currecnydata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Currency.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



