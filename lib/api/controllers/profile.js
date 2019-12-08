var mongoose = require('mongoose');
var User = mongoose.model('User');
var Room = mongoose.model('Room');

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};

module.exports.showRooms = function(req, res) {
  // console.log(req);
  if(!req.body.userid) {
    res.status(401).json({
      "message": "UnauthorizedError: Private Profile"
    });
  } else {
    Room
    .find({userid: req.body.userid}, {property: req.body.property_name})
    .exec(function(err, rooms){
      res.status(200).json(rooms);
    });
  }
}

module.exports.addProperty = function(req, res) {
  // console.log(req.body);
  User
  .find({_id: req.body.userid})
  .exec(function(err, user) {
    // console.log(user);
    user[0].properties.push(req.body.property_name);
    user[0].save(function(err, resul){
      if(!err) res.status(200).json(resul);
      else res.status(401).json(err);

    });
  });
  
}

module.exports.addRate = function(req, res) {
  // console.log(req.body);
  User
  .find({_id: req.body.userid})
  .exec(function(err, user) {
    // console.log(user);
    user[0].rates.push(req.body.rate_type);
    user[0].save(function(err, resul){
      if(!err) res.status(200).json(resul);
      else res.status(401).json(err);

    });
  });
  
}


module.exports.updateProfile = function(req, res) {
  
  
  if (!req.body._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    /*
    User
      .findById(req.body._id)
      .populate(roomGroup)
      .exec(function(err, user){
        if(err) {
          res.status(500)
          .json({ error: 'Unable to update profile.', });
        }
        res.status(200)
        .json(user);
      });

    */


   User.findByIdAndUpdate(req.body._id, {
    $addToSet: {"roomGroup": {"$each": req.body.roomGroup }}
}, {
    safe: true,
    new: true
}, function(err, user){
    if(err){
        res.send(err);
    } else {
        res.json(user);
    }
});

  
    /*
    User.update(
      { '_id': req.body._id },
      {push: {'roomGroup': roomGr}},
      //{push: {'roomGroup': req.body.roomGroup}},
      //{ $set:  {'roomCategory': req.body.roomCategory, 'roomCount': req.body.roomCount, 'name': req.body.name, 'roomGroup': req.body.roomGroup }},
      (err, user) => {
        if (err) {
          res.status(500)
          .json({ error: 'Unable to update profile.', });
        } else {
          res.status(200)
          .json(user);
        }
     }
    );
    */
    
  }
  

  
};