var mongoose = require("mongoose");
const User = mongoose.model("User");
const Subscription = mongoose.model("subscription");
const Hotels = mongoose.model('hotel');
const _=require('lodash');

exports.getHotalList = function (req, res) {
  if (!req.payload.user_type == 'super-admin') {
    return res.status(401).json("Access Denied");
  }
  //console.log(req);
  Hotels.find({}, function (err, data) {
    if (err) res.status(500).json(err);
    else if (data.length == 0) res.status(400).json('No data found');
    else res.status(200).json(data);
  })
}

module.exports.activateHotel = function (req, res) {

  if (!req.payload.user_type == "super-admin") {
    return res.status(401).json("Access Denied");
  } else if (!req.body.hotelCode) {
    return res.status(400).json({ "message": "Required Parameter is Missing" });
  } else {
    User.findOneAndUpdate(
      { hotelCode: req.body.hotelCode },
      { isLoggedIn: true },
      function (err, data) {
        if (err) {
          return res.status(500).json({ "message": "Mongo Error" });
        }
        else return res.status(200).json({ "message": "Success" });
      });
  }

};

module.exports.deactivateHotel = function (req, res) {

  if (!req.payload.user_type == "super-admin") {
    return res.status(401).json("Access Denied");
  } else if (!req.body.hotelCode) {
    return res.status(400).json({ "message": "Required Parameter is Missing" });
  } else {
    User.findOneAndUpdate(
      { hotelCode: req.body.hotelCode },
      { isLoggedIn: false },
      function (err, data) {
        if (err) {
          return res.status(500).json({ "message": "Mongo Error" });
        }
        else return res.status(200).json({ "message": "Success" });
      });
  }

};

module.exports.sendNotify = function (req, res) {
  //console.log("hello");


  var AWS = require('aws-sdk');
  // Set the region 
  AWS.config.update({ region: 'eu-west-1' });

  // Create sendEmail params 
  var params = {
    Destination: { /* required */

      ToAddresses: [
        'bonustraveler@gmail.com',
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: "UTF-8",
          Data: "this is a text email"
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY"
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email'
      }
    },
    Source: 'info@bonuspms.awsapps.com', /* required */
    ReplyToAddresses: [
      'info@bonuspms.awsapps.com',
      /* more items */
    ],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function (data) {
      //console.log(data.MessageId);
    }).catch(
      function (err) {
        console.error(err, err.stack);
      });
  // snippet-end:[ses.JavaScript.email.sendEmail]






};

// module.exports.addSubscription = function (req, res) {
//   console.log("req.body", req.body);
//   if (!req.payload.user_type == "super-admin") {
//     return res.status(401).json("Access Denied");
//   } else if (!req.body.hotelCode || !req.body.startTime || !req.body.endTime) {
//     return res.status(400).json({ "message": "Required Parameter is Missing" });
//   } else {
//     var subscription = {
//       startTime: req.body.startTime,
//       endTime: req.body.endTime,
//       access: req.body.access
//     };
//     User.findOneAndUpdate({
//       hotelCode: req.body.hotelCode
//     }, {
//       $set: {

//         subscription: subscription
//       }
//     }, function (err, data) {
//       console.log("############", err, data);
//       if (err) {
//         return res.status(500).json({ "message": "Mongo Error" });
//       }
//       else return res.status(200).json({ "message": "Success" });
//     });
//   }

// };
module.exports.addSubscription = function (req, res) {
   if (!req.body.startTime || !req.body.endTime) {
    return res.status(400).json({ "message": "Required Parameter is Missing" });
  } 
  try{
     const saveData=req.body;
     saveData.email=req.body.email||'';
     saveData.name=req.body.name || '';
     const saveSubscriptions = new Subscription(saveData);
     saveSubscriptions.save();
     return res.status(200).json({ "message": "Success" });
  }catch(e){
    return res.status(500).json({ "message": "Something went wrong" });
  }
};
module.exports.getAllSubscriptions = async function (req, res) {
  if (!req.payload.user_type == "super-admin") {
        return res.status(401).json("Access Denied");
  }
  try {
    const subscriptionData = await Subscription.find({},{_id:0});
   if (subscriptionData.length !== 0)

      return res.status(200).json({ code: 200, subscriptionData });   
      return res.status(404).json({ code: 404, message: "subscriptions are not available" });
  } catch (e) {
    return res.status(500).json({ "message": "something went wrong" });
  }
}
module.exports.getByIdSubscriptions = async function (req, res) {
  if (!req.payload.user_type == "super-admin") {
    return res.status(401).json("Access Denied");
  }
  try {
    const subscriptionData = await Subscription.findOne({id:req.params.id});
   if (subscriptionData!=null && subscriptionData!=undefined)
      return res.status(200).json({ code: 200, subscriptionData });
    else
      return res.status(404).json({ code: 404, message: "subscription is not available" });
  } catch (e) {
    return res.status(500).json({ "message": "something went wrong" });
  }
}
module.exports.deleteSubscription= async function (req, res) {
  if (!req.payload.user_type == "super-admin") {
    return res.status(401).json("Access Denied");
  }
  if(_.isEmpty(req.body)){
    return res.status(400).json({ "message": "Required Parameter is Missing" });
   }
  if(req.body.temp){
    try{
      await Subscription.updateOne({id:req.body.id},{$set:{temp_terminate:0}});
      return res.status(200).json({ code: 200, message:'user terminated successfully' });
    }catch(e){
      return res.status(500).json({ "message": "something went wrong" });
    }
  } else{
    try{
      await Subscription.deleteOne({id:req.body.id});
      return res.status(200).json({ code: 200, message:'user deleted successfully' });
    }catch(e){
      return res.status(500).json({code: 500, "message": "something went wrong" });
    }
  }
}
module.exports.renewSubscription=async function(req,res){
  if(_.isEmpty(req.body)){
    return res.status(400).json({ "message": "Required Parameter is Missing" });
   }
   try {
     const updateData = {...req.body};
     delete updateData.id;
     console.log("update",updateData);
     console.log("id",req.body.id);
     await Subscription.updateOne({id:req.body.id},{$set:updateData},{strict:false});
     return res.status(200).json({ code: 200, message:'subscription has been updated' });
   } catch(e) {
     return res.status(500).json({code: 500, "message": "something went wrong" });
   }
}
