/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require("./database/");
const express = require("express");
const env = require("dotenv").config();
const baseController = require("./controllers/baseController");
const app = express();
const static = require("./routes/static");
const expressEjsLayouts = require("express-ejs-layouts");
const accountRoute = require("./routes/accountRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const expressMessages = require("express-messages");

/*************************
 * Middleware
 * ********************** */
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'defualt_secret',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
}))

//Express Messages Middleware
app.use(require('flash')())
app.use(function (req, res, next) {
  res.locals.messages = req.flash('error');
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 *************************/  
app.set("view engine", "ejs")
app.use(require("express-ejs-layouts"))
app.set("layout", "./layouts/layout") // not at views root
app.use("/account", accountRoute)
/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

//Inventory routes
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we apper to have lost that page.'})
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 ************************ */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){message = err.message} else {message = 'Oh no! there was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  } )
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

