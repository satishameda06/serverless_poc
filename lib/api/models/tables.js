var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var orderSchema = new mongoose.Schema({
    category: String,
    description: String,
    id: String,
    img: String,
    name: String,
    qty: Number,
    rate: Number,
    userId: Schema.Types.ObjectId,
    hotelCode:Number,
    _id: Schema.Types.ObjectId
},{strict:false});

var PaymentInfo = new mongoose.Schema({
    amt : Number,
    taxes : Number,
    discount: Number,
    chequeNo: String,
    receiptNo: String,
    description: String,
    mode: String
})

var tableSchema = new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    shape: {
        type: String
    },
    status: {
        type: String,
        enum: ['Occupied', 'Vacant', 'Dirty'],
        default: 'Vacant'
    },
    description: {
        type: String
    },
    noOfChairs: {
        type: Number,
        default: 4
    },
    orderId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    hotelCode:{
        type:Number,
        required:true
    },
    visitors: {
        type: Number,
        default: null
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    resource_groupId:{
        type: Schema.Types.ObjectId,
        ref: 'restaurant_group'
    },
    restaurantData: {
        tableData: [orderSchema],
        isBooked: {
            type: Boolean,
            default: false
        },
        orderClosed: {
            type: Boolean,
            default: false
        },
        orderPrepared: {
            type: Boolean,
            default: false
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'partial', 'paid'],
            default: 'pending'
        },
        status: String,
        orderTotal: {
            qty: Number,
            subTotal: Number,
            discount: Number,
            taxes: Number,
            paid: Number
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'RestaurantOrder'
        },
        paymentInfo: [PaymentInfo]
    }
},{strict:false});

tableSchema.pre('save', function (next) {
    var table = this;
    table.id = 'tab-' + shortid.generate();
    next();
});

mongoose.model('RestaurantTable', tableSchema);