var mongoose  = require("mongoose");
var CompanyProfile = mongoose.model("companyprofile");

module.exports.addCompanyProfile = function (req, res){
     var cmpProfile = new CompanyProfile(req.body);
       cmpProfile.save(cmpProfile,function(err, data){
          //  console.log("addCompanyProfile",err)
        if (err) res.json({code:5002,data:err.message}); 
        else res.json({code:5003,data:data}); 
      });
}



