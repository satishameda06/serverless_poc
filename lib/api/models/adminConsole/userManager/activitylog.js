var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// mongoose.set('debug', true);

var activityLogSchema = new mongoose.Schema({
   email: {
   	type: String,
   	required: true
   },
   userid: {
       type: Schema.Types.ObjectId,
        required : true
       },
   ipaddress: {
      type: Schema.Types.Mixed
   },
   timestamp: {
      type: Date
   },
   section: {
   	 type: String,
   	 required: true
   },
   hotelCode: {
   	type: Number,
   	required: true
   },
   loginStatus:{
      type:String,
      required:true
   },
   user_type:{
      type:String,
   }
},{strict:false});

mongoose.model('ActivityLog', activityLogSchema);