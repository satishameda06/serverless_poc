var mongoose  = require("mongoose");
var ActivityLog = mongoose.model("ActivityLog");

module.exports.addActivityLog = function (req, res){

	if(!req.body.section){
      return res.status(200).json({"message" : "all fields required"})
	}else{
	  req.body.userid = req.payload._id;
	  req.body.email = req.payload.email;
      var activityLog = new ActivityLog(req.body);
      activityLog.hotelCode = req.payload.hotelCode;
      activityLog.ipaddress = req.connection.remoteAddress;
	  activityLog.timestamp = Date.now();
	  activityLog.user_type=req.payload.user_type;
      activityLog.save(activityLog,function(err, data){
      	if(err){
			console.log("");
			return res.status(500).json(err);
		  }else {
			return res.status(200).json(data);
		  }
      		
      });
	}

};

module.exports.listActivityLog = function(req, res){
	// {userid:req.payload._id,hotelCode:req.payload.hotelCode}
	try{
		let conditions;
		if(req.payload.user_type==="employee"){
		  conditions={hotelCode:req.payload.hotelCode,user_type:req.payload.user_type};
		} else {
		  conditions={hotelCode:req.payload.hotelCode};
		}
	  
	  ActivityLog.find(conditions, function(err, data){
		  if (err) {
			  return res.status(500).json(err);
		  }else{
			  return res.status(200).json(data);
		  }
	  });
	}catch(e){
        console.log("satish error is thro",e);
	}

};

module.exports.updateLogoutTime = function(req, res) {
	
	try{
		const update_params={loginStatus:"Inactive",logoutTime:Date.now()};
		
		ActivityLog.updateOne({"_id":mongoose.Types.ObjectId(req.body.id)},{$set:update_params}, function(err, data){
			if (err) {
				console.log("error is occuring while updateActivityLogout",err);
				return res.json({code:3000,message:"something went wrong"});
			}else{
				return res.json({code:3001,message:"updated successfully"});
			}
		});
	}catch(e){
		console.log("what is coming here",e);
		return res.json({code:3002,message:"something went wrong"});
	}

};