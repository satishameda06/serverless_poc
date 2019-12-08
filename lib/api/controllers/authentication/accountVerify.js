const mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Token = mongoose.model('tokens'),
  nodemailer = require('nodemailer');
//Satish ameda
exports.confirmationPost = function (req, res, next) {
  console.log("re.query confirmationPost",req.query);
  const token = req.query.token;
  const email = req.query.email;
  if (!token && !email) {
    return res.status(200).send({ msg: 'Invalid parametrs' });
  }
  Token.findOne({ token: token }, function (err, tokenData) {
  
    if (!tokenData)
      return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
    // If we found a token, find a matching user
    User.findOne({ token: tokenData.token, email: email }, function (err, user) {
      console.log("Finding user",err, user);
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
      if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
      // Verify and save the user
      User.update({ email: email }, {
        isVerified: true,
      }, function (err, affected) {

        if (err) { return res.status(500).send({ msg: err.message }); }
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: "satishameda06@gmail.com", // generated ethereal user
            pass: "8500152933"  // generated ethereal password
          }
        });
        var mailOptions = {
          from: 'joyisjoy71@gmail.com', to: user.email, subject: `Pms Account Details Re${user.hotelCode}`, html: `
<html>
<head>
<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
th, td {
  padding: 5px;
  text-align: left;    
}
</style>
</head>
<body>


<p>Your account details are:</p>

<table style="width:100%">
  <tr>
    <th>Hotel Code:</th>
    <td>${user.hotelCode}</td>
  </tr>
  <tr>
    <th>Email:</th>
    <td>${user.email}</td>
  </tr>
</table>
</body>
</html> ` };
        transporter.sendMail(mailOptions, function (err, data) { })
        res.send(`<h1>"The account has been verified. Please log in."</h1><body><p><a href="http://localhost:4200/login">Click here to login</a></p></body>`);

      })

    });
  });
};