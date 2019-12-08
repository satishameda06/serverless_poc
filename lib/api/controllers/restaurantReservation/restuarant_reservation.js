const mongoose = require('mongoose');
const _ = require('lodash');
const RestaurantGroup = mongoose.model('restaurant_group');
// const RestaurantTables = mongoose.model('restaurant_resource');
var Table = mongoose.model('RestaurantTable');
var Event = mongoose.model('restaurant_event');
var User = mongoose.model('User');

module.exports.createGroup = async function (req, res) {
    if (_.isEmpty(req.body)) {
        return res.json({ code: 3000, message: "Invalid input" });
    }
    try {
        const restGroupDb = new RestaurantGroup(req.body);
        restGroupDb.save();
        return res.json({ code: 2000, message: "record saved" })
    } catch (e) {
        return res.json({ code: 5000, message: "Something went wrong" })
    }
}
module.exports.createTables = async function (req, res) {
    if (_.isEmpty(req.body)) {
        return res.json({ code: 3000, message: "Invalid input" });
    }
    try {
        const foundUser = await User.findOne({ hotelCode: req.body.hotelCode });
        if (foundUser != null && foundUser !== undefined) {
            const restGroupDb = new RestaurantGroup(req.body);
            restGroupDb.save();
            const table = {};
            for (var i = 0; i < req.body.no_of_tables; i++) {
                table.name = 'Table_' + (i).toString();
                table.group = req.body.group_name;
                table.hotelCode = req.body.hotelCode;
                table.noOfChairs = req.body.noOfChairs;
                table.resource_groupId = restGroupDb._id;
                table.userId = req.payload._id;
                savingTable = new Table(table);
                savingTable.save(function (err, room) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            res.status(200).json('Success');
            return;
        } else {
            res.json({
                "message": "User not found"
            });
            return;
        }

    } catch (e) {
        console.log("creating table error");
        return res.json({ code: 5000, message: "Something went wrong" })
    }
}
module.exports.getAll = async function (req, res) {
   
    RestaurantGroup.aggregate([
        {
            $match: { hotelCode: req.payload.hotelCode }
        }, {
            "$lookup": {
                "from": "restauranttables",
                "localField": "group_name",
                "foreignField": "group",
                "as": "children"
            }
        },

        { "$unwind": { path: "$children", preserveNullAndEmptyArrays: true } },
        { $sort: { 'children.name': 1 } },
        {
            "$match":
            {
                "children.hotelCode": req.payload.hotelCode
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "id": { "$first": "$name" },
                "name": { "$first": "$name" },
                "expanded": { "$first": true },
                "children": { "$push": "$children" }
            }
        },
        {
            $project: {
                __v: 0,
                tables: 0,
                'children.restaurantData': 0,
                'children.orderId': 0,
                'children.visitors': 0,
                'children.isBooked': 0,
                'children.group': 0,
                'children.userId': 0,
                'children._id': 0,
                'children.status': 0,
                'children.hotelCode': 0,
                'children.__v': 0,
                'children.resource_groupId':0
            }
        }
    ], function (err, data) {
        return res.json({ code: 5001, data })
    })

}
module.exports.createEvent = async function (req, res) {
    if (_.isEmpty(req.body)) {
        return res.json({ code: 3000, message: "Invalid input" });
    }
    try {
        const copyBody={...req.body};
        copyBody.hotelCode=req.payload.hotelCode;
        const EventDb = new Event(copyBody);
        await EventDb.save();
        return res.status(200).json({ code: 200, data:EventDb })
    } catch (e) {
        return res.status(500).json({ code: 500, message: "something went wrong" });
    }

}
module.exports.getEvents = async function (req, res) {
    Event.find({
        hotelCode:req.payload.hotelCode,
        $or:
            [
                { end: { '$lte': new Date(req.query.to) } },
                { start: { '$gte': new Date(req.query.from) } }
            ]
    }
  ,function(err,data){
       if(err){
           console.log(err)
         return res.status(500).json({ code: 500, message: "something went wrong" });
       }
       return res.status(200).json({ code: 200, data })
  })
}
module.exports.updateEvents = async function (req, res) {
    if (_.isEmpty(req.body)) {
        return res.json({ code: 3000, message: "Invalid input" });
    }
    const Id=req.body.id;
    const updateParams=req.body;
    delete updateParams._id;
    try{
        const updateEventData=await Event.findOneAndUpdate({"id":Id},updateParams,{new: true});

        return res.status(200).json({ code: 200, updateEventData });
    }catch(e){
        console.log("update Events",e);
        return res.status(500).json({ code: 500, message: "something went wrong" });
    }
  }

  module.exports.deletEvent = async function (req, res) {
    if (_.isEmpty(req.body)) {
        return res.json({ code: 3000, message: "Invalid input" });
    }
    const Id=req.body.id;
    try{
        Event.deleteOne({"id":Id});
        return res.status(200).json({ code: 200, message:"record deleted" });
    }catch(e){
        console.log(e);
        return res.status(500).json({ code: 500, message: "something went wrong" });
    }
  }
  