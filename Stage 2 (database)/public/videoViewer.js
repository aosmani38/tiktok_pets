// This viewer takes a TikTok video URL and displays it in a nice magenta box, and gives it a reload button in case you want to watch it again. 
async function sendGetRequest(url) {
  let response = await fetch(url);
  if (response.ok) {
   let data = await response.json();
    console.log(data);
    return data;
 } else {
   throw Error(response.status);
 }
}

// Add the blockquote element that tiktok will load the video into
async function addVideo(tiktokurl,divElmt) {
  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;

  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id",videoNumber);
  block.style = "width: 325px; height: 563px;"
  
  let section = document.createElement('section');
  block.appendChild(section);
  divElmt.appendChild(block);
}

sendGetRequest("/getMostRecent")
  .then(function(data) {
    let example = data[0].url;
    let reloadButton = document.getElementById("reload");
    let divElmt = document.getElementById("tiktokDiv");
    // set up button
    reloadButton.addEventListener("click", function(){
      reloadVideo(example, divElmt)
    });

    // add the blockquote element that TikTok wants to load the   video into
    addVideo(example,divElmt);

    // on start-up, load the videos
    loadTheVideos();

    let newnickname = document.getElementById("vidnick");
    newnickname.textContent = data[0].nickname;
  })


// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}


function reloadVideo (example, divElmt) {
  let blockquotes = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
  block = blockquotes[0];
  console.log("block",block);
  let parent = block.parentNode;
  parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(example,divElmt);
  loadTheVideos();
}

// my videos button redirect
let my_vid_btn = document.getElementById("cont");
my_vid_btn.addEventListener("click",rdirect);

function rdirect() {
  window.location = "myVideos.html";
}