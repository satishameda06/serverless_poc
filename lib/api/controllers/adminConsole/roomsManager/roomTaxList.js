const mongoose = require('mongoose');
const RoomTaxList = mongoose.model('roomtaxlist');


module.exports.createRoomTaxList = async (req, res)=> {
  try {
      const {taxTitle,taxId,accountCode,taxtype,hotelCode,department} =req.body;
      if(!taxTitle || !taxId || !accountCode || !taxtype || !hotelCode || !department)
      return res.json({code:5001,message:"all fields are required."});  
      const RTaxList = new RoomTaxList(req.body);
      const saveRmTax = await RTaxList.save();
      saveRmTax ? res.json({code:5003,data:saveRmTax}): null;
     } catch (e){
      return res.json({code:5002,message:"something went wrong"});
    }
};

module.exports.getAllRoomTaxList = async  (req, res)=> {
    try{
      const rmtaxList= await RoomTaxList.find({});
      (rmtaxList.length == 0) ? res.json({code:6002,message:'No RoomTaxList found'}) : res.json({code:6003,data: RoomTaxLists});
    } catch (e) {
      return res.json({code:6001,message:"something went wrong"});
    }
}

module.exports.updateRoomTaxList = async (req, res) =>{
  try{
    const {taxTitle,taxId,accountCode,taxtype,department,id} =req.body;
    if(!id)
      return res.json({code:7001,message:"all fields are required."});
    const findRoomtaxList = await RoomTaxList.findOne({id:id});
    if(findRoomtaxList===null || findRoomtaxList===undefined)
      return res.json({code:7002,message:"Record not found"});
    const updateData={taxTitle,taxId,accountCode,taxtype,department};
    const updateRoomTax = await RoomTaxList.updateOne({id:id},{$set:updateData});
    updateRoomTax ? res.json({code:7003,message:"record upadted successfully"}) : null ;
  }catch(e){
    res.json({code:7004,message:"something went wrong"});
  }
}
module.exports.deleteRoomTaxList = async (req, res)=> {
  try{
    const {id} =req.body;
    if(!id)
    return res.json({code:8001,message:"all fields are required."}); 
    const findRoomtaxList = await RoomTaxList.findOne({id:id});
    if(findRoomtaxList===null || findRoomtaxList===undefined)
      return res.json({code:8003,message:"record not found"})
    const rmtaxListRemove = await RoomTaxList.remove({id:id});
    rmtaxListRemove ? res.json({code:8003,message:"record deleted successfully"}) : null ;
    } catch(e) {
      res.json({code:8002,message:"something went wrong in db"});
  }
}
module.exports.roomTaxListPaging= async ()=> {
  try{
    const queryParams = req.query;
    let query = {};
    const hotelcode = queryParams.hotelcode,
          sortOrder = queryParams.sortOrder,
          pageNumber = parseInt(queryParams.pageNumber) || 0,
          pageSize = parseInt(queryParams.pageSize);
          if(!hotelcode){
            return res.json({code:9001,message:"all fields are required."});  
          }
          if(pageSize < 0 || pageNumber === 0) {
            return res.json({code:9000,"message" : "invalid page number, should start with 1"}) 
          }
       query.skip = pageSize * (pageNumber - 1);
       query.limit = pageSize;
       const rmtaxListPaging = await RoomTaxList.find({hotelCode:parseInt(hotelcode)},query);
       res.json({code:9002,"data" : rmtaxListPaging});
  } catch(e) {
     res.json({code:9001,"message" : "Error fetching data"});
  }
 
}