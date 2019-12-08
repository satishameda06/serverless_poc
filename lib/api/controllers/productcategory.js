var mongoose = require("mongoose");
var ProductCategory = mongoose.model("ProductCategory");

module.exports.addProductCategory = function (req, res){
	if(!req.body.name){
      return res.status(400).json({"message": "All Fields Required"});
	}else{
      var productcategory = new ProductCategory(req.body);
      productcategory.save(req.body, function(err, data){
      	if(err){
      		return res.status(500).json(err);
      	}else{
      		return res.status(200).json(data);
      	}
      });
	}

};


module.exports.getProductCategory = function(req, res){
	ProductCategory.find({},function(err,data){
		if(err){
			return res.status(500).json(err);
		}else{
			return res.status(200).json(data);
		}
	});

};