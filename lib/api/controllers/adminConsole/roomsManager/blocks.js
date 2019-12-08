var mongoose = require('mongoose');
var Blocks = mongoose.model('block');


module.exports.createBlocks= function (req, res) {
    if(!req.body.block_name && !req.body.hotelCode){
       return res.json({code:5001,message:"all fields are required."});  
    }
    const Block = new Blocks(req.body);
    Block.save(function (err, result) {
      if (err) res.json({code:5002,message:err.message}); 
      else res.json({code:5003,data:result}); 
    });
};

module.exports.getAllBlocks = function (req, res) {

  if(!req.query.hotelcode){
    return res.json({code:5001,message:"all fields are required."});  
  }
  Blocks.find({hotelCode:parseInt(req.query.hotelcode)}, function (err, Blks) {
    
    if (err) 
        return res.json({code:6001,message:"something went wrong in db"});
    if (Blks.length == 0) 
         res.json({code:6002,message:'No Block found'});
    else 
         res.json({code:6003,data: Blks});
  });
}

module.exports.updateBlocks = function (req, res) {
  // console.log("updateBlock is calling",req.body.id,req.body.block_name)
    if(!req.body.id && req.body.block_name){
        return res.json({code:7001,message:"all fields are required."});  
     }
     const id=req.body.id;
     const block_name=req.body.block_name;
    //  console.log("calling method of updateBlock",id,block_name);
     try{
        Blocks.update({id:id},{$set:{block_name:block_name}},function (err, data) {
            if (err) res.json({code:7002,message:"something went wrong in db"});  
            else  res.json({code:7003,message:"updated successfully"})
          })
     }catch(e){
        res.json({code:7003,message:"something went wrong"})
     }
  
}

module.exports.deleteBlocks= function (req, res) {
    if(!req.body.id){
        return res.json({code:8001,message:"all fields are required."});  
     }
     const id=req.body.id;
  Blocks.remove({
    id: id
  }, function (err, Blocks) {
    if (err) res.json({code:8002,message:"something went wrong in db"});
    if (Blocks.length == 0) res.json({code:"8002",message:'No Blocks found!'});
    else res.json({code:8003,message:"Block deleted successfully"});
  });
}
module.exports.searchWithPaging=function(req,res){
  const queryParams = req.query;
  
  let query = {};
  const hotelcode = queryParams.hotelcode,
        filter = queryParams.filter || '',
        sortOrder = queryParams.sortOrder,
        pageNumber = parseInt(queryParams.pageNumber) || 0,
        pageSize = parseInt(queryParams.pageSize);
        if(!hotelcode){
          return res.json({code:5001,message:"all fields are required."});  
        }
        if(pageSize < 0 || pageNumber === 0) {
          response = {code:9000,"message" : "invalid page number, should start with 1"};
          return res.json(response)
    }
     query.skip = pageSize * (pageNumber - 1);
     query.limit = pageSize;
    
     Blocks.find({hotelCode:parseInt(hotelcode)},{_id:0,__v:0},query,(err,data)=>{
      if(err) {
        response = {code:9001,"message" : "Error fetching data"};
    } else {
        response = {code:9002,"data" : data};
    }

    res.json(response);
 })
}