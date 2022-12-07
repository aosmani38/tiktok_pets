const report = document.querySelector(".confirm")
let nickName = sessionStorage.getItem("nickName");

let content = report.textContent;
content= content.replace("nickName", nickName);
report.textContent = content;