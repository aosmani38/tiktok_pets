// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

async function sendGetRequest(url="/getWinner") {
  params = {
    method: 'GET', 
     };
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw Error(response.status);
  }
}

sendGetRequest()
  .then(function(data) {
    // console.log(data);
    // let data1 = JSON.parse(data);
    let winningUrl = data.url;
    addVideo(winningUrl, divElmt);
    console.log("winner received: ", data);
    loadTheVideos();
  })
  .catch(function(){
    console.log("winner not received")
  })
// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.


