// functions responsible for pin effect on hover.

function hoverPinEffect(taskId, pinColor) {
    document.querySelector(`#pin${taskId}`).src = `./assets/images/pins/${pinColor}/out.png`;
    document.querySelector(`#remove${taskId}`).style.visibility = "visible";
};

function outPinEffect(taskId, pinColor) {
    document.querySelector(`#pin${taskId}`).src = `./assets/images/pins/${pinColor}/in.png`;
    document.querySelector(`#remove${taskId}`).style.visibility = "hidden";
};

// a function responsible for sorting the tasks by date and by time

function sortTasks() {
    tasks.sort(function (a, b) {
        a = formatToFullDate({date: a.date, time: a.time});
        b = formatToFullDate({date: b.date, time: b.time});
        return a-b;
    });
};

function formatToFullDate(task) {
    let year = new Date(task.date).getFullYear();
    let month = new Date(task.date).getMonth();
    let day = new Date(task.date).getDate();
    if(task.time){
        let time = task.time.split(":");
        let hours = time[0];
        let minutes = time[1];
        return new Date(year, month, day, hours, minutes);
    };
    return new Date(year, month, day);
};

function recolorPastTasks() {
    let now = new Date();
    tasks.map(task=>{
        if((formatToFullDate({date: task.date, time: task.time})<now && task.time!=="") ||
        task.time==="" && new Date(task.date)<new Date(now.getFullYear(), now.getMonth(), now.getDate())){
            document.querySelector(`#task${task.id}`).style.filter = "grayscale()";
        };
    });
};

// functions that format the content on the form so that the first word of each sentence will start with a capital letter.

function formatContent(id) {
    punctuationToUse(".", id);
    punctuationToUse("?", id);
    punctuationToUse("!", id);
};

function punctuationToUse(punct, id) {
    const content = document.querySelector(id);
    const stringArr = content.value.split(`${punct} `);
    let formattedArr = [];
    if (stringArr.length > 0) {
        for (let string of stringArr) {
            let start = string.substring(0, 1).toUpperCase();
            let end = string.substring(1, string.length);
            formattedArr.push(start + end);
        };
        content.value = formattedArr.join(`${punct} `);
    };
};

// clears form values.

function clearForm() {
    document.querySelector("#content").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#time").value = "";
    document.querySelector("input[name='color']:checked") ? document.querySelector("input[name='color']:checked").checked = false : "";
};

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
    } else if ( localStorage.getItem("tasks") && localStorage.getItem("deletedTasks") &&
                JSON.parse(localStorage.getItem("tasks")).length === 0 &&
                JSON.parse(localStorage.getItem("deletedTasks")).length === 0) {
        notice.style.backgroundColor = "#4C46EC8a";
        notice.innerHTML = `Lets start working! What's your first task?`;
        return;
    };
    notice.style.backgroundColor = "#4C46EC8a";
    notice.innerHTML = `Need to restore a task? <span style="cursor:pointer;margin:auto;" onclick="displayNotice('restore deleted')" class="fas fa-cog"></span>`;
};

// sets input to regular display after values have been validated.
function resetInputsDisplay() {
    resetContentInputDisplay();
    document.querySelector("#date").style.border = "1px solid #dfdede";
};

function resetContentInputDisplay() {
    document.querySelector("#content").style.border = "1px solid transparent";
};

// rotate notes randomly

function genRandDeg4Rotation(){
    return Math.floor(Math.random()*20)-10;
};

function addRotationValueToTask() {
    for(let task of tasks){
        task.rotation = genRandDeg4Rotation();
    };
};

function addRotationEffect() {
    for(let task of tasks) {
        document.querySelector(`#task${task.id}`).style.transform = `rotate(${task.rotation}deg)`;
    };
};

function executeRotation() {
    if(validateScreenSize()) return;
    addRotationValueToTask();
    addRotationEffect();
};

// enlarge task on click

function focusOnTask(id) {
    if(validateScreenSize()) return;
    let task = document.querySelector(`#task${id}`);
    if(!task) return;
    let minimizer = document.querySelector(`#minimize${id}`);
    if(minimizer)minimizer.style.visibility = "visible";
    let rotation = 0;
    minimizeRestOfTasks(id);
    task.style.transform = `scale(1.5) rotate(${rotation}deg)`;
    task.style.zIndex = `10`;
    document.querySelector("#minimizer").style.display = "block";
};

// undo enlargement

function unfocusOnTask(id) {
    if(validateScreenSize()) return;
    let task = document.querySelector(`#task${id}`);
    if(!task) return;
    let minimizer = document.querySelector(`#minimize${id}`);
    if(minimizer)minimizer.style.visibility = "hidden";
    let rotation = tasks.find(task=>task.id===id).rotation;
    task.style.transform = `rotate(${rotation}deg) scale(1)`;
    task.style.zIndex = `1`;
    closeMinimizer();
};

function closeMinimizer(){
    document.querySelector("#minimizer").style.display = "none";
};

function validateScreenSize() {
    if(window.innerWidth<768){
        return true;
    };
    return false;
};

function minimizeRestOfTasks(id=undefined) {
    let tasksToMonomize = id?tasks.filter(task=>task.id!==id):tasks;
    for (let task of tasksToMonomize){
        unfocusOnTask(task.id);
    };
};