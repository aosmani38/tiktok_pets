// file for js logic 
button = document.querySelector("#Continue");

async function sendPostRequest(url, data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: data,
  });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

button.addEventListener(
  "click",
  () => {
    let userName = document.querySelector("#username").value;
    let url = document.querySelector("#Url").value;
    let video_nickname = document.querySelector("#vid_nickname").value;
    
    let input = userName+ url + video_nickname;
    sessionStorage.setItem("nickName", "\'"+ video_nickname + "\'");
    //Editing this 
    sendPostRequest("/videoData", input);
    window.location = "./acknowledgement.html";
  },
  false
);


