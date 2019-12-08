const mongoose = require("mongoose"),
    MarketSegment= mongoose.model("marketsegment"),
    _=require('lodash');
module.exports.getAllMarketSegment= async (req, res) => {
    try {
        const marketSegmentData = await MarketSegment.find({});
        res.json({ code: 4000, result: marketSegmentData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createMarketSegment= async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        const marketSegmentObj = new MarketSegment(req.body);
       marketSegmentObj.hotelCode = req.payload.hotelCode;
       marketSegmentObj.userId = req.payload._id;
      
        const marketSegmentDb = await marketSegmentObj.save(marketSegmentObj);
        if (marketSegmentDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateMarketSegment= async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const marketSegmentdata = await MarketSegment.findOne({ id: req.params.id });
        if (!marketSegmentdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await MarketSegment.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteMarketSegment= async (req, res) => {
    try {
      
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const marketSegmentdata = await MarketSegment.findOne({ id: req.params.id });
        if (!marketSegmentdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await MarketSegment.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



