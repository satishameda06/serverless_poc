const mongoose = require("mongoose"),
    Language = mongoose.model("language");

module.exports.getAllLanguages = async (req, res) => {
    try {
        const LanguageData = await Language.find({});
        res.json({ code: 4000, result: LanguageData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" })
    }
}
module.exports.createLanguage = async (req, res) => {
    try {
        const languageObj = new Language(req.body);
        languageObj.hotelCode = req.payload.hotelCode;
        languageObj.userId = req.payload._id;
        
        const LanguageDb = await languageObj.save(languageObj);
        if (LanguageDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateLanguage = async (req, res) => {
    try {
        if (!req.body.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const languagedata = await Language.findOne({ id: updateData.id });
        if (!languagedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        delete updateData.id;
        await Language.updateOne({ id: req.body.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteLanguage = async (req, res) => {
    try {
        if (!req.body.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const languagedata = await Language.findOne({ id: req.body.id });
        if (!languagedata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Language.deleteOne({ id: req.body.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



