var mongoose = require('mongoose');
var Inventory = mongoose.model('room_inventory');
var async = require('async');
module.exports.UpdateRoomInvetory = function (req, res) {
    Inventory.findOne({
        "hotelCode": req.payload.hotelCode,
        "inventory.to": new Date(req.body.inventory.to),
        "inventory.from": new Date(req.body.inventory.from)
    },(err, Invdata) => {
            if (err) {
                console.log(err);
                res.json({ code: 500, message: "something went wrong" });
                return;
            }
            if (Invdata !== null && Invdata !== undefined) {
                //    Inventory.findOne({"room_categories.category":,"room_categories.date":})
                res.json({ code: 200, message: "record already exist" });
            } else {
                req.body.hotelCode = req.payload.hotelCode;
                const invDb = new Inventory(req.body);
                invDb.save((err, saved) => {
                    if (err) {
                        console.log(err);
                        res.json({ code: 500, message: "something went wrong" });
                        return;
                    }
                    if (saved) {
                        res.json("success");
                        return;
                    }
                })
            }
        })
}
