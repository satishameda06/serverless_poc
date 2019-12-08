var mongoose = require('mongoose');
var Rate = mongoose.model('Rate');
var Room = mongoose.model('Room');
var User = mongoose.model('User');
var RoomCategory = mongoose.model('RoomCategory');
var Roomrate = mongoose.model('room_rates');
var shortid = require('shortid')
var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var tempRate = mongoose.model('temp_rates');
function getDateArray(start, end) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        let date = moment(new Date(dt)).format('YYYY-MM-DD');
        arr.push(date);
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}

function preparingDateWiseRate(rateName, days, roomRate, payload) {

    var startDate = new Date();
    var endDate = moment().add(parseInt(days) - 1, 'd').toDate();

    var dateArr = getDateArray(startDate, endDate);
    const globalObj = {};
    const ratesObj = {};
    globalObj.hotelCode = payload.hotelCode;
    globalObj.useruserId = payload.userId;
    globalArr = [];
    const exObj = {};
    ratesObj.roomRates = [];
    async.forEach(roomRate, (rateval, outerCallback) => {
        async.forEach(dateArr, (dateVal, call) => {
            const inrObj = {};
            inrObj.date = new Date(dateVal);
            inrObj.id = 'date-' + shortid.generate();
            inrObj.rate = rateval.rate;
            inrObj.deviations = payload.deviations;
            inrObj.updateAt = new Date();
            ratesObj.rateCategory = payload.name;
            ratesObj.roomRates.push(inrObj);
            exObj.roomCategory = rateval.roomName;
            globalArr.push(ratesObj);
            call();
        }, (done) => {
            exObj.dateWiseRates = _.uniqBy(globalArr, 'rateCategory');
            globalObj.rates = [];
            globalObj.rates.push(exObj);
            var query = {};
            query['hotelCode'] = payload.hotelCode;
            async.waterfall([
                (callback) => {
                    Roomrate.findOne(query, function (err, data) {
                        if (data == null) {
                            const RoomRateDb = new Roomrate(globalObj);
                            RoomRateDb.save((err, data) => {
                                console.log("RoomRateDb here");
                                console.log(err, data);
                                callback()
                            })
                        } else {
                            callback()
                        }

                    })
                },
                (callback) => {
                    query["rates.roomCategory"] = roomRate[0].roomName;
                    Roomrate.findOne(query, function (err, data) {
                        if (data == null) {
                            console.log("first here");
                            Roomrate.update(
                                { hotelCode: payload.hotelCode },
                                { $push: { rates: exObj } }, function (err, updated) {
                                    console.log(err, updated);
                                }
                            )
                            callback()

                        } else if (data !== null && data !== undefined && data !== '') {
                            console.log("second here", _.uniqBy(globalArr, 'rateCategory'));
                            Roomrate.update(
                                query,
                                {
                                    "$push":
                                        { "rates.$.dateWiseRates": _.uniqBy(globalArr, 'rateCategory')[0] }
                                }
                                , function (err, updatedRate) {
                                    console.log("third condition", err, updatedRate);
                                })
                            callback()
                        }
                    })
                }], (done) => {
                    console.log("new one done");
                })
        })

        outerCallback()
    }, (done) => {


    })


}
module.exports.bulkUpdateRatesWIthFilters = function (req, res) {
    const allRates = req.body.roomRates;
    const hotelCode = req.payload.hotelCode;
    let counter = 0;
    allRates.forEach(rateObj => {
        let id = rateObj.id;
        const queries = {
            "hotelCode": hotelCode,
            'rates.dateWiseRates.roomRates.id': id
        }
        const updateRate = {
            'rates.$[].dateWiseRates.$[].roomRates.$[element].rate': rateObj.rate,
            'rates.$[].dateWiseRates.$[].roomRates.$[element].updateAt': new Date()
        }
        Roomrate.updateOne(
            queries,
            { $set: updateRate },
            {
                arrayFilters: [{ 'element.id': id }]
            }, function (err, data) {
                console.log("update status-data", data);

                if (err) {
                    return res.status(500).json(err);
                } else {
                    counter += 1;
                    if (counter === allRates.length) {
                        return res.status(200).json('Success');
                    }
                }
            });
    });
}
module.exports.createRate = function (req, res) {

    User.find({ _id: mongoose.Types.ObjectId(req.body.userId), hotelCode: req.body.hotelCode }, function (err, user) {
        if (err) {
            console.log("@@@@@@@@@createRate@@@@@@@@@@", err);
            res.json(err);
        }
        if (user) {

            if (!req.body.daysWiseRate) {
                return res.status(400).json({ code: 400, message: "all fileds are required" });
            }
            const numberMonth = Number(req.body.daysWiseRate);
            var endDate = moment().add(numberMonth, 'd').toDate();
            const startdate = new Date();
            const roomRatesArr = req.body.roomRates;
            const anotherDTA = _.filter(roomRatesArr, function (user) {
                return user.rate !== null;
            });
            console.log("anotherDTA", anotherDTA);
            const inputBody = { ...req.body };
            preparingDateWiseRate(req.body.name, req.body.daysWiseRate, anotherDTA, req.body);

            var rate = new Rate(inputBody);
            rate.save(req.body, function (err, rate) {
                if (err) {
                    console.log(err);
                    res.json(err);
                    return;
                }
                res.json({
                    "message": "Rate created",
                    "property": rate
                });
            })
        }
        else {
            res.json({
                "message": "User not found"
            });
        }

    })
};
function Commented() {
    // module.exports.newGetRate=(req,res)=>{
    //    if (!req.payload._id && !req.payload.hotelCode) {
    //         res.status(401).json({
    //             "message": "UnauthorizedError: private profile"
    //         });
    //         return
    //     } 
    //     if(!req.body.selectedDate){
    //         res.json({ code:4000,
    //             "message": "Please provide date"
    //         });
    //         return
    //     }
    //     try{
    //         console.log("am in try bock",req.payload);
    //         tempRate.aggregate([ 
    //             { $sort : { date : 1 } },
    //             { 
    //                 $match : 
    //                 {
    //                    hotelCode : req.payload.hotelCode,
    //                    userId:req.payload._id  ,
    //                    'date' : 
    //                           { '$gte' : new Date(req.body.selectedDate) 
    //                         }
    //                     }
    //                 },
    //                { 
    //                    $group : 
    //                        { _id : 
    //                           {
    //                               "roomCategory":"$roomCategory",
    //                               "rateCategory":"$rateCategory"

    //                     },
    //          rates: { 
    //              $push: 
    //                   { 
    //                       rate: "$rate", 
    //                       date: "$date",
    //                       "_id":"$_id" ,
    //                       deviations:"$deviations"
    //                     } 
    //                 } 
    //             }
    //         }, {$sort: {"rates": -1}}
    //      ],function(err,data){
    //        console.log("After aggregate function",err,data);
    //        return res.json({ code: 4001, data});
    //      } )
    //     }catch(e){
    //         console.log("what is the error",e)
    //     }

    // }
    // module.exports.newGetRate = async (req, res) => {
    //     console.log("@@@@@@@@@@@@");
    //     console.log(new Date(req.body.selectedDate));
    //     console.log("##############");
    //     if (!req.payload._id && !req.payload.hotelCode) {
    //         res.status(401).json({
    //             "message": "UnauthorizedError: private profile"
    //         });
    //         return
    //     }

    //     if (!req.body.selectedDate) {
    //         res.json({
    //             code: 4000,
    //             "message": "Please provide date"
    //         });
    //         return
    //     }
    //     try {
    //         const tempDataCount = await tempRate.find({
    //             date: new Date(req.body.selectedDate),
    //             hotelCode: req.payload.hotelCode,
    //             userId: req.payload._id
    //         }).count();
    //         if (tempDataCount !== 0) {
    //             tempRate.aggregate([
    //                 { $sort: { date: 1 } },
    //                 {
    //                     $match:
    //                     {
    //                         hotelCode: req.payload.hotelCode, userId: req.payload._id,
    //                         'date': {
    //                             '$gte': new Date(req.body.selectedDate)
    //                         }

    //                     }
    //                 },

    //                 {
    //                     $group:
    //                     {
    //                         _id:
    //                         {
    //                             "rateCategory": "$rateCategory",
    //                             roomCategory: "$roomCategory"
    //                         },
    //                         rates:
    //                         {
    //                             $push:
    //                             {
    //                                 rate: "$rate",
    //                                 date: "$date",
    //                                 "_id": "$_id",
    //                                 deviations: "$deviations"
    //                             }
    //                         }
    //                     }
    //                 },
    //                 {
    //                     $group:
    //                     {
    //                         _id: { "rateCategory": "$_id.rateCategory" },
    //                         dateWiseRates: { $push: { roomCategory: "$_id.roomCategory", "roomRates": "$rates" } }
    //                     }
    //                 },
    //                 {
    //                     $project: {
    //                         dateWiseRates: 1,
    //                         rateCategory: "$_id.rateCategory",
    //                         _id: 0
    //                     }
    //                 }
    //             ], function (err, data) {
    //                 return res.json({ code: 4001, data });
    //             })
    //         } else {
    //             return res.json({ code: 4003, message: "no rates found" });
    //         }

    //     } catch (e) {
    //         return res.json({ code: 4002, message: "something went wrong" });
    //     }

    // }
}

module.exports.newGetRate = function (req, res) {
    Roomrate.findOne({ hotelCode: req.payload.hotelCode }, function (err, data) {
        if (err) {
            res.status(500).json({ code: 500, message: "something went wrong" });
            return;
        }
        if (data !== null) {
            res.status(200).json({ code: 200, data });
            return;
        }
        if (data == null) {
            res.status(404).json({ code: 404, message: "no data found" });
            return;
        }
    })
}

module.exports.listRate = function (req, res) {
    // if (!req.payload._id && !req.payload.a_userid && !req.payload.hotelCode) {
    //   res.status(401).json({
    //     "message" : "UnauthorizedError: private profile"
    //   });
    // } else {
    //   Rate
    //   .find({$or: [{userid: req.payload._id}, {userid: req.payload.a_userid},{hotelCode:req.payload.hotelCode}]})
    //   .exec(function(err, rates) {
    //     res.status(200).json(rates);
    //   });
    // }
    // if (!req.payload._id && !req.payload.a_userid) {
    //     res.status(401).json({
    //         "message": "UnauthorizedError: private profile"
    //     });
    // } else {
    //     Rate
    //         .find({ $or: [{ userid: req.payload._id }, { userid: req.payload.a_userid },{hotelCode:req.payload.hotelCode}] })
    //         .exec(function (err, rates) {
    //             console.log("@@@@@@@@@rates@@@@@@@", rates);
    //             res.status(200).json(rates);
    //         });
    // }
    if (!req.payload._id && !req.payload.hotelCode) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {

        Rate
            .find({ userId: req.payload._id, hotelCode: req.payload.hotelCode })
            .exec(function (err, rates) {

                res.status(200).json(rates);
            });
    }
};

// getRates
exports.editRates = function (req, res) {
    const allRates = req.body;
    let counter = 0;
    allRates.forEach(rate => {
        let id = rate._id;
        delete rate._id;
        Rate.update({ _id: mongoose.Types.ObjectId(id) }, rate, function (err, data) {
            if (err) {
                return res.status(500).json(err);
            } else {
                counter += 1;
                if (counter === allRates.length) {
                    return res.status(200).json('Success');
                }
            }
        })
    });
}

exports.editRatesById = function (req, res) {
    let id = rate._id;
    delete rate._id;
    Rate.update({ _id: mongoose.Types.ObjectId(id) }, rate, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json('Success');
        }
    });
};
exports.fetchPrice = function (req, res) {
    // console.log("fetchPrice is calling");
    const params = { ...req.body };
    console.log("fetchPrice is calling",params,typeof req.payload.hotelCode);
    Rate.findOne({
        "name": params.ratetype,
        "hotelCode": req.payload.hotelCode,
        "roomRates.roomName": params.category
    },
        {
            roomRates:
            {
                $elemMatch:
                {
                    roomName: params.category
                }
            },
            name: 1
        },
        function (err, data) {
            console.log("@@@@@@@@@@@@",err,data)
            if (err) {

                res.json({ code: 5000, message: "something went wrong" });
                return;
            }
            if (data) {

                const rate = data.roomRates[0].rate;
                const rate_type = data.name;

                return res.json({ code: 5001, result: { price: rate, rate_type: rate_type } });

            }
        })
}
// module.exports.bulkUpdateWithDate = function (req, res) { backup
//     var startDate = new Date(req.body.to); //YYYY-MM-DD
//     var endDate = new Date(req.body.from);
//     const dateArr = getDateArray(startDate, endDate);
//     const ratesArr=req.body.room_rates;
//     try{
//         async.forEach(ratesArr,function(cate,callback){
//             const query = {
//                 "hotelCode":req.body.hotelCode,
//                 "rates.roomCategory":cate.room_cat
//            };
//            console.log("Query",cate);
//            let counter = 0;
//            Roomrate.findOne(query, function (err, data) {
//                console.log("@@@@@@@@@@@@@@",err, data)
//                if (err) {
//                    console.log(err)
//                }
//                if (data !== null && data !== undefined) {
//                    cate.rate_cat;
//                    async.forEach(cate.rate_cat,(eachRate,call)=>{

//                     async.forEach(dateArr,(dateKey, dateVal) => {
//                         let date = new Date(dateKey);
//                         const queries = {
//                             "hotelCode": req.body.hotelCode,
//                             'rates.dateWiseRates.roomRates.date': date,
//                             'rates.dateWiseRates.rateCategory': eachRate.rate_name
//                         }
//                         Roomrate.findOne(queries,function(err,dt){
//                          if(err){

//                          } 
//                          if(dt!==null && dt!==undefined){

//                             const updateRate = {
//                                 'rates.$[].dateWiseRates.$[element].rateCategory':eachRate.rate_name,
//                                 'rates.$[].dateWiseRates.$[].roomRates.$[element].rate': eachRate.value,
//                                 'rates.$[].dateWiseRates.$[].roomRates.$[element].updateAt': new Date()
//                             }
//                             Roomrate.updateOne(
//                                 queries,
//                                 { $set: updateRate },
//                                 {
//                                     arrayFilters: [{ 'element.date': date }]
//                                 }, function (err, data) {
//                                     console.log("update status-data", data);

//                                     if (err) {
//                                         return res.status(500).json(err);
//                                     } else {
//                                         counter += 1;
//                                         if (counter === dateArr.length) {
//                                             return res.status(200).json('Success');
//                                         }
//                                     }
//                                 });
//                          } else {

//                          }
//                          dateVal()
//                         })

//                     },function(dateArrDone){
//                       console.log();
//                     })
//                     call();
//                    },(done)=>{

//                    })

//                 //    here
//                }
//            })
//           callback()
//         },(done)=>{

//         })


//     }catch(err){
//         console.log("@@@@@@@@@Query@@@@@",err);
//     }



// }
module.exports.bulkUpdateWithDate = function (req, res) {
    var startDate = new Date(req.body.to); //YYYY-MM-DD
    var endDate = new Date(req.body.from);
    const dateArr = getDateArray(endDate, startDate);
    const ratesArr = req.body.room_rates;
    try {
        let counter = 0;
        async.forEach(ratesArr, function (cate, callback) {
            async.forEach(cate.rate_cat, function (val, call) {
                async.forEach(dateArr, function (dateKey, dateCall) {
                    let date = new Date(dateKey);
                    const queries = {
                        "hotelCode": req.body.hotelCode,
                        'rates.roomCategory': cate.room_cat,
                        'rates.dateWiseRates.roomRates.date': date,
                        'rates.dateWiseRates.rateCategory': val.rate_name
                    }
                    const updateRate = {
                        'rates.$[element].roomCategory': cate.room_cat,
                        'rates.$[].dateWiseRates.$[element].rateCategory': val.rate_name,
                        'rates.$[].dateWiseRates.$[].roomRates.$[element].rate': val.value,
                        'rates.$[].dateWiseRates.$[].roomRates.$[element].updateAt': new Date()
                    }
                    Roomrate.update( 
                        {
                        "hotelCode": req.payload.hotelCode,
                        'rates.roomCategory': cate.room_cat,
                        'rates.dateWiseRates.roomRates.date': date,
                        'rates.dateWiseRates.rateCategory': val.rate_name
                          },{
                              $set:{ 
                                    'rates.$[i].dateWiseRates.$[j].roomRates.$[element].rate': val.value
                                  }
                            },
                         {
                            arrayFilters: [
                                {'i.roomCategory': cate.room_cat },
                                {'j.rateCategory': val.rate_name},
                                { 'element.date': date }
                               ]
                        }, function (err, data) {
                            console.log("update status-data", data);
                             if (err) {
                                return res.status(500).json(err);
                            } else {
                                counter += 1;
                                if (counter === dateArr.length) {
                                    console.log("htyu")
                                    return res.status(200).json('Success');
                                }
                            }
                        });
                    dateCall();
                }, (done3) => {
                    console.log("inner@@@ callabck");
                    // return res.status(200).json('Success');
                })
            }, (done1) => {
               
            })
            callback()
        }, (done2) => {
            console.log("outer callback");
        })
    } catch (err) {
        console.log("@@@@@@@@@Query@@@@@", err);
    }
}
module.exports.projectRateWithRoomCategories = async (req, res) => {
    const hotelcode = req.payload.hotelCode;
    if (hotelcode == null || hotelcode === undefined) {
        return res.json({ code: 406, message: "wrong input" });
    }
    try {
        const RatesData = await Roomrate.findOne({ hotelCode: hotelcode }, { "rates.roomCategory": 1, "rates.dateWiseRates.rateCategory": 1, _id: 0 });
        const ArrayData = [];
        if (RatesData !== null && RatesData !== undefined) {
            var obj = {};
            async.forEach(RatesData.rates, function (key, call) {
                obj['room_cat'] = key.roomCategory;
                obj['rate_cat'] = [];
                async.forEach(key.dateWiseRates, function (k, callback) {
                    obj['rate_cat'].push(k.rateCategory);
                    callback()
                })
                ArrayData.push(obj);
                obj = {};
                call()
            }, () => {
                res.status(200).json({ code: 200, data: { room_rates: ArrayData } });
                return;
            });


        } else {
            res.status(404).json({ code: 404, message: "record not found" });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
        return;
    }
}