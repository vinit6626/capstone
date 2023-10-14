const express = require('express');
const route = require('./routes/web.js');   
const nodemailer = require('nodemailer');

const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');



const app = express();
app.use(session({
  secret: 'Trendify', 
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(2700, ()=>{
    console.log("Running at 2700");
})


app.get('/', (req, res) => {
    res.send('Hello world');
  });
  
app.use(route);