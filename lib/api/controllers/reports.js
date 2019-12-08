var mongoose = require('mongoose');
var BookingHistory = mongoose.model('BookingHistory');
var Bookings = mongoose.model('Bookings');
var Customers = mongoose.model('Customers');
var Restaurant = mongoose.model('Restaurant');
var Room = mongoose.model('Room');
var PaymentTypes = mongoose.model('PaymentTypes');
// mongoose.set('debug', true);
var async = require('async');
var _ = require('lodash');
var shortid = require('shortid');
var moment = require('moment');



exports.addRoomBookingv1 = function (req, res) {
  let userData = req.body.user;

  // * First find customer
  Customers.findOneAndUpdate({
    firstname: userData.firstname,
    email: userData.email,
    phone: userData.phone
  }, userData, {
    upsert: true
  }, function (err, data) {
    if (err) return res.status(500).json(err);
    else {
      //console.log(data);
      let bookingData = {};
      bookingData.calendarInfo = req.body.calendarInfo;
      bookingData.bookingFor = 'room';
      bookingData.userId = req.body.userId;
      bookingData.customer = data._id;
      bookingData.room = req.body.room._id;
      bookingData.from = req.body.from;
      bookingData.to = req.body.to;
      bookingData.type = req.body.type;
      if (!bookingData.id) bookingData.id = bookingData.bookingFor + '-' + shortid.generate();
      //console.log(bookingData);
      Bookings.findOneAndUpdate({
        id: bookingData.id
      }, bookingData, {
        upsert: true
      }, function (err1, data1) {
        if (err1) return res.status(500).json(err1);
        else return res.status(200).json(data1);
      })

    }
  })
}

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
  bookingData.id = bookingData.bookingFor + '-' + shortid.generate();
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
      Customers.findOneAndUpdate({
        firstname: userData.firstname,
        email: userData.email,
        phone: userData.phone
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
      status: "active",
      $and: [{
        type: {
          $ne: "noshow"
        }
      }, {
        type: {
          $ne: "cancelled"
        }
      }]
    })
    .populate('room')
    .populate('rateType')
    .populate('customer.details')
    .exec(function (err, data) {
      if (err) return res.status(500).json(err);
      else return res.status(200).json(data);
    });
}


exports.changeBookingStatus = function (req, res) {
  //console.log(req.body);
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
          console.log('Room made dirty!');
        })
      }
      return res.status(200).json({
        id: data.id,
        msg: 'Appointment updated!'
      });
    }
  });
}

exports.addToFolio = function (req, res) {
  //console.log(req.body);
  Bookings.findOneAndUpdate({
    _id: mongoose.Types.ObjectId(req.body.bookingId)
  }, {
    $push: {
      'folio.items': req.body.folio
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
        // var roomRate = _.filter(booking.rateType.roomRates, (x) => {
        //   //console.log(x.roomName);
        //   x.roomName === booking.room.category
        
        // });
        var roomRate = null;
        for (const rate of booking.rateType.roomRates) {
          //console.log(rate.rate, rate.roomName);
          roomRate = [rate];
        }
        //console.log(roomRate);
        booking.rateType.roomRates = roomRate;
        let folioNum = booking.duration;
        let folioTotal = {
          totalPayableAmt: 0,
          payedAmt: 0,
          balanceAmt: 0
        }
        for (let i = 0; i < folioNum; i++) {
          let folio = {}
          folio.type = 'room';
          // if (!booking.rateType.roomRates) folio.basePrice = booking.roomRates.rate;
          folio.basePrice = booking.rateType.roomRates.rate;
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
          if (!folio.balanceAmt) folio.balanceAmt === 0;
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

module.exports.changeRoom = function (req, res) {

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


module.exports.allReports = function (req, res){
  Bookings.find({},function(err, data){
    if (err) return res.status(500).json(err);
    else res.status(200).json(data);
  })
};

module.exports.getAll = function(req, res){
  if (!req.query.counter && !req.query.country && !req.query.nationality && !req.query.roomType && !req.query.queryBasedOn && !req.query.fromDate && !req.query.toDate) {
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
      if (err) return res.status(500).json(err);
     else return res.status(200).json(data);
   });
  } else {
    let query = {userId: req.payload._id,hotelCode:req.payload.hotelCode};
    if (req.query.country) {
      if (req.query.country !== "All") {
        query = { userId: req.payload._id,hotelCode:req.payload.hotelCode, "customer.address.country" : req.query.country};
      }
      if (req.query.nationality) {
        if (req.query.country !== "All") {
          query = { userId: req.payload._id, hotelCode:req.payload.hotelCode, "customer.address.country" : req.query.country, "customer.nationality" : req.query.nationality};
        }
      }
    }
    if (req.query.nationality) {
      if (req.query.country !== "All") {
        query = { userId: req.payload._id, hotelCode:req.payload.hotelCode, "customer.nationality" : req.query.nationality};
      }
      if (req.query.country) {
        if (req.query.country !== "All") {
          query = { userId: req.payload._id,hotelCode:req.payload.hotelCode, "customer.address.country" : req.query.country, "customer.nationality" : req.query.nationality};
        }
      }
    }
    if (req.query.roomType) {
      query.bookingType = req.query.roomType;
    }
    if (req.query.queryBasedOn) {
      if (req.query.fromDate !== "undefined") {
        if (req.query.toDate !== "undefined") {
          let time = moment.duration("05:30:00");
          let from_date = moment(req.query.fromDate, "MM/DD/YYYY").subtract(time);
          let fromDate = from_date.unix();
          let to_date = moment(req.query.toDate, "MM/DD/YYYY").subtract(time);
          let toDate = to_date.unix();
          if (req.query.queryBasedOn == "Check In") {
            query.checkIn = {$gte : fromDate, $lte : toDate};
          } else if (req.query.queryBasedOn == "Check Out Date") {
            query.checkOut = {$gte : fromDate, $lte : toDate};
          } else {
            query.checkIn = {$gte : fromDate, $lte : toDate};
            query.checkOut = {$gte : fromDate, $lte : toDate};
          }
        } else {
          return res.status(500).json({res : false, message : "Please enter to date"});
        }
      } else {
        return res.status(500).json({res : false, message : "Please enter from date"});
      }
    }
    Bookings.find(query, function(err, data){
      if (err) return res.status(500).json(err);
     else 
     return res.status(200).json(data);
   });
  }

};

module.exports.tempReserveSummary = function(req, res){
  if (!req.query.fromDate && !req.query.toDate && !req.query.queryBasedOn) {
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, type: "tempReserve"}, function(err, data){
      if (err) return res.status(500).json(err);
     else return res.status(200).json(data);
   });
  } else {
    let query = {userId: req.payload._id,hotelCode:req.payload.hotelCode, type: "tempReserve"};
    if (req.query.queryBasedOn) {
      if (req.query.fromDate !== "undefined") {
        if (req.query.toDate !== "undefined") {
          let time = moment.duration("05:30:00");
          let from_date = moment(req.query.fromDate, "MM/DD/YYYY").subtract(time);
          let fromDate = from_date.unix();
          let to_date = moment(req.query.toDate, "MM/DD/YYYY").subtract(time);
          let toDate = to_date.unix();
          if (req.query.queryBasedOn == "Check In") {
            query.checkIn = {$gte : fromDate, $lte : toDate};
          } else if (req.query.queryBasedOn == "Check Out Date") {
            query.checkOut = {$gte : fromDate, $lte : toDate};
          } else {
            query.checkIn = {$gte : fromDate, $lte : toDate};
            query.checkOut = {$gte : fromDate, $lte : toDate};
          }
        } else {
          return res.status(500).json({res : false, message : "Please enter to date"});
        }
      } else {
        return res.status(500).json({res : false, message : "Please enter from date"});
      }
 
    }
    Bookings.find(query, function(err, data){
      if (err) return res.status(500).json(err);
     else return res.status(200).json(data);
   });
  }

};

// Finance Report Module Start
module.exports.getMonthlyFinanceReport = function(req, res){
  if(!req.body.monthStartTimeStamp || !req.body.monthEndTimeStamp){
    res.status(400).json("All fileds Required");
  }else{
   return res.status(200).json({"totalroominventory": 585,"ravparIncl":34,"ravparExcl":24,"totalRoomRent":23994,"TotalRoomIncl":237874,"TotalTax":23467,"totalOtherCharge":34567,"totalOtherTax":7865,"grossTotal":675476});
  }
 
};

module.exports.getRevPerReport = function(req, res){
  if(!req.body.monthStartTimeStamp || !req.body.monthEndTimeStamp){
    return res.status(400).json({"msg" : "All fileds Required"});
  }else{
    var monthStartTimeStamp = req.body.monthStartTimeStamp;
    var monthEndTimeStamp = req.body.monthEndTimeStamp;
    Bookings.find({userId: req.payload._id, hotelCode:req.payload.hotelCode,checkIn: {$gte: monthStartTimeStamp }, checkOut: {$lte: monthEndTimeStamp}},{folio: true}, function(err, data){
      if(err){
        return res.status(500).json({"msg": "Oops! Something went wrong"});
      }else{
        return res.status(200).json(data);
      }
   });
  }
};

module.exports.getFinanceReport = function(req,res){
  if(!req.body.counter ||!req.body.type || !req.body.monthStartTimeStamp || !req.body.monthEndTimeStamp){
    return res.status(400).json({"msg" : "All fileds Required"});
  }else{
      if(req.body.type == 1){
        Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, checkIn: {$gte: req.body.monthStartTimeStamp},checkIn: {$lte: req.body.monthEndTimeStamp}},{checkIn: true,checkOut: true,"folio.items": true}, function(err, data){
          if (err) return res.status(500).json(err);
        else return res.status(200).json(data);
        });

      } else if(req.body.type == 2){
        Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, checkOut: {$gte: req.body.monthStartTimeStamp},checkOut: {$lte: req.body.monthEndTimeStamp}},{checkIn: true,checkOut: true,"folio.items": true}, function(err, data){
          if (err) return res.status(500).json(err);
        else return res.status(200).json(data);
        });

      } else if(req.body.type == 3){
        Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, checkIn: {$gte: req.body.monthStartTimeStamp},checkOut: {$lte: req.body.monthEndTimeStamp}},{checkIn: true,checkOut: true,"folio.items": true}, function(err, data){
          if (err) return res.status(500).json(err);
        else return res.status(200).json(data);
        });

      } else{
        return res.status(400).json({"msg" : "Incorrect Data Type"});
      }
      
  }
}

module.exports.getBookingDetails = function(req, res){
  if(!req.body.bookingId){
    return res.status(400).json({"msg" : "All Parameter Required"});
  }
  Bookings.find({userId: req.payload._id,_id: req.body.bookingId,hotelCode:req.payload.hotelCode},function(err, data){
    if(err){
      return res.status(500).json({"msg": "Internal Server Error"});
    }else{
      return res.status(200).json(data);
    }
  });

};

module.exports.getDailyRevenueReport = function(req, res){
   if(!req.body.dayStartTimeStamp || !req.body.dayEndTimeStamp || !req.body.excluderoundoffcharge || !req.body.financialyear){
      return res.status(400).json({"msg": "All Parameter Required"});
   }
   Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, checkIn: {$gte: req.payload.dayStartTimeStamp}, checkIn: {$lte: req.body.dayEndTimeStamp}},function(err, data){
     if(err){
       return res.status(500).json(err);
     }else{
       return res.status(200).json(data);
     }
   });

};


// Finance Report Module End

module.exports.getAvailibilityReport = function(req, res){
  if(!req.body.roomType || !req.body.from || !req.body.to){
     return res.status(400).json({"msg": "All fiels Required"});
  }else{
     var roomType = req.body.roomType;
     Room.find({category: req.body.roomType},{name: true,isRestaurantBooked: true}, function(err, data){
        if(err){
          return res.status(500).json("Oops! Something went wrong");
        }else{
          return res.status(200).json(data);
        }
     });
  }

};

module.exports.getReserveReservation = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, type: "reserve"}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getChenibReservation = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, type: "checkin"}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getMonthlyReserveSummary = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getDayReserveSummary = function(req, res){
  let today = moment().startOf('day').valueOf() / 1000;
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getpostreport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};module.exports.getGuestReport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};module.exports.getTaxReport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};module.exports.getSourceReport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getMonthlyReserveSummary = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getAdvDailyDepositReport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode},{"folio.items": true,customer: true}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getDirectBillingReport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getFundOperation = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};
module.exports.getMothlyCCReport = function(req, res){
  if(!req.body.from || !req.body.to){
    res.status(400).json("All fileds Required");
  }else{
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,from : { 
        $gte : req.body.from
      },
        to : { 
          $lte : 
          req.body.to
        }}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });
  }
  

};
module.exports.getDailyCCReport = function(req, res){
  if(!req.body.from || !req.body.to){
    res.status(400).json("All fileds Required");
  }else{
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,from : { 
        $gte : req.body.from
      },
        to : { 
          $lte : 
          req.body.to
        }}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });
  }

};
module.exports.getGroupStayReport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};
module.exports.getNightAudits = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};



module.exports.revenueGetCashierReport = function(req, res){
  if(!req.body.checkIn || !req.body.checkOut){
    return res.status(400).json({"message": "All Fields Required"})
  }else{
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,checkIn : { $lt : req.body.checkIn}, checkOut : {$gt: req.body.checkOut} }, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });
  }
    

};

module.exports.revenueGetCashierReport2 = function(req, res){
  if(!req.body.checkIn || !req.body.checkOut){
    return res.status(400).json({"message": "All Fields Required"})
  }else{
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,$or : [{checkIn : { $lt : req.body.checkIn}, checkOut : {$gt: req.body.checkOut}}]}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });
  }

};


module.exports.payTypeReport = function(req, res){
   if(!req.body.checkIn || !req.body.checkOut){
    return res.status(400).json({"message": "All Fields Required"})
  }else{
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,$or : [{checkIn : { $lt : req.body.checkIn}, checkOut : {$gt: req.body.checkOut}}]}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });
  }

};

module.exports.getRevenueCollection = function(req, res){
   if(!req.body.checkIn || !req.body.checkOut){
    return res.status(400).json({"message": "All Fields Required"})
  }else{
    Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,$or : [{checkIn : { $lt : req.body.checkIn}, checkOut : {$gt: req.body.checkOut}}]}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });
  }

};

module.exports.getAllRoomsByFromTo = function(req, res) {
  if(!req.body.from || !req.body.to){
    return res.status(400).json({
      msg : "All parameters required"
    })
  }
  let count = 0;
  var calls = [];
  const today = req.params.date;
  Room.find({userid: req.payload._id,hotelCode:req.payload.hotelCode})
  .lean()
  .exec(function(err, data) {
    if(err) res.status(500).json(err);
    // data.forEach(room => {
    //   BookingHistory.findOne({entityId: room._id.toString()}, function(err, data) {
    //     ++count;
    //   })
    // });
    // res.status(200).json(count);
    data.forEach(function(room){
      calls.push(function(callback) {
          Bookings.findOne({
            room: mongoose.Types.ObjectId(room._id), 
            from: {$gte: req.body.from}, 
            to: {$lte: req.body.to}
          }, 
              
            function(err, _data) {
              if (err)
                  return callback(err);
              //console.log(_data);
              if (_data) {
                room.availability = 'Occupied';
              } else {
                room.availability = 'Available';
              }
              ++count;
              callback(null, room._id);
          });
      }
  )});
  
  async.parallel(calls, function(err, result) {
      /* this code will run after all calls finished the job or
         when any of the calls passes an error */
      if (err)
          return //console.log(err);
      res.status(200).json(data);
  });
  })
}


module.exports.betweenReport = function(req, res){
  
  if(!req.body.from || !req.body.to){
    return res.status(400).json({
      msg : "All parameters required"
    })
  }
  Bookings
  .find({userId: req.payload._id,hotelCode:req.payload.hotelCode,
    checkIn: {$gte : req.body.from},
    checkOut: {$lte: req.body.to}
  },function(err, data) {
    if (err) 
    console.log(err);
    else  return res.status(200).json(data);
  });
};

module.exports.alllookup = function(req, res){
  
  /* let book = {};
  book = req.body;
  Bookings
  .find(book,function(err, data) {
    if (err) //console.log(err);
    else  return res.status(200).json(data);
  }); */
  let book = {};
  book = req.body;
  book.userId = req.payload._id;
  book.hotelCode=req.payload.hotelCode;
  Bookings.find(book)
  .populate('room',{"name": true})
  .exec(function (err, data) {
    console.log(err);
    if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });
};

module.exports.getPaymetTypes = function(req, res){
  PaymentTypes.find({},function(err, data){
    if (err) 
    console.log(err);
    else  
    return res.status(200).json(data);
  }); 

};

module.exports.getCashierRevenue = function(req, res){
  Bookings
  .find({userId: req.payload._id,hotelCode:req.payload.hotelCode
  },{"customer.firstname" : 1,"customer.lastname" : 1,"folio.totalPayableAmt": 1,id: 1,room: 1},function(err, data) {
    if (err) 
    console.log(err);
    else  return res.status(200).json(data);
  });

};

module.exports.getCashierRevenueBetweenFromTo = function(req, res){
  if(!req.body.fromdate || !req.body.todate || !req.body.type){
    return res.status(400).json({
      msg : "All parameters required"
    })
 }
 var myDate = req.body.fromdate;
 myDate=myDate.split("-");
 var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
 var ts= Math.round(new Date(newDate).getTime()/1000);
 var myDate2 = req.body.todate;
 myDate2=myDate2.split("-");
 var newDate2 =myDate2[1]+","+myDate2[0]+","+myDate2[2];
 var tss = Math.round(new Date(newDate2).getTime()/1000);
 var tss2 = tss + (24 * 3600);
  Bookings
  .find({userId: req.payload._id,hotelCode:req.payload.hotelCode,checkIn: {"$gte": ts},checkIn: {"$lte": tss2}
  },{"customer.firstname" : 1,"customer.lastname" : 1,"folio": 1,id: 1,room: 1},function(err, data) {
    if (err) 
    console.log(err);
    else  return res.status(200).json(data);
  });

};






module.exports.getTrialBalanceByDate = function(req, res){
  if(!req.body.date || !req.body.type){
    return res.status(400).json({
      msg : "All parameters required"
    })
 };
 var type = req.body.type;
 var myDate = req.body.date;
 myDate=myDate.split("-");
 var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
 var ts= Math.round(new Date(newDate).getTime()/1000);
 var ts2 = ts + (24 * 3600);
  Bookings
  .find({userId: req.payload._id,hotelCode:req.payload.hotelCode,type: type,checkIn: {"$gte": ts},checkIn: {"$lte": ts2}
  },{"customer.firstname" : 1,"customer.lastname" : 1,"folio": 1,id: 1,room: 1,type:1,checkIn:1,checkOut:1},function(err, data) {
    if (err) 
    console.log(err);
    else  return res.status(200).json(data);
  });

};



module.exports.getMonthlyCreditCardReport = function(req, res){
 //  var myDate="26-02-2012";
  var myDate= req.body.startDate;
  var myDate2= req.body.endDate;

  myDate= myDate.split("-");
  var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
  var startDate= Math.round(new Date(newDate).getTime()/1000);

  myDate2= myDate2.split("-");
  var newDate2=myDate2[1]+","+myDate2[0]+","+myDate2[2];
  var endDate= Math.round(new Date(newDate2).getTime()/1000);
  
  Bookings
  .find({userId: req.payload._id,hotelCode:req.payload.hotelCode,from: {
    $lte: endDate
  },
  to: {
    $gte: startDate
  }
  },{"customer.cardInfo": 1,"folio.totalPayableAmt": 1},function(err, data) {
    if (err)
     console.log(err);
    else  return res.status(200).json(data);
  });

};

module.exports.getDailyCreditReport = function(req,res){
 // var myDate="26-02-2012";
   var myDate = req.body.date;
   myDate=myDate.split("-");
  var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
  var ts= Math.round(new Date(newDate).getTime()/1000);
  var tsYesterday = ts - (24 * 3600);
  Bookings
  .find({userId: req.payload._id,hotelCode:req.payload.hotelCode,from: {
    $lte: ts
  },
  to: {
    $gte: tsYesterday
  }
  },{"customer.cardInfo": 1,"folio.totalPayableAmt": 1},function(err, data) {
    if (err) 
    console.log(err);
    else  return res.status(200).json(data);
  });

}

module.exports.houseKeepingReport = function(req, res){
  Room.aggregate([
    {
      "$lookup": {
        "localField": "_id",
        "from": "bookings",
        "foreignField": "room",
        "as": "bookingsinfo"
      }
    },

  ],function(err, data){
    if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  })
};

module.exports.houseKeepingReportByDate = function(req, res){
if(!req.body.date){
    return res.status(400).json({
      msg : "All parameters required"
    })
}
// var myDate="26-02-2012";
 var myDate = req.body.date;
 myDate=myDate.split("-");
 var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
 var ts= Math.round(new Date(newDate).getTime()/1000);
 var ts2 = ts + (24 * 3600);
  Room.aggregate([
    {
      "$lookup": {
        "localField": "_id",
        "from": "bookings",
        "foreignField": "room",
        "as": "bookingsinfo"
      },
      
    },
    {$unwind : "$bookingsinfo"},
    { $match: {"bookingsinfo.from": {"$gte": ts},"bookingsinfo.from": {"$lte": ts2},"bookingsinfo.userId": req.payload._id,"bookingsinfo.hotelCode":req.payload.hotelCode}}
   //  { $match: {"bookingsinfo.from": {"$gte": ts},"bookingsinfo.to": {"$lte": ts}}}
  ],function(err, data){
    if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  })
};


module.exports.summaryReport = function(req, res){
  Bookings.aggregate([{"$lookup": {
                  "localField": "userId",
                  "from": "users",
                  "foreignField": "_id",
                  "as": "userinfo"
                }}],function(err, data){
                   if (err) return res.status(500).json(err);
                   else return res.status(200).json(data);
                })

};

/*module.exports.getAll = function(req, res){
  //console.log("Payload : ",req.payload);
  Bookings.find({userId: req.payload._id}, function(err, data){
     if (err) return res.status(500).json(err);
    else 
    //console.log("Data : ",data);
    return res.status(200).json(data);
  });

};*/

module.exports.getReservationReport = function(req, res){
  if(!req.body.fromdate || !req.body.todate || !req.body.nationality || !req.body.country || !req.body.bookingType){
    return res.status(400).json({
      msg : "All parameters required"
    })
 }
  var myDate = req.body.fromdate;
 myDate=myDate.split("-");
 var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
 var ts= Math.round(new Date(newDate).getTime()/1000);
 var myDate2 = req.body.todate;
 myDate2=myDate2.split("-");
 var newDate2 =myDate2[1]+","+myDate2[0]+","+myDate2[2];
 var tss = Math.round(new Date(newDate2).getTime()/1000);
 var tss2 = tss + (24 * 3600);
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode, 'customer.nationality': req.body.nationality, 'customer.address.country' : req.body.country,bookingType: req.body.bookingType,checkIn: {"$gte": ts},checkIn: {"$lte": tss2}},function(err,data){
    if(err) 
    console.log(err);
    else return res.status(200).json(data);
  });

};

module.exports.getTempReservationReport = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,type: "tempReserve"},{room: true,customer: true,type: true,checkIn: true,checkOut: true,"folio.balanceAmt": true,"folio.payedAmt": true,"folio.totalPayableAmt": true},function(err,data){
    if(err) 
    console.log(err);
    else return res.status(200).json(data);
  });

};

module.exports.getSummary = function(req, res){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
     if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

};

module.exports.getArivalList = function (req, res) {
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!

var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd;
} 
if(mm<10){
    mm='0'+mm;
} 
var today = dd+'-'+mm+'-'+yyyy;

if (!req.query.queryBasedOn && !req.query.fromDate && !req.query.toDate && !req.query.nameSearch) {
  //console.log("inside");
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
    if (err) return res.status(500).json(err);
   else return res.status(200).json(data);
 });
} else {
  let query = {userId: req.payload._id,hotelCode:req.payload.hotelCode};
  if (req.query.nameSearch) {
    query = {userId : req.payload._id ,hotelCode:req.payload.hotelCode,"$or": [{"customer.firstname" : {$regex: req.query.nameSearch}},
    {"customer.lastname" : {$regex: req.query.nameSearch}}]};
  }
  if (req.query.queryBasedOn) {
    if (req.query.fromDate !== "undefined") {
      if (req.query.toDate !== "undefined") {
        let time = moment.duration("05:30:00");
        let from_date = moment(req.query.fromDate, "MM/DD/YYYY").subtract(time);
        let fromDate = from_date.unix();
        let to_date = moment(req.query.toDate, "MM/DD/YYYY").subtract(time);
        let toDate = to_date.unix();
        if (req.query.queryBasedOn == "Check In") {
          query.checkIn = {$gte : fromDate, $lte : toDate};
        } else if (req.query.queryBasedOn == "Check Out Date") {
          query.checkOut = {$gte : fromDate, $lte : toDate};
        } else {
          query.checkIn = {$gte : fromDate, $lte : toDate};
          query.checkOut = {$gte : fromDate, $lte : toDate};
        }
      } else {
        return res.status(500).json({res : false, message : "Please enter to date"});
      }
    } else {
      return res.status(500).json({res : false, message : "Please enter from date"});
    }
  }
  let sorting;  
  if (req.body.sortBy) {
    if (req.query.sortBy == "Room Type") {
      sorting = { bookingType : -1 };
    } else if (req.query.sortBy == "Room") {
      sorting = { room : -1};
    }
  }
    Bookings.find(query).sort(sorting).exec(function(err, data){
      if (err) { 
          return res.status(500).json(err);
        } else {
          return res.status(200).json(data);
        }
    });
  }
};

module.exports.getArrivalByCheckInCheckOut = function(req, res){
 if(!req.body.fromdate || !req.body.todate || !req.body.type){
    return res.status(400).json({
      msg : "All parameters required"
    })
 }
 var myDate = req.body.fromdate;
 myDate=myDate.split("-");
 var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
 var ts= Math.round(new Date(newDate).getTime()/1000);
 var myDate2 = req.body.todate;
 myDate2=myDate2.split("-");
 var newDate2 =myDate2[1]+","+myDate2[0]+","+myDate2[2];
 var tss = Math.round(new Date(newDate2).getTime()/1000);
 var tss2 = tss + (24 * 3600);
 if(req.body.type == 'checkIn'){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,checkIn: {"$gte": ts},checkOut: {"$lte": tss2}},{"checkIn": true,"checkOut": true,"id": true,"bookingType": true,"customer": true,"folio": true}, function(err, data){
    if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

 }else if(req.body.type = 'checkOut'){
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,checkIn: {"$gte": ts},checkOut: {"$lte": tss2}},{"checkIn": true,"checkOut": true,"id": true,"bookingType": true,"customer": true,"folio": true}, function(err, data){
    if (err) return res.status(500).json(err);
    else return res.status(200).json(data);
  });

 }else{
  return res.status(400).json({
    msg : "Type value is incorrect"
  })
 }
  
};

module.exports.getDepartureByCheckInCheckOut = function(req, res){
  if(!req.body.fromdate || !req.body.todate || !req.body.type){
     return res.status(400).json({
       msg : "All parameters required"
     })
  }
  var myDate = req.body.fromdate;
  myDate=myDate.split("-");
  var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
  var ts= Math.round(new Date(newDate).getTime()/1000);
  var myDate2 = req.body.todate;
  myDate2=myDate2.split("-");
  var newDate2 =myDate2[1]+","+myDate2[0]+","+myDate2[2];
  var tss = Math.round(new Date(newDate2).getTime()/1000);
  var tss2 = tss + (24 * 3600);
  if(req.body.type == 'checkIn'){
   Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,checkIn: {"$gte": ts},checkOut: {"$lte": tss2}}, function(err, data){
     if (err) return res.status(500).json(err);
     else return res.status(200).json(data);
   });
 
  }else if(req.body.type = 'checkOut'){
   Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode,checkIn: {"$gte": ts},checkOut: {"$lte": tss2}}, function(err, data){
     if (err) return res.status(500).json(err);
     else return res.status(200).json(data);
   });
 
  }else{
   return res.status(400).json({
     msg : "Type value is incorrect"
   })
  }
   
 };
 

module.exports.getDepartureList = function (req, res) {
  var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!

var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd;
} 
if(mm<10){
    mm='0'+mm;
} 
var today = dd+'-'+mm+'-'+yyyy;
if (!req.query.queryBasedOn && !req.query.fromDate && !req.query.toDate && !req.query.nameSearch) {
  //console.log("inside");
  Bookings.find({userId: req.payload._id,hotelCode:req.payload.hotelCode}, function(err, data){
    if (err) return res.status(500).json(err);
   else return res.status(200).json(data);
 });
} else {
  let query = {userId: req.payload._id,hotelCode:req.payload.hotelCode};
  if (req.query.nameSearch) {
    query = {userId : req.payload._id , hotelCode:req.payload.hotelCode,"$or": [{"customer.firstname" : {$regex: req.query.nameSearch}}, 
    {"customer.lastname" : {$regex: req.query.nameSearch}}]};
  }
  if (req.query.queryBasedOn) {
    if (req.query.fromDate !== "undefined") {
      if (req.query.toDate !== "undefined") {
        let time = moment.duration("05:30:00");
        let from_date = moment(req.query.fromDate, "MM/DD/YYYY").subtract(time);
        let fromDate = from_date.unix();
        let to_date = moment(req.query.toDate, "MM/DD/YYYY").subtract(time);
        let toDate = to_date.unix();
        if (req.query.queryBasedOn == "Check In") {
          query.checkIn = {$gte : fromDate, $lte : toDate};
        } else if (req.query.queryBasedOn == "Check Out Date") {
          query.checkOut = {$gte : fromDate, $lte : toDate};
        } else {
          query.checkIn = {$gte : fromDate, $lte : toDate};
          query.checkOut = {$gte : fromDate, $lte : toDate};
        }
      } else {
        return res.status(500).json({res : false, message : "Please enter to date"});
      }
    } else {
      return res.status(500).json({res : false, message : "Please enter from date"});
    }
  }
  let sorting;  
  if (req.body.sortBy) {
    if (req.query.sortBy == "Room Type") {
      sorting = { bookingType : -1 };
    } else if (req.query.sortBy == "Room") {
      sorting = { room : -1};
    }
  }
    Bookings.find(query).sort(sorting).exec(function(err, data){
      if (err) { 
          return res.status(500).json(err);
        } else {
          return res.status(200).json(data);
        }
    });
  }
};

module.exports.getAllBookings = function (req, res) {
  let today = moment().startOf('day').valueOf() / 1000;
  Bookings.find({
      userId: req.payload._id,
      hotelCode:req.payload.hotelCode,
      from: {
        $lte: today
      },
      to: {
        $gte: today
      }
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

module.exports.listRestaurant = function(req, res){
   // //console.log('restaurants data'+req);
   Restaurant.find({})
   .exec(function (err, data) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      } else res.status(200).json(data);
    })


};


exports.getRoomStats = function (req, res) {
  //console.log(req.payload._id);
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

exports.analyticsReport = async (req, res) => {
  return res.status(200).json({});
}

exports.noShowReport = async (req, res) => {
  let startDate = moment(req.body.startDate).startOf('day').valueOf();
  let endDate = moment(req.body.endDate).endOf('day').valueOf();
  let noShowBookings = await Bookings.find({checkIn: {$gte: startDate, $lte: endDate}, type: 'noshow'});

  return res.status(200).json(noShowBookings);
}

exports.occupancyAnalysis = async (req, res) => {
  const startDate = moment(req.body.startDate).startOf('day').valueOf() / 1000;
  const endDate = moment(req.body.endDate).endOf('day').valueOf() / 1000;

  const user = req.payload;

  const totalRoomCount = Rooms.count({userid: user._id, status: active,  hotelCode:user.hotelCode});

  const soldRoomCount = Bookings.count({checkIn: {$gte: startDate, $lte: endDate}, status: 'checkin'});

  const availableRoomCount = totalRoomCount - soldRoomCount;

  const soldRoomPercent = (soldRoomCount / availableRoomCount) * 100;

  // const roomRevenue = Bookings.aggregate([
  //   {
  //     $match: {
  //       checkIn: {
  //         $gte: startDate,
  //         $lte: endDate
  //       },
  //       status: 'checkin'
  //     }
  //   }, 
  //   {

  //   }
  // ])



}