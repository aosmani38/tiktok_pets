'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner2");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

//Step 2
app.get("/getTwoVideos", (req, res) => {
  async function returnVideo() {
    const cmd = "SELECT * FROM VideoTable";
    let result = await db.all(cmd);
    let arr = [];
    let rand_one = getRandomInt(8);
    let rand_two = getRandomInt(8);

    while(rand_one === rand_two) {
      rand_two = getRandomInt(8);
    }

    arr[0] = result[rand_one];
    arr[1] = result[rand_two];

    console.log("Line 103:  " + arr);
    return arr;
  }

  returnVideo()
    .then(function(data) {
      res.send(data)
    })
    .catch(function(err) {
      console.log("The has been an error:", err);
    })
});

app.post("/insertPref", (req, res) => {
  console.log("sending Response");
  console.log(req.body);
  let ndata = JSON.stringify(req.body);
  let qdata = JSON.parse(ndata);

  async function insertVideo(v) {
    let resp = "";
    let new_cmd = "select * from PrefTable"
    const tabelContent = await db.all(new_cmd);

    
    if (tabelContent.length > 15) {
      resp = "pickWinner"; 
    } else {
      const cmd = "insert into PrefTable (better, worse) values (?,?)";
      db.run(cmd, [v.better, v.worse]);
      resp = "continue";
    }
    console.log(resp);
    return resp;
  }
  
  
  insertVideo(ndata)
    .then(function(data){
      console.log("this object added: ", qdata);
      res.send(data);
    })
    .catch(function(){
      console.log("object not added")
    })
  
});


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  // try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
    
  let winner = await win.computeWinner2(8,false);
    
  const cmd_1 = `SELECT * FROM VideoTable WHERE rowIdNum=${winner}`;

  let win1 = await db.get(cmd_1);
    
  
  // you'll need to send back a more meaningful response here.
  console.log("WINNER--> ", win1)
  res.json(win1);
  
  // } catch(err) {
  //   res.status(500).send(err);
  // }
  
});


// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

