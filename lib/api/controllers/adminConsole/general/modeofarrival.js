const mongoose = require("mongoose"),
    ModeOfArrDep= mongoose.model("modeof_arrival_departure"),
    _=require('lodash');
module.exports.getAllModeOfArrDep= async (req, res) => {
    try {
        const modeofData = await ModeOfArrDep.find({});
        res.json({ code: 4000, result: modeofData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createModeOfArrDep= async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const ModeofObj = new ModeOfArrDep(req.body);
       ModeofObj.hotelCode = req.payload.hotelCode;
       ModeofObj.userId = req.payload._id;
      
        const ModeofDb = await ModeofObj.save(ModeofObj);
        if (ModeofDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateModeOfArrDep= async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const modeofdata = await ModeOfArrDep.findOne({ id: req.params.id });
        if (!modeofdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await ModeOfArrDep.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteModeOfArrDep= async (req, res) => {
    try {
     
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const modeofdata = await ModeOfArrDep.findOne({ id: req.params.id });
        if (!modeofdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await ModeOfArrDep.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



