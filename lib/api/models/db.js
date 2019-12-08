var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI =
    'mongodb://pmslogicUser:pmslogicDbPassword45667@ec2-35-178-80-207.eu-west-2.compute.amazonaws.com:27017/pmslogic';
// var dbURI = 'mongodb://bonusAdmin:bonusPassword123@ds263619.mlab.com:63619/bonus-pms'
// if (process.env.NODE_ENV === 'production') {
//   dbURI = process.env.MON

// }

mongoose.connect(dbURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
});
mongoose.set('debug', false);
// Test code
/*
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("hotels", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});*/
// Test code


// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./users');

require('./bookings');

require('./payments');
require('./customers');
require('./properties');;
require('./rates');

require('./restaurant');
require('./employees');
require('./tables');
require('./restaurantOrders');
require('./menuitems');
require('./menucategories');
require('./bookingv2');
require('./address');
//user management
require('./adminConsole/userManager/usertype');
require('./adminConsole/userManager/accesslevel');
require('./adminConsole/userManager/activitylog');
//rooms management
require('./adminConsole/roomsManager/floors');
require('./adminConsole/roomsManager/blocks');
require('./adminConsole/roomsManager/roomTaxList');
require('./adminConsole/roomsManager/room-categories');
require('./adminConsole/roomsManager/amenities');
require('./adminConsole/roomsManager/rooms');
require('./adminConsole/roomsManager/accountCode');

require('./productcategory');
require('./product');
require('./paymenttypes');
//Satish Ameda
require('./tokenSchema');
require('./hotelcodes');
require('./orderidkeys');
require('./productcodes');
//Company Info
require('./adminConsole/companyInfo/companyprofile');
require('./adminConsole/userManager/department');
//poc
require('./adminConsole/hotel');
//general dbs
require('./adminConsole/general/currencies');
require('./adminConsole/general/languages');
require('./adminConsole/general/reasonForCancellation');
require('./adminConsole/general/reasonTaxExempt');
require('./adminConsole/general/announcement');
require('./adminConsole/general/paymode');
require('./adminConsole/general/paytype');
require('./adminConsole/general/defaultSettings');
require('./adminConsole/general/invoiceNumberSettings');
require('./adminConsole/general/identificationtype');
require('./adminConsole/general/sourcebusinesses');
require('./adminConsole/general/modeofarrival');
require('./adminConsole/general/emailConfig');
require('./adminConsole/general/marketSegment');

require('./temp_rates');
require('./room_rates');
require('./adminConsole/roomsManager/room_inventory');

require('./restaurantReservation/restaurant_events');
require('./restaurantReservation/restaurant_groups');
require('./restaurantReservation/restaurant_resources');
require('./restaurantReservation/gen_hours_opening');
require('./restaurantReservation/example');
require('./restaurantReservation/booking_settings');
require('./subscriptions');
require('./ordertransactions');