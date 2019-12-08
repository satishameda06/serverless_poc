var mongoose = require( 'mongoose' );
var shortid = require('shortid');

var DepartmentSchema = new mongoose.Schema({
    department: {
    	type: String,
        required : true,
        unique:true
    },
    description:{
    	type: String,
        required: true
    },
    hotelCode:{
    	type: Number,
        required: true
    },
    id:{
        type: String
    }
    

});

DepartmentSchema.pre('save', function (next) {
    var department = this;
    department.id = 'dept-' + shortid.generate();
    next();
});
mongoose.model('department',DepartmentSchema);
