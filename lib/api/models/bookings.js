var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  
  userid: {
    type: String,
  },
  hotelCode: {
    type: Number
  },
  title: String,
  firstname: String,
  middlename: String,
  lastname: String,
  email: {
    type: String,
  },
  contact: {
    type: String
  },
  nationality: {
    type: String
  },
  idType: String,
  idNo: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dob: String,
  address : {
    street: String,
    country: String,
    state: String,
    city: String,
    zip: String
  }
},{strict:false});

var paymentInfo = new mongoose.Schema ({
  roomBasePrice: Number,
  roomTaxes: Number,
  addOns: Number,
  otherCharges: Number,
  otherTaxes: Number,
  discount: Number,
  otherDiscount: Number,
  noOfNights: Number,
  totalPayableAmt: Number,
  payedAmt: Number,
  balanceAmt: Number,
  cardInfo: {
    cardNo: String,
    cardType: String,
    expiryDate: Date,
    cvv: String 
  }
});

var CalendarInfoSchema = new mongoose.Schema ({
  dragCount: Number,
  baseElement: String,
  calendarMode: String
});

var ServiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  entityId: String,
  type: String,
  from: Number,
  counter : {
    type: String,
    default: 'Default Counter'
  },
  pospoint: {
    type: String,
    default: 'Frontdesk'
  },
  to: Number,
  remarks: String,
  arrival: {
    type: Number
  },
  departure: {
    type: Number
  },
  adults: {
    type: Number
  },
  children: {
    type: Number
  },
  bookDate: {
    type: Number,
  },
  rateType: {
    type: String,
  },
  rateValue: {
    type: Number
  },
  checkIn: Date,
  duration: Number,
  checkOut: Date,
  extraBed: Number,
  purpose: String,
  source: String,
  stayType: String,
  mktSegment: String,
  arrivalMode: String,
  arrivalNo: String,
  arrivalTime: String,
  assignTask: Boolean,
  sendEmail: Boolean,
  user: UserSchema,
  calendarInfo: CalendarInfoSchema,
  payment: paymentInfo
});

var bookingHistorySchema = new mongoose.Schema({
  bookingType: {
    type: String
  },
  userId: {
    type: String
  },
  hotelCode: {
    type: Number
  },
  entityId: {
    type: String
  },
  propertyId: {
    type: String,
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'cancelled']
  },
  roomType: {
    type: String,
  },
  roomName: {
    type: String,
  },
  tableNumber: {
    type: String,
    default: null
  },
  services: [
    ServiceSchema
  ]
},{strict:false});


mongoose.model('BookingHistory', bookingHistorySchema);
