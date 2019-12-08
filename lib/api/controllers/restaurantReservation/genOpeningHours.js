const mongoose = require('mongoose');
const _ = require('lodash');
var GenaralOpeiningHrsModel = mongoose.model('restaurant_gen_opening_hour');
var ObjectID = require('mongodb').ObjectID;
module.exports.createGeneralOpeningHrsOrUpdate = async function (req, res) {
    try {
        if (_.isEmpty(req.body)) {
            return res.json({ code: 3000, message: "Invalid input" });
        }
        let counter = 0;
        restWorkingHrsArr = req.body.arr;
        restWorkingHrsArr.forEach(obj => {
            console.log("obj",obj);
            const updateParms = {}
            if ((obj.start_time) && !(obj.end_time)) {
                updateParms["opening_hours.$.start_time"] = obj.start_time;
            } else if (!(obj.start_time) && (obj.end_time)) {
                updateParms["opening_hours.$.end_time"] = obj.start_time;
            } else if((obj.cutoff_time) && (!(obj.start_time) && !(obj.end_time))){
                updateParms["opening_hours.$.cutoff_time"] = obj.cutoff_time;
            } else {
                updateParms["opening_hours.$.start_time"] = obj.start_time;
                updateParms["opening_hours.$.end_time"] = obj.end_time;
            }
            const htlCode = req.payload.hotelCode;
            const query = {
                hotelCode: htlCode,
            }
            query['opening_hours._id'] = mongoose.Types.ObjectId(obj._id);
            console.log("query", query);
            console.log("updateParms", updateParms);
            GenaralOpeiningHrsModel.updateOne(query, updateParms, (err, updated) => {
                console.log("Update status",err,updated);
                if (!err) {
                    counter += 1;
                     if (counter === restWorkingHrsArr.length) {
                        return res.status(200).json('Success');
                    }
                }
            });
        })
    } catch (e) {
        console.log(e);
        return res.json({ code: 5000, message: "Something went wrong" });
    }
}
module.exports.getGeneralOpeningHrs = async function (req, res) {
    try {
        const GenaralOpeiningHrs = await GenaralOpeiningHrsModel.findOne({ hotelCode: req.payload.hotelCode });
        if (GenaralOpeiningHrs != null && GenaralOpeiningHrs !== undefined) {
            res.status(200).json({ code: 200, result: GenaralOpeiningHrs });
            return;
        } else {
            res.status(404).json({
                code: 404,
                "message": "Hours not found"
            });
            return;
        }
    } catch (e) {
        console.log("creating table error");
        return res.status(500).json({ code: 500, message: "Something went wrong" });
    }
}
module.exports.closeOnlineBookingStatus = async (req, res) => {
    try {
        const query = { hotelCode: req.payload.hotelCode };
        const GenaralOpeiningHrs = await GenaralOpeiningHrsModel.findOne(query);
        if (GenaralOpeiningHrs != null && GenaralOpeiningHrs !== undefined) {
            query['opening_hours._id'] = mongoose.Types.ObjectId(req.body._id);
            const updateParms = {}
            updateParms["opening_hours.$.is_closed"] = req.body.isClosed;
            await GenaralOpeiningHrsModel.updateOne(query, updateParms);
            res.status(200).json({ code: 200, message: "record updated" });
        }
    } catch (e) {
        return res.status(500).json({ code: 500, message: "Something went wrong" });
    }
}
