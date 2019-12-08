var passport = require('passport');

module.exports.login = function (req, res) {

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        msg: "All parameters required"
      })
    }
    passport.authenticate('local', function (err, user, info) {
      var token;
  
      // If Passport throws/catches an error
      if (err) {
  
        return res.status(404).json(err);;
      }
  
      // If a user is found
      if (user.user_type == 'super-admin') {
        //console.log(user);
        token = user.generateJwt();
        res.status(200);
        res.json({
          'user': user,
          'token': token
        });
      } else {
        // If user is not found
        return res.status(401).json(info);
      }
    })(req, res);
  };
  
  