

routes.post('/', (req, res) => {
        const id = req.body.email,
        OTP = parseInt(req.body.OTP);
      
 const sendInfoMail = (email, client_id) => {
      
      

        

    function getOTPExpire(device_addresses, device_address) {
        console.log("getOTPExpire");
        for (var i = 0; i < device_addresses.length; i++) {
            if (device_addresses[i].device_address == device_address) {
                return device_addresses[i].OTPExpire;
            }
        }
    }

    
    const createUser = (client_id, email, password_encrypted, dob, register_device_address, nickname, referring_code, country, currency_code) => {
    
        var time = new Date();
        var password_decrypted = privatePem.decrypt(password_encrypted, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING).toString();
        const salt = uuid();
        const hash = hashPassword(client_id, password_decrypted, salt);
        async.waterfall([
           (callback) => {
                db.User.create({
                    client_id,
                    email,
                    nickname,
                    password: hash,
                    dateOfBirth: dob,
                    salt,
                    created: time,
                    updated: time,
                    walletAddBtc,
                    register_device_address,
                    referral_code,
                    country,
                    currency_code,
                    referred_by,
                    isVerified: true
                }, (err, data) => {
                   
                   
                });
            },
          
        ], (err) => {
            if (err) {
                return res.status(400).json({code: 1304, message: err.message});
            }
            sendInfoMail(email, client_id);
            db.Temp_user.remove({email: email}, (err, status) => {
                console.log("db.Temp_user.remove",err, status);
            });

        });
    };
    db.User.findOne(condition, {
        client_id: 1,
        email: 1,
        isVerified: 1,
        password: 1,
        device_addresses: 1,
        OTP: 1,
        OTPExpire: 1
    }, (err, userDetails) => {
        if (err) {
            res.status(400).json({code: 1304, message: err.message});
            return;
        } else {
            console.log("@@@@@@@@@@@userDetails@@@@@@@@@@@@@@@@@@@@",userDetails);
            if (userDetails) {
                var isVerified = userDetails.isVerified;
                if (!nullChecker(device_address)) {
                    var deviceCondition = condition;
                    deviceCondition["device_addresses.device_address"] = device_address;
                    deviceCondition["device_addresses.OTP"] = OTP;
                    console.log("deviceCondition",deviceCondition);
                    db.User.findOne(deviceCondition, {
                        client_id: 1,
                        email: 1,
                        isVerified: 1,
                        password: 1,
                        device_addresses: 1,
                        nickname: 1,
                        referral_code: 1,
                        currency_code: 1,
                        country: 1,
                        loyalty_points:1
                    }, (err, userDetails) => {
                        if (err) {
                            res.status(400).json({code: 1304, message: err.message});
                            return;
                        } else {
                            if (userDetails) {
                                var device_addresses = userDetails.device_addresses;
                                console.log("######device_address#########",device_addresses, device_address);
                                var OTPExpire = getOTPExpire(device_addresses, device_address);
                                console.log("OTPExpire",OTPExpire);
                                if (OTPExpire) {
                                    var start_date = moment(OTPExpire, 'YYYY-MM-DD HH:mm:ss'),
                                        date = moment().format(),
                                        end_date = moment(date, 'YYYY-MM-DD HH:mm:ss'),
                                        duration = moment.duration(end_date.diff(start_date)),
                                        minutes = duration.asMinutes();
                                    if (minutes < 5) {
                                        db.User.update(deviceCondition, {
                                            $set: {
                                                "device_addresses.$.isVerified": true,
                                                "device_addresses.$.OTP": 0
                                            }
                                        }, (err, details) => {
                                            if (err) {
                                                res.status(400).json({code: 1304, message: err.message});
                                                return;
                                            } else {
                                                var tokenExpireTime = '1000h';
                                                if (device_type != "web") {
                                                    tokenExpireTime = '72000h';
                                                }
                                                var token = jwt.sign({
                                                    email: userDetails.email,
                                                    client_id: userDetails.client_id,
                                                    device_address: device_address,
                                                    user_name: userDetails.user_name,
                                                    nickname: userDetails.nickname,
                                                    referral_code: userDetails.referral_code,
                                                    currency_code: userDetails.currency_code,
                                                    country: userDetails.country
                                                }, key, {expiresIn: tokenExpireTime});
                                                userDetails.password = undefined;
                                                userDetails.device_addresses = undefined;
                                                res.setHeader('token', token);
                                                console.log(`@@@@@@@@@@@USer details@@@@@@@@@@@@,${userDetails}`);
                                                res.status(200).json({
                                                    code: 1301,
                                                    message: "User logged in successfully",
                                                    data: {userDetails: userDetails}
                                                });
                                            }
                                        });
                                    } else {
                                        res.status(200).json({code: 1302, message: "OTP expired"});
                                    }
                                }
                            } else {
                                console.log("@@@@@Satisg@@@@",userDetails);
                                res.status(403).json({code: 1303, message: "Device unauthorized/Wrong OTP"});
                                return;
                            }
                        }
                    });
                }
            } else {
                db.Temp_user.findOne(condition, (err, tempUserDetails) => {
                    if (err) {
                    } else {
                        if (tempUserDetails) {
                            var email = tempUserDetails.email,
                                password_encrypted = tempUserDetails.password,
                                client_id = tempUserDetails.client_id,
                                register_device_address = tempUserDetails.device_address,
                                dateOfBirth = tempUserDetails.dateOfBirth,
                                nickname = tempUserDetails.nickname,
                                country = tempUserDetails.country,
                                currency_code = tempUserDetails.currency_code,
                                referring_code = tempUserDetails.referring_code;
                            if (OTP == tempUserDetails.OTP) {
                                var start_date = moment(tempUserDetails.OTPExpire, 'YYYY-MM-DD HH:mm:ss'),
                                    date = moment().format(),
                                    end_date = moment(date, 'YYYY-MM-DD HH:mm:ss'),
                                    duration = moment.duration(end_date.diff(start_date)),
                                    minutes = duration.asMinutes();
                                if (minutes < 5) {
                                    createUser(client_id, email, password_encrypted, dateOfBirth, register_device_address, nickname, referring_code, country, currency_code);
                                } else {
                                    res.status(200).json({code: 1302, message: "OTP expired"});
                                }
                            } else {
                                res.status(403).json({code: 1305, message: "Invalid OTP"});
                            }
                        } else {
                            res.status(403).json({code: 1303, message: "User unauthorized"});
                        }
                    }
                });
            }
        }
    });
});

module.exports = routes;