/*******************************************
 * Account routes
 * week 4 deliver login view
 * **************************************** */
//Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities= require("../utilities");

//Map each route to the Controller function

router.get("/login", utilities.handleErrors(accountController.buildLogin));


module.exports = router;