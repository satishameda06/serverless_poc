var mongoose = require('mongoose');
var MenuCategories = mongoose.model('MenuCategories'); 
var MenuItems = mongoose.model('MenuItems');
var async=require('async');


module.exports.getAllProductCatList = function(req, res) {
  const queryParams = req.query;
  let query = {};
  let catQuery={};
  let itemQuery={};
  let catName=req.query.catName || null;
      if(catName){
        catName=new RegExp(catName);
        catQuery.name=catName;
        itemQuery.category=catName;
      }
      const hotelcode = parseInt(req.body.hotelCode),
        filter = queryParams.filter || '',
        sortOrder = queryParams.sortOrder,
        pageNumber = parseInt(queryParams.pageNumber) || 1,
        pageSize = parseInt(queryParams.pageSize)||0;
        if(!hotelcode){
          return res.json({code:5001,message:"all fields are required."});  
        }
        catQuery.hotelCode=hotelcode;
        itemQuery.hotelCode=hotelcode;
     query.skip = pageSize * (pageNumber - 1);
     query.limit = pageSize;
     var locals = {};
     var tasks = [
      // Load categories
      function(callback) {
    
        MenuCategories.find(catQuery,{description:0,userId:0,__v:0,id:0,userId:0},query,function(err, categories) {
              if (err) return callback(err);
              //console.log("categories",categories);
              locals.categories = categories;
              callback();
          });
      },
      // Load items
      function(callback) {
         MenuItems.find(itemQuery,{_id:0,id:0,__v:0},query,function(err, items) {
              if (err) return callback(err);
              //console.log("items",items);
              locals.items = items;
              callback();
          });
      }
  ];
   async.parallel(tasks, function(err,next) {
     //console.log(err);
      //This function gets called after the two tasks have called their "task callbacks"
      if (err) return  //If an error occurred, let express handle it by calling the `next` function
       res.send(locals)
  });
 };

   