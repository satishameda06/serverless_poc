var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var usertypeSchema = new mongoose.Schema({
    title: {
    	type: String,
        required : true
    },
    userid: {
        type: Schema.Types.ObjectId,
        required : true
    },
    description:{
    	type: String,
        required: true
    },
    status:{
    	type: Boolean,
    	default: true
    },
    hotelCode: {
        type: Number,
        required: true
    }

},{strict:false});

mongoose.model('UserType',usertypeSchema);
