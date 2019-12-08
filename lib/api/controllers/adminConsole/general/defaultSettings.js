const mongoose=require('mongoose'),
 defualtSetting=mongoose.model('defaultsetting');

 module.exports.updateDefaultSettings=function(req,res){
   const updateSetting={...req.body}

   defualtSetting.findOneAndUpdate({hotelCode:parseInt(req.params.id)},updateSetting,{strict:false,new:true,upsert: true},(err,updated)=>{
  
    
     if(err){
      return res.json({code:3000,message:"something went wrong"});
     }
     
     return res.json({code:3001,message:"record updated successfully"})
   })
 }
 module.exports.getDefaultSettings=function(req,res){
 
   defualtSetting.find({hotelCode:req.payload.hotelCode},{__v:0,_id:0,id:0,hotelCode:0,isChild:0},(err,data)=>{
    if(err){
     return res.json({code:4000,message:"something went wrong"});
    }
    if(data.length==0){
      return res.json({code:4002,message:"No data"});
    }
    return res.json({code:4001,result:data});
  })
}
    