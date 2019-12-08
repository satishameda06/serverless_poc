var mongoose = require('mongoose');
var Bookings = mongoose.model('Bookings');

exports.performNightAudit = async function (userId) {
    let allBookings = [];
    await Bookings.find({userId: userId}, function(err, bookings) {
        if (err) {
            return err;
        } else {
            allBookings = bookings;
        }
    });
    
    return allBookings;
}