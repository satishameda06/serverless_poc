const mongoose = require('mongoose'),
 User = mongoose.model('User'),
 nodemailer = require('nodemailer'),
 crypto = require('crypto');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "satishameda06@gmail.com", // generated ethereal user
      pass: "8500152933"  // generated ethereal password
    }
  });

exports.forgotpassword =async function (req, res, next) {
  try{
    const emailID = req.body.email;
    const hotelCode = req.body.hotelcode;
     if (!emailID && !hotelCode) {
      return res.json({ code: 6001, message: 'all fields required' });
    }
    const foundUser = await User.findOne({ email: emailID,hotelCode:hotelCode});
    if (foundUser && foundUser !== null) {
      const token = crypto.randomBytes(20).toString('hex');
      const mailOptions = {
        from: 'joyisjoy71@gmail.com',
        to: emailID,
        subject: 'Link to reset password',
        html: `<p>To initiate the password reset process for your Hotelogix account ${emailID} 
                              click on the link below:</p> <br> <p><a href="http://localhost:4200/changepassword?token=${token}&email=${emailID}">http://localhost:4200/changepassword?token=${token}&email=${emailID}</a></p>`
      }
      Promise.all[User.updateOne({ email: emailID },
        {
          $set:
          {
            resetPasswordToken: token,
            resetPasswordExpiresIn: Date.now() + 36000
          }
        }),
        transporter.sendMail(mailOptions)];
        return res.json({ code: 6004, message: "recovery email sent.." })
    } else {
      return res.json({ code: 6003, message: "user details are not found" });
    }
    
  }catch(error){
    console.log("error is coming forgotpassword",error);
    return res.json({ code: 6003, message: "something went wrong" })
  }
 
  // User.findOne({ email: emailID,hotelCode:hotelCode}, (err, data) => {
  //   if (err) {
  //     return res.json({ code: 6002, message: "something went wrong" })
  //   }
  //   if (data && data !== null) {
  //     const token = crypto.randomBytes(20).toString('hex');
  //     User.updateOne({ email: emailID },
  //       {
  //         $set:
  //         {
  //           resetPasswordToken: token,
  //           resetPasswordExpiresIn: Date.now() + 36000
  //         }
  //       }, (err, updated) => {
  //         if (err) {
  //           return //console.log(err);
  //         }
  //         const mailOptions = {
  //           from: 'joyisjoy71@gmail.com',
  //           to: emailID,
  //           subject: 'Link to reset password',
  //           html: `<p>To initiate the password reset process for your Hotelogix account ${emailID} 
  //                                 click on the link below:</p> <br> <p><a href="http://localhost:4200/changepassword?token=${token}&email=${emailID}">http://localhost:4200/changepassword?token=${token}&email=${emailID}</a></p>`
  //         }
        
  //         transporter.sendMail(mailOptions, function (err, data) {
  //           if (err) {
  //             return res.json({ code: 6003, message: "something went wrong" })
  //           }
  //           return res.json({ code: 6004, message: "recovery email sent.." })

  //         })
  //       })
  //   } else {
  //     return res.json({ code: 6003, message: "user details are not found" })
  //   }
  // })
}