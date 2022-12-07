let button = document.getElementById("home");
button.addEventListener("click", buttonPress);

async function sendPostRequest(url, data) {
  params = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  };
  console.log("about to send post request");

  let response = await fetch(url, params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

function deleteVideo(rowid) {
  let nRowId = JSON.stringify({ rowid });
  sendPostRequest("/del", nRowId)
    .then(function(response) {
      console.log("Deleting video" + response);
    })
    .catch(function(err) {
      console.log("Error in deletion")
    })
  repopulate("/getList");
  let btnaddnew = document.getElementById("home");
  let btnplaygme = document.getElementById("pgame");
  btnaddnew.style.backgroundColor = "#EE1D52";
  btnplaygme.style.backgroundColor = "#EF9BB3";
}

function repopulate(url) {
  console.log("I have been hit at line 35");
  sendGetRequest(url)
    .then(function(data) {
      let allparagraph = document.getElementsByClassName("nname");
      // console.log(allparagraph);
      let objData = JSON.parse(data);
      for (let i = 0; i < 8; i++) {
        allparagraph[i].textContent = "";
      }
      for (let i = 0; i < objData.length; i++) {
        let currObjNickname = objData[i].nickname;
        allparagraph[i].textContent = currObjNickname;
      }
      let btnArr2 = document.getElementsByClassName("delete");
      const limit = objData.length;

      for (let i = 0; i < 8; i++) {
        let oldVariable = btnArr2[i];
        let newVariable = oldVariable.cloneNode(true);
        oldVariable.parentNode.replaceChild(newVariable, oldVariable);
      }
      console.log(limit);
      for (let i = 0; i < limit; i++) {
        let button = btnArr2[i];
        button.addEventListener("click", function() {
          deleteVideo(objData[i].rowIdNum);
        });
      }
      console.log(limit);
      // nparagraph[0].style = "border: dotted 2px #D8D8D8";
      for (let i = limit; i <= 8; i++) {
        allparagraph[i].style = "border: dotted 2px #D8D8D8";
      }
      
    });
}

function buttonPress() {
  window.location = "tiktokpets.html";
}

async function sendGetRequest(url) {
  let response = await fetch(url);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

// when db is not full (n < 8), gray out -> play game
// when db is full (n == 8), gray out -> add new
sendGetRequest("/getList")
  .then(function(data) {
    let rndobj = JSON.parse(data);
    const length = Object.keys(rndobj).length;
    if (length < 8) {
      let btnplygme = document.getElementById("pgame");
      btnplygme.style.backgroundColor = "#EF9BB3";
    } else {
      let btnplygme = document.getElementById("home");
      btnplygme.style.backgroundColor = "#EF9BB3";
    }
    let allparagraph = document.getElementsByClassName("nname");
    // console.log(allparagraph);
    let objData = JSON.parse(data);
    for (let i = 0; i < objData.length; i++) {
      let currObjNickname = objData[i].nickname;
      console.log(currObjNickname);
      allparagraph[i].textContent = currObjNickname;
    }
    let btnArr = document.getElementsByClassName("delete");
    for (let i = 0; i < 8; i++) {
      let button = btnArr[i];
      button.addEventListener("click", function() {
        deleteVideo(objData[i].rowIdNum);
      });
    }
    allparagraph = document.getElementsByClassName("nname");
    // nparagraph[0].style = "border: dotted 2px #D8D8D8";
    for (let i = length; i <= 8; i++) {
      allparagraph[i].style = "border: dotted 2px #D8D8D8";
    }
  });

