let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];
const formContent = document.querySelector("#content");
const formDate = document.querySelector("#date");
const formTime = document.querySelector("#time");

formContent.value = JSON.parse(localStorage.getItem("formContent")) || "";
formDate.value = JSON.parse(localStorage.getItem("formDate")) || "";
formTime.value = JSON.parse(localStorage.getItem("formTime")) || "";

let taskIdCounter = tasks.length + 1;
let currentTaskId;

function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
}

function saveFormValueToLocalStorage() {
    localStorage.setItem("formContent", JSON.stringify(formContent.value));
    localStorage.setItem("formDate", JSON.stringify(formDate.value));
    localStorage.setItem("formTime", JSON.stringify(formTime.value));
}

function removeFormValuesFromLocalStorage() {
    localStorage.setItem("formContent", JSON.stringify(""));
    localStorage.setItem("formDate", JSON.stringify(""));
    localStorage.setItem("formTime", JSON.stringify(""));
}

function removeTasksFromLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(""));
    localStorage.setItem("deletedTasks", JSON.stringify(""));
}

function hoverPinEffect(taskId) {
    document.querySelector(`#pin${taskId}`).src = "./assets/images/pinoutwithshadow.png";
    document.querySelector(`#close${taskId}`).style.display = "inline";
}

function outPinEffect(taskId) {
    document.querySelector(`#pin${taskId}`).src = "./assets/images/pininwithshadow.png";
    document.querySelector(`#close${taskId}`).style.display = "none";
}

class Task {
    constructor(content, date, time, id = undefined) {
        if (id === undefined) {
            currentTaskId = taskIdCounter;
        }
        this.id = id || taskIdCounter;
        this.content = content;
        this.date = date;
        this.time = time;
        this.task = `
            <div    class="task" id="task${this.id}" 
                    onmouseover="hoverPinEffect(${this.id})" 
                    onmouseout="outPinEffect(${this.id})">
                <img    class="task-pin" 
                        id="pin${this.id}" 
                        src="./assets/images/pininwithshadow.png"/>
                <textarea   class="task-textarea" 
                            id="content${this.id}" 
                            onkeyup="editTask(${this.id});saveTasksToLocalStorage();">${this.content}</textarea>
                <div class="task-date">${moment(this.date).format("DD/MM/YYYY")}</div>
                <div class="flex">
                    <div class="task-time">${this.time}</div>
                    <span   class="close-task fas fa-times" 
                            id="close${this.id}" 
                            onclick="removeTaskById(${this.id})"></span>
                    <span   class="copy-task fas fa-copy" 
                            id="duplicate${this.id}" 
                            onclick="duplicateTask(${this.id});saveTasksToLocalStorage();"></span>
                </div>
            </div>
        `;
    }
    addToTasks() {
        tasks.push({ id: this.id, content: this.content, date: this.date, time: this.time });
        taskIdCounter++;
    }
    displayTask() {
        document.querySelector("#tasks").innerHTML += this.task;
        if (currentTaskId && document.querySelector(`#task${currentTaskId}`)) {
            document.querySelector(`#task${currentTaskId}`).classList = "task fade-in";
            currentTaskId = undefined;
        }
    }
}

function createTask() {
    let content = document.querySelector("#content").value;
    document.querySelector("#content").style.border = "1px solid transparent";
    document.querySelector("#date").style.border = "1px solid #dfdede";
    if (!content) {
        displayNotice("Please write your note first.");
        document.querySelector("#content").style.border = "1px solid red";
        return;
    }
    let date = document.querySelector("#date").value;
    if (!date) {
        displayNotice("Please enter a date.");
        document.querySelector("#date").style.border = "1px solid red";
        return;
    }
    displayNotice();
    let time = document.querySelector("#time").value;
    clearForm();
    new Task(content, date, time).addToTasks();
    displayTasks();
}

function validateDate() {
    let inputDate = new Date(document.querySelector("#date").value);
    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    if(inputDate<today){
        displayNotice("Tasks are usually for the future.");
        document.querySelector("#create").setAttribute("disabled", true);
    } else {
        displayNotice();
        document.querySelector("#create").removeAttribute("disabled");
    }
}

function clearForm() {
    document.querySelector("#content").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#time").value = "";
}

function displayTasks() {
    document.querySelector("#tasks").innerHTML = "";
    sortTasks();
    for (let task of tasks) {
        new Task(task.content, task.date, task.time, task.id).displayTask();
    }
}

function removeTaskById(id) {
    deletedTasks.push(...tasks.filter((task) => task.id === id));
    tasks = tasks.filter((task) => task.id !== id);
    displayNotice("restore deleted");
    saveTasksToLocalStorage();
    displayTasks();
}

function sortTasks() {
    // sort by date
    tasks.sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    // sort by time
    if (tasks.length < 2) {
        return;
    }
    let dateToCheck;
    let arrs = [];
    let currArr = [];

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].date === dateToCheck) {
            continue;
        }
        dateToCheck = tasks[i].date;
        currArr.push(tasks[i]);
        for (let j = tasks.length - 1; j > i; j--) {
            if (dateToCheck === tasks[j].date) {
                currArr.push(tasks[j]);
            }
        }
        arrs.push(currArr);
        currArr = [];
    }

    for (let arr of arrs) {
        arr.sort(function (a, b) {
            let c = a.time.split(":");
            let d = b.time.split(":");
            c = c.join("");
            d = d.join("");
            return new Date(c) - new Date(d);
        });
    }

    let result = [];
    for (let arr of arrs) {
        result.push(...arr);
    }
    tasks = result;
}

function restoreLastTask() {
    if (deletedTasks.length === 0) {
        return;
    }
    currentTaskId = deletedTasks[deletedTasks.length - 1].id;
    tasks = [...tasks, deletedTasks[deletedTasks.length - 1]];
    deletedTasks.pop();
    displayTasks();
}

function restoreAllTasks() {
    if (deletedTasks.length === 0) {
        return;
    }
    tasks = [...tasks, ...deletedTasks];
    deletedTasks = [];
    displayTasks();
}

function displayNotice(message = undefined) {
    const notice = document.querySelector("#notice");
    if (message === "restore deleted") {
        notice.style.backgroundColor = "#7274ff8a";
        notice.innerHTML = `
                <button onclick="restoreLastTask();saveTasksToLocalStorage();" class="btn btn-success">Restore One Task</button>
                <button onclick="restoreAllTasks();saveTasksToLocalStorage();" class="btn btn-success">Restore All Tasks</button>
                <button onclick="clearTaskboard();saveTasksToLocalStorage();" class="btn btn-warning">Clear Task Board</button>
                <button onclick="deleteRemovedTasks();saveTasksToLocalStorage();" class="btn btn-danger">Permanently Delete Removed Tasks</button>
        `;
        return;
    } else if (message) {
        notice.style.backgroundColor = "#ff05058a";
        notice.innerHTML = message;
        return;
    } else if (deletedTasks.length > 0) {
        notice.style.backgroundColor = "#4C46EC8a";
        notice.innerHTML = `
                <button onclick="restoreLastTask();saveTasksToLocalStorage();" class="btn btn-success">Restore One Task</button>
                <button onclick="restoreAllTasks();saveTasksToLocalStorage();" class="btn btn-success">Restore All Tasks</button>
                <button onclick="clearTaskboard();saveTasksToLocalStorage();" class="btn btn-warning">Clear Task Board</button>
                <button onclick="deleteRemovedTasks();saveTasksToLocalStorage();" class="btn btn-danger">Permanently Delete Removed Tasks</button>
        `;
        return;
    } else if (localStorage.length === 0) {
        notice.style.backgroundColor = "#4C46EC8a";
        notice.innerHTML = `Lets start working! What's your first task?`;
        return;
    }
    notice.style.backgroundColor = "#4C46EC8a";
    notice.innerHTML = `Need to restore a task? <span style="cursor:pointer;margin:auto;" onclick="displayNotice('restore deleted')" class="fas fa-cog"></span>`;
}

function deleteRemovedTasks() {
    deletedTasks = [];
    if(tasks.length===0){
        displayNotice();
    }
}

function clearTaskboard() {
    deletedTasks = [...tasks, ...deletedTasks];
    tasks = [];
    displayTasks();
}

function formatContent() {
    punctuationToUse(".");
    punctuationToUse("?");
    punctuationToUse("!");
}

function punctuationToUse(punct) {
    const content = document.querySelector("#content");
    const stringArr = content.value.split(`${punct} `);
    let formattedArr = [];
    if (stringArr.length > 0) {
        for (let string of stringArr) {
            let start = string.substring(0, 1).toUpperCase();
            let end = string.substring(1, string.length);
            formattedArr.push(start + end);
        }
        content.value = formattedArr.join(`${punct} `);
    }
}

function editTask(id) {
    const newContent = document.querySelector(`#content${id}`).value;
    tasks.map((task) => (task.id === id ? (task.content = newContent) : ""));
}

function duplicateTask(id) {
    let taskToDuplicate = tasks.filter((task) => task.id == id)[0];
    new Task(taskToDuplicate.content, taskToDuplicate.date, taskToDuplicate.time).addToTasks();
    displayTasks();
}
