let myVid = document.querySelector(".myvideos");
myVid.addEventListener("click",rdirect);

let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);

// given function that sends a post request
async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: data };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

function rdirect() {
  window.location = "myVideos.html";
}

function buttonPress() { 
  // Get all the user info.
  let username = document.getElementById("user").value;
  let URL = document.getElementById("URL").value;
  let nickname = document.getElementById("nickname").value;

  let data = username+","+URL+","+nickname;
  let dataObj = JSON.stringify({data});
    
  sendPostRequest("/videoData", dataObj)
  .then( function (response) {
    console.log("Response recieved", response);
    sessionStorage.setItem("nickname", nickname);
    if(response == "Database is full") {
      window.alert(response);
    }else{
       window.location = "videoViewer.html";
    }

  })
  .catch( function(err) {
    console.log("POST request error",err);
  });
}
