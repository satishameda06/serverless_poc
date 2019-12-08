const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    moment = require('moment');
exports.changeUserPassword = function (req, res) {
  
    const founddata = req.body.user;
    if (founddata.resetPasswordToken && founddata.resetPasswordExpiresIn) {
        var start_date = moment(new Date(founddata.resetPasswordExpiresIn), 'YYYY-MM-DD HH:mm:ss');
        var date = moment().format();
        var end_date = moment(date, 'YYYY-MM-DD HH:mm:ss');
        var duration = moment.duration(end_date.diff(start_date));
        var hours = duration.asHours();
        if (hours > 1) {
            return res.json({ code: 5001, message: "Password link has been expired" })
        }
        let user = new User();
        let hash = user.setPassword(req.body.password);
        delete user._id;
        delete user.permission;
        // if(){

        // }
        User.updateOne({ _id: mongoose.Types.ObjectId(req.body.user._id) }, { $set: { hash: user.hash, salt: user.salt } }, function (err, data) {
            if (err) {
                return res.status(500).json(err);
            } else {
                res.status(200).json({ code: 5004, message: "password changed successfully" });
            }
        })
    } else if (founddata.user_type == "employee" && !founddata.firstTimeLogin) {
        let user = new User();
        let hash = user.setPassword(req.body.password);
        delete user._id;
        delete user.permission;
        User.updateOne({ _id: mongoose.Types.ObjectId(req.body.user._id) }, { $set: { hash: user.hash, salt: user.salt, firstTimeLogin: true } }, function (err, data) {
            if (err) {
                return res.status(500).json(err);
            } else {
                res.status(200).json({ code: 5004, message: "password changed successfully" });
            }
        })
    } else {
        res.json({ code: 5003, message: "Invalid details" });
    }

}
