var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kitchenSchema = new Schema({
    // What the ingredient is
    name: String,
    // How much we charge for it
    price: Number,
    // How much of the ingredient is in stock
    stock: Number,
    // Keep references to all of the orders which use this ingredient
    // The length of this shows the popularity of the ingredient for the
    // marketing team
    orders: [Schema.Types.ObjectId]
});