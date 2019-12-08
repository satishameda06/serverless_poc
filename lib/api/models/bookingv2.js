var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var shortid = require('shortid');

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

var FolioSchema = new mongoose.Schema ({
  type: {
    type: String,
    // enum: ['room', 'amenities', 'restaurant', 'others', 'housekeeping', 'laundry']
  },
  basePrice: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  addOns: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  otherTaxes: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  otherDiscount: {
    type: Number,
    default: 0
  },
  totalPayableAmt: {
    type: Number,
    default: 0
  },
  payedAmt: {
    type: Number,
    default: 0
  },
  balanceAmt: {
    type: Number,
    default: 0
  },
  mode: String,
  paymentType: String,
  chequeNo: String,
  receiptNo: String,
  description: String,
  paymentMode: {
    type: String,
    enum: ['Cash', 'Visa', 'MasterCard', 'Others']
  },
  paymentMaker: {
    type: Schema.Types.ObjectId
  },
  paymentFrom: {
    type: String,
    enum: ['cashier', 'estaurant']
  }
})

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
  to: Number,
  remarks: String,
  counter : {
    type: String,
    default: 'Default Counter'
  },
  pospoint: {
    type: String,
    default: 'Frontdesk'
  },
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

var FolioSchema = new mongoose.Schema({
  id: {
    type: String
  },
  type: {
    type: String,
    enum: ['room', 'restaurant', 'others']
  },
  basePrice: Number,
  taxes: Number,
  otherTaxes: Number,
  addOns: Number,
  otherCharges: Number,
  discount: Number,
  otherDiscount: Number,
  totalPayableAmt: Number,
  payedAmt: Number,
  balanceAmt: Number,
  createdOn: Date,
  date: String,
  paymentMode: {
    type: String,
    enum: ['Cash', 'Visa', 'MasterCard', 'Others']
  },
  paymentMaker: {
    type: Schema.Types.ObjectId
  },
  paymentFrom: {
    type: String,
    enum: ['cashier', 'estaurant']
  }
});

var LifecycleSchema = new mongoose.Schema({
  msg: String,
  createdOn: Date
})

var bookingSchema = new mongoose.Schema({
    id: {
        type: String
    },
    userId: {
        type: String
    },
    hotelCode: {
      type: Number
    },
    bookingFor: {
        type: String,
        enum: ['room', 'table']
    },
    type: {
        type: String,
        enum: ['checkin', 'reserve', 'tempReserve']
    },
    bookingType: {
        type: String,
        enum: ['basic', 'detailed']
    },
    customer: {
        details: {
          type: Schema.Types.ObjectId,
          ref: 'Customers'
        },
        title: String,
        firstname: String,
        middlename: String,
        lastname: String,
        phone: String,
        email: String,
        gender: String,
        nationality: '',
        idType: '',
        idNo: String,
        dob: '',
        address: {
          street: String,
          country: String,
          state: String,
          city: String,
          zip: String
        },
        cardInfo: {
          cardNo: String,
          cardType: String,
          expiryDate: String,
          cvv: String
        }
    },
    calendarInfo: {
        count: Number,
        row: Number,
        col: Number,
        mode: String,
        startId: String
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    from: {
      type: Number
    },
    to: {
      type: Number
    },
    rateType : {
      type: Schema.Types.ObjectId,
      ref: 'Rate'
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'cancelled']
    },
    lifecycle: [
      LifecycleSchema
    ],
    folio: {
      items: [FolioSchema],
      totalPayableAmt: Number,
      payedAmt: Number,
      balanceAmt: Number,
    },
    duration: Number,
    remarks: String,
    arrival: Number,
    departure: Number,
    adults: Number,
    children: Number,
    bookDate: Number,
    checkIn: Number,
    checkOut: Number,
    extraBed: 0,
    purpose: '',
    source: '',
    stayType: '',
    mktSegment: '',
    arrivalMode: '',
    arrivalNo: String,
    arrivalTime: String,
    assignTask: false,
    sendEmail: false
},{strict:false});

bookingSchema.pre('update', function (next) {
    var booking = this;
    booking.id = this.bookingFor + '-' + shortid.generate();
    next();
});

mongoose.model('Bookings', bookingSchema);
