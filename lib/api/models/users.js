var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;
var moment = require('moment');

var propertySchema = new mongoose.Schema({
  businessDate: {
    type: Number
  },
  propertyPhotos: {
    type: [String]
  },
  hotelLogo: {
    type: String
  },
  name: {
    type: String
  },
  address: {
    country: {
      type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    zipCode: {
        type: String
    }
  
  },
  phone: {
    type: String
  },
  fax: {
    type: String
  },
  webAddress: {
    type: String
  },
  email: {
    type: String
  },
  description: {
    type: String
  },
  floorCount: {
    type: Number
  },
  blockCount: {
    type: Number
  },
  systemInfo: {
    frontdesk: {
        colors: {
            checkin: String, 
            reserve: String, 
            tempReserve: String,
            checkout: String,
            noshow: String
        }
    },
   
    housekeeping: {
        colors: {
            dirty: String, 
            clean: String, 
            repair: String, 
            inspect: String, 
            touchUp: String, 
            outOfOrder: String
        }
    }
  },
  cancellationReasons: {
    type: [{
      reason: String,
      description: String
    }]
  }
})


var userSchema = new mongoose.Schema({
  empID: {
    type: String
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  profileImg: String,
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  phone: {
    type: String,
  },
  mobile: {
    type: String
  },
  emergencyNo: {
    type: String,
  },
  role: {
    type: String
    // required: true,
    // enum: ['Manager', 'Cashier']
  },
  permission: [String],
  gender: {    
    type: String
    // required: true
    // enum: ['Male', 'Female']
  },
  dob: {
    type: String,
  },
  IDtype: {
    type: String,
  },
  IDNumber: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  loginEmp: {
    type: Boolean
  },
  department: {
    type: String
    // required: true,
    // enum: ['Account', 'Billing', 'Housekeeping', 'Maintenance', 'Frontdesk', 'Restaurant']
  },
  restaurants: [
    {
      type: Schema.Types.ObjectId
    }
  ],
  counters: {
    type: [String],
  },
  isVerified: { type: Boolean, default: false },
  // hotelCode:Number,
  hotelCode: { type: Number, ref: 'hotel' },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email']
  },
  posPin: {
    type: String
  },
  joiningDate: {
    type: Date
  },
  shift: {
    from: {
      type: String
    },
    to: {
      type: String
    }
  },
  permittedIP: {
    type: [String]
  },
  comments: {
    type: String
  },
  restrictReserve: {
    type: Boolean
  },
  receiveNAreport: {
    type: Boolean
  },
  restrictNAreport: {
    type: Boolean
  },
  restrictDowntimeEmail: {
    type: Boolean
  },
  reservationPermission: {
    type: String
    // enum: ['Partial Mode', 'View Mode']
    // required: true,
  },
  frontdeskReadOnly: {
    type: Boolean
  },
  a_userid: {
    type: Schema.Types.ObjectId,
    default: null
  }, 
  hotelCreatedBy:{
    type:Number,
    default:null
  },
  designation: {
    type: String
  },
  user_type: {
    type: String,
    // enum: ['admin', 'employee']
    required: true,
  },
  property: {
    type: propertySchema,
  },
  rates: {
    type: [String],
  },
  subscription:{
       startTime: Date,
       endTime: Date,
       access:[]
  },
  resetPasswordToken:String,
  resetPasswordExpiresIn:Date,
  hash: String,
  salt: String,
  defaultView:String,

  token:String,
  firstTimeLogin:{
    type: Boolean,
    default: false
  },
  device_addresses:[],
  permissions: {
    frontdesk: {
      type: Boolean,
      default: false
    },
    houseKeeping: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: Boolean,
      default: false
    },
    nightAudit: {
      type: Boolean,
      default: false
    },
    adminConsole: {
      type: Boolean,
      default: false
    },
    reports: {
      type: Boolean,
      default: false
    }
  }

}, { usePushEach: true },{strict:false});

userSchema.path('email').validate(function (value, respond) {
  return mongoose.model('User').countDocuments({ email: value }).exec().then(function (count) {
      return !count;
    })
    .catch(function (err) {
      throw err;
    });
  }, 'Email already exists.');


userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return(this.hash, this.salt);
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {

  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  if (!this.property) {
    this.property = {};
    this.property.businessDate = moment().startOf('day').valueOf();
  }
  return jwt.sign({
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    name: this.name,
    user_type: this.user_type,
    a_userid: this.a_userid,
    hotelCode:this.hotelCode,
    isVerified:this.isVerified,
    businessDate: this.property.businessDate,
    defaultView:this.defaultView,
    firstTimeLogin:this.firstTimeLogin,
    device_addresses:this.device_addresses,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);


