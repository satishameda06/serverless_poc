const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/./../../.env'});
module.exports = {
  user_name: process.env.SEND_GRID_USER_NAME,
  password:  process.env.SEND_GRID_PASSWORD,
  from_email: process.env.FROM_EMAIL
};