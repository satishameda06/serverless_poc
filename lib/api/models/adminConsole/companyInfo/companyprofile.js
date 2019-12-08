const mongoose= require('mongoose');
var shortid = require('shortid');
const CompanyProfile=new mongoose.Schema({
    company_id: {
        type:String,
        unique:true
    },
    company_name:{
        type:String,
        unique:true
    },
    logo:String,
    image:String,
    address:{
        "address_line1":{type:String, required: true},
        "address_line2":String,
         country: {type:String, required: true},
         state: {type:String, required: true},
         city: {type:String, required: true},
         zipCode:{type:String, required: true}
     },
    phone:{type:String, required: true},
    fax:String,
    website_address:String,
    typeof_tax:String,
    gst_no:String,
    description:String,
    hotelCode:{type:Number,required:true},
    billing_address:{
         billing_company_name:{type:String, required: true},
         address:{
              address_line1:{type:String, required: true},
              address_line2:String,
              country: {type:String, required: true},
              state: {type:String, required: true},
              city: {type:String, required: true},
              zipCode:{type:String, required: true}
            },
            office_phone:{type:String, required: true},
            office_fax:String  
     },
    billing_contact:{
        salutation:String,
        first_name:{type:String, required: true},
        last_name:{type:String, required: true},
        designation:{type:String, required: true},
        office_phone:{type:String, required: true},
        office_fax:String,
        extn:String,
        email: {
            type: String,
            required: true,
            match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    'Please enter a valid email']
          },
          mobile: {
            type: String
          },
      
    },
    createdAt:{type:Date,default: Date.now},
    updatedAt:{type:Date}
},{ strict:false,
    usePushEach: true
});
CompanyProfile.pre('save', function (next) {
    var cmpprofile = this;
    cmpprofile.company_id = 'cmp-profile-' + shortid.generate();
    next();
  });
CompanyProfile.path('billing_contact.email').validate(function (value, respond) {
    return mongoose.model('companyprofile').countDocuments({ "billing_contact.email": value }).exec().then(function (count) {
        return !count;
      })
      .catch(function (err) {
        throw err;
      });
    }, 'Email already exists.');

CompanyProfile.index({company_name:1,company_id:1});
mongoose.model('companyprofile', CompanyProfile);
// const cmp=mongoose.model('companyprofile', CompanyProfile);
// var obj={
//     company_name:"xxx",
//     logo:"xxx",
//     image:"xxx",
//     address:{
//         "address_line1":"address1",
//         "address_line2":"address2",
//          country: "India",
//          state: "Telanagana",
//          city:"Hydearabad",
//          zipCode:"1234"
//      },
//     phone:"8099236612",
//     fax:"zzz",
//     website_address:"www.pms.com",
//     typeof_tax:"vat",
//     gst_no:"123",
//     description:"about pms is ",
//     billing_address:{
//          billing_company_name:"xxx",
//          address:{
//               address_line1:"xxxx",
//               address_line2:"yyyy",
//               country: "India",
//               state:"Telangana",
//               city:"Hyderabad",
//               zipCode:"500035"
//             },
//             office_phone:"98749",
//             office_fax:"+19947092234"  
//      },
//     billing_contact:{
//         salutation:"mr.",
//         first_name:"Satish",
//         last_name:"Ameda",
//         designation:"Software ",
//         office_phone:"+919912770867",
//         office_fax:"office_tax",
//         extn:"23",
//         email:"Satishameda06@gmail.com",
//         mobile:"8099236612" 
//     }
// };
// const cmpObj=new Cmp(obj);
// cmpObj.save((err,data)=>{
//   console.log(err,data);
// })
