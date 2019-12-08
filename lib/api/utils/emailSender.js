const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('../config/config');
const {user_name,password,from_email}=config;

const options = {
    service: 'SendGrid',
    auth: {
        api_user: user_name,
        api_key: password
    }
}
const client = nodemailer.createTransport(sgTransport(options));
class EmailerUtil {
    sendemail(toAddress,subject,template){
        const email = {
            from: from_email, //pmsLogic<noreply@pmsLogic.com>
            to: toAddress,
            subject: subject,
            html: template
        };
        client.sendMail(email, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Message sent: ', info);
                return;
            }
        });
    }
}
module.exports = EmailerUtil;
