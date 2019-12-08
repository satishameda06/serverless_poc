var mongoose = require( 'mongoose' );
var UserType = mongoose.model('UserType');

module.exports.addusertype = function(req, res){
    // console.log("calling addusertype method",req.body);
   if(!req.body.title || !req.body.description){
       return res.status(400).json({"message" : "All fields required"});
   }else{
          var usertype = new UserType(req.body);
          usertype.userid = req.payload._id;
          usertype.hottelCode=req.payload.hottelCode;
          usertype.save(usertype, function(err, data){
              if(err){
                  return res.status(500).json(err);
              }
              else{
                return res.status(200).json({"message" : "usertype added!"});
              }
          });
   }
    
   

};

module.exports.listusertype = function(req, res){
  //  console.log("listusertype",req.payload);
	UserType.find({userid:mongoose.Types.ObjectId(req.payload._id),hotelCode:req.payload.hotelCode},function(err, data){
		if(err){
      console.log("listusertype err",err);
      return res.status(200).json(err);
    }	else{
      console.log("listusertype data",data);
      return res.status(200).json(data);
    }
		
	
		
	})


};

exports.changeUserTypeStatus = function (req, res) {

  if(!req.body.id){
    return res.status(400).json({"message" : "all fiels required"});
  }else{
     UserType.findOneAndUpdate({
    _id: req.body.id
  }, {
    $set: {
      status: req.body.status
    }
  }, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    } else {
       return res.status(200).json(data);
    }
  }); 
  }

 
};

module.exports.deleteUserType = function(req, res){


  if(!req.body.id){
    return res.status(400).json({"message" : "required fields missing"});
  }else{
     UserType.deleteOne({_id: mongoose.Types.ObjectId(req.body.id)}, 
    function(err, data) {
        if (err) return res.status(500).json(err);
        else 
          return res.status(200).json(data);
    })
  }
	

};