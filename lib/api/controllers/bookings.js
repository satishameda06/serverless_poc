var mongoose = require('mongoose');
var BookingHistory = mongoose.model('BookingHistory');
var Bookings = mongoose.model('Bookings');
var Customers = mongoose.model('Customers');
var User = mongoose.model('User');
var Room = mongoose.model('Room');

// mongoose.set('debug', true);
var async = require('async');
var _ = require('lodash');
var shortid = require('shortid');
var moment = require('moment');

const roomUtils = require('../utils/room');

exports.addRoomBooking = function (req, res) {

  // *Add booking
  if (req.body.customer.details == '') {
    req.body.customer.details = null;
  }
  if (typeof req.body.checkIn !== 'number') {
    req.body.checkIn = moment(req.body.checkIn).unix();
  }
  if (typeof req.body.checkOut !== 'number') {
    req.body.checkOut = moment(req.body.checkOut).unix();
  }

  let bookingData = new Bookings(req.body);
  bookingData.bookingFor = 'room';
  bookingData.id = shortid.generate();
  bookingData.hotelCode=req.body.hotelCode;
  bookingData.save(function (err, data) {
    if (err) return res.status(500).json(err);
    else {
      //console.log('Booking added!');
      updateFolio(data, function (er, dt) {
        if (er) {
          //console.log(er);
        } else {
          //console.log(dt);
        }
      })

      let userData = req.body.customer;
      userData['$setOnInsert'] = {id: shortid.generate()};
      Customers.findOneAndUpdate({
        email: userData.email
      }, userData, {
        upsert: true,
        new: true
      }, function (err2, cusData) {
        if (err) {
          //console.log(error);
        } else {
          //console.log('Customer added');
          Bookings.update({
            id: data.id
          }, {
            $set: {
              'customer.details': mongoose.Types.ObjectId(cusData._id)
            }
          }, function (ern, dan) {
            if (ern) {
              //console.log(ern);
            } else {
              //console.log('Booking customer updated')
            }
          })
        }
      });
      res.status(200).json(data);
     }
  });
}

exports.getBookings = function (req, res) {
 
  Bookings.find({
      userId: req.payload._id,
      hotelCode:req.payload.hotelCode,
      status: "active"
      // $and: [{
      //   type: {
      //     $ne: "noshow"
      //   }
      // }, {
      //   type: {
      //     $ne: "cancelled"
      //   }
      // }]
    })
    .populate('room')
    .populate('rateType')
    .populate('customer.details')
    .exec(function (err, data) {
      if (err){
     
        return res.status(500).json(err);
      } 
      else {
       
        return res.status(200).json(data);
      }
    });
}

exports.changeBookingStatus = function (req, res) {
  //console.log(req.body);
  console.log("changeBookingStatus")
  Bookings.findOneAndUpdate({
    id: req.body.id
  }, {
    $set: {
      type: req.body.type
    }
  }, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    } else {
      if (req.body.type === 'checkin') {
        Room.update({_id: mongoose.Types.ObjectId(req.body.room._id)}, {$set: {housekeepingStatus: 'Dirty'}}, function(err, retData) {
          if (err) 
          console.log(err);
          else 
          return res.status(200).json({
            status:"checkin",
            id: data.id,
            msg: 'Appointment updated!'
          });
        })
      }
    //here wrinting somthing
      if(req.body.type==="checkout"){
        Room.update({_id: mongoose.Types.ObjectId(req.body.room._id)}, {$set: {"restaurantData.status": 'Vaccant',"restaurantData.orderId": null,"restaurantData.tableData":[],"restaurantData.paymentInfo":[],"restaurantData.orderTotal":null}}, function(err, retData) {
          console.log("checkout",err, data);
          if (err) 
          console.log(err);
          else 
          return res.status(200).json({
            status:"checkout",
            id: data.id,
            msg: 'Appointment updated!'
          });
        })
      }//hiii
    
    }
  });
}

exports.addToFolio = function (req, res) {
  //console.log(req.body);
  Bookings.findOneAndUpdate({
    status: 'active',
    room: mongoose.Types.ObjectId(req.body.roomId)
  }, {
    $push: {
      'folio.items': {$each: req.body.folio}
    }
  }, function (err, data) {
    if (err) res.status(500).json(err);
    else res.status(200).json(data);
  });
}

updateFolio = function (bookingS, callback) {
  Bookings.findOne({
      id: bookingS.id
    })
    .populate('rateType')
    .populate('room')
    .lean()
    .exec(function (err, bookingA) {
      if (err) {
        callback(err, null);
      } else {
        booking = bookingA;
        var roomRate = _.filter(booking.rateType.roomRates, {
          roomName: booking.room.category
        });
        booking.rateType.roomRates = roomRate[0];
        let folioNum = booking.duration;
        let folioTotal = {
          totalPayableAmt: 0,
          payedAmt: 0,
          balanceAmt: 0
        }
        for (let i = 0; i < folioNum; i++) {
          let folio = {}
          folio.type = 'room';
          folio.basePrice = booking.rateType.roomRates[0].rate;
          folio.taxes = booking.rateType.vat;
          folio.addOns = booking.rateType.addOns || 0;
          folio.otherCharges = booking.rateType.otherCharges || 0;
          folio.otherTaxes = booking.rateType.other_tax || 0;
          folio.discount = booking.rateType.discount || 0;
          folio.otherDiscount = booking.rateType.otherDiscount || 0;
          folio.totalPayableAmt = booking.rateType.totalPayableAmt || 0;
          folio.payedAmt = booking.rateType.payedAmt || 0;
          folio.balanceAmt = booking.rateType.balanceAmt || 0;
          folio.date = moment.unix(booking.from).add(i, 'days').format('DD-MM-YYYY');
          folio.totalPayableAmt = ((folio.basePrice * (folio.taxes + folio.otherTaxes + folio.otherCharges - folio.discount - folio.otherDiscount)) / 100) + folio.basePrice + folio.addOns;
          folio.balanceAmt = folio.totalPayableAmt - folio.payedAmt;
          folioTotal.totalPayableAmt += folio.totalPayableAmt;
          folioTotal.payedAmt += folio.payedAmt;
          folioTotal.balanceAmt += folio.balanceAmt;
          //console.log(folio);
          Bookings.findOneAndUpdate({
              id: booking.id
            }, {
              $push: {
                'folio.items': folio
              },
              $set: {
                'folio.totalPayableAmt': folioTotal.totalPayableAmt,
                'folio.payedAmt': folioTotal.payedAmt,
                'folio.balanceAmt': folioTotal.balanceAmt
              }
            },
            function (error, data) {
              if (error) {
                //console.log(error);
              } else {
                //console.log('Folio added');
              }
            })
        }
        callback(null, 'Folio updated');
      }
    });
}

addBasicBooking = function (data, callback) {
  // *Add booking to booking table
  callback();
}

addUserData = function (data, callback) {
  // *Add new user data or update
  callback();
}

module.exports.addSingleBooking = function (req, res) {
  //console.log(JSON.stringify(req.body));
  var booking = new BookingHistory(req.body);
  // booking.services[0] = req.body.services;
  BookingHistory.update({
    entityId: req.body.entityId
  }, {
    $push: {
      services: req.body.services[0]
    }
  }, function (err, data) {
    if (err) res.status(500).json(err);
    //console.log(data);
    if (data.nModified == 0) {
      booking.save(function (err, _data) {
        if (err) res.status(500).json(err);
        res.status(200).json('Added');
      })
    } else {
      res.status(200).json('Added')
    };
  })
}

module.exports.updateBooking = function (req, res) {

  if (typeof req.body.checkIn !== 'number') {
    req.body.checkIn = moment(req.body.checkIn).unix();
  }
  if (typeof req.body.checkOut !== 'number') {
    req.body.checkOut = moment(req.body.checkOut).unix();
  }
  let bookingId = req.body._id;
  delete req.body._id;
  Bookings.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(bookingId)
    },
    req.body,
    function (err, data) {
      if (err) res.status(500).json(err);
      else res.status(200).json(data);
      updateFolio(data, function (er, dt) {
        if (er) {
          //console.log(er);
        } else {
          //console.log(dt);
        }
      });
    });
}

module.exports.changeRoom = async (req, res) => {

  if (typeof req.body.checkIn !== 'number') {
    req.body.checkIn = moment(req.body.checkIn).unix();
  }
  if (typeof req.body.checkOut !== 'number') {
    req.body.checkOut = moment(req.body.checkOut).unix();
    
  }
  let bookingId = req.body._id;
  req.body.room = mongoose.Types.ObjectId(req.body.room);
  delete req.body._id;
  const prevRoom = req.body.prevRoom;
  const newRoom = req.body.room;
  const roomAvailibility = await roomUtils.checkRoomAvailability(newRoom, req.body.checkIn, req.body.checkOut);
  console.log("roomAvailibility",roomAvailibility);
  if (roomAvailibility.bookingStatus === 'checkin') {
    return res.status(500).json('Room is checked in!');
  } else if (roomAvailibility.roomStatus === 'Dirty') {
    return res.status(500).json({msg: 'Room id dirty!'});
  }
  Bookings.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(bookingId)
    },
    req.body, {new: true},
    function (err, data) {
      if (err) res.status(500).json(err);
      else res.status(200).json(data);
    });
}

module.exports.cancelBookingv2 = function (req, res) {
  //console.log(req.body);
  Bookings.findOneAndUpdate({
    id: req.body.id
  }, {
    $set: {
      type: 'cancelled',
      status: 'inactive'
    }
  }, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    } else {
      //console.log(data);
      return res.status(200).json({
        id: data.id,
        msg: 'Appointment Cancelled!'
      });
    }
  });
}

module.exports.allbookings = function (req, res) {
  //console.log(req.payload);
  BookingHistory
    .find({
      userId: req.payload._id,
      hotelCode:req.payload.hotelCode,
      status: {
        $neq: 'cancelled'
      }
    })
    .exec(function (err, bookings) {
      res.status(200).json(bookings);
    })
};

module.exports.getDayBookings = async function (req, res) {
 
  let today ;
  // let today = moment().startOf('day').valueOf() / 1000;
  const querParams=req.query;

  let userId,hotelCode;
  
  if(querParams.user_type!=='admin'){
    
    //console.log("cming to under admin if condition");
     userId=req.payload._id;
     hotelCode=req.payload.hotelCode;
  
    const getBusinesData=await User.findOne({hotelCode,user_type:"admin"},{"property":1});
   
     //console.log("getBusinessDate",getBusinesData);
     today=getBusinesData.property.businessDate.valueOf();
     //console.log("today",today);
  } else {
    //console.log("coming to under admin else condition",req.payload);
  
    userId= req.payload._id;
    hotelCode=req.payload.hotelCode;
    today = req.payload.businessDate.valueOf();
    //console.log("userID",userId)
  }
  // console.log("userId",userId);
  // console.log("hotelCode",hotelCode);
  // console.log("req.payload",req.payload);
 

 console.log("today",today);
 console.log("userId",userId);
 console.log("hotelCode",hotelCode,req.payload.businessDate);
  Bookings.find({
      userId: userId,
      hotelCode:hotelCode,
      from: {
        $lte: today
      },
      to: {
        $gte: today
      },
      type: 'checkin'
    })
    .populate('room')
    .populate('rateType')
    .exec(function (err, data) {
      
      res.json(data);
    });
}

exports.getTodayCheckouts = function (req, res) {
  //console.log(req.body.businessDate);
  // const today = moment(req.payload.businessDate).startOf('day').valueOf() / 1000;
  const today = req.body.businessDate;

  Bookings.find({
      userId: req.body.userId,
      hotelCode:req.body.hotelCode,
      type: 'checkin',
      checkOut: {
        $lte: today
      }
    })
    .populate('room')
    .exec(function (err, data) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else res.status(200).json(data);
    })
  // res.json(today);
}

exports.getTodayCheckins = function (req, res) {
  const today = req.body.businessDate
  Bookings.find({
      userId: req.body.userId,
      hotelCode:req.body.hotelCode,
      type: {
        $in: ['reserve', 'tempReserve']
      },
      checkIn: {
        $lte: today
      }
    })
    .populate('room')
    .exec(function (err, data) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else res.status(200).json(data);
    })
}

exports.getRoomStats = function (req, res) {
  //console.log(req.payload._id,req.payload.hotelCode);
  let occupiedRooms = {};
  let availableRooms = {};
  let todayCheckins = {};
  let todayCheckouts = {};
  // Or, with named functions:
  async.waterfall([
    occupiedRoomsFunc,
    availableRoomsFunc,
    todayCheckinsFunc
  ], function (err, result) {
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.status(200).json(
        {
          occupiedRooms: occupiedRooms,
          availableRooms: availableRooms,
          todayCheckins: todayCheckins
        }
      )
    }
  });

  function occupiedRoomsFunc(callback) {
    Bookings.find({
      userId: req.payload._id,
      hotelCode:req.payload.hotelCode,
      type: 'checkin'
    }, function (err, docs) {
      if (err) {
        callback(err, null);
      } else if (docs) {
        //console.log(docs);
        occupiedRooms.total = docs.length;
        const adults = _.sumBy(docs, 'adults');
        const children = _.sumBy(docs, 'children');
        occupiedRooms.guests = adults + children;
        callback(null, docs);
      } else {
        occupiedRooms.total = 0;
        callback(null, []);
      }
    });
  }

  function availableRoomsFunc(occupiedBookings, callback) {
    Room.find({
      userid: req.payload._id,
      hotelCode:req.payload.hotelCode
    }, function (err, docs) {
      if (err) {
        callback(err, null);
      } else {
        availableRooms = {
          total: docs.length
        }
        const occupiedRoomIds = _.map(occupiedBookings, 'room');
        const freeRooms = _.filter(docs, function(o) {
          if(occupiedRoomIds.indexOf(o._id) == -1) return o 
        });
        availableRooms.total = freeRooms.length;
        callback(null, availableRooms);
      }
    })
  }

  function todayCheckinsFunc(someData, callback) {
    Bookings.find({
      userId: req.payload._id,
      hotelCode:req.payload.hotelCode,
      checkIn: req.payload.businessDate
    }, function(err, data) {
      if (err) callback(err, null);
      else {
        const adults = _.sumBy(data, 'adults');
        const children = _.sumBy(data, 'children');
        todayCheckins = {
          total: data.length,
          guests: adults + children
        }
        callback(null, todayCheckins);
      }
    })
    
  }

  function todayCheckoutsunc(someData, callback) {
    Bookings.find({
      userId: req.payload._id,
      hotelCode:req.payload.hotelCode,
      checkOut: req.payload.businessDate
    }, function(err, data) {
      if (err) callback(err, null);
      else {
        //console.log(data);
        const adults = _.sumBy(data, 'adults');
        const children = _.sumBy(data, 'children');
        todayCheckouts = {
          total: data.length,
          guests: adults + children
        }
        callback(null, todayCheckouts);
      }
    })
    
  }

}

exports.noShowBooking = async(req, res) => {
  let id = req.body._id;
  let booking = req.body;
  let updatedBooking = await Bookings.findByIdAndUpdate(id, {type: booking.type});

  return res.status(200).json(updatedBooking);
}