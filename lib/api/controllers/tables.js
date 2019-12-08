var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var User = mongoose.model('User');
var Restaurant = mongoose.model('Restaurant');
var Table = mongoose.model('RestaurantTable');
const RestaurantOrders = mongoose.model('RestaurantOrder')
var async = require('async');
const OrderTransaction = mongoose.model('OrderTransaction');
module.exports.add = function (req, res) {
    var table = new Table(req.body);
    table.save(function (err, data) {
        if (err) res.status(500).json(err);
        else res.status(200).json('Success');
    })
}

module.exports.bookTable = function (req, res) {
    //console.log(req.body);
    var tableId = req.body._id;
    delete req.body._id;
    req.body.restaurantData.isBooked = true;
    if(!req.body.restaurantData.status) {
        req.body.restaurantData.status = 'Occupied';
    }
    Table.findByIdAndUpdate(
        tableId, {
            $set: {
                restaurantData: req.body.restaurantData
            }
        },
        function (err, result) {
            if (err) res.status(500).json(err);
            res.status(200).json(result);
        });
};

module.exports.unBookTable = function (req, res) {
    //console.log('Unbooking table');
    // //console.log(req.body);
    var tableId = req.body._id;
    delete req.body._id;
    let updateTableData = {
        isBooked: false,
        status: 'Vacant',
        orders: []
    };
    Table.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(tableId)
    }, updateTableData, function (err, result) {
        if (err) res.status(500).json(err);
        res.status(200).json(result);
    });
};

module.exports.unBookTablev2 = function (req, res) {
    res.json(req.body);
}

module.exports.getAll = function (req, res) {
    Table.find({
        userId: req.payload._id,
        hotelCode:req.payload.hotelCode
    }, function (err, tables) {
        if (err) res.status(500).json(err);
        if (!tables) res.status(404).json('No tables found');
        res.status(200).json(tables);
    })

}

module.exports.updateTable = function (req, res) {
    let tableId = req.body._id;
    delete req.body._id;
    req.body.isBooked = true;
    req.body.status = 'Occupied';
    Table.findByIdAndUpdate(tableId, req.body, function(err, doc) {
        if (err) res.status(500).json(err);
        else res.status(200).json(doc);
    })
}

module.exports.confirmTableRestaurantOrder = function (req, res) {
    let tableId = req.body._id;
    delete req.body._id;
    if (req.body.restaurantData.orderClosed === true) {
        Table.findByIdAndUpdate(tableId, req.body, function(err1, data1) {
            if (err1) return res.status(500).json(err1);
            else {
                RestaurantOrders.findByIdAndUpdate(req.body.restaurantData.orderId, {$set: {status: 'confirmed'}}, function(err, doc) {
                    if (err) res.status(500).json(err);
                    else res.status(200).json(data1);
                })
            }
        })
    }
}

module.exports.tableRestaurantOrderPrepared = function (req, res) {
    let tableId = req.body._id;
    delete req.body._id;
    if (req.body.restaurantData.orderPrepared === true) {
        Table.findByIdAndUpdate(tableId, req.body, function(err1, data1) {
            if (err1) return res.status(500).json(err1);
            else {
                RestaurantOrders.findByIdAndUpdate(req.body.restaurantData.orderId, {$set: {status: 'prepared'}}, function(err, doc) {
                    if (err) res.status(500).json(err);
                    else res.status(200).json(data1);
                })
            }
        })
    }
}

module.exports.tableRestaurantOrderPay = function(req, res) {
    try{
        let tableId = req.body._id;
        delete req.body._id;
        let tableInfo = req.body.restaurantData;
        let otherInfo=req.body;
        const orderId = tableInfo.orderId;
        let totalPaid = 0;
        // _.forEach(tableInfo.paymentInfo, (x)  => {
        //     totalPaid += x.amt;
        // });
        tableInfo.paymentInfo.forEach(element => {
            totalPaid += element.amt;
        });
        //console.log('total paid: ' + totalPaid);
        let orderUpdater = {};
        const updateTransaction = {};
        if (totalPaid <= 0 && otherInfo.orderTotal.subTotal > 0) {
            tableInfo.paymentStatus = 'pending';
            orderUpdater = {$set: {paymentInfo: tableInfo.paymentInfo, payedAmt: totalPaid,pending_balance:otherInfo.orderTotal.subTotal, paymentStatus: 'pending'}};
    
        } else if (totalPaid < otherInfo.orderTotal.subTotal) {
            tableInfo.paymentStatus = 'partial';
            orderUpdater = {$set: {paymentInfo: tableInfo.paymentInfo, payedAmt: totalPaid,pending_balance:otherInfo.orderTotal.subTotal-totalPaid, paymentStatus: 'partial'}};
            updateTransaction.amount_paid = totalPaid;
            updateTransaction.balance = otherInfo.orderTotal.subTotal - totalPaid;
            updateTransaction.orderId = orderId;
            updateTransaction.payment_status = "partial";
            updateTransaction.payment_type = tableInfo.paymentInfo[0].mode ? tableInfo.paymentInfo[0].mode : "d_cash";
            updateTransaction.folio = tableInfo.tableData.length;
            updateTransaction.date = new Date();
            updateTransaction.time = Date.now();
            updateTransaction.description = "about transaction";
            updateTransaction.hotelCode = req.body.hotelCode;
            updateTransaction.chequeNo = "no cheque";
            updateTransaction.receiptNo = "no receipt";
        } else if (totalPaid >= otherInfo.orderTotal.subTotal) {
            tableInfo.paymentStatus = 'paid';
            orderUpdater = {$set: {paymentInfo: tableInfo.paymentInfo, payedAmt: totalPaid,pending_balance:otherInfo.orderTotal.subTotal, paymentStatus: 'paid'}};
            updateTransaction.amount_paid = totalPaid;
            updateTransaction.balance = otherInfo.orderTotal.subTotal - totalPaid;
            updateTransaction.orderId = orderId;
            updateTransaction.payment_status = "paid";
            updateTransaction.payment_type = tableInfo.paymentInfo[0].mode ? tableInfo.paymentInfo[0].mode : "d_cash";
            updateTransaction.folio = tableInfo.tableData.length;
            updateTransaction.date = new Date();
            updateTransaction.time = Date.now();
            updateTransaction.description = "about transaction";
            updateTransaction.hotelCode = req.body.hotelCode;
            updateTransaction.chequeNo = "no cheque";
            updateTransaction.receiptNo = "no receipt";
        }
        async.waterfall([
            (callback)=>{
                let OrderTransactionDb = new OrderTransaction(updateTransaction);
                OrderTransactionDb.save((err, data) => {
                  if (!err) {
                    console.log("OrderTransactionDb",data);
                    callback()
                  }
                });
            },
            (callback)=>{
                Table.findByIdAndUpdate(tableId, {'restaurantData.orderTotal.paid': totalPaid,'restaurantData.paymentInfo': tableInfo.paymentInfo, 'restaurantData.paymentStatus': tableInfo.paymentStatus}, function(err1, data1) {
                    console.log("err1, data1",err1, data1);   
                    if (err1) return res.status(500).json(err1);
                        else {
                            RestaurantOrders.findByIdAndUpdate(orderId, orderUpdater, function(err, doc) {
                                console.log("err, doc",err1, data1);   
                                if (err) res.status(500).json(err);
                                else res.status(200).json(data1);
                            })
                        }
                })
            }
        ],()=>{
            
        })
       
    }catch(e){
       console.log(e);
    }
}

module.exports.tableRenew = function (req, res) {
    const tableId = req.body._id;
    const tableInfo = req.body;
    delete tableInfo._id;

    Table.findByIdAndUpdate(tableId, tableInfo, function(err, data) {
        if (err) res.status(500).json(err)
        else {
            RestaurantOrders.findByIdAndRemove(tableInfo.restaurantData.orderId, function(err1, data1) {
                if (err1) res.status(500).json(err1);
                else res.status(200).json(data);
            })
        }
    })
}