var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var User = mongoose.model('User');
var Restaurant = mongoose.model('Restaurant');
var Table = mongoose.model('RestaurantTable');
var MenuItems = mongoose.model('MenuItems');
var MenuCategories = mongoose.model('MenuCategories');
var ProductKeys=mongoose.model('productkey');


module.exports.add = function (req, res) {
  try{
    delete req.body.productcode;
    const Productcode = async () => {
      try {
        return await ProductKeys.findOneAndUpdate({ _id: 'prodkey' }, { $inc: { productIdSequence: 1 } }).exec();
      } catch (err) {
        return err;
      }
    };
    Productcode().then((keyData)=>{
      req.body.productcode=keyData.productIdSequence;
      var item = new MenuItems(req.body);
      item.save(function (err, result) {
       if (err) res.status(500).json(err);
       else res.status(200).json(result);
     });
    })
    
  }catch(e){
    console.log("error is occuring",e);
  }

};

module.exports.getAll = function (req, res) {
  console.log("menu-item getall function is calling");
  // console.log(req.payload);


  MenuItems.find({
    userId: req.payload._id,
    hotelCode:req.payload.hotelCode
  }, function (err, items) {
    if (err) res.status(500).json(err);
    if (items.length == 0) res.status(404).json('No items found');
    else res.status(200).json(items);
  });


}

module.exports.addCat = function (req, res) {
  console.log("@@@@@@@@@@getAllCat@@@@@@@@@");
  console.log("req.body",req.body);
  
  let menuCat = new MenuCategories(req.body);
  menuCat.save(function (err, data) {
    if (err) res.status(500).json(err);
    else res.status(200).json('Success');
  })
}

module.exports.getAllCat = function (req, res) {
  console.log("@@@@@@@@@@getAllCat@@@@@@@@@");
  console.log("userId",req.payload._id);
  console.log("hotelCode",req.payload.hotelCode);
  MenuCategories.find({
    userId: req.payload._id,
    hotelCode:req.payload.hotelCode,
  }, function (err, items) {
    if (err) res.status(500).json(err);
    if (items.length == 0) res.status(404).json('No categories found!');
    else res.status(200).json(items);
  });
}