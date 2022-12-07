// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");
// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
// create object to interface with express
const app = express();
// Code in this section sets up an express pipeline

/*
    Adding text here at May 1
*/
const fetch = require("cross-fetch");
// get Promise-based interface to sqlite3
const db = require('./public/sqlWrap');

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.use(express.text());
// make all the files in 'public' available 

app.use(express.json());

app.use(function(req, res, next) {
  console.log("body contains", req.body);
  next();
});

app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myVideos.html");
});

app.post("/videoData", (req, res) => {
  console.log("sending Response");
  console.log(req.body);
  let ndata = JSON.stringify(req.body);
  let qdata = JSON.parse(ndata);
  console.log(typeof qdata.data);
  const splitArr = qdata.data.split(",");

  async function validateAndInsertIntOTable() {
    let thisflag = 1;
    let vidObj = {
      "url": splitArr[1],
      "nickname": splitArr[2],
      "userid": splitArr[0]
    }
    const tableContents = await dumpTable();
    if (tableContents.length != 0 && tableContents.length < 8) {
      //Find current data with flag true
      const cmd = "UPDATE VideoTable SET flag = 0 WHERE flag = 1";
      db.run(cmd, function(err, val) {
        if (err) {
          console.log("Database Insertion Failure", err.message);
        } else {
          console.log("Successfully updated flag");
        }
      });
      await insertVideo(vidObj);
    } else if (tableContents.length == 0) {
      await insertVideo(vidObj);
    } else {
      console.log("Data Inserted Limit Exceeded");
      thisflag = 0;
    }
    // const returnDataInserted = await dumpTable();
    // console.log(returnDataInserted);
    return thisflag;
  }

  validateAndInsertIntOTable()
    .then(function(thisflag) {
      if (thisflag == 0) {
        res.send("Database is full");
      } else {
        res.send("Post Received");
      }
    })
    .catch(function(err) {
      console.log("Db error", err);
    });
});



//Get for step 6
app.get("/getMostRecent", (req, res) => {
  async function returnMostRecent() {
    const cmd = "select * from VideoTable where flag = 1";
    let result = await db.all(cmd);
    let retJsonString = JSON.stringify(result);
    console.log("Line 103:  " + retJsonString);
    return retJsonString;
  }
  returnMostRecent()
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.log("The has been an error:", err);
    });

});

app.get("/getList", function(req, res) {
  async function returnEverything() {
    let returnData = "";
    const cmd = "select * from VideoTable";
    let result = await db.all(cmd);
    let contentLength = result.length;
    if (contentLength <= 8) {
      returnData = JSON.stringify(result);
    } else {
      returnData = "DbFull";
    }
    return returnData;
  }

  returnEverything()
    .then(function(data) {
      console.log("Line 133 is executed: \n" + data);
      res.send(data);
    });

});

app.post("/del", (req, res) => {
  async function deleteRow() {
    console.log(req.body);
    let objExtracted = req.body;
    let sqlcmd = "DELETE FROM VideoTable where rowIdNum = ?"; 
    const resp = await db.run(sqlcmd, [objExtracted.rowid]);
    res.send("Successfully deleted");
    let n = await dumpTable();
    console.log("I have been hit good sir");
    console.log(n);
  }
  deleteRow();
  
  
});

// Need to add response if page not found!
app.use(function(req, res) {
  res.status(404); res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

/*
May 1 
*/

function databaseCodeExample() {

  console.log("testing database");

  // put the video data into an object
  let vidObj = {
    "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
    "nickname": "Cat vs Fish",
    "userid": "ProfAmenta"
  }

  async function insertAndCount(vidObj) {

    await insertVideo(vidObj);
    const tableContents = await dumpTable();
    console.log(tableContents.length);
  }

  insertAndCount(vidObj)
    .catch(function(err) { console.log("DB error!", err) });

  // getVideo("Cat vs Fish")
  //   .then(function(result) {
  //     // console.log("row contained",result); 
  //         })
  //   .catch(function(err) {
  //     console.log("SQL error",err)} );

}

// ******************************************** //
// Define async functions to perform the database 
// operations we need

// An async function to insert a video into the database
async function insertVideo(v) {
  const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";

  await db.run(sql, [v.url, v.nickname, v.userid]);
}

// an async function to get a video's database row by its nickname
// async function getVideo(nickname) {

//   // warning! You can only use ? to replace table data, not table name or column name.
//   const sql = 'select * from VideoTable where nickname = ?';

// let result = await db.get(sql, [nickname]);
// return result;
// }

// an async function to get the whole contents of the database 
async function dumpTable() {
  const sql = "select * from VideoTable"

  let result = await db.all(sql);
  return result;
}
