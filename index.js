const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const app = express();
const nocache= require('nocache')
dotenv.config();

// MONGODB CONNECTION
const database = process.env.MONGOLAB_URI;
mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// View engine
app.set('view engine', 'ejs');




app.use(session({
  secret: 'key',
  cookie: { maxAge: 6000000 },
  resave: true,
  saveUninitialized: true,
}));




// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(nocache());

// User route
const userroutes = require('./routes/userroutes');
app.use('/', userroutes);

// Admin route
const adminroutes = require('./routes/adminroutes');
app.use('/admin', adminroutes);

//SERVE PUBLIC 
app.use(express.static('public'))

// PORT DEFINING
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Server is running on port:', PORT));
