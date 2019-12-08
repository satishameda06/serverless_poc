process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var moment = require('moment');
const _ = require('lodash');
var generator = require('generate-password');

module.exports.login = (req, res) => {
  const inputBody = { ...req.body },
    email = inputBody.email,
    device_address = req.connection.remoteAddress;
  const objectInArray = (list, val) => {
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].device_address == val && list[i].isVerified) {
          return true;
        }
      }
    }
    return false;
  };
  const sendVerificationMail = (email) => {
    var OTP = generator.generate({
      length: 10,
      numbers: true
    });
    let mailOptions = {
      subject: 'Verify your pms account',
      html: 'Hello,<br><br>' + '<b>' + OTP +
        '</b> is your OTP for login. </br> Do not share it with anyone.<br><br>Best Regards, <br>PmsLogic Team.<br>www.pms.com'
    };
    emailSend.sendemail(email, mailOptions.subject, mailOptions.html); //sending email from here
    var deviceCondition = {};
    deviceCondition.email = email;
    deviceCondition["device_addresses.device_address"] = device_address;
    User.update(deviceCondition, { $set: { "device_addresses.$.OTP": OTP, "device_addresses.$.OTPExpire": new Date() } }, (err, status) => {
      if (err) {
        return res.status(400).json({ code: 1104, message: err.message });
      } else {
        return res.status(200).send({ code: 1102, message: 'OTP has been sent to ' + email + '.' });
      }
    });
  };
  passport.authenticate('local', async function (err, user, info) {
    console.log("What is this",err,user,info);
    var token;
    if (info && info.message === "Password is wrong")
      return res.json({ code: 4002, msg: info.message });
    if (info && info.message === "User not found")
      return res.json({ code: 4003, msg: info.message });
    if (!user.isVerified)
      return res.json({ code: 4001, msg: 'Your account has not been verified.' });
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found
    if (user) {
      var device_addresses = user.device_addresses;
      const deviceData = await User.findOne({ email: email, "device_addresses.device_address": device_address }, { "device_addresses": { $elemMatch: { device_address: device_address } } });
      console.log("deviceData", deviceData);
      if (deviceData !== null && deviceData.device_addresses && deviceData.device_addresses.length > 0) {
        console.log("coming");
        const dbDeviceAdd = deviceData.device_addresses[0].isVerified;
        if (dbDeviceAdd) {
          token = user.generateJwt();
          res.status(200).json({ code: 1105, 'user': user, 'token': token });
          return;
        }
      }
      if (objectInArray(device_addresses, device_address)) {
        sendVerificationMail(user.email);
      } else {
        var value = { "device_address": device_address, "isVerified": false, OTP: 0, OTPExpire: "" };
        User.update({ email: email }, { $addToSet: { device_addresses: value } }, (err2, status) => {
          if (err) {
            res.status(400).json({ code: 1104, message: err.message });
            return;
          } else {
            sendVerificationMail(user.email);
          }
        });
      }
    } else {
      res.status(401).json(info);
    }
  })(req, res);
}
module.exports.otpConfirmation = (req, res) => {
   const email = req.body.email,
    OTP = req.body.OTP,
    device_address = req.connection.remoteAddress;
  const condition = { email: email };
  function getOTPExpire(device_addresses, device_address) {
    console.log("getOTPExpire");
    for (var i = 0; i < device_addresses.length; i++) {
      if (device_addresses[i].device_address == device_address) {
        return device_addresses[i].OTPExpire;
      }
    }
  }
  console.log("what conditionis coming here", condition);
  User.findOne(condition, {
    email: 1,
    isVerified: 1,
    password: 1,
    device_addresses: 1,
    OTP: 1,
    OTPExpire: 1
  }, (err, user) => {
    
    if (user) {
      var isVerified = user.isVerified;
      if (device_address !== null) {

        var deviceCondition = condition;
        console.log("deviceCondition", deviceCondition)
        deviceCondition["device_addresses.device_address"] = device_address;
        deviceCondition["device_addresses.OTP"] = OTP;
        console.log("deviceCondition", deviceCondition);
        User.findOne(deviceCondition, {

        }, (err, userDetails) => {
          if (err) {
            res.status(400).json({ code: 1304, message: err.message });
            return;
          } else {
            if (userDetails) {

              var device_addresses = userDetails.device_addresses;
              console.log("######device_address#########", device_addresses, device_address);
              var OTPExpire = getOTPExpire(device_addresses, device_address);
              console.log("OTPExpire", OTPExpire);
              if (OTPExpire) {
                var start_date = moment(OTPExpire, 'YYYY-MM-DD HH:mm:ss'),
                  date = moment().format(),
                  end_date = moment(date, 'YYYY-MM-DD HH:mm:ss'),
                  duration = moment.duration(end_date.diff(start_date)),
                  minutes = duration.asMinutes();
                if (minutes < 5) {
                  User.update(deviceCondition, {
                    $set: {
                      "device_addresses.$.isVerified": true,
                      // "device_addresses.$.OTP": 0
                    }
                  }, (err, details) => {
                    if (err) {
                      res.status(400).json({ code: 1304, message: err.message });
                      return;
                    } else {
                      const token = userDetails.generateJwt();
                      res.status(200);
                      res.json({
                        'user': userDetails,
                        'token': token
                      });
                    }
                  });
                } else {
                  res.status(403).json({ code: 1302, message: "OTP expired" });
                }
              }
            } else {
              console.log("@@@@@Satisg@@@@", userDetails);
              res.status(403).json({ code: 1303, message: "Device unauthorized/Wrong OTP" });
              return;
            }
          }
        });
      }
    } else {
      console.log("else condition is coming");
    }
  })


}