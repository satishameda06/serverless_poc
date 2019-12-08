const mongoose = require("mongoose"),
    sourcebusinesses = mongoose.model("sourcebusinesses"),
    _=require('lodash');
module.exports.getAllsourcebusinesses = async (req, res) => {
    try {
        const sourcebusinessesData = await sourcebusinesses.find({});
        res.json({ code: 4000, result: sourcebusinessesData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createsourcebusinesses = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const sourcebusinessesObj = new sourcebusinesses(req.body);
        sourcebusinessesObj.hotelCode = req.payload.hotelCode;
        sourcebusinessesObj.userId = req.payload._id;
       
        const sourcebusinessesDb = await sourcebusinessesObj.save(sourcebusinessesObj);
        if (sourcebusinessesDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updatesourcebusinesses = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const sourcebusinessesdata = await sourcebusinesses.findOne({ id: req.params.id });
        if (!sourcebusinessesdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await sourcebusinesses.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deletesourcebusinesses = async (req, res) => {
    try {
 
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const sourcebusinessesdata = await sourcebusinesses.findOne({ id: req.params.id });
        if (!sourcebusinessesdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await sourcebusinesses.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



