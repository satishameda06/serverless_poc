var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var RoomCat = mongoose.model("RoomCategory");
var async = require('async');
var moment = require('moment');
var Booking = mongoose.model('Bookings');
const RestaurantOrders = mongoose.model('RestaurantOrder');
const OrderTransaction = mongoose.model('OrderTransaction');
module.exports.test = function (req, res) {
  res.send(req.body);
}

module.exports.getAllRooms = function (req, res) {

  if (!req.payload._id && req.payload.hotelCode) {
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else {
    Room
      .find({ userid: req.payload._id, hotelCode: req.payload.hotelCode })
      .exec(function (err, rooms) {
        // console.log("getAllRooms",rooms);
        res.status(200).json(rooms);
      });
  }

};

module.exports.getAllRoomsByDate = function (req, res) {

  let user_id;
  if (req.query.user_role !== 'admin') {
    user_id = req.query.user_id;
  } else {
    user_id = req.payload._id;
  }
  const hotelCode = req.payload.hotelCode;
  //console.log("req.body",req.body);
  let count = 0;
  var calls = [];
  const today = req.params.date;
  Room.find({ userid: user_id, hotelCode: hotelCode })
    .lean()
    .exec(function (err, data) {
      if (err) res.status(500).json(err);
      // data.forEach(room => {
      //   BookingHistory.findOne({entityId: room._id.toString()}, function(err, data) {
      //     ++count;
      //   })
      // });
      // res.status(200).json(count);
      if (data !== undefined && data !== null && data.length > 0) {
        data.forEach(function (room) {
          calls.push(function (callback) {
            Booking.findOne({
              room: mongoose.Types.ObjectId(room._id),
              from: { $lte: today },
              to: { $gte: today }
            },

              function (err, _data) {
                if (err)
                  return callback(err);
                // //console.log(_data);
                if (_data) {
                  room.availability = 'Occupied';
                } else {
                  room.availability = 'Available';
                }
                ++count;
                callback(null, room._id);
              });
          }
          )
        });
      }


      async.parallel(calls, function (err, result) {
        //console.log("result",result);
        /* this code will run after all calls finished the job or
           when any of the calls passes an error */
        if (err)
          return //console.log(err);
        res.status(200).json(data);
      });
    })
}

module.exports.available = function (req, res) {

  if (!req.payload._id && !req.payload.hotelCode) {
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else {
    Room
      .find({ userid: req.payload._id, hotelCode: req.payload.hotelCode })
      .exec(function (err, rooms) {
        res.status(200).json(rooms);
      });
  }

};

module.exports.showRooms = function (req, res) {
  // //console.log('Body' + JSON.stringify(req.body));
  if (!req.body.userid && !req.body.a_userid) {
    res.status(401).json({
      "message": "UnauthorizedError: Private Profile"
    });
  } else {
    Room
      .find({ $or: [{ userid: req.body.userid }, { userid: req.body.a_userid }, { hotelCode: req.payload.hotelCode }] })
      .where({ property: req.body.property_name })
      .exec(function (err, rooms) {
        res.status(200).json(rooms);
      });
  }
}

module.exports.addRoomSingle = function (req, res) {
  // //console.log(req.body);

  const room = req.body;

  var roomer = new Room(room);
  Room.findOne({ name: roomer.name, category: roomer.category }, function (err, roomDoc) {
    // //console.log(roomDoc);

    if (err) {
      res.status(500).json(err);
    }
    else if (roomDoc != null) {
      res.status(450).json('Room already exists!');
    }
    else {
      roomer.save(function (err, data) {
        if (err) return res.status(500).json(err); // #sadpanda
        else res.status(200).json({ "Success:": "Rooms Added Successfully" });

      });
    }
  })


}

module.exports.addSingleRoom = function (req, res) {
  // //console.log(parseInt(req.body.room_number));
  if (!req.body.user_id && !req.payload.hotelCode) {
    res.status(401).json({
      "message": "UnauthorizedError: Private Profile"
    });
  } else {

    Room.update(
      { userid: req.body.user_id, room_name: req.body.room_type, hotelCode: req.payload.hotelCode },
      { $push: { room_numbers: req.body.room_number } },
      function (err, foo) {
        if (err) {
          //console.log(err);
        }
        else {
          res.status(200).json({
            "message": "Room added successfully"
          });
        }
      }
    )

    //Room.where({ userid: req.body.user_id }, {room_name: req.body.room_type}).update({ $push: { room_numbers:  req.body.room_number.parseInt()}});      


  }
}

module.exports.addRoom = function (req, res) {
  // //console.log(req.body.rooms);

  const rooms = req.body.rooms;
  /*
  let hun = 100;
  for (room of rooms ) {
    room.room_numbers = [];
    for ( let i=0; i<room.no_of_rooms; i++ ) {
      room.room_numbers.push(hun + i);
    }
    hun += 100;


  }

  async.each(rooms, function (photoData, callback) {
    var roomer = new Room(room);
    roomer.save(function(err, item){
      if (err){
        //console.log(err);
      }

      //console.log('Saved', item);
      callback();
    });
  }, function (error) {
    if (error) res.json(500, {error: error});
  
    //console.log('Rooms saved');
    return res.json(200, {msg: 'Rooms saved'} );
  });
  /*
  Room.create(req.body.rooms, function (err) {
    if (err) {
      //console.log(err);
    }// ...
  });*/


  for (room of rooms) {
    let hun = 100;
    for (room of rooms) {
      room.room_numbers = [];
      for (let i = 0; i < room.no_of_rooms; i++) {
        room.room_numbers.push(hun + i);
      }
      hun += 100;
    }
    var roomer = new Room(room);

    roomer.save(function (err, data) {
      console.log("while saving room error", err) // #sadpanda
      console.log("while saving room data", data);
    });
  }

  res.status(200).json({ "Success:": "Rooms Added Successfully" });
}

module.exports.add = function (req, res) {
  // //console.log(JSON.stringify(req));
  var room = new Room();
  room.name = req.body.name;
  room.base_price = req.body.base_price;
  room.ex_person_charge = req.body.ex_person_charge;
  room.ex_bed_charge = req.body.ex_bed_charge;
  room.no_of_rooms = req.body.no_of_rooms;
  room.occup_base = req.body.occup_base;
  room.occup_max = req.body.occup_max;
  room.occup_ex_beds = req.body.occup_ex_beds;
  room.save(function (err, room) {
    if (!err) res.status(200).json(room);
  });
};

module.exports.update = function (req, res) {
  //console.log(req.body);
  let roomId = req.body._id;
  delete req.body._id;
  //console.log(req.body, roomId);
  Room.find({ _id: mongoose.Types.Objectid(roomId) }, function (err, doc) {
    if (err) //console.log(err);
      if (!err) res.status(200).json(doc);
  });
};

module.exports.updateRoom = function (req, res) {
  console.log("updateRoom function is here");
  const roomId = req.body._id;
  delete req.body._id;

  //console.log(req.body);
  Room.findOneAndUpdate({ _id: mongoose.Types.ObjectId(roomId) }, req.body, function (err, data) {
    console.log("update room is calling ", err, data);
    if (err) //console.log(err);
      res.json(data);
  });
}
module.exports.updateRm = function (req, res) {
  console.log("updateRoom function is here", req.body);
  const roomId = req.body._id;
  delete req.body._id;

  //console.log(req.body);
  Room.updateOne({ _id: mongoose.Types.ObjectId(roomId) }, req.body, function (err, data) {
    console.log("update room is calling ", err, data);
    if (err)
      return res.status(500).json({ statusCode: 500, "message": "something went wrong" });
    return res.status(200).json({ statusCode: 200, "message:": "Rooms updated Successfully" });
  });
}

module.exports.updateMultipleRooms = function (req, res) {
  // //console.log(req.body);
  const dataLen = req.body.length;
  let counter = 0;
  //console.log(dataLen);
  req.body.forEach(room => {
    let roomId = room._id;
    delete room._id;
    Room.findOneAndUpdate({ _id: mongoose.Types.ObjectId(roomId) }, room, function (err, data) {

      counter += 1;
      if (err) return res.status(500).json(err);
      // //console.log(counter);
      if (counter === dataLen) return res.status(200).json('Success');
    });
  });

}

module.exports.delete = function (req, res) {
  Room.remove({ name: req.body.name }, function (err, removed) {
    if (!err) res.status(200).json(removed);
  });

};

module.exports.confirmRoomRestaurantOrder = function (req, res) {
  console.log("confirmRoomRestaurantOrder is calling", req.body._id);
  try {
    let roomId = req.body._id;
    const updateParms = { ...req.body };
    delete updateParms._id;
    console.log("roomId", roomId);
    if (req.body.restaurantData.orderClosed === true) {
      console.log("coming ot if confit", req.body.restaurantData.orderId);
      RestaurantOrders.findByIdAndUpdate(req.body.restaurantData.orderId, { $set: { status: 'confirmed' } }, function (err1, data1) {
        console.log("connfirm orders api ", err1, data1);
        if (err1) return res.status(500).json(err1);
        else {
          Room.findByIdAndUpdate(roomId, updateParms, function (err, doc) {
            if (err) res.status(500).json(err);
            else res.status(200).json(doc);
          })
        }
      })
    }
  } catch (e) {
    res.status(500).json(err);
  }

}

module.exports.roomRestaurantOrderPrepared = function (req, res) {
  let roomId = req.body._id;
  delete req.body._id;
  if (req.body.restaurantData.orderClosed === true) {

    Room.findByIdAndUpdate(roomId, req.body, function (err, doc) {
      if (err) res.status(500).json(err);
      else {
        RestaurantOrders.findByIdAndUpdate(req.body.restaurantData.orderId, { $set: { status: 'prepared' } }, function (err1, data1) {
          if (err1) return res.status(500).json(err1);
          else { }
        });
        res.status(200).json(doc);
      }
    });

  }
}

module.exports.roomRestaurantOrderPay = function (req, res) {
  try {
    console.log("what is coming",req.body);
    let roomId = req.body._id;
    delete req.body._id;
    let roomInfo = req.body.restaurantData;
    let otherInfo = req.body;
    const orderId = roomInfo.orderId;
    let totalPaid = 0;
    roomInfo.paymentInfo.forEach(element => {
      totalPaid += element.amt;
    });

    let orderUpdater = {};
    const updateTransaction = {};
    if (totalPaid <= 0 && otherInfo.orderTotal.subTotal > 0) {

      roomInfo.paymentStatus = 'pending';
      orderUpdater = { $set: { paymentInfo: roomInfo.paymentInfo, payedAmt: totalPaid, pending_balance: otherInfo.orderTotal.subTotal, paymentStatus: 'pending' } };
         console.log("pending-roomInfo",roomInfo);
         console.log("pending-orderUpdater",orderUpdater);
    } else if (totalPaid < otherInfo.orderTotal.subTotal) {

      roomInfo.paymentStatus = 'partial';
      orderUpdater = { $set: { paymentInfo: roomInfo.paymentInfo, payedAmt: totalPaid, pending_balance: otherInfo.orderTotal.subTotal - totalPaid, paymentStatus: 'partial' } };
      console.log("@@@@@@@@@@2orderUpdater@@@@@@@",orderUpdater);
      updateTransaction.amount_paid = totalPaid;
      updateTransaction.balance = otherInfo.orderTotal.subTotal - totalPaid;
      updateTransaction.orderId = orderId;
      updateTransaction.payment_status = "partial";
      updateTransaction.payment_type = roomInfo.paymentInfo[0].mode ? roomInfo.paymentInfo[0].mode : "d_cash";
      updateTransaction.folio = roomInfo.tableData.length;
      updateTransaction.date = new Date();
      updateTransaction.time = Date.now();
      updateTransaction.description = "about transaction";
      updateTransaction.hotelCode = req.body.hotelCode;
      updateTransaction.chequeNo = "no cheque";
      updateTransaction.receiptNo = "no receipt";
      console.log("partial-roomInfo",roomInfo);
      console.log("partial-orderUpdater",orderUpdater);
    } else if (totalPaid >= otherInfo.orderTotal.subTotal) {
      roomInfo.paymentStatus = 'paid';
      orderUpdater = { $set: { paymentInfo: roomInfo.paymentInfo, payedAmt: totalPaid, payedAmt: totalPaid, pending_balance: otherInfo.orderTotal.subTotal-totalPaid, paymentStatus: 'paid' } };
      updateTransaction.amount_paid = totalPaid;
      updateTransaction.balance = otherInfo.orderTotal.subTotal - totalPaid;
      updateTransaction.orderId = orderId;
      updateTransaction.payment_status = "paid";
      updateTransaction.payment_type = roomInfo.paymentInfo[0].mode ? roomInfo.paymentInfo[0].mode : "d_cash";
      updateTransaction.folio = roomInfo.tableData.length;
      updateTransaction.date = new Date();
      updateTransaction.time = Date.now();
      updateTransaction.description = "about transaction";
      updateTransaction.hotelCode = req.body.hotelCode;
      updateTransaction.chequeNo = "no cheque";
      updateTransaction.receiptNo = "no receipt";
      console.log("paid-roomInfo",roomInfo);
      console.log("paid-orderUpdater",orderUpdater);
    }
 
    async.waterfall([(callback) => {
      let OrderTransactionDb = new OrderTransaction(updateTransaction);
      OrderTransactionDb.save((err, data) => {
        if (!err) {
          console.log("OrderTransactionDb",data);
          callback()
        }
      });
     }, (callback) => {
      Room.findByIdAndUpdate(roomId, { 'restaurantData.orderTotal.paid': totalPaid, 
      'restaurantData.paymentInfo': roomInfo.paymentInfo,
      'restaurantData.paymentStatus': roomInfo.paymentStatus,
      'restaurantData.status': "Vacant" }, function (err1, data1) {
        if (err1) return res.status(500).json(err1);
        else {
          RestaurantOrders.findByIdAndUpdate(orderId, orderUpdater, function (err, doc) {
            if (err) res.status(500).json(err);
            else res.status(200).json(data1);
          })
        }
      })
    }], (done) => {

    })

  } catch (e) {
    console.log("exexption", e)
  }


}

module.exports.roomRenew = function (req, res) {
  const roomId = req.body._id;
  const roomInfo = req.body;
  delete roomInfo._id;

  Room.findByIdAndUpdate(roomId, roomInfo, function (err, data) {
    if (err) res.status(500).json(err)
    else {
      RestaurantOrders.findByIdAndRemove(roomInfo.restaurantData.orderId, function (err1, data1) {
        if (err1)
          console.log(err1);
        else console.log(data1);
      })
      res.status(200).json(data);
    }
  })
}
module.exports.getAllRoomsByCat = function (req, res) {
  var arr = [];
  RoomCat.find({ userid: req.payload._id, hotelCode: req.payload.hotelCode }, { name: 1 }, (err, categoriesData) => {
    async.forEach(categoriesData, function (item, callback) {
      // print the key
      Room.find({ category: item.name }).count((err, countOfRooms) => {
        const obj = {
          category: item.name,
          roomCount: countOfRooms
        };
        arr.push(obj);
        callback();
      });

    }, function (err) {
      console.log("@@@@@@@@@@", arr);
      res.json({ code: 3000, result: arr })

    });
  })
}