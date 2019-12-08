var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productcategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	}

});
mongoose.model("ProductCategory",productcategorySchema);