const mongoose = require("mongoose"),
    identificationtype = mongoose.model("identificationtype"),
    _=require('lodash');
module.exports.getAllidentificationtype = async (req, res) => {
    try {
        const identificationtypeData = await identificationtype.find({});
        res.json({ code: 4000, result: identificationtypeData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createidentificationtype = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const IdentificationtypeObj = new identificationtype(req.body);
        IdentificationtypeObj.hotelCode = req.payload.hotelCode;
        IdentificationtypeObj.userId = req.payload._id;
       
        const IdentificationtypeDb = await IdentificationtypeObj.save(IdentificationtypeObj);
        if (IdentificationtypeDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateidentificationtype = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const Identificationtypedata = await identificationtype.findOne({ id: req.params.id });
        if (!Identificationtypedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await identificationtype.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteidentificationtype = async (req, res) => {
    try {
       
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const Identificationtypedata = await identificationtype.findOne({ id: req.params.id });
        if (!Identificationtypedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await identificationtype.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



