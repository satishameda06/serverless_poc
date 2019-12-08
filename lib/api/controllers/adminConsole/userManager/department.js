var mongoose = require( 'mongoose' );
var Department = mongoose.model('department');

module.exports.addDepartment = function(req, res){
    //console.log("calling addDepartment method",req.body);
   if(!req.body.department || !req.body.hotelCode){
       return  res.send({code:3001,"message" : "All fields required"});
   }else{
          req.body.description="this is department";
          var dept = new Department(req.body);
           dept.save(dept, function(err, data){
              if(err){
                //console.log(err);
                return res.send({code:3002,"message" : "something went wrong!"});
              }
              else{
                return res.send({code:3003,"message" : "department is added!"});
              }
          });
   }
};
module.exports.getAllDepartments = function(req, res){
  if(!req.body.hotelcode){
     return res.send({code:2001,message:"hotel code is required..!"})
  }
   Department.find({hotelCode:parseInt(req.body.hotelcode)},function(err, data){
		if(err)
	    	return res.send({code:2002,message:"Something went wrong..!"})
		else
			return  res.send({code:2003,result:data});
	})
};
module.exports.searchWithPaging=function(req,res){
  //console.log("coming here searchWithPaging");
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
    
     Department.find({hotelCode:parseInt(hotelcode)},{_id:0,__v:0},query,(err,data)=>{
      if(err) {
        response = {code:9001,"message" : "Error fetching data"};
    } else {
        response = {code:9002,"data" : data};
    }

    res.json(response);
 })
};
module.exports.updateDepartment = function (req, res) {
  // //console.log("updateBlock is calling",req.body.id,req.body.block_name)
    if(!req.body.id && req.body.department){
        return res.json({code:7001,message:"all fields are required."});  
     }
     const id=req.body.id;
     const dept_name=req.body.department;
    //  //console.log("calling method of updateBlock",id,block_name);
     try{
      Department.update({id:id},{$set:{department:dept_name}},function (err, data) {
            if (err) res.json({code:7002,message:"something went wrong in db"});  
            else  res.json({code:7003,message:"updated successfully"})
          })
     }catch(e){
        res.json({code:7003,message:"something went wrong"})
     }
  
}

module.exports.deleteDepartment = function(req, res){
  //console.log("deleteDepartment",req.body.id)
if(!req.body.id){
  return res.json({code:8001,"message" : "required fields missing"});
}else{
  Department.deleteOne({id:req.body.id}, 
  function(err, data) {
      //console.log(err, data);
      if (err) return res.json({code:8002,message:"something went wrong"});
      else 
        return res.json({code:8003,message:"department deleted successfully"});
  })
}
};