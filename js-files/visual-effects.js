// functions responsible for pin effect on hover.

function hoverPinEffect(taskId) {
    document.querySelector(`#pin${taskId}`).src = "./assets/images/pinoutwithshadow.png";
    document.querySelector(`#close${taskId}`).style.display = "inline";
}

function outPinEffect(taskId) {
    document.querySelector(`#pin${taskId}`).src = "./assets/images/pininwithshadow.png";
    document.querySelector(`#close${taskId}`).style.display = "none";
}

// a function responsible for sorting the tasks by date and by time

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

// functions that format the content on the form so that the first word of each sentence will start with a capital letter.

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

// clears form values.

function clearForm() {
    document.querySelector("#content").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#time").value = "";
}

// show message and restoration buttons when appropriate.

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
    } else if ( JSON.parse(localStorage.getItem("tasks")).length === 0 &&
                JSON.parse(localStorage.getItem("deletedTasks")).length === 0) {
        notice.style.backgroundColor = "#4C46EC8a";
        notice.innerHTML = `Lets start working! What's your first task?`;
        return;
    }
    notice.style.backgroundColor = "#4C46EC8a";
    notice.innerHTML = `Need to restore a task? <span style="cursor:pointer;margin:auto;" onclick="displayNotice('restore deleted')" class="fas fa-cog"></span>`;
}

// sets input to regular display after values have been validated.
function resetInputsDisplay() {
    document.querySelector("#content").style.border = "1px solid transparent";
    document.querySelector("#date").style.border = "1px solid #dfdede";
}