var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	productcode: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	adultqty: {
		type: Number,
		required: true
	},
	childqty: {
		type: Number,
		required: true
	}

});
mongoose.model("Product",productSchema);