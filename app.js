const express = require('express');
const route = require('./routes/web.js');   
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.listen(2700, ()=>{
    console.log("Running at 2700");
})


app.get('/', (req, res) => {
    res.send('Hello world');
  });
  
app.use(route);