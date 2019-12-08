var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccesslevelSchema = new mongoose.Schema({
  title: {
         type: String,
         required : true,
         unique:true
       },
       userid: {
       type: Schema.Types.ObjectId,
        required : true
       },
       hotelCode: {
         type: Number, 
         required: true
       },
       accesstype: {
        type : [],
        required: true
       },
       defaultworkarea: {
        type: String,
              required: true
       },
       description: {
        type: String, 
              required: true
       }

},{strict:false});

mongoose.model('AccessLevel', AccesslevelSchema);