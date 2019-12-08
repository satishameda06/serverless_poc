

var express = require('express');
var path = require('path');

var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
const helmet = require('helmet');

const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const EmailSending=require('./api/utils/emailSender');
var methodOverride = require('method-override');
global.emailSend= new EmailSending();
// [SH] Require Passport
var app = express();//initialize the app
app.use(helmet());//adding security purpose
var passport = require('passport');
// var winston = require('./config/winston');
require('dotenv').config();
// [SH] Bring in the data model
require('./api/models/db');
// [SH] Bring in the Passport config after model is defined
require('./api/config/passport');
// require('./jobs/agenda');

app.use(cors({origin: '*'})); 
// [SH] Bring in the routes for the API (delete the default routes)
var routesApi = require('./api/routes/index');
// var adminRoutes = require('./admin/routes/index.js');


app.use(compression());//Gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app
app.use(busboy());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(morgan('combined', {stream: winston.stream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboyBodyParser());
app.use(cookieParser());

// app.use(expressMiddleware());
app.use(methodOverride());
// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());
app.use(function (req, res, next) {
 console.log("what is the request is coming");
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', "*");

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
})
// [SH] Use the API routes when path starts with /api
app.use('/api', routesApi);
// app.use('/admin', adminRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("catch 404 and forward to error handler");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  console.log("Catch unauthorised errors 3");
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log("Satish Ameda-development 2");
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// function expressMiddleware(req, res, next) {
//   console.log(req);
//   if ('OPTIONS' === req.method) {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// }
if (process.env.NODE_ENV === 'production') { // [2]
    process.on('uncaughtException', function (er) {
      emailSend.sendemail('satishameda06@gmail.com',er.message,er.stack);
      process.exit(1) // [5]
    })
  }
  // production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("Satish Ameda 1");
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
