// main variables and local storage settings

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];

const formContent = document.querySelector("#content");
const formDate = document.querySelector("#date");
const formTime = document.querySelector("#time");

formContent.value = JSON.parse(localStorage.getItem("formContent")) || "";
formDate.value = JSON.parse(localStorage.getItem("formDate")) || "";
formTime.value = JSON.parse(localStorage.getItem("formTime")) || "";

let taskIdCounter = JSON.parse(localStorage.getItem("taskIdCounter")) || tasks.length + 1;
let currentTaskId;