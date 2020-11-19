// a class that holds the task's parameters and methods.
class Task {
    constructor(content, date, time, pin, id = undefined) {
        if (id === undefined) {
            currentTaskId = taskIdCounter;
        };
        this.id = id || taskIdCounter;
        this.content = content;
        this.date = date;
        this.time = time;
        if(pin==="777") pin = generatreRandomPinColor();
        this.pinColor = pin;
        this.task = `
        <div    class="task" id="task${this.id}" 
                onmouseover="hoverPinEffect(${this.id}, ${this.pinColor});" 
                onmouseout="outPinEffect(${this.id}, ${this.pinColor});">
            <img    class="task-pin" 
                id="pin${this.id}" 
                onclick="focusOnTask(${this.id});displayPalette(${this.id});"
                src="./assets/images/pins/${this.pinColor}/in.png"/>
            <textarea   class="task-textarea"
                id="content${this.id}" 
                onclick="focusOnTask(${this.id});hideAllPalettes();" 
                onkeyup="formatContent('#content${this.id}');editTask(${this.id});saveTasksToLocalStorage();">${this.content}</textarea>
            <div class="task-date" contenteditable="true" onclick="focusOnTask(${this.id});hideAllPalettes();" id="date${this.id}" onkeyup="editDate(event, ${this.id});saveTasksToLocalStorage();">${moment(this.date).format("DD/MM/YYYY")}</div>
            <div class="flex">
                <div class="task-time" contenteditable="true" id="time${this.id}" onclick="focusOnTask(${this.id});hideAllPalettes();" onkeyup="editTime(event, ${this.id});saveTasksToLocalStorage();">${this.time}</div>
                <div class="icons-container">
                    <div>
                        <span   class="copy-task fas fa-copy" 
                                id="duplicate${this.id}" 
                                onclick="duplicateTask(${this.id});saveTasksToLocalStorage();"></span>
                        <span   class="minimize-task fas fa-minus-circle" 
                                id="minimize${this.id}" 
                                onclick="unfocusOnTask(${this.id});hideAllPalettes();"></span>
                    </div>
                    <div>
                        <span   class="remove-task fas fa-times" 
                                id="remove${this.id}" 
                                onclick="removeTaskById(${this.id})"></span>
                    </div>
                </div>
            </div>
            <div id="palette${this.id}" class="palette fade-in" onclick="editPin(${this.id});saveTasksToLocalStorage();">
                <input type="radio" name="palette" value="1" data-palette="white">
                <input type="radio" name="palette" value="2" data-palette="black">
                <input type="radio" name="palette" value="3" data-palette="orange">
                <input type="radio" name="palette" value="4" data-palette="gold">
                <input type="radio" name="palette" value="5" data-palette="yellow">
                <input type="radio" name="palette" value="6" data-palette="lime">
                <input type="radio" name="palette" value="7" data-palette="cyan">
                <input type="radio" name="palette" value="8" data-palette="sky">
                <input type="radio" name="palette" value="9" data-palette="blue">
                <input type="radio" name="palette" value="10" data-palette="purple">
                <input type="radio" name="palette" value="11" data-palette="pink">
                <input type="radio" name="palette" value="12" data-palette="red">
            </div>
        </div>
        `;
    };
    addToTasks() {
        tasks.push({ id: this.id, content: this.content, date: this.date, time: this.time, pin: this.pinColor });
        taskIdCounter++;
    };
    displayTask() {
        document.querySelector("#tasks").innerHTML += this.task;
        if (currentTaskId && document.querySelector(`#task${currentTaskId}`)) {
            document.querySelector(`#task${currentTaskId}`).classList = "task fade-in";
            currentTaskId = undefined;
        };
    };
};

function generatreRandomPinColor() {
    let pinColors = 12;
    let pinColor = Math.floor(Math.random()*(pinColors))+1;
    return pinColor;
}

// this function uses the task's method to create a task after some validations.
function createTask() {
    let content = document.querySelector("#content").value;
    let date = document.querySelector("#date").value;
    let pin = document.querySelector("input[name='color']:checked") ? document.querySelector("input[name='color']:checked").value : 1;
    
    resetInputsDisplay();

    if( validateInputs("content", content, "Please write your note first.") &&
        validateInputs("date", date, "Please enter a date.")){
            displayNotice();
            let time = document.querySelector("#time").value;
            clearForm();
            new Task(content, date, time, pin).addToTasks();
            displayTasks();
        };
};

// this function actually displays the tasks on the task board sfter they have been created.

function displayTasks() {
    document.querySelector("#tasks").innerHTML = "";
    sortTasks();
    for (let task of tasks) {
        new Task(task.content, task.date, task.time, task.pin, task.id).displayTask();
    };
    executeRotation();
    recolorPastTasks();
};

// functions that auto save edits in tasks.

function editTask(id) {
    const newContent = document.querySelector(`#content${id}`).value;
    tasks.map((task) => (task.id === id ? (task.content = newContent) : ""));
};

function editDate(e, id){
    if(e.keyCode===13){
        displayTasks();
        displayNotice();
        return;
    };
    let newDate = document.querySelector(`#date${id}`).innerHTML;
    let patternSlash = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/ ;
    let patternDash = /^(0?[1-9]|[12][0-9]|3[01])[\-](0?[1-9]|1[012])[\-]\d{4}$/ ;
    if(patternSlash.test(newDate)||patternDash.test(newDate)){
        if(patternSlash.test(newDate)) newDate = newDate.split("/");
        if(patternDash.test(newDate)) newDate = newDate.split("-");
        newDate = newDate[2]+"-"+ newDate[1]+"-"+ newDate[0];
        tasks.map((task) => (task.id === id ? (task.date = newDate) : ""));
        displayNotice();
        return;
    };
    displayNotice("Make sure the date format is DD/MM/YYYY");
};

function editTime(e, id) {
    if(e.keyCode===13){
        displayTasks();
        displayNotice();
        return;
    };
    let newTime = document.querySelector(`#time${id}`).innerHTML;
    let pattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ ; 
    if(newTime===""||pattern.test(newTime)){
        tasks.map((task) => (task.id === id ? (task.time = newTime) : ""));
        displayNotice();
        return;
    };
    displayNotice("Make sure the time format is HH:MM");
};

// this function creates a task with identical values of the one chosen, and displays it immediately.

function duplicateTask(id) {
    let taskToDuplicate = tasks.filter((task) => task.id == id)[0];
    new Task(taskToDuplicate.content, taskToDuplicate.date, taskToDuplicate.time, taskToDuplicate.pin).addToTasks();
    displayTasks();
};

function editPin(id) {
    const newPin = document.querySelector("input[name='palette']:checked").value;
    tasks.map((task) => (task.id === id ? (task.pin = newPin) : ""));
    displayTasks();
    hideAllPalettes();
};

function displayPalette(id) {
    hideAllPalettes();
    const palette = document.querySelector(`#palette${id}`);
    palette.style.display = "block";
};

function hideAllPalettes(){
    let palettes = document.querySelectorAll(".palette");
    for (let palette of palettes){
        palette.style.display = "none";
    };
};