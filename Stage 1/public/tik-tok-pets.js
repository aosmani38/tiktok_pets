// file for js logic 
button = document.querySelector("#cont");

async function sendPostRequest(url, data) {
  console.log("sending post request");
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: data
  });
  if (response.ok) {
    let data = await response.text();
    return data;
  } 
  else {
    throw Error(response.status);
  }
}

button.addEventListener("click", () => {
  let userName = document.querySelector("#user").value;
  let url = document.querySelector("#url").value;
  let video_nickname = document.querySelector("#nick").value;
    
  let input = userName + url + video_nickname;
  sessionStorage.setItem("nickName", "\'"+ video_nickname + "\'");
  //Editing this 
  sendPostRequest("/videoData", input);
  window.location = "./tik-tok-ackn.html";
}, false);