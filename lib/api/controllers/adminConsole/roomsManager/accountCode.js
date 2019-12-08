const mongoose = require('mongoose');
const AccountCode = mongoose.model('accountcode');


module.exports.createAccountCode = async (req, res)=> {
  try {
      const {account_name,account_code,hotelCode} = req.body;
      if(!account_name || !account_code || !hotelCode)
      return res.json({code:5001,message:"all fields are required."});
      const accCode = new AccountCode(req.body);
      const saveAccCode = await accCode.save();
      saveAccCode ? res.json({code:5003,data:saveAccCode}): null;
     } catch (e){
       if(e.errmsg.includes("E11000 duplicate key error collection"))
         return res.json({code:5002,message:"Account code must be unique!"});
         return res.json({code:5002,message:"something went wrong"});
    }
};

module.exports.getAllAccountCode = async  (req, res)=> {
    try{
      const accCode= await AccountCode.find({});
      (accCode.length == 0) ? res.json({code:6002,message:'No AccountCode found'}) : res.json({code:6003,data: accCode});
    } catch (e) {
       
      return res.json({code:6001,message:"something went wrong"});
    }
}

