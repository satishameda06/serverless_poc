var mongoose = require('mongoose');
var User = mongoose.model('User');
var Property = mongoose.model('Property');

//Property CRUD

module.exports.createProperties = function(req, res) {
    // //console.log(req.body);
    User.find({_id: mongoose.Types.ObjectId(req.body.userId)}, function(err, user){
        if(err) {
            //console.log(err);
            res.json(err);
        }
        if(user) {
            var property = new Property(req.body);
            property.save(req.body, function(err, property){
                if(err){
                    //console.log(err);
                    res.json(err);
                }
                res.json({
                    "message": "Property created",
                    "property": property
                });
            })
        }
        else {
        res.json({
            "message": "User not found"
        });
    }
        
    })
};

module.exports.readProperties = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
          "message" : "UnauthorizedError: private profile"
        });
      } else {
        Property
          .find({userId: req.payload._id})
          .exec(function(err, properties) {
            res.status(200).json(properties);
          });
      }
};

module.exports.updateProperties = function(req, res) {

};

module.exports.deleteProperties = function(req, res) {

};