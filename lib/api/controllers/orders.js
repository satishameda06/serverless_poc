var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var User = mongoose.model('User');
var Restaurant = mongoose.model('Restaurant');
var Table = mongoose.model('RestaurantTable');
var RestaurantOrder = mongoose.model('RestaurantOrder');
const OrderTransaction = mongoose.model('OrderTransaction');
var async = require('async');

module.exports.add = function(req, res) {
	
 if(!req.body.amount  || !req.body.roomno || !req.body.qty){
      return res.status(400).json({"message": "All Fields Required"});
	}else{
  order = new RestaurantOrder(req.body);
  order.userid = req.payload._id;
  order.hotelCode=req.payload.hotelCode;
  order.email = req.payload.email;
  order.OrderDateTime = new Date();
  order.save(function(err, result) {
      if (err) res.json(err);
      res.json(result);
  })
}
};


module.exports.getOrders = function(req, res){
	let query={};
	if(req.query.toDate && req.query.fromDate){
		query["OrderDateTime"]={ "$gte":new Date(req.query.fromDate), "$lt":new Date(req.query.toDate) }
	}
	if(req.query.orderId){
		query["orderId"]=Number(req.query.orderId)
	}
	query.userid=req.payload._id;
	query.hotelCode=req.payload.hotelCode;
	RestaurantOrder.find(query,function(err,data){
		if(err){
			return res.status(500).json(err);
		}else{
			return res.status(200).json(data);
		}
	});

};

module.exports.getAccountStatement = function(req, res){
	let query={};
	if(req.query.date){
		query["OrderDateTime"]=new Date(req.query.date)
	}
	query.userid=req.payload._id;
	query.hotelCode=req.payload.hotelCode;
	RestaurantOrder.find({userid: req.payload._id,hotelCode:req.payload.hotelCode},function(err,data){
		if(err){
			return res.status(500).json(err);
		}else{
			return res.status(200).json(data);
		}
	});

};

module.exports.getTransactionList = function(req, res){
	//date format should be like this 2019-02-10
	try{
		let query={};
		if(req.query.toDate && req.query.fromDate){
			query["date"]={ "$gte":new Date(req.query.fromDate), "$lt":new Date(req.query.toDate) }
		}
		query.hotelCode=req.payload.hotelCode;
		console.log("@@@@@@query@@@@",query);
		OrderTransaction.find(query,function(err,data){
			if(err){
				return res.status(500).json(err);
			}else{
				return res.status(200).json(data);
			}
		});
	}catch(err){
		console.log(err);
		return res.status(500).json(err);
	}


};


module.exports.getRefundList = function(req, res){
	let query={};
	if(req.query.toDate && req.query.fromDate){
		query["date"]={ "$gte":new Date(req.query.fromDate), "$lt":new Date(req.query.toDate) }
	}
	query.hotelCode=req.payload.hotelCode;
	console.log("@@@@@@query@@@@",query);
	OrderTransaction.find(query,function(err,data){
		if(err){
			return res.status(500).json(err);
		}else{
			return res.status(200).json(data);
		}
	});

};
//get order

module.exports.getOrderById=function(req,res){
	//if you wanna first name and last name of customer,u have to post the customer id so that i will fecth customer details
   RestaurantOrder.findOne({orderId:req.params.OrderId,hotelCode:req.payload.hotelCode})
    .populate('roomId')
	.populate('tableId')
	.populate('bookingId',{"customer.firstname":1,"customer.lastname":1})
    .exec(function(err, data) {
		console.log()
        if (err) return res.status(500).json(err);
        else return res.status(200).json(data); 
    })
}
module.exports.getFolio=function(req,res){
	let query={};
	if(req.query.toDate && req.query.fromDate){
		query["date"]={ "$gte":new Date(req.query.fromDate), "$lt":new Date(req.query.toDate) }
	}
	query.hotelCode=req.payload.hotelCode;
	OrderTransaction.find(query,function(err,data){
		if(err){
			return res.status(500).json(err);
		}else{
			return res.status(200).json(data);
		}
	});
}