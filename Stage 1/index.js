// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.text());

// make all the files in 'public' available 
app.use(express.static("public"));

app.post("/videoData",function(req,res){
    console.log("I have been hit in the server");
    console.log(req.body);
    res.send("Received data");
});

// Code in this section sets up an express pipeline


// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/tik-tok-pets.html");
});

// Need to add response if page not found!
app.use(function(req, res){ res.status(404); res.type('txt'); res.send('404 - File '+req.url+' not found'); });
// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

