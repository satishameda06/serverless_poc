var mongoose = require("mongoose");
var Product = mongoose.model("Product");

module.exports.addProduct = function (req, res){

	if(!req.body.name || !req.body.category || !req.body.price || !req.body.adultqty  || !req.body.childqty || !req.body.productcode){
      return res.status(400).json({"message": "All Fields Required"});
	}else{
      var product = new Product(req.body);
      product.save(req.body, function(err, data){
      	if(err){
      		return res.status(500).json(err);
      	}else{
      		return res.status(200).json(data);
      	}
      });
	}

};


module.exports.getProduct = function(req, res){
	Product.find({},function(err,data){
		if(err){
			return res.status(500).json(err);
		}else{
			return res.status(200).json(data);
		}
	});

};