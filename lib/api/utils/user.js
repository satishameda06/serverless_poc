var mongoose = require('mongoose');
var Bookings = mongoose.model('Bookings');

exports.getAllBookingsforUser = function (userId) {
    Bookings.find({userId: mongoose.Types.ObjectId(userId)}, function(err, docs) {
        
    })
}