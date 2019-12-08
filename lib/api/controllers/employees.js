var mongoose = require('mongoose');
var Employee = mongoose.model('Employee'); 
const User = mongoose.model('User');
const AccessLevel = mongoose.model('AccessLevel');
const shortid = require('shortid'); 
var nodemailer = require('nodemailer');
var tokenSchema = mongoose.model('tokens');
var crypto = require('crypto');

//Employee CRUD
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
       user: "satishameda06@gmail.com", // generated ethereal user
       pass: "8500152933"  // generated ethereal password
   }
});
//  
module.exports.createEmployee = async function(req, res) {
  try{
    req.body.user_type="employee";
    const permissions = {
        "frontdesk" : false,
        "houseKeeping" : false,
        "restaurant" : false,
        "nightAudit" : false,
        "adminConsole" : false,
        "reports":false,
    };
    const access = await AccessLevel.findOne({title:req.body.role},{accesstype:1});
    if(access.accesstype.length>0){
      access.accesstype.forEach((k)=>{
        if(permissions.hasOwnProperty(k)){
          permissions[k]=true;
        }
      })
    }
    const emailCheck = await User.findOne({email:req.body.email},{email:1});
    if(emailCheck){
      return res.send({code:2004,message:"Email already exists"})
    }
    req.body.permissions = permissions;
    const tokenDb = new tokenSchema({ _userId: req.payload._id,hotelCode:req.payload.hotelCode, token: crypto.randomBytes(16).toString('hex') });
    const tonekDbSave = await tokenDb.save();
    const emp = new User(req.body);
    emp.empId = 'emp' + shortid.generate();
    emp.hotelCreatedBy=req.payload.hotelCode;
    emp.setPassword(req.body.password);
    emp.a_userid = req.payload._id;
    emp.hotelCode=req.payload.hotelCode;
    emp.hotelCreatedBy=req.payload.hotelCode;
    emp.token=tonekDbSave.token;
    const mailOptions = { from: 'joyisjoy71@gmail.com', to: req.body.email, 
    subject: 'Account Verification Token', 
    html: '<p>Hello,</br>\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/account/verify\/' +'?token='+
    tonekDbSave.token +'&email='+ req.body.email +'\n </p>' };
    Promise.all[emp.save(emp),
      transporter.sendMail(mailOptions)]
      return res.json({code:2002,message:'Added employee'});
   } catch(err) {
    console.log("what is the error is coming",err);
    return res.json({code:2003,message:'Something went wrong'});
  }
};

module.exports.getAllEmployees = function(req, res) {
    User.find({a_userid: req.payload._id,user_type:"admin"}, function(err, data){
      if(err) return res.status(500).json(err);
      else res.status(200).json(data);
    })
};
module.exports.employeesList =  function (req, res) {
  const queryParams = req.query;
  let query = {};
  let response;
  const hotelcode = queryParams.hotelcode,
        filter = queryParams.filter || '',
        sortOrder = queryParams.sortOrder,
        pageNumber = parseInt(queryParams.pageNumber) || 0,
        pageSize = parseInt(queryParams.pageSize);
        if(!hotelcode){
          return res.json({code:5001,message:"all fields are required."});
        }
        if(pageSize < 0 || pageNumber === 0) {
          response = {code:9000,"message" : "invalid page number, should start with 1"};
          return res.json(response);
       }
     query.skip = pageSize * (pageNumber - 1);
     query.limit = pageSize;
     console.log("what is the hotelcode",hotelcode);
     User.find({hotelCreatedBy:parseInt(hotelcode)},{email:1,user_type:1,permissions:1,name:1},query,(err,data)=>{
      if(err) {
        response = {code:9001,"message" : "Error fetching data"};
    } else {
      console.log("what kind of data is coming from users collections",data);
      let empListArr=[];
      if(data.length>0){
        data.forEach((k,v)=>{
          var mainObj =  JSON.parse(JSON.stringify(k));
          var obj = JSON.parse(JSON.stringify(k.permissions));
          var keys = Object.keys(obj);
          var filtered = keys.filter(function(key) {
             return obj[key];
            });
            console.log("@@@@filtered@@@@@@@@",filtered);
            mainObj.filter=filtered;
           if(mainObj.filter.length===0 && mainObj.user_type=="employee"){
              mainObj.filterString ="No permissions";
            } else if(mainObj.filter.length===0 && mainObj.user_type=="admin"){
              mainObj.filterString ="No permissions required";
            } else{
               mainObj.filterString=filtered.toString();
            }
            console.log("@@@@#########filtered@####@@@@@@@@");
            empListArr.push(mainObj);
          })
          response = {code:9002,"data" : empListArr};
         }
        
    }
    console.log("@@@@response@@@@@@@@",response);
    res.json(response);
 })
};

module.exports.getAllAdmin = function(req, res) {
    User.find({a_userid: null}, function(err, data){
      if(err) return res.status(500).json(err);
      else   return res.status(200).json(data);
    })
};

module.exports.updateEmployees = function(req, res) {
    // //console.log("finding user...");
    User
    .find({a_userid: req.payload._id,hotelCreatedBy:req.payload.hotelCode})
    .exec(function(err, users) {
      res.status(200).json(users);
    });
};

module.exports.deleteEmployees =async function(req, res) {
    try{
      if(!req.body.email) {
        return res.send({code:4001,message:"all fields are required"});
      }
      const checkEmail= await User.findOne({email:req.body.email},{email:1});
      
      if(!checkEmail){
        return res.send({code:4002,message:"employee not found"});
      }
      await User.deleteOne({email:req.body.email});
     
    }catch(err){
      return res.send({code:4003,message:"something went wrong"});
    }
   
};