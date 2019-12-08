process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Hotel = mongoose.model('hotel');
var tokenSchema = mongoose.model('tokens');
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var moment = require('moment');
var crypto = require('crypto');
var async = require('async');

var Restaurant = mongoose.model('Restaurant');
const Bookings = mongoose.model('Bookings');
const Hotelcodes = mongoose.model('hotelcodes');
const cancelReasonDB=mongoose.model('reasonforcancellation'); 
var nightAuditUtil = require('../utils/nightAudit');

// var transporter = nodemailer.createTransport(ses({
//   accessKeyId: 'AKIAICNG6Q4FGYYTBZEQ',
//   secretAccessKey: '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'
// }));
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "satishameda06@gmail.com", // generated ethereal user
    pass: "8500152933"  // generated ethereal password
  }
});
//  const mailOptions = {
//   from: 'bonusPMS@', // sender address
//   to: ['joyisjoy71@gmail.com'], // list of receivers
//   subject: 'Bonus PMS Registration', // Subject line
//   html: ''// plain text body
// };

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.logout = function (req, res) {
  res.status(200).json('Logged out!');
}
function commented(){
// module.exports.register = function(req, res) {
//   //console.log("tokenDb");
//   if(!req.body.name || !req.body.email || !req.body.password) {
//     sendJSONresponse(res, 400, {
//       "msg": "All fields required"
//     });
//     return;
//   }

//   if(req.body.property) {
//     const buff = req.body.property;
//     req.body.property = {
//       name: buff,
//       businessDate: moment().startOf('day').valueOf() / 1000
//     };
//   }

//   //console.log('In register');
//   var user = new User(req.body);
//  const Hotelcode= async () => {
//     try {
//         return await Hotelcodes.findOneAndUpdate({_id: 'hotelCode'}, {$inc:{hotelSequenceCode:1}} ).exec();
//     } catch(err) {
//         return err;
//     }
// };
// async.waterfall([(callback)=>{
//   Hotelcode().then((num)=>{
//     const hotelCode=num.hotelSequenceCode;
//     callback(null,hotelCode)
//   })
// }],(err,hotelCode)=>{
//   user.user_type = 'admin';
//   user.hotelCode=hotelCode;
//   user.lastName = ''
//   user.setPassword(req.body.password);
//   user.save(function(err, data) {
//     var token;
//     token = user.generateJwt();
//     if(!err){
//        // Create a verification token for this user
//        var tokenDb = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

//        // Save the verification token
//        tokenDb.save(async function (err) {
//            if (err) { return res.status(500).send({ msg: err.message }); }
//            const updateTokenInUserDb=await User.update({email:user.email},{$set:{token:tokenDb.token}},{strict:false});
//            //console.log("updateTokenInUserDb",updateTokenInUserDb);
//            // Send the email
//           //  var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
//            var mailOptions = { from: 'joyisjoy71@gmail.com', to: user.email, subject: 'Account Verification Token', html: '<p>Hello,</br>\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/account/verify\/' +'?token='+ tokenDb.token +'&email='+ user.email +'\n </p>' };
//            transporter.sendMail(mailOptions, function (err,Emaildata) {

//                if (err) { return res.status(500).send({ msg: err.message }); }
//                else{

//                 let restaurant = new Restaurant({userId: data._id, name: req.body.name.split(/[\s,]+/)[0] + "'s Restaurant"});
//                 restaurant.save(function(err, restData) {
//                   if (err) //console.log(err);
//                   else //console.log('Restaurant created for user - ' + data._id);
//                 })
//                 res.status(200).json({
//                   "token" : token,
//                   "user" : user
//                 });

//                }
//               //  res.status(200).send('A verification email has been sent to ' + user.email + '.');
//               //console.log('A verification email has been sent to ' + user.email + '.');
//            });
//        });
//     //   mailOptions.to.push(user.email);
//     //   mailOptions.html = registerTemplate;
//     //   transporter.sendMail(mailOptions, function (err, info) {
//     //     if(err)
//     //       //console.log(err)
//     //     else
//     //       //console.log(info);
//     //  });

//   } else {
//     res.status(400).json({
//       "msg" : err.message
//     });
//   }
//   });
// })




// };
// module.exports.register = function (req, res) {
//   if (!req.body.name || !req.body.email || !req.body.password) {
//     sendJSONresponse(res, 400, {
//       "msg": "All fields required"
//     });
//     return;
//   }
//   const email = req.body.email,
//     created_by = req.body.name,
//     country = req.body.country,
//     state = req.body.state,
//     city = req.body.city;
//   if (req.body.property) {
//     const buff = req.body.property;
//     req.body.property = {
//       name: buff,
//       businessDate: moment().startOf('day').valueOf() / 1000
//     };
//   }
//   var user = new User(req.body);
//   const Hotelcode = async () => {
//     try {
//       return await Hotelcodes.findOneAndUpdate({ _id: 'hotelCode' }, { $inc: { hotelSequenceCode: 1 } }).exec();
//     } catch (err) {
//       return err;
//     }
//   };
//   async.waterfall([(callback) => {
//     Hotelcode().then((num) => {
//       const hotelCode = num.hotelSequenceCode;
//       //console.log("waterfall method is calling hotelCode", hotelCode);
//       callback(null, hotelCode)
//     })
//   }], async (err, hotelCode) => {
//     try {
//       user.user_type = 'admin';
//       user.hotelCode = hotelCode;
//       user.lastName = ''
//       user.setPassword(req.body.password);
//       const _id = hotelCode;
//       const hotelObj = { _id, email, created_by, country, state, city };
//       const hotelDb = new Hotel(hotelObj);
//       const saveUser = await user.save();
//       const tokenDb = new tokenSchema({ _userId: saveUser._id, hotelCode:hotelCode, token: crypto.randomBytes(16).toString('hex') });
//       const tokenSave = await tokenDb.save();
//       const mailOptions = {
//         from: 'joyisjoy71@gmail.com',
//         to: saveUser.email,
//         subject: 'Account Verification Token',
//         html: '<p>Hello,</br>\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/'
//           + req.headers.host + '\/api/account/verify\/' + '?token=' +
//           tokenSave.token + '&email=' + saveUser.email + '\n </p>'
//       };
//       let restaurant = new Restaurant({ userId: saveUser._id, 
//                                        hotelCode: hotelCode, 
//                                        name: req.body.name.split(/[\s,]+/)[0] + "'s Restaurant" });
//       let token = saveUser.generateJwt();//genarate jwt token with user details in schema
//       Promise.all[
//         hotelDb.save(),//save hotel here
//         User.update({ email: user.email }, { $set: { token: tokenSave.token } }, { strict: false }),//update verification token
//         transporter.sendMail(mailOptions), //sending email verification to the user
//         restaurant.save()];
//       res.status(200).json({
//         "token": token,
//         "user": user
//       });
//     } catch (e) {
//       //console.log("Satish", e);
//       res.json({ code: 1000, message: e.message })
//     }
//   })
// };

// module.exports.registersuperadmin = function (req, res) {


//   if (!req.body.name || !req.body.email || !req.body.password) {
//     sendJSONresponse(res, 400, {
//       "msg": "All fields required"
//     });
//     return;
//   }

//   if (req.body.property) {
//     const buff = req.body.property;
//     req.body.property = {
//       name: buff,
//       businessDate: moment().startOf('day').valueOf() / 1000
//     };
//   }

//   //console.log('In register');
//   var user = new User(req.body);


//   user.user_type = 'super-admin';
//   user.lastName = ''
//   user.setPassword(req.body.password);



//   user.save(function (err, data) {
//     var token;
//     token = user.generateJwt();
//     if (!err) {
//       //   mailOptions.to.push(user.email);
//       //   mailOptions.html = registerTemplate;
//       //   transporter.sendMail(mailOptions, function (err, info) {
//       //     if(err)
//       //       //console.log(err)
//       //     else
//       //       //console.log(info);
//       //  });
//       let restaurant = new Restaurant({ userId: data._id, name: req.body.name.split(/[\s,]+/)[0] + "'s Restaurant" });
//       restaurant.save(function (err, restData) {
//         if (err) 
//         console.log(err);
//         else 
//         console.log('Restaurant created for user - ' + data._id);
//       })
//       res.status(200).json({
//         "token": token,
//         "user": user
//       });

//     } else {
//       res.status(400).json({
//         "msg": err.message
//       });
//     }
//   });

// };
}


module.exports.login = function (req, res) {
passport.authenticate('local', function (err, user, info) {
     console.log("What is this",err,user);
    var token;

    if (info && info.message === "Password is wrong")
      return res.json({ code: 4002, msg: info.message })
    if (info && info.message === "User not found")
      return res.json({ code: 4003, msg: info.message })

    if (!user.isVerified) return res.json({ code: 4001, msg: 'Your account has not been verified.' });
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      //console.log(user);
      token = user.generateJwt();
      res.status(200);
      res.json({
        'user': user,
        'token': token
      });
    } else {
      // If user is not found
      //console.log("hiiiii");
      res.status(401).json(info);
    }
  })(req, res);
};


module.exports.adduser = function (req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.location = req.body.location;
  user.properties[0] = req.body.property;
  user.user_type = 'employee';
  user.designation = req.body.designation;
  user.a_userid = req.body.a_userid;
  user.setPassword(req.body.password);
  user.property = {}


  user.save(function (err) {
    var token;
    token = user.generateJwt();
    if (!err) {
      res.status(200);
      res.json({
        "token": token,
        "user_type": user.user_type
      });
    } else {
      res.status(400)
      res.json({
        "msg": 'User already exists'
      });
    }
  });

};


module.exports.userlist = function (req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
  //console.log("finding user...");
  User
    .find({ a_userid: req.payload._id })
    .exec(function (err, users) {
      res.status(200).json(users);
    });
};

exports.updateProperty = function (req, res) {
  User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body.userId) },
    { property: req.body },
    function (err, data) {
      if (err) {
        //console.log(err);
        res.status(500).json(err);
      }
      else res.status(200).json(data);
    });
}

exports.addCancellationReason = function (req, res) {
   console.log("addCancellationReason",req.body);
    User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.payload._id) },
    { $addToSet: { 'property.cancellationReasons': req.body } },
    function (err, data) {
      if (err) res.status(500).json(err);
      else res.status(200).json(data);
    }
  )
}

exports.getCancellationReasons = function (req, res) {

  // User.findById(req.payload._id, { 'property.cancellationReasons': 1 }, function (err, data) {
  //   if (err) res.status(500).json(err);
  //   else res.status(200).json(data);
  // })
  cancelReasonDB.find({userId:req.payload._id,hotelCode:req.payload.hotelCode},{cancellationTitle:1},function(err,data){
    if(err){
      res.status(500).json(err);
      return;
    }
    console.log("getCancellationReasons",data);
    res.status(200).json(data)
  })
}

exports.getUserInfo = function (req, res) {
  User.findById(req.payload._id, function (err, data) {
    if (err) res.status(500).json(err);
    else if (data.length == 0) res.status(400).json('Not found');
    else res.status(200).json(data);
  })
}

exports.nightAudit = function (req, res) {
  let bookings = null;
  nightAuditUtil.performNightAudit(req.payload._id)
  //console.log(bookings);
  res.json(bookings);
}

exports.proceedBusinessDate = function (req, res) {
  const nextDay = moment.unix(req.body.businessDate).add(1, 'days').valueOf() / 1000;
  User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.userId) }, { 'property.businessDate': nextDay }, function (err, data) {
    if (err) return res.status(500).json(err);
    else res.status(200).json(data);
  })
}

exports.checkIfEmailExists = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, data) {
    if (err) res.status(500).json(err);
    if (data === null) return res.status(200).json('Email not found!');
    else if (data.email) res.status(200).json(data);
  })
}

exports.changeUserPassword = function (req, res) {
  //console.log("###########", req.body);
  const founddata = req.body.user;
  if (founddata.resetPasswordToken && founddata.resetPasswordExpiresIn) {
    var moment = require('moment');
    var start_date = moment(new Date(founddata.resetPasswordExpiresIn), 'YYYY-MM-DD HH:mm:ss');
    var date = moment().format();
    var end_date = moment(date, 'YYYY-MM-DD HH:mm:ss');
    var duration = moment.duration(end_date.diff(start_date));
    var hours = duration.asHours();
    if (hours > 1) {
      return res.json({ code: 5001, message: "Password link has been expired" })
    }
    let user = new User();
    let hash = user.setPassword(req.body.password);
    //console.log(hash);
    delete user._id;
    delete user.permission;
    User.updateOne({ _id: mongoose.Types.ObjectId(req.body.user._id) }, { $set: { hash: user.hash, salt: user.salt } }, function (err, data) {
      if (err) {
        return res.status(500).json(err);


      } else {
        // var mailOptions = { from: 'joyisjoy71@gmail.com', to: req.body.email, subject: 'Link to reset password', html: '<p>Hello,</br>\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/account/verify\/' +'?token='+ tokenDb.token +'&email='+ user.email +'\n </p>' };
        // transporter.sendMail(mailOptions, function (err,data) {

        // })

        res.status(200).json({ code: 5004, message: "password changed successfully" });
      }
    })
  } else {
    res.json({ code: 5003, message: "Invalid details" })
  }

}

exports.guestLookup = function (req, res) {
  let aUserId = null;
  let query = {};
  let results = [];
  if (req.payload.user_type === 'admin') {
    aUserId = req.payload._id;
  } else {
    aUserId = req.payload.a_userid;
  }
  if (!aUserId) {
    return res.status(500).json('Unauthorized call');
  } else query.userId = mongoose.Types.ObjectId(aUserId);

  Bookings.find(query, function (err, docs) {
    if (err) return res.status(500).json(err);
    else return res.status(200).json(docs);
  })

}

var registerTemplate = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Simple Transactional Email</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */
      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%; }
      body {
        background-color: #f6f6f6;
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; }
      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%; }
        table td {
          font-family: sans-serif;
          font-size: 14px;
          vertical-align: top; }
      /* -------------------------------------
          BODY & CONTAINER
      ------------------------------------- */
      .body {
        background-color: #f6f6f6;
        width: 100%; }
      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
        display: block;
        Margin: 0 auto !important;
        /* makes it centered */
        max-width: 580px;
        padding: 10px;
        width: 580px; }
      /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
        box-sizing: border-box;
        display: block;
        Margin: 0 auto;
        max-width: 580px;
        padding: 10px; }
      /* -------------------------------------
          HEADER, FOOTER, MAIN
      ------------------------------------- */
      .main {
        background: #ffffff;
        border-radius: 3px;
        width: 100%; }
      .wrapper {
        box-sizing: border-box;
        padding: 20px; }
      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }
      .footer {
        clear: both;
        Margin-top: 10px;
        text-align: center;
        width: 100%; }
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center; }
      /* -------------------------------------
          TYPOGRAPHY
      ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        font-family: sans-serif;
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
        Margin-bottom: 30px; }
      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize; }
      p,
      ul,
      ol {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        Margin-bottom: 15px; }
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px; }
      a {
        color: #3498db;
        text-decoration: underline; }
      /* -------------------------------------
          BUTTONS
      ------------------------------------- */
      .btn {
        box-sizing: border-box;
        width: 100%; }
        .btn > tbody > tr > td {
          padding-bottom: 15px; }
        .btn table {
          width: auto; }
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center; }
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize; }
      .btn-primary table td {
        background-color: #3498db; }
      .btn-primary a {
        background-color: #3498db;
        border-color: #3498db;
        color: #ffffff; }
      /* -------------------------------------
          OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
      .last {
        margin-bottom: 0; }
      .first {
        margin-top: 0; }
      .align-center {
        text-align: center; }
      .align-right {
        text-align: right; }
      .align-left {
        text-align: left; }
      .clear {
        clear: both; }
      .mt0 {
        margin-top: 0; }
      .mb0 {
        margin-bottom: 0; }
      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0; }
      .powered-by a {
        text-decoration: none; }
      hr {
        border: 0;
        border-bottom: 1px solid #f6f6f6;
        Margin: 20px 0; }
      /* -------------------------------------
          RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table[class=body] h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important; }
        table[class=body] p,
        table[class=body] ul,
        table[class=body] ol,
        table[class=body] td,
        table[class=body] span,
        table[class=body] a {
          font-size: 16px !important; }
        table[class=body] .wrapper,
        table[class=body] .article {
          padding: 10px !important; }
        table[class=body] .content {
          padding: 0 !important; }
        table[class=body] .container {
          padding: 0 !important;
          width: 100% !important; }
        table[class=body] .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important; }
        table[class=body] .btn table {
          width: 100% !important; }
        table[class=body] .btn a {
          width: 100% !important; }
        table[class=body] .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important; }}
      /* -------------------------------------
          PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%; }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%; }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important; }
        .btn-primary table td:hover {
          background-color: #34495e !important; }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important; } }
    </style>
  </head>
  <body class="">
    <table border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
            <table class="main">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p>Hi there,</p>
                        <p>Hi, welcome to BonusPMS. Click on the link below to access your account</p>
                        <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                          <tbody>
                            <tr>
                              <td align="left">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tbody>
                                    <tr>
                                      <td> <a href="http://localhost:3000/login" target="_blank">Login</a> </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p></p>
                        <p></p>
                        <p>Good luck! Hope it works.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link"></span>
                    <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by">
                    .
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;