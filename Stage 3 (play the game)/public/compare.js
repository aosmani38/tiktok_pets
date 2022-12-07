let videoElmts = document.getElementsByClassName("tiktokDiv");
let chosen = [0,0];

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop

async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

//step 3 
async function sendGetRequest(url = "/getTwoVideos") {
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
      let twoVideos = data;
      let heartButtons = document.querySelectorAll("div.heart");
      let next = document.querySelector("button")

      
      console.log("two videos: ", twoVideos)
      let urls = [twoVideos[0].url, twoVideos[1].url];
      for (let i=0; i<2; i++) {
          addVideo(urls[i],videoElmts[i]);
      }

      heartButtons[0].addEventListener("click", ()=> {
        chosen[0] = 1;
        chosen[1] = 0;
        heartButtons[0].style.color = "#ff0bac";
        heartButtons[1].style.color = "rgb(180,180,180)";
      })
        
      heartButtons[1].addEventListener("click", ()=> {
        chosen[0] = 0;
        chosen[1] = 1;
        heartButtons[1].style.color = "#ff0bac";
        heartButtons[0].style.color = "rgb(180,180,180)";
      })

      
      
      next.addEventListener("click", () => {
        let compared = {
          // rowIdNum: twoVideos[0].rowIdNum,
          better: twoVideos[0].rowIdNum, 
          worse: twoVideos[1].rowIdNum
          };

        if(chosen[1] == 1){
          compared.better = twoVideos[1].rowIdNum;
          // compared.rowIdNum = twoVideos[1].rowIdNum;
          compared.worse = twoVideos[0].rowIdNum;
        }
        
        sendPostRequest("/insertPref", compared)
          .then(function(data){
            console.log("response is ",data);
            //ocation.reload();
            //window.location = "./winner.html";
            
            if(data =="continue"){
              location.reload();
            } else {
              window.location = "./winner.html";
            }
          })
          .catch(function(){
            console.log("Data not sent")
          })
        
      })
      
      
    //load the videos after the names are pasted in! 
    loadTheVideos();
    })
    .catch(function(err) {
      console.log("The has been an error with getitng the video:", err);
    })

