/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: Main driver code for setting default routes and middleware.
 */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const pug = require('pug');
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');



const userRouter = require('./routes/userRoutes');
const loanRouter = require('./routes/loanRoutes')


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())


app.use((req, res, next) => {
  console.log('hello from middlewear');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', userRouter);
app.use('/',loanRouter);


app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
