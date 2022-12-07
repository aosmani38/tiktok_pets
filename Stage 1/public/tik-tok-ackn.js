button = document.querySelector("#cont");

let nickName = sessionStorage.getItem("nickName");
let nick = document.querySelector("#nickName");
nick.style.color = "rgb(238, 29, 82, 0.9)";
nick.textContent = nickName;

button.addEventListener(
    "click", 
    () => {window.location = "./tik-tok-pets.html";}, 
    false
);