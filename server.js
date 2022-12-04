/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: Set properties to connect to the server.
 */
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const mongoose = require('mongoose');

const MONGO_DATA_BASE = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

//Connext to database
mongoose.connect(MONGO_DATA_BASE,
  //connection recipie
  {
    useNewUrlParser: true
  }).then(con=>{
    console.log(con.connection);// log connection properties
    console.log(`The Database connection was successful with ${process.env.DATABASE}`);// log connection properties
  });

var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));
  
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
