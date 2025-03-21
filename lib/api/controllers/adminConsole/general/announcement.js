const mongoose = require("mongoose"),
    Announcements = mongoose.model("announcement");

module.exports.getAllAnnouncements = async (req, res) => {
    try {
        const AnnouncementsData = await Announcements.find({});
        res.json({ code: 4000, result: AnnouncementsData })
    } catch (e) {
        console.log(e);
        res.json({ code: 4001, message: "something went wrong" });
    }
}
module.exports.createAnnouncement = async (req, res) => {
    try {
        const AnnouncementsObj = new Announcements(req.body);
        AnnouncementsObj.hotelCode = req.payload.hotelCode;
        AnnouncementsObj.userId = req.payload._id;
      
        const AnnouncementsDb = await AnnouncementsObj.save(AnnouncementsObj);
        if (AnnouncementsDb) {
            res.json({ code: 5000, message: "record saved" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({ code: 5001, message: "something went wrong" });
        return;
    }
}
module.exports.updateAnnouncement = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 6000, message: "all fields are required" });
            return;
        }
        const updateData = { ...req.body };
        const Announcementsdata = await Announcements.findOne({ id: req.params.id});
        if (!Announcementsdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        
        await Announcements.updateOne({ id: req.params.id }, { $set: updateData });
        res.json({ code: 6001, message: "record updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ code: 6002, message: "something went wrong" });
    }
}

module.exports.deleteAnnouncement = async (req, res) => {
    try {
        if (!req.params.id) {
            res.json({ code: 7000, message: "all fields are required" });
            return;
        }
        const Announcementsdata = await Announcements.findOne({ id: req.params.id });
        if (!Announcementsdata) {
            res.json({ code: 7001, message: "record not found" });
            return;
        }
        await Announcements.deleteOne({ id: req.params.id });
        res.json({ code: 7002, message: "record deleted successfully" })
    } catch (e) {
        console.log(e);
        res.json({ code: 7003, message: "something went wrong" });
    }
}



