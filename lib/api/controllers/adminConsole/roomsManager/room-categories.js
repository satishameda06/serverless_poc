var mongoose = require('mongoose');
var User = mongoose.model('User');
var Property = mongoose.model('Property');
var RoomCategory = mongoose.model('RoomCategory');
var Room = mongoose.model('Room');
var _ = require('lodash');
var async = require('async');

//Property CRUD

module.exports.create = function (req, res) {
    //console.log("@@@@@Room-category@@@@@@@",req.body);
    //console.log("@@@@@req.payload.hotelCode@@@@@@@",req.payload.hotelCode);
    User.find({ _id: mongoose.Types.ObjectId(req.body.userId), hotelCode: req.payload.hotelCode }, function (err, user) {
        if (err) {
            //console.log(err);
            res.json(err);
        }
        if (user) {
            var roomCategory = new RoomCategory(req.body);
            roomCategory.save(req.body, function (err, roomcategory) {
                if (err) {
                    //console.log(err);
                    res.json(err);
                }
                Room.find({ userid: req.body.userid, hotelCode: req.payload.hotelCode }, function (err, rooms) {
                    var index = 1;

                    var room = {
                        name: String,
                        userid: String,
                        property: String
                    };
                    if (err) {
                        //console.log(err);
                    }
                    if (rooms.length != 0) {
                        index = rooms.length;

                    }
                    for (var i = 0; i < req.body.no_of_rooms; i++) {
                        room.name = (parseInt(req.body.startingRoomName) + i).toString();
                        room.userid = req.body.userid;
                        room.property = req.body.property;
                        room.category = req.body.name;
                        room.hotelCode = req.payload.hotelCode;
                        savingRoom = new Room(room);
                        savingRoom.save(function (err, room) {
                            if (err) {
                                //console.log(err);
                            }

                        })
                    }

                })
                res.json({
                    "message": "Room Category created",
                    "property": roomcategory
                });
            })
        }
        else {
            res.json({
                "message": "User not found"
            });
        }

    })
};

module.exports.read = function (req, res) {

    if (!req.payload._id && !req.payload.hotelCode) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        RoomCategory
            .find({ userid: req.payload._id, hotelCode: req.payload.hotelCode })
            .exec(function (err, roomCategories) {
                res.status(200).json(roomCategories);
            });
    }
};

module.exports.deleteRoomCategory = function (req, res) {
    RoomCategory.deleteOne({ _id: mongoose.Types.ObjectId(req.body._id) },
        function (err, data) {
            if (err) res.status(500).json(err);
            else {
                Room.deleteMany({ category: req.body.name, userid: req.body.userid, hotelCode: req.payload.hotelCode },
                    function (error, data1) {
                        if (error) res.status(500).json(error);
                        else {
                            res.status(200).json('Success');
                        }
                    })
            }
        })
}

module.exports.updateProperties = function (req, res) {

};

module.exports.deleteProperties = function (req, res) {

};


module.exports.RoomCatBlocked = function (req, res) {
    const inputBody = { ...req.body };
    if (_.isEmpty(inputBody)) {
        res.json({ code: 5001, message: "all fields are required" });
        return;
    }
    if (inputBody.room_blocking == undefined || inputBody.id === undefined) {
        res.json({ code: 5002, message: "invalid input" });
    }
    try {
        let room_blocking = inputBody.room_blocking;
        async.forEach(room_blocking, function (record, callback) {
            RoomCategory.findOne({ id: inputBody.id, "room_blocking.date": record.date },
                { "room_blocking": { $elemMatch: { date: record.date } } }, (err, catData) => {
                    if (catData === null) {
                        console.log("coming here");
                        RoomCategory.update({ id: inputBody.id }, { $addToSet: { room_blocking: record } }, (err, update) => {
                            console.log(err, update);
                        });
                        callback()
                    } else {
                        console.log("what record is ",record);
                        
                        // const updateData={};
                        // updateData['room_blocking.$.date']= record.date;
                        // if(record.rooms_closed!==undefined&& record.rooms_closed !==null && record.rooms_closed || !record.rooms_closed){
                        //     updateData["room_blocking.$.rooms_closed"]= record.rooms_closed;
                        // }
                        // if(record.hotels_closed!==undefined&& record.hotels_closed !==null && record.hotels_closed || !record.hotels_closed){
                        //     updateData["room_blocking.$.hotels_closed"]= record.hotels_closed;
                        // }
                        // if(record.avilable_rooms){
                        //     pdateData["room_blocking.$.avilable_rooms"]= record.avilable_rooms;
                        // }
                         
                        const updateData = {
                            "room_blocking.$.date": record.date,
                            "room_blocking.$.avilable_rooms": record.avilable_rooms||0,
                            "room_blocking.$.sold_rooms": record.sold_rooms||0,
                            "room_blocking.$.total_rooms": record.total_rooms||0,
                            "room_blocking.$.rooms_closed": record.rooms_closed,
                            "room_blocking.$.hotels_closed": record.hotels_closed
                        };
                        if(record.rooms_closed===undefined){
                            delete updateData['room_blocking.$.rooms_closed'];
                        }
                        if(record.hotels_closed===undefined){
                            delete updateData["room_blocking.$.hotels_closed"]; 
                        }
                        console.log("$$$$$$$$$$$$$",updateData);
                        RoomCategory.updateOne({ id: inputBody.id, "room_blocking.date": record.date }, { $set: updateData }, (err, update) => {
                            console.log(err, update);
                        });
                        callback()
                    }
                });
        }, function (done) {
            res.json({ code: 5003, message: "record is updated" });
        })
    } catch (e) {
        console.log("what error is coming", e);
        res.json({ code: 5004, message: "something went wrong" })
    }
};





