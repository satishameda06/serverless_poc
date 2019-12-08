var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var EmployeeSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String
  },
  address: String,
  country: String,
  state: String,
  city: String,
  zipCode: String,
  phone: String,
  mobile: String,
  emergencyNo: String,
  dob: String,
  idType: String,
  idNo: String,
  bloodGroup: String,
  gender: {
    type: String,
 
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});
//hashing a password before saving it to the database
EmployeeSchema.pre('save', function (next) {
    var user = this;
    user.id = 'emp-' + shortid.generate();
    if(user.password){
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
    })
    }
    next();
});

var Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
