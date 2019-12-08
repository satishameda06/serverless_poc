const mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hotel = mongoose.model('hotel'),
  tokenSchema = mongoose.model('tokens'),
  nodemailer = require('nodemailer'),
  moment = require('moment'),
  crypto = require('crypto'),
  async = require('async'),
  Restaurant = mongoose.model('Restaurant'),
  Hotelcodes = mongoose.model('hotelcodes');
  RestBookingSetting = mongoose.model('rest_booking_setting');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "satishameda06@gmail.com", // generated ethereal user
    pass: "8500152933"  // generated ethereal password
  }
});

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function (req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "msg": "All fields required"
    });
    return;
  }
  const email = req.body.email,
    created_by = req.body.name,
    country = req.body.country,
    state = req.body.state,
    city = req.body.city;
  if (req.body.property) {
    const buff = req.body.property;
    req.body.property = {
      name: buff,
      businessDate: moment().startOf('day').valueOf() / 1000
    };
  }
  var user = new User(req.body);
  const Hotelcode = async () => {
    try {
      return await Hotelcodes.findOneAndUpdate({ _id: 'hotelCode' }, { $inc: { hotelSequenceCode: 1 } }).exec();
    } catch (err) {
      return err;
    }
  };
  async.waterfall([(callback) => {
    Hotelcode().then((num) => {
      const hotelCode = num.hotelSequenceCode;
      //console.log("waterfall method is calling hotelCode", hotelCode);
      callback(null, hotelCode)
    })
  }], async (err, hotelCode) => {
    try {
      user.user_type = 'admin';
      user.hotelCode = hotelCode;
      user.lastName = ''
      user.setPassword(req.body.password);
      const _id = hotelCode;
      const hotelObj = { _id, email, created_by, country, state, city };
      const hotelDb = new Hotel(hotelObj);
      const saveUser = await user.save();
      const tokenDb = new tokenSchema({ _userId: saveUser._id, hotelCode: hotelCode, token: crypto.randomBytes(16).toString('hex') });
      const tokenSave = await tokenDb.save();
      const mailOptions = {
        from: 'satishameda06@gmail.com',
        to: saveUser.email,
        subject: 'Account Verification Token',
        html: '<p>Hello,</br>\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/'
          + req.headers.host + '\/api/account/verify\/' + '?token=' +
          tokenSave.token + '&email=' + saveUser.email + '\n </p>'
      };
      let restaurant = new Restaurant({
        userId: saveUser._id,
        hotelCode: hotelCode,
        name: req.body.name.split(/[\s,]+/)[0] + "'s Restaurant"
      });
      console.log("restaurant",restaurant);
      let bookingSetting= new RestBookingSetting({
        hotelCode: hotelCode,
        restuarent_name:restaurant.name,
        restuarentId:restaurant._id,
        createdAt: new Date()
      })
      let token = saveUser.generateJwt();//genarate jwt token with user details in schema
      User.update({ email: user.email }, { $set: { token: tokenSave.token } }, { strict: false },function(err,update){
        console.log("token update",err,update);
      }),
      Promise.all[
        hotelDb.save(),//save hotel here
       //update verification token
        transporter.sendMail(mailOptions), //sending email verification to the user
        restaurant.save(),
        bookingSetting.save()];//save booking settings here..
      res.status(200).json({
        "token": token,
        "user": user
      });
    } catch (e) {
      console.log("Satish", e);
      res.json({ code: 1000, message: e.message })
    }
  })
};

module.exports.registersuperadmin = function (req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "msg": "All fields required"
    });
    return;
  }
  if (req.body.property) {
    const buff = req.body.property;
    req.body.property = {
      name: buff,
      businessDate: moment().startOf('day').valueOf() / 1000
    };
  }
  var user = new User(req.body);
  user.user_type = 'super-admin';
  user.lastName = ''
  user.setPassword(req.body.password);
  user.save(function (err, data) {
    var token;
    token = user.generateJwt();
    if (!err) {
      let restaurant = new Restaurant({ userId: data._id, name: req.body.name.split(/[\s,]+/)[0] + "'s Restaurant" });
      restaurant.save(function (err, restData) {
        if (err)
          console.log(err);
        else
          console.log('Restaurant created for user - ' + data._id);
      })
      res.status(200).json({
        "token": token,
        "user": user
      });

    } else {
      res.status(400).json({
        "msg": err.message
      });
    }
  });

};
