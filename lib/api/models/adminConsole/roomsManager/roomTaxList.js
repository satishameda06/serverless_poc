const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
const RoomTaxList= new mongoose.Schema({
    id:{
        type:String,
        unique: true,
    },
   taxTitle:{
      type:String,
      required: true
    },
   taxId:{
    type:String,
    required: true 
   },
   department:{
    type:String,
    required: true 
   },
   accountCode:{
    type:String,
    required: true 
   },
   description:{
    type:String, 
   },
   taxtype:{
     type:String,
     required:true 
   },
   hotelCode:{
     type:Number,
     required:true 
   }
},{strict:false});
RoomTaxList.pre('save', function (next) {
    var rmTax = this;
    rmTax.id = 'rm-tax' + shortid.generate();
    next();
  });
RoomTaxList.index({taxTitle:1,hotelCode:1,id:1});
mongoose.model('roomtaxlist', RoomTaxList);