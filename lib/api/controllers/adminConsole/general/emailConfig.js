const mongoose = require("mongoose"),
    EmailConfig = mongoose.model("email_configuration"),
    _=require('lodash');
module.exports.getAllEmailConfig = async (req, res) => {
    try {
        const EmailConfigData = await EmailConfig.find({});
        res.json({ code: 4000, result: EmailConfigData });
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" });
    }
}
module.exports.createEmailConfig = async (req, res) => {
    try {
       if(_.isEmpty(req.body)){
            res.json({ code: 5002, message: "all fields are required" });
            return;  
        }
        delete req.body.retypesmtpPassword;
        const EmailConfigObj = new EmailConfig(req.body);
        EmailConfigObj.hotelCode = req.payload.hotelCode;
        EmailConfigObj.userId = req.payload._id;
        
        const EmailConfigDb = await EmailConfigObj.save(EmailConfigObj);
        if (EmailConfigDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateEmailConfig = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const emailConfigdata = await EmailConfig.findOne({ id: req.params.id });
        if (!emailConfigdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await EmailConfig.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteEmailConfig = async (req, res) => {
    try {
      
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const emailConfigdata = await EmailConfig.findOne({ id: req.params.id });
        if (!emailConfigdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await EmailConfig.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



