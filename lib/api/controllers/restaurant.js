var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var User = mongoose.model('User');
var Restaurant = mongoose.model('Restaurant');
var Table = mongoose.model('RestaurantTable');
var RestaurantOrders = mongoose.model('RestaurantOrder');
var Room = mongoose.model('Room');
var Orderidkey = mongoose.model('orderidkey');
var async = require('async');
const RestaurantUtils = require('../utils/restaurantUtils');

module.exports.getAllOrders = function (req, res) {
    RestaurantOrders.find({userId: req.payload._id,hotelCode:req.payload.hotelCode})
    .populate('roomId')
    .populate('tableId')
    .exec(function(err, data) {
        if (err) return res.status(500).json(err);
        else return res.status(200).json(data); 
    })
}

module.exports.listRestaurant = function (req, res) {
    Restaurant.find({}, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(data);
        }
    });

};

module.exports.updateRestaurentStatus = function (req, res) {
    if (!req.body._id) {
        return res.status(400).json({
            "message": "all fields are required"
        });
    } else {
        Restaurant.findOneAndUpdate({
            _id: req.body._id
        }, {
            $set: {
                "status": true
            }
        }, function (err, data) {
            if (err) {
                return res.status(500).json(err);
            } else {
                return res.status(200).json(data);
            }

        });
    }
};

module.exports.addRestaurant = function (req, res) {
    // //console.log(req.body);

    restaurant = new Restaurant(req.body);

    async.waterfall([
        saveRestaurant,
        addTables,
        sendResponse,

    ], function (err) {
        if (err) {
            return cnError.sendApplicationError(res, cnError.getErrorMessage(err));
        }
        return res.json('Restaurant created');
    });

    function saveRestaurant(fn) {
        restaurant.save(function (err, result) {
            if (err) res.json(err);
            // //console.log(result);
            return fn(null, result._id, 'two');
        })
    }

    function addTables(arg1, arg2, callback) {
        for (var i = 1; i <= req.body.noOfTables; i++) {
            var buildTable = {};
            buildTable.name = 'table-' + i.toString();
            buildTable.restaurant = mongoose.Types.ObjectId(arg1);
            buildTable = new Table(buildTable);
            buildTable.save(function (err, result) {
                if (err) res.json(err);
                //console.log(buildTable.name + ' created');
            })
            if (i == req.body.noOfTables) callback(null, arg1);
        }
    }

    function sendResponse(arg1, callback) {
        User.update({
            _id: mongoose.Types.ObjectId(req.body.userId)
        }, {
            $addToSet: {
                restaurants: mongoose.Types.ObjectId(arg1)
            }
        }, function (err, result) {
            if (err) res.json(err);
            callback(null, 'done');
        })
    }




};


exports.generateOrderAndBook = function (req, res) {
    //console.log(req.body);
    OrderId = RestaurantUtils.generateOrder(req.body);

}

exports.bookRoomRestaurant = function (req, res) {
    let roomId = req.body._id;
    delete req.body._id;
    req.body.restaurantData.isBooked = true;
    if (!req.body.restaurantData.status) {
        req.body.restaurantData.status = 'Occupied';
    }
    Room.findByIdAndUpdate(roomId, {$set: {restaurantData: req.body.restaurantData}}, function(err, result) {
        if (err) return res.status(500).json(err);
        else return res.status(200).json(result);
    })
}
const generateOrderIDs=async ()=>{
var query = {'_id': 'Orderkey'};
var inc = {$inc:{'orderIdSequence':1}};
var options = {new: true, upsert: true};
let Order_Key_Data;
try{
   Order_Key_Data = await Orderidkey.findOneAndUpdate(query, inc);
}catch(e){
  return new Error("cant upadte");
}
  return Order_Key_Data.orderIdSequence;
}
exports.prepareRestaurantOrder = async function(req, res) {
    // //console.log("generateOrderIDs",)
    let order = req.body;
    if (req.payload.user_type) {

    }
    order.userId = mongoose.Types.ObjectId(req.payload._id);
    order.hotelCode=req.payload.hotelCode;
   try {
        const or_id= await generateOrderIDs();
        console.log("Satish Ameda or_id",or_id);
        order.orderId=or_id;
        order.date=new Date();
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    } catch(e) {
       //console.log("calling generateOrderIDs erorr");
    }
   let query = {
        status : {$in: ['unprepared', 'prepared']},
        userId: order.userId
    };
    if (req.body.payedAmt) {
        query.payedAmt = {$inc: req.body.payedAmt};
    }
    if ('tableId' in order) {
        query.tableId = mongoose.Types.ObjectId(order.tableId);
    } else if ('roomId' in order) {
        query.roomId = mongoose.Types.ObjectId(order.roomId);

    }
    const foundOrder = await RestaurantOrders.findOne({userId:order.userId},{paymentStatus:1,userId:1});
    //console.log("foundOrder",foundOrder);
    if(foundOrder && foundOrder.paymentStatus==="pending"){
        console.log("record alredy exist",order);
        // delete order.orderId;
        RestaurantOrders.findOneAndUpdate(query, order, {upsert: true, new: true,multi:true,strict:false}, function(err, data) {
            if (err) {
                return res.status(500).json(err);
            } else {
               return res.status(200).json(data);
            }
        });
    } else {
        console.log( "record does not  exist so we are creating new one---order",order);
        console.log( "record does not  exist so we are creating new one --query",query);
        RestaurantOrders.findOneAndUpdate(query, order, {upsert: true, new: true,multi:true,strict:false}, function(err, data) {
            if (err) {
                return res.status(500).json(err);
            } else {
           
                return res.status(200).json(data);
            }
        });
     
    }
    }

exports.payRestaurantOrder = function(req, res) {
    let query = {
        orderId: req.params.orderId
    }
    RestaurantOrders.update(query, {$inc: {payedAmt: req.body.payedAmt}, $push: {paymentInfo: req.body.paymentInfo}}, function(err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(data);
        }
    });
}

exports.refundRestaurantOrder = function(req, res) {
    let query = {
        orderId: req.params.orderId
    }
    RestaurantOrders.update(query, {$inc: {refundAmt: req.body.refundAmt}, $push: {refundInfo: req.body.refundInfo}}, function(err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(data);
        }
    });
}

exports.restaurantOrderStatusChange = function(req, res) {
    let query = {
        orderId: req.params.orderId
    };
    let updater = {};
    if('status' in req.body) {
        updater.status = req.body.status;
    } 
    if ('paymentStatus' in req.body) {
        updater.paymentStatus = req.body.paymentStatus;
    }
    RestaurantOrders.findByIdAndUpdate(query._id, updater, function(err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(data);
        }
    });
}
exports.restaurantOrderCancel = function(req, res) {
    let query = {
        orderId: req.params.orderId
    };
    let updater = {};
   
    if ('isCancelled' in req.body) {
        updater.isCancelled = req.body.isCancelled;
    }
    RestaurantOrders.findByIdAndUpdate(query, updater, function(err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(data);
        }
    });
}
exports.restaurantOrderUpdate = function(req, res) {
    console.log("calling restaurantOrderUpdate");
    let condition = {
        orderId: parseInt(req.params.orderId)
    };
    let updater={...req.body.items};
    delete updater._id;
    delete updater.id;
    console.log("updater",updater);
    // updater.rate=req.body.rate;
    // updater.qty=req.body.qty;
    var OrderCondition = condition;
    // OrderCondition["items.id"] =  mongoose.Types.ObjectId(req.body.items.id);
    OrderCondition["items.id"] = req.body.items.id;
    console.log("OrderCondition",OrderCondition);
    console.log("updater",updater);
    RestaurantOrders.update(OrderCondition, {
        $set: {"items.$.qty":updater.qty,
                "items.$.name":updater.name, 
                "items.$.rate":updater.rate,
                "items.$.description":updater.description}
    }, function(err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(data);
        }
    });
}

