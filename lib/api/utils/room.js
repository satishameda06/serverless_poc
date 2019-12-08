const mongoose = require('mongoose');
const moment = require('moment');

const Rooms = mongoose.model('Room');
const RoomBookings = mongoose.model('Bookings');

exports.checkRoomAvailability = async(roomId, checkIn, checkOut) => {
 
    const bookingQuery = {
        room: roomId,
        $or: [{
            checkIn: {
                $gte: moment(checkIn*1000).startOf('day').valueOf()/1000,
                $lte: moment(checkOut*1000).startOf('day').valueOf()/1000
            }
        }, {
            checkOut: {
                $gte: moment(checkIn * 1000).startOf('day').valueOf() / 1000,
                $lte: moment(checkOut * 1000).startOf('day').valueOf() / 1000
            }
        }]
    }

    let bookingStatus = null;
    bookingStatus = await RoomBookings.findOne(bookingQuery).lean();

    let roomStatus = null;
    if (bookingStatus) {
       
        bookingStatus = bookingStatus.type;
        roomStatus = await Rooms.findById(roomId).lean();
        if (roomStatus) roomStatus = roomStatus.housekeepingStatus;
    }

    return {roomStatus: roomStatus, bookingStatus: bookingStatus};
}
