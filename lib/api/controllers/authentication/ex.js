'use strict';
var requirePackage = require('../../configurations/import');
var db = require('../../db').db;
var nullChecker = require('../nullChecker');
const hashPassword = require('../userManagement/func/hashPassword');
const fs = requirePackage.packages.fs;
var handlebars = requirePackage.packages.handlebars;
const routes = requirePackage.packages.express.Router();
const jwt = requirePackage.packages.jwt;
const key = requirePackage.packages.key;
const nodemailer = requirePackage.packages.nodemailer;
const ursa = requirePackage.packages.ursa;
const authenticator = requirePackage.packages.authenticator;
var handlebars = requirePackage.packages.handlebars;
var moment = requirePackage.packages.moment;
var serverUrl = require('../../configurations/config').serverUrl;
var privatePem = ursa.createPrivateKey(fs.readFileSync(__dirname + '/../../bin/my-server.key.pem'));

routes.post('/', (req, res) => {
    ////console.log(req.body);
    const id = req.body.id;
    const password_encrypted = req.body.password;
    const device_address_encrypted = req.body.device_address;
    const device_type = req.body.device_type;

    // ////console.log("LOGIN:", id, password_encrypted, device_address_encrypted, device_type);
    if (nullChecker(id) || nullChecker(password_encrypted) || nullChecker(device_address_encrypted)) {
        return res.status(422).json({ code: 1104, message: "Invalid input" });
    }

    if (device_type != 'android' && device_type != 'ios' && device_type != 'web') {
        return res.status(422).json({ code: 1104, message: "Invalid device" });
    }

    var condition = { "email": id };

    if (!isNaN(id)) {
        condition = { "client_id": id };
    }

    const getRandomOTP = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    };

    // ////console.log(email);

    const sendVerificationMail = (email) => {
        var username = "btcmonk";
        var password = "btcmonk@123";

        var OTP = getRandomOTP(100000, 999999);

        let transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: username,
                pass: password
            }
        });
  
     
        
         

            let mailOptions = {
                from: 'StakePlayer<noreply@stakeplayer.com>',
                to: email,
                subject: 'Verify your Stakeplayer account',
               html: 'Hello,<br><br>' + '<b>' + OTP + '</b> is your OTP for login. </br> Do not share it with anyone.<br><br>Best Regards, <br>BTCMonk Team.<br>www.btcmonk.com',
            };

            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    // return res.status(400).json({ code: 1104, message: err.message });
                }
            });
            var deviceCondition = {};
            deviceCondition.email = email;
            deviceCondition["device_addresses.device_address"] = device_address;
            db.User.update(deviceCondition, { $set: { "device_addresses.$.OTP": OTP, "device_addresses.$.OTPExpire": new Date() } }, (err, status) => {
                if (err) {
                    return res.status(400).json({ code: 1104, message: err.message });
                } else {
                    res.status(200).send({ code: 1102, message: 'OTP has been sent to ' + email + '.' });
                }
            });
   
    };

    const objectInArray = (list, val) => {

        ////console.log("in list",list);

        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].device_address == val) {
                    return true;
                }
            }
        }
        return false;
    };

    const isDeviceVerified = (list, val) => {
        for (var i = 0; i < list.length; i++) {
            if (list[i].device_address == val) {
                return list[i].isVerified;
            }
        }
        return false;
    };

    var password = password_encrypted;
    var device_address = device_address_encrypted;

    if (device_type != 'web') {
        password = privatePem.decrypt(password_encrypted, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING).toString();
        device_address = privatePem.decrypt(device_address_encrypted, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING).toString();
    }
    db.User.findOne(condition, { client_id: 1, email: 1, isVerified: 1, password: 1, salt: 1, suspended: 1,device_addresses:1 }, (err, userDetails) => {
        if (err) {
            res.status(400).json({ code: 1104, message: err.message });
            return;
        } else {
            var errorMessage = "Invalid CI no./Email/Password";
            if (userDetails) {
                const client_id = userDetails.client_id;
                const suspended = userDetails.suspended;
                if (suspended == 1) {
                    return res.status(200).json({ code: 1103, message: 'User has been blocked. Contact Support' });
                }
                const storedHash = userDetails.password;
                const salt = userDetails.salt;
                //console.log("@@@@@storedHash,salt,password@@@@",storedHash,salt,password);
                const hash = hashPassword(client_id, password, salt);
                ////console.log("@@@@@Hash@@@@",hash);
                var passwordStatus = (storedHash == hash);

                //console.log(passwordStatus);
                if (passwordStatus) {
                    var tokenExpireTime = '10h';
                    if (device_type != "web") {
                        tokenExpireTime = '720h';
                    }
                    var token = jwt.sign({ email: userDetails.email, client_id: userDetails.client_id, device_address: device_address }, key, { expiresIn: tokenExpireTime });
                    var device_addresses = userDetails.device_addresses;
                    if (objectInArray(device_addresses, device_address)) {
                        ////console.log("MAC present");
                        // if (isDeviceVerified(device_addresses, device_address)) {
                        //     userDetails.password = undefined;
                        //     userDetails.device_addresses = undefined;
                        //     // res.setHeader('token', token);
                        //     // res.status(200).json({ code: 1101, message: "User logged in successfully", data: { userDetails: userDetails } });
                        // } else
                        // if ((userDetails.googleAuthenticator.status === true) && (device_type != 'web')) {
                        //     res.status(200).json({ code: 1106, message: "please verification google authenticator", data: { userDetails: userDetails } });
                        // } else {
                        sendVerificationMail(userDetails.email);
                        // }
                    } else {
                        ////console.log("MAC not present");
                        var value = { "device_address": device_address, "device_type": device_type, "isVerified": false, OTP: 0, OTPExpire: "" };
                        db.User.update(condition, { $addToSet: { device_addresses: value } }, (err2, status) => {
                            if (err) {
                                res.status(400).json({ code: 1104, message: err.message });
                                return;
                            } else {
                                sendVerificationMail(userDetails.email);
                            }
                        });
                    }
                } else {
                    return res.status(200).json({ code: 1103, message: errorMessage });
                }
            }
            else {
                return res.status(200).json({ code: 1105, message: errorMessage });
            }
        }
    });
});


module.exports = routes;