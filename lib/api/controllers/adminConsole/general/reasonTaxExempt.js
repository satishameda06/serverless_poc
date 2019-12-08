const mongoose = require("mongoose"),
    ReasonsTaxExempt = mongoose.model("reasontaxexempt"),
    _=require('lodash');
module.exports.getAllReasonsTaxExempts= async (req, res) => {
    try {
        const ReasonsTaxExemptData = await ReasonsTaxExempt.find({});
        res.json({ code: 4000, result: ReasonsTaxExemptData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" });
    }
}
module.exports.createReasonsTaxExempt = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const ReasonsTaxExemptObj = new ReasonsTaxExempt(req.body);
        ReasonsTaxExemptObj.hotelCode = req.payload.hotelCode;
        ReasonsTaxExemptObj.userId = req.payload._id;
        
        const ReasonsTaxExemptDb = await ReasonsTaxExemptObj.save(ReasonsTaxExemptObj);
        if (ReasonsTaxExemptDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateReasonsTaxExempt = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const ReasonsTaxExemptdata = await ReasonsTaxExempt.findOne({ id: req.params.id });
        if (!ReasonsTaxExemptdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await ReasonsTaxExempt.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteReasonsTaxExempt = async (req, res) => {
    try {
       
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const ReasonsTaxExemptdata = await ReasonsTaxExempt.findOne({ id: req.params.id });
        if (!ReasonsTaxExemptdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await ReasonsTaxExempt.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



