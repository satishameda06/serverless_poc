var mongoose = require('mongoose');
var Floor = mongoose.model('floor');


module.exports.createFloor= function (req, res) {
    if(!req.body.title && !req.body.hotelCode){
       return res.json({code:5001,message:"all fields are required."});  
    }
    const floor = new Floor(req.body);
    floor.save(function (err, result) {
      if (err) res.json({code:5002,message:err.message}); 
      else res.json({code:5003,data:result}); 
    });
};

module.exports.getAllFloor = function (req, res) {
  if(!req.query.hotelcode){
    return res.json({code:5001,message:"all fields are required."});  
  }
   Floor.find({hotelCode:parseInt(req.query.hotelcode)}, function (err, floors) {
     if (err) 
        return res.json({code:6001,message:"something went wrong in db"});
    if (floors.length == 0) 
         res.json({code:6002,message:'No floor found'});
    else 
         res.json({code:6003,data: floors});
  });
}

module.exports.updateFloor = function (req, res) {
  
    if(!req.body.id && req.body.title){
        return res.json({code:7001,message:"all fields are required."});  
     }
     const id=req.body.id;
     const title=req.body.title;
    //  console.log("calling method of updateFloor",id,title);
     try{
        Floor.update({id:id},{$set:{title:title}},function (err, data) {
            if (err) res.json({code:7002,message:"something went wrong in db"});  
            else  res.json({code:7003,message:"updated successfully"})
          })
     }catch(e){
        res.json({code:7003,message:"something went wrong"})
     }
  
}

module.exports.deleteFloor = function (req, res) {
    if(!req.body.id){
        return res.json({code:8001,message:"all fields are required."});  
     }
     const id=req.body.id;
  Floor.remove({
    id: id
  }, function (err, floors) {
    if (err) res.json({code:8002,message:"something went wrong in db"});
    if (floors.length == 0) res.json({code:"8002",message:'No floors found!'});
    else res.json({code:8003,message:"floor deleted successfully"});
  });
}