var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});


var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

//Rooms Management
var ctrlRooms = require('../controllers/adminConsole/roomsManager/rooms');
var ctrlRoomCategories = require('../controllers/adminConsole/roomsManager/room-categories');
var ctrlAmen = require('../controllers/adminConsole/roomsManager/amenities');
var ctrlfloors=require('../controllers/adminConsole/roomsManager/floors');//satish Aameda
var ctrlblocks=require('../controllers/adminConsole/roomsManager/blocks');//satish Aameda
var ctrlRoomTaxList=require('../controllers/adminConsole/roomsManager/roomTaxList');//satish Aameda
var ctrlAccountCode=require('../controllers/adminConsole/roomsManager/accountCode');//satish Aameda

//User Management
var ctrlUserType = require('../controllers/adminConsole/userManager/usertype');
var ctrlAccessLevel  = require('../controllers/adminConsole/userManager/accesslevel');

var ctrlActivityLog = require('../controllers/adminConsole/userManager/activitylog');

var ctrlBookings = require('../controllers/bookings');
var ctrlEmployees = require('../controllers/employees');
var ctrlProperties = require('../controllers/properties');
var ctrlRates = require('../controllers/rates');
var ctrlRestaurant = require('../controllers/restaurant');
var ctrlTable = require('../controllers/tables');
var ctrlMenuItems = require('../controllers/menuitems');
var ctrlOrders = require('../controllers/orders');
var ctrlFiles = require('../controllers/s3');
var ctrlUpload = require('../controllers/uploads');
var ctrlReports = require('../controllers/reports');

var ctrlProductCategory = require('../controllers/productcategory');
var ctrlProduct = require('../controllers/product');
var ctrlSuperAdmin = require('../controllers/superadmin.js');
var ctrlProductCatList=require('../controllers/productCatList');//satish Aameda
var ctrlAddCompany=require('../controllers/adminConsole/companyInfo/companyprofile');
var ctrlDepartment=require('../controllers/adminConsole/userManager/department'); 
// var ctrlFileUploader=require('../controllers/fileUpload');
var ctrlRegister=require('../controllers/authentication/register');
var ctrlChangePassword = require('../controllers/authentication/changePassword');
var emailVerfy=require('../controllers/authentication/accountVerify');//satish Ameda
var ctrlForgotpassword=require('../controllers/authentication/forgotPassword');//satish Ameda
var ctrlLogin=require('../controllers/authentication/login');
//gerenaral
// * Currencies
var ctrlCurrencies=require('../controllers/adminConsole/general/currencies');
// * Languages
var ctrlLanguages=require('../controllers/adminConsole/general/languages');
// * ReasonForCancellation
var ctrlReasonForCancellation=require('../controllers/adminConsole/general/reasonForCancellation');
// * ReasonForCancellation
var ctrlReasonTaxExempt=require('../controllers/adminConsole/general/reasonTaxExempt');
//* Announcememnt
var ctrlAnnouncement =require('../controllers/adminConsole/general/announcement');
//* Paymode
var ctrlPaymode =require('../controllers/adminConsole/general/paymode');
//* Paytype
var ctrlPaytype =require('../controllers/adminConsole/general/paytype');
//defaultSettings
var ctrlDefaultSetting=require('../controllers/adminConsole/general/defaultSettings');
//Invoice number
var ctrlInvoiceNumber=require('../controllers/adminConsole/general/invoiceNumberSettings');
//Identificationtype
var ctrlIdentificationtype=require('../controllers/adminConsole/general/identificationtype'); 

//sourcebusinesses
var ctrlSourcebusinesses=require('../controllers/adminConsole/general/sourcebusinesses'); 
//modeofArrivalDeparture
var ctrlModeofArrivalDep=require('../controllers/adminConsole/general/modeofarrival'); 
//emailConfiguration
var ctrlEmailConfiguration=require('../controllers/adminConsole/general/emailConfig');
//Market Segment
var ctrlMarketSegment=require('../controllers/adminConsole/general/marketSegment');
//Room Inventory
var ctrlRoomInventory=require('../controllers/room_inventory');

var ctrlSuperAdminLogin=require('../controllers/authentication/superAdminLogin');

//restaurant

var ctrlRestuarantReservation=require('../controllers/restaurantReservation/restuarant_reservation');

var ctrlGenOpeningHours=require('../controllers/restaurantReservation/genOpeningHours');

var ctrlBookingSettings=require('../controllers/restaurantReservation/bookingSettings');

var multer  = require('multer'),
    multerS3 = require('multer-s3');
var aws = require('aws-sdk');

aws.config.loadFromPath('./s3.config.json');
var s3 = new aws.S3();


var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'pms-bucket',
      key: function (req, file, cb) {
          // console.log(file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
});




//
router.post('/addproductcategory', ctrlProductCategory.addProductCategory);
router.get('/getproductcategory', ctrlProductCategory.getProductCategory);
router.post('/addproduct', ctrlProduct.addProduct);
router.get('/getproduct', ctrlProduct.getProduct);


// User Type
router.post('/addusertype', auth, ctrlUserType.addusertype);
router.get('/listusertype', auth, ctrlUserType.listusertype);
router.post('/changeUserTypeStatus',auth,  ctrlUserType.changeUserTypeStatus);
router.post('/deleteUserType', auth, ctrlUserType.deleteUserType);

// Access Level
router.post('/adduseraccesss',auth, ctrlAccessLevel.addUserAccess);
router.get('/listuseraccesss', auth, ctrlAccessLevel.listuseraccesss);

router.post('/updateuseraccesss',auth,  ctrlAccessLevel.updateuseraccesss);
router.post('/deleteuseraccesss', auth, ctrlAccessLevel.deleteuseraccesss);
router.post('/get/defualt/view', auth, ctrlAccessLevel.getDefaultView);

//Activity Log
router.post('/addActivityLog', auth, ctrlActivityLog.addActivityLog);
router.get('/listActivityLog', auth, ctrlActivityLog.listActivityLog);
router.post('/updateLogoutLog',ctrlActivityLog.updateLogoutTime);


// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/emailcheck', ctrlAuth.checkIfEmailExists);
router.post('/forgotpassword',ctrlForgotpassword.forgotpassword);
router.post('/pswdreset', ctrlChangePassword.changeUserPassword);


// bookings
router.get('/availability', auth, ctrlRooms.available);
router.post('/booking/addv2', ctrlBookings.addRoomBooking);
router.post('/booking/update', ctrlBookings.updateBooking);
router.post('/booking/changeroom', ctrlBookings.changeRoom);
router.post('/booking/cancelv2', ctrlBookings.cancelBookingv2);
router.get('/booking/get', auth, ctrlBookings.getBookings);
router.post('/booking/checkin', ctrlBookings.changeBookingStatus);
router.get('/booking/today', auth, ctrlBookings.getDayBookings);
router.post('/booking/addfolio', auth, ctrlBookings.addToFolio);
router.post('/booking/todaycheckouts', ctrlBookings.getTodayCheckouts);
router.post('/booking/todaycheckins', ctrlBookings.getTodayCheckins);
router.get('/booking/stats', auth, ctrlBookings.getRoomStats);
router.post('/booking/noshow', auth, ctrlBookings.noShowBooking);

// room category
router.post('/room-categories/create',auth, ctrlRoomCategories.create);
router.get('/room-categories/read', auth, ctrlRoomCategories.read);
router.post('/room-categories/delete',auth, ctrlRoomCategories.deleteRoomCategory);

router.post('/room-categories/cateblock',auth,ctrlRoomCategories.RoomCatBlocked)
router.post('/test/api', ctrlRooms.test);

//report done
router.get('/report/availability', auth, ctrlRooms.available);
router.get('/report/housekeeping', auth, ctrlReports.houseKeepingReport);
router.get('/report/getcashiereport', auth, ctrlReports.listRestaurant);
router.get('/report/getall', auth, ctrlReports.getAll);
router.get('/report/trialbalance', auth, ctrlReports.getAll);
router.get('/report/summary', auth, ctrlReports.getSummary);

// Revenue Report Section
router.get('/report/paymenttypes', auth, ctrlReports.getPaymetTypes);
router.post('/report/cashierrevenue', auth, ctrlReports.getCashierRevenue);
router.post('/report/monthlycreditcard', auth, ctrlReports.getMonthlyCreditCardReport);
router.post('/report/dailycreditcard', auth, ctrlReports.getDailyCreditReport);
router.post('/report/cashierrevenuebetweenfromandto', auth, ctrlReports.getCashierRevenueBetweenFromTo);

//Reservation Report Section
router.post('/report/housekeepingbydate', auth, ctrlReports.houseKeepingReportByDate);
router.post('/report/reservationsummaryreport', auth, ctrlReports.getReservationReport);
router.post('/report/tempreservesummaryreport', auth, ctrlReports.getTempReservationReport);

// Guest Report
router.post('/report/arrivalbycheckincheckout', auth, ctrlReports.getArrivalByCheckInCheckOut);
router.post('/report/departurebycheckincheckout', auth, ctrlReports.getDepartureByCheckInCheckOut);
router.post('/report/guesttrialbalancebydate', auth, ctrlReports.getTrialBalanceByDate);

// Availibility Report
router.post('/report/availibilityreport', auth, ctrlReports.getAvailibilityReport);

// we will add a payment types by defaults and on new booking types we will also add payment types and counter

//3-11-18
//revenue-report-section
router.post('/report/revenuegetcashier', auth, ctrlReports.revenueGetCashierReport);
router.post('/report/revenuegetcashier2', auth, ctrlReports.revenueGetCashierReport2);
router.post('/report/paytypereport', auth, ctrlReports.payTypeReport);
router.post('/report/counterrevenuecollection', auth, ctrlReports.getRevenueCollection);

// Finance Report Section
router.post('/report/financemonthsummaryreport', auth, ctrlReports.getMonthlyFinanceReport);
router.post('/report/revperroomreport', auth, ctrlReports.getRevPerReport);
router.post('/report/financereport', auth, ctrlReports.getFinanceReport);
router.post('/report/depositreport', auth, ctrlReports.getAdvDailyDepositReport);
router.post('/report/getBookingDetails', auth, ctrlReports.getBookingDetails);
router.post('/report/dailyrevenuereport', auth, ctrlReports.getDailyRevenueReport);


// report in-development
router.get('/report/arrivallist', auth, ctrlReports.getArivalList);
router.get('/report/departurelist', auth, ctrlReports.getDepartureList);
router.get('/report/tempreservesummary', auth, ctrlReports.tempReserveSummary);
router.get('/report/reservereservesummary', auth, ctrlReports.getReserveReservation);
router.get('/report/checkinreservesummary', auth, ctrlReports.getChenibReservation);
router.get('/report/monthlyreservationsummary', auth, ctrlReports.getMonthlyReserveSummary);
router.get('/report/getdayreservationsummary', auth, ctrlReports.getDayReserveSummary);
router.get('/report/reservationsummary', auth, ctrlReports.getAll);

// report based on userinput
router.post('/report/betweenfromto', auth, ctrlReports.betweenReport);
//from and to in timestamp
router.post('/report/getGuestReport', auth,  ctrlReports.getGuestReport);
router.post('/report/gettaxreport', auth, ctrlReports.getTaxReport);
router.post('/report/getSourceReport', auth, ctrlReports.getSourceReport);
router.post('/report/getfinanacialreport', auth, ctrlReports.getFinanceReport);
router.post('/report/getadvancedailydepositreport', auth, ctrlReports.getAdvDailyDepositReport);
router.post('/report/getdirectbillingreport', auth, ctrlReports.getDirectBillingReport);
router.post('/report/getfundoperation', auth, ctrlReports.getFundOperation);
router.post('/report/getmothlycreditcardreport', auth, ctrlReports.getMothlyCCReport);
router.post('/report/getdailycreditcardreport', auth, ctrlReports.getDailyCCReport);
router.post('/report/getgroupstayreport', auth, ctrlReports.getGroupStayReport);
router.post('/report/getnightaudits', auth, ctrlReports.getNightAudits);
router.post('/report/roombetweenfromtodate', auth, ctrlReports.getAllRoomsByFromTo);

// Source e.g social,ads, promotion,Credit -card and
/*The six basic steps involved in preparing a night audit are:

Posting room and tax charges
Assembling guest charges and payments
Reconciling departmental financial activities
Reconciling the accounts receivable
Running the trial balance
Preparing the night audit report*/



// admin
router.get('/rooms/list', auth, ctrlRooms.getAllRooms);
router.get('/rooms/:date', auth, ctrlRooms.getAllRoomsByDate);
router.post('/property/add', ctrlProfile.addProperty);
router.post('/rate/add', ctrlProfile.addRate);
router.post('/room/confirmrestorder', auth, ctrlRooms.confirmRoomRestaurantOrder);
router.post('/room/orderprepared', auth, ctrlRooms.roomRestaurantOrderPrepared);
router.post('/room/orderpay', auth, ctrlRooms.roomRestaurantOrderPay);
router.post('/room/renew', auth, ctrlRooms.roomRenew);
router.post('/room/delete',auth,ctrlRooms.delete);

router.post('/property/rooms', ctrlRooms.showRooms);
router.post('/rooms/add', ctrlRooms.addRoomSingle);
// router.post('/rooms/addsingle', ctrlRooms.addRoom);
// router.post('/rooms/add/single', ctrlRooms.addSingleRoom);
router.post('/room/update', ctrlRooms.updateRm);
router.post('/room/updateall', ctrlRooms.updateMultipleRooms);
router.get('/rooms/cat/count',auth, ctrlRooms.getAllRoomsByCat);

// Super-Admin
router.post('/super-admin/login', ctrlSuperAdminLogin.login);
router.get('/super-admin/hotellist', auth, ctrlSuperAdmin.getHotalList);
router.post('/super-admin/activatehotel', auth, ctrlSuperAdmin.activateHotel);
router.post('/super-admin/deactivatehotel', auth, ctrlSuperAdmin.deactivateHotel);
//Super-Admin subcription
router.post('/super-admin/sendnotify', auth, ctrlSuperAdmin.sendNotify);
router.post('/super-admin/addsubscription', ctrlSuperAdmin.addSubscription);
router.post('/super-admin/renewalsubscription', auth, ctrlSuperAdmin.renewSubscription);
router.get('/super-admin/getallsubscription',auth,ctrlSuperAdmin.getAllSubscriptions);
router.get('/super-admin/getsubscription/:id',auth,ctrlSuperAdmin.getByIdSubscriptions);
router.post('/super-admin/removesubscription',auth,ctrlSuperAdmin.deleteSubscription);

// authentication
router.post('/account/register', ctrlRegister.register);
router.post('/account/registersuperadmin', ctrlRegister.registersuperadmin);

router.get('/account/verify',emailVerfy.confirmationPost);
router.post('/login', ctrlLogin.login);
router.post('/account/otpConfirmation',ctrlLogin.otpConfirmation);
router.post('/account/login', ctrlLogin.login);
router.post('/account/logout', ctrlAuth.logout);
router.post('/user/updateproperty', ctrlAuth.updateProperty);
router.post('/user/addcancelreason',auth, ctrlAuth.addCancellationReason);
router.get('/user/getinfo', auth, ctrlAuth.getUserInfo);
router.get('/user/cancelreasons', auth, ctrlAuth.getCancellationReasons);


// employees CRUD
router.post('/emp/add', auth, ctrlEmployees.createEmployee);
router.get('/emp/all', auth, ctrlEmployees.getAllEmployees);
router.get('/admin/all', auth, ctrlEmployees.getAllAdmin);
router.post('/employees/update',auth, ctrlEmployees.updateEmployees);
router.post('/employees/delete',auth, ctrlEmployees.deleteEmployees);

// employees List with paging 
router.get('/employees/list', ctrlEmployees.employeesList);


// property CRUD
router.get('/properties/read', auth, ctrlProperties.readProperties);
router.post('/properties/create', ctrlProperties.createProperties);

// amenities
router.get('/amenity/list', auth, ctrlAmen.list);
router.post('/amenity/add', auth,ctrlAmen.add);
router.post('/amenity/delete',auth, ctrlAmen.delete);
router.post('/amenity/update',auth,ctrlAmen.update);

// rates CRUD
router.post('/rates/create', ctrlRates.createRate);
router.get('/rates/list', auth, ctrlRates.listRate);
router.post('/rates/edit', ctrlRates.editRates);
router.post('/rates/editbyid', ctrlRates.editRatesById);
// router.post('/rates/with/dates',auth,ctrlRates.updateRatesWithDateWise);

// restaurant CRUD
router.post('/restaurant/add', ctrlRestaurant.addRestaurant);
router.post('/restaurant/list', ctrlRestaurant.listRestaurant);
router.get('/restaurant/orders', auth, ctrlRestaurant.getAllOrders);


// table 
router.post('/table/add', ctrlTable.add);
router.post('/table/book', ctrlTable.bookTable);
router.post('/table/unbook', auth, ctrlTable.unBookTablev2);
router.post('/table/antibook', ctrlTable.unBookTable);
router.get('/table/getall', auth, ctrlTable.getAll);
router.post('/table/update', auth, ctrlTable.updateTable);
router.post('/table/confirmrestorder', auth, ctrlTable.confirmTableRestaurantOrder);
router.post('/table/orderprepared', auth, ctrlTable.tableRestaurantOrderPrepared);
router.post('/table/orderpay', auth, ctrlTable.tableRestaurantOrderPay);
router.post('/table/renew', auth, ctrlTable.tableRenew);

//menuitems
router.post('/menu-cat/add', ctrlMenuItems.addCat);
router.post('/menu-item/add', ctrlMenuItems.add);
router.get('/menu-item/getall', auth, ctrlMenuItems.getAll);
router.get('/menu-cat/getall', auth, ctrlMenuItems.getAllCat);

// restaurant order
router.post('/order/generate', auth, ctrlRestaurant.generateOrderAndBook);
router.post('/order/add',  auth, ctrlOrders.add);
router.get('/orderslist',   auth, ctrlOrders.getOrders);
router.get('/getaccountstamement',   auth, ctrlOrders.getAccountStatement);
// router.get('/gettransactionlist',   auth, ctrlOrders.getTransactionList);
router.get('/gettransactionlist',auth, ctrlOrders.getTransactionList);
router.get('/getrefundlist',   auth, ctrlOrders.getRefundList);
router.post('/room/restbook', auth, ctrlRestaurant.bookRoomRestaurant);
router.post('/restaurant/order/create', auth, ctrlRestaurant.prepareRestaurantOrder);
router.post('/restaurant/order/pay', auth, ctrlRestaurant.payRestaurantOrder);
router.post('/restaurant/order/refund', auth, ctrlRestaurant.refundRestaurantOrder);
router.post('/restaurant/order/cancel/:orderId', auth, ctrlRestaurant.restaurantOrderCancel);
router.post('/restaurant/order/update/:orderId', ctrlRestaurant.restaurantOrderUpdate);
router.post('/restaurant/order/status', auth, ctrlRestaurant.restaurantOrderStatusChange);

router.get('/restaurant/order/:OrderId',auth,ctrlOrders.getOrderById);
// Guest Lookup
router.post('/lookup/guest', auth, ctrlAuth.guestLookup);
router.post('/lookup/alllookup', auth, ctrlReports.alllookup);

// s3 apis
//use by upload form
// router.post('/upload', upload.array('upl',1), function (req, res, next) {
//   res.send("Uploaded!");
// });
router.get('/s3/list', auth, ctrlFiles.listBuckets);
// router.post('/s3/delete-bucket', ctrlFiles.deleteBucket);
// router.post('/s3/create-bucket', ctrlFiles.createBucket);
// router.get('/s3/:bucketName/get-objects', ctrlFiles.getObjects);
router.post('/upload', ctrlUpload.getURL);

router.get('/auth/nightaudit', auth, ctrlAuth.nightAudit);
router.post('/user/updbsnsdte', ctrlAuth.proceedBusinessDate);

router.post('/reports/noshow', auth, ctrlReports.noShowReport);

//Satish Ameda
//ProductsListCategories
router.post('/productCatList', ctrlProductCatList.getAllProductCatList);

//Satish Ameda
//floors 
router.get('/floors/getAllFloors',auth, auth,ctrlfloors.getAllFloor);
router.post('/floors/create',auth, ctrlfloors.createFloor);
router.post('/floors/update',auth, ctrlfloors.updateFloor);
router.post('/floors/delete',auth, ctrlfloors.deleteFloor);

//Satish Ameda
//blocks 
router.get('/blocks/getAllblocks', auth,ctrlblocks.getAllBlocks);
router.post('/blocks/create',auth, ctrlblocks.createBlocks);
router.post('/blocks/update',auth, ctrlblocks.updateBlocks);
router.post('/blocks/delete',auth, ctrlblocks.deleteBlocks);
router.get('/blocks/search',auth, ctrlblocks.searchWithPaging);

//Satish Ameda
//RoomTaxList 
router.get('/room/taxlist/getall', auth, ctrlRoomTaxList.getAllRoomTaxList);
router.post('/room/taxlist/create',auth, ctrlRoomTaxList.createRoomTaxList);
router.post('/room/taxlist/update',auth, ctrlRoomTaxList.updateRoomTaxList);
router.post('/room/taxlist/delete',auth, ctrlRoomTaxList.deleteRoomTaxList);
router.get('/room/taxlist/search',auth, ctrlRoomTaxList.roomTaxListPaging);

//Satish Ameda
//Account-code
router.get('/accountcode/getall', auth, ctrlAccountCode.getAllAccountCode);
router.post('/accountcode/create',auth, ctrlAccountCode.createAccountCode);

router.post('/companyProfile/create',auth, ctrlAddCompany.addCompanyProfile);

//department for user management

router.post('/department/getAll',auth, ctrlDepartment.getAllDepartments);
router.post('/department/create',auth, ctrlDepartment.addDepartment);
router.get('/department/search',auth, ctrlDepartment.searchWithPaging);
router.post('/department/update',auth, ctrlDepartment.updateDepartment);
router.post('/department/delete',auth, ctrlDepartment.deleteDepartment);

//general
//Currencies
router.get('/currency/getAll',auth,ctrlCurrencies.getAllCurrencies);
router.post('/currency/create',auth,ctrlCurrencies.createCurrency);
router.post('/currency/update/:id',auth,ctrlCurrencies.updateCurrency);
router.post('/currency/delete/:id',auth,ctrlCurrencies.deleteCurrency);


//languages
router.get('/language/getAll',auth,ctrlLanguages.getAllLanguages);
router.post('/language/create',auth,ctrlLanguages.createLanguage);
router.post('/language/update/:id',auth,ctrlLanguages.updateLanguage);
router.post('/language/delete/:id',auth,ctrlLanguages.deleteLanguage);

//ReasonForCancellation ctrlReasonForCancellation

router.get('/canacel/reason/getAll',auth,ctrlReasonForCancellation.getAllReasons);
router.post('/canacel/reason/create',auth,ctrlReasonForCancellation.createReason);
router.post('/canacel/reason/update/:id',auth,ctrlReasonForCancellation.updateReason);
router.post('/canacel/reason/delete/:id',auth,ctrlReasonForCancellation.deleteReason);
//ctrlReasonTaxExempt

router.get('/tax/reason/getAll',auth,ctrlReasonTaxExempt.getAllReasonsTaxExempts);
router.post('/tax/reason/create',auth,ctrlReasonTaxExempt.createReasonsTaxExempt);
router.post('/tax/reason/update/:id',auth,ctrlReasonTaxExempt.updateReasonsTaxExempt);
router.post('/tax/reason/delete/:id',auth,ctrlReasonTaxExempt.deleteReasonsTaxExempt);

//ctrlAnnouncement
router.get('/announcement/getAll',auth,ctrlAnnouncement.getAllAnnouncements);
router.post('/announcement/create',auth,ctrlAnnouncement.createAnnouncement);
router.post('/announcement/update/:id',auth,ctrlAnnouncement.updateAnnouncement);
router.post('/announcement/delete/:id',auth,ctrlAnnouncement.deleteAnnouncement);

//ctrlPaymode
router.get('/paymode/getAll',auth,ctrlPaymode.getAllPaymode);
router.post('/paymode/create',auth,ctrlPaymode.createPaymode);
router.post('/paymode/update/:id',auth,ctrlPaymode.updatePaymode);
router.post('/paymode/delete/:id',auth,ctrlPaymode.deletePaymode);

//ctrlPaytype
router.get('/paytype/getAll',auth,ctrlPaytype.getAllPaytype);
router.post('/paytype/create',auth,ctrlPaytype.createPaytype);
router.post('/paytype/update/:id',auth,ctrlPaytype.updatePaytype);
router.post('/paytype/delete/:id',auth,ctrlPaytype.deletePaytype);
//defaultSettings
router.post('/defaultsettings/:id',auth,ctrlDefaultSetting.updateDefaultSettings);
router.get('/defaultsettings/getAll',auth,ctrlDefaultSetting.getDefaultSettings);
//fetchPRice
router.post('/fetchPrice',auth,ctrlRates.fetchPrice);
// router.post('/getrates',auth,ctrlRates.getRates);
router.post('/getrates',auth,ctrlRates.newGetRate);
router.post('/rates/bulkupdate',auth,ctrlRates.bulkUpdateRatesWIthFilters);
router.post('/rates/category/wise/update',auth,ctrlRates.bulkUpdateWithDate);
router.get('/room/wise/getrates',auth,ctrlRates.projectRateWithRoomCategories);
//Invoicenumber fro frontDesk
//Room_Inventory
router.post('/room/inventory/update',auth,ctrlRoomInventory.UpdateRoomInvetory);
router.get('/frontdesk/invoiceNumber/getAll',auth,ctrlInvoiceNumber.getInvoice); 
router.post('/frontdesk/invoiceNumber/update/:type',auth,ctrlInvoiceNumber.editInvoiceSerialNumber); 

//Identifiactiontype 
router.get('/identificationtype/getAll',auth,ctrlIdentificationtype.getAllidentificationtype);
router.post('/identificationtype/create',auth,ctrlIdentificationtype.createidentificationtype);
router.post('/identificationtype/update/:id',auth,ctrlIdentificationtype.updateidentificationtype);
router.post('/identificationtype/delete/:id',auth,ctrlIdentificationtype.deleteidentificationtype);

//ctrlSourcebusinesses 
router.get('/sourcebusinesses/getAll',auth,ctrlSourcebusinesses.getAllsourcebusinesses);
router.post('/sourcebusinesses/create',auth,ctrlSourcebusinesses.createsourcebusinesses);
router.post('/sourcebusinesses/update/:id',auth,ctrlSourcebusinesses.updatesourcebusinesses);
router.post('/sourcebusinesses/delete/:id',auth,ctrlSourcebusinesses.deletesourcebusinesses);
//ctrlModeofArrivalDep
router.get('/modeofarrivaldeparture/getAll',auth,ctrlModeofArrivalDep.getAllModeOfArrDep);
router.post('/modeofarrivaldeparture/create',auth,ctrlModeofArrivalDep.createModeOfArrDep);
router.post('/modeofarrivaldeparture/update/:id',auth,ctrlModeofArrivalDep.updateModeOfArrDep);
router.post('/modeofarrivaldeparture/delete/:id',auth,ctrlModeofArrivalDep.deleteModeOfArrDep);
//ctrlEmailConfiguration

router.get('/emailConfig/getAll',auth,ctrlEmailConfiguration.getAllEmailConfig);
router.post('/emailConfig/create',auth,ctrlEmailConfiguration.createEmailConfig);
router.post('/emailConfig/update/:id',auth,ctrlEmailConfiguration.updateEmailConfig);
router.post('/emailConfig/delete/:id',auth,ctrlEmailConfiguration.deleteEmailConfig);
//ctrlMarketSegment
router.get('/marketSegment/getAll',auth,ctrlMarketSegment.getAllMarketSegment);
router.post('/marketSegment/create',auth,ctrlMarketSegment.createMarketSegment);
router.post('/marketSegment/update/:id',auth,ctrlMarketSegment.updateMarketSegment);
router.post('/marketSegment/delete/:id',auth,ctrlMarketSegment.deleteMarketSegment);

//restuarent
router.post('/create/table/group',auth,ctrlRestuarantReservation.createGroup);
router.post('/create/bulk/tables',auth,ctrlRestuarantReservation.createTables);


router.get('/restaurant/getAll/tables',auth,ctrlRestuarantReservation.getAll);

router.post('/create/tablereservation',auth,ctrlRestuarantReservation.createEvent);
router.get('/get/tablereservation',auth,ctrlRestuarantReservation.getEvents);
router.post('/update/tablereservation',auth,ctrlRestuarantReservation.updateEvents);
router.post('/move/tablereservation',auth,ctrlRestuarantReservation.updateEvents);
router.post('/delete/tablereservation',auth,ctrlRestuarantReservation.deletEvent);

//GeneralHoursOpeing
router.post('/update/generalopeninghours',auth,ctrlGenOpeningHours.createGeneralOpeningHrsOrUpdate);
router.get('/get/generalopeninghours',auth,ctrlGenOpeningHours.getGeneralOpeningHrs);
router.post('/update/isclosed',auth,ctrlGenOpeningHours.closeOnlineBookingStatus);
//ctrlBookingSettings
router.post('/update/settings',auth,ctrlBookingSettings.UpdateBookingSettings);
router.get('/get/settings',auth,ctrlBookingSettings.getBookingSettings);

router.get('/get/folio',auth,ctrlOrders.getFolio);
//for testing purpose i have added this  route
router.get('/testing',auth,(req,res)=>{
   return res.send({Errcode:false,message:"success"})
})
module.exports = router;
