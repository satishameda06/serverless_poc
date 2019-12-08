var mongoose = require('mongoose');
var Amenity = mongoose.model('Amenity');
var Room = mongoose.model('Room');
var User = mongoose.model('User');

module.exports.add = function (req, res) {

    //hotelCode
   
    req.body.hotelCode = req.payload.hotelCode;

    var amenity = new Amenity(req.body);
    // console.log("ameniti@@@@@@@@@@@",amenity);
    amenity.save(req.body, function (err, amenity) {
        // console.log("Satish Ameda ais calling here amenties",err,amenity);
        if (err) {
            // console.log(err);
            return res.status(500).json(err);
        }
        else res.status(200).json('Success');
    });

};

module.exports.list = function (req, res) {
    Amenity
        .find({
            userId: req.payload._id,
            hotelCode: req.payload.hotelCode
        })
        .exec(function (err, amenities) {
            if (err) releaseEvents.status(500).json(err);
            else res.status(200).json(amenities);
        });
};
module.exports.delete = function (req, res) {
    Amenity
        .deleteOne({
            id: req.body.id
        })
        .exec(function (err, amenities) {
            if (err) releaseEvents.status(500).json(err);
            else res.status(200).json(amenities);
        });
};
module.exports.update = async (req, res) => {
    try {
        if (!req.body.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const amentityData = await Amenity.findOne({ id: req.body.id });
        if (!amentityData) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Amenity.updateOne({ id: req.body.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}