const mongoose = require("mongoose"),
    Reason = mongoose.model("reasonforcancellation"),
    _=require('lodash');
module.exports.getAllReasons = async (req, res) => {
    try {
        const ReasonData = await Reason.find({userId:req.payload._id,hotelCode:req.payload.hotelCode});
        res.json({ code: 4000, result: ReasonData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createReason = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const ReasonObj = new Reason(req.body);
        ReasonObj.hotelCode = req.payload.hotelCode;
        ReasonObj.userId = req.payload._id;
       
        const ReasonDb = await ReasonObj.save(ReasonObj);
        if (ReasonDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateReason = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const reasondata = await Reason.findOne({ id: req.params.id });
        if (!reasondata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Reason.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteReason = async (req, res) => {
    try {
    
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const reasondata = await Reason.findOne({ id: req.params.id });
        if (!reasondata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Reason.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



