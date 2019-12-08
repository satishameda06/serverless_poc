const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hotelSchema=Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please enter a valid email']
      },
    created_by:String, //name of creater
   _id:{
       type:Number,
       unique:true
   },
   country:{
       type:String
   },
   state:{
    type:String
   },
   city:{
    type:String
   },
   users: [{ type: Number, ref: 'users' }],
   createdAt:{type:Date,default: Date.now},
   updatedAt:{type:Date}
},{strict:false});
hotelSchema.path('email').validate(function (value, respond) {
    return mongoose.model('hotel').countDocuments({ email: value }).exec().then(function (count) {
        return !count;
      })
      .catch(function (err) {
        throw err;
      });
    }, 'Email already exists.');
mongoose.model('hotel', hotelSchema);