async function sendGetRequest(url) {
  let response = await fetch(url);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

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

function buttonPress() {
  window.location = "tiktokpets.html";
}

let button = document.getElementById("home");
button.addEventListener("click", buttonPress);


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
  sendGetRequest(url)
    .then(function(data) {
      let objData = JSON.parse(data);
      const limit = objData.length;
      let allparagraph = document.getElementsByClassName("nname");
      let btnArr2 = document.getElementsByClassName("delete");

      for (let i = 0; i < 8; i++) {
        allparagraph[i].textContent = "";
        let oldVariable = btnArr2[i];
        let newVariable = oldVariable.cloneNode(true);
        oldVariable.parentNode.replaceChild(newVariable, oldVariable);
      }
    
      for (let i = 0; i < limit; i++) {
        let currObjNickname = objData[i].nickname;
        allparagraph[i].textContent = currObjNickname;

        let button = btnArr2[i];
        button.addEventListener("click", function() {
          deleteVideo(objData[i].rowIdNum);
        });
      }

      for (let i = limit; i < 8; i++) {
        allparagraph[i].style = "border: dotted 2px #D8D8D8";
      }
    });
}

sendGetRequest("/getList")
  .then(function(data) {
    let objData = JSON.parse(data);
    const limit = objData.length;
    let allparagraph = document.getElementsByClassName("nname");
    let btnArr = document.getElementsByClassName("delete");
    
    if (limit < 8) {
      let btnplygme = document.getElementById("pgame");
      btnplygme.style.backgroundColor = "#EF9BB3";
    } 
    else {
      let btnplygme = document.getElementById("home");
      btnplygme.style.backgroundColor = "#EF9BB3";
    }
    
    for (let i = 0; i < limit; i++) {
      let currObjNickname = objData[i].nickname;
      allparagraph[i].textContent = currObjNickname;
    }

    for (let i = 0; i < 8; i++) {
      let button = btnArr[i];
      button.addEventListener("click", function() {
        deleteVideo(objData[i].rowIdNum);
      });
    }

    for (let i = limit; i < 8; i++) {
      allparagraph[i].style = "border: dotted 2px #D8D8D8";
    }
  });
