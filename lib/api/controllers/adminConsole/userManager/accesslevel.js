var mongoose = require("mongoose");
var AccessLevel = mongoose.model("AccessLevel");
//console.log("c");
module.exports.adduseraccesss = function(req, res){
  //console.log("adduseraccesss---req.body",req.body);
  //   if(!req.body.title || !req.body.description || !req.body.accesstype || !req.body.defaultworkarea){
  //      return res.status(400).json({"message" : "All fields required"});
  //  }else{
  //  //console.log("adduseraccesss---req.body",req.body);
  //  var accesslevel = new AccessLevel(req.body);
  //  accesslevel.userid = req.payload._id;
  //  accesslevel.save(accesslevel, function(err, data){
  //  	  if (err) res.status(500).json(err);
  //  	  else res.status(200).json(data);
  //  })
  //   }

};
module.exports.addUserAccess=async(req,res)=>{
   try{
      if(!req.body.title || !req.body.description || !req.body.accesstype || !req.body.defaultworkarea){
        return res.json({code:1000,"message" : "All fields required"});
      }
      const accesslevel = new AccessLevel(req.body);
      accesslevel.userid = req.payload._id;
      accesslevel.hotelCode=req.payload.hotelCode;
      accessLevelDbSave=await accesslevel.save(accesslevel);
      return res.json({ code:1001,  "message" : "Given access to levels"});
    } catch(err){
       return res.json({ code:1002, "message" : "Something went wrong"});
    }
  }
module.exports.listuseraccesss = function(req, res){

	AccessLevel.find({userid:mongoose.Types.ObjectId(req.payload._id),hotelCode:req.payload.hotelCode}, function(err, data){
		if(err) {
      console.log("listuserAccess err",err);
      res.status(500).json(err);

    }else{
  
      res.status(200).json(data);
    };
		 
	});
};
module.exports.getDefaultView= function(req, res){
 
	AccessLevel.findOne({userid: req.payload._id,hotelCode:req.body.hotelCode,title:req.body.title}, function(err, data){
    console.log("data is received from accesslevel collection for specific view",err,data);
		if(err) res.status(500).json(err);
		else res.status(200).json(data);
	});
};

module.exports.updateuseraccesss = function(req,res){
	 if(!req.body.id){
    return res.status(400).json({"message" : "all fiels required"});
  }else{
     AccessLevel.findOneAndUpdate({
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

module.exports.deleteuseraccesss = function(req, res){
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