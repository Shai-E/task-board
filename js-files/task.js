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
        this.pinColor = pin;
        this.task = `
        <div    class="task" id="task${this.id}" 
                onmouseover="hoverPinEffect(${this.id}, ${this.pinColor});" 
                onmouseout="outPinEffect(${this.id}, ${this.pinColor});">
            <img    class="task-pin" 
                id="pin${this.id}" 
                src="./assets/images/pins/${this.pinColor}/in.png"/>
            <textarea   class="task-textarea"
                id="content${this.id}" 
                onclick="focusOnTask(${this.id});" 
                onkeyup="formatContent('#content${this.id}');editTask(${this.id});saveTasksToLocalStorage();">${this.content}</textarea>
            <div class="task-date">${moment(this.date).format("DD/MM/YYYY")}</div>
            <div class="flex">
                <div class="task-time">${this.time}</div>
                <div class="icons-container">
                    <div>
                        <span   class="copy-task fas fa-copy" 
                                id="duplicate${this.id}" 
                                onclick="duplicateTask(${this.id});saveTasksToLocalStorage();"></span>
                        <span   class="minimize-task fas fa-minus-circle" 
                                id="minimize${this.id}" 
                                onclick="unfocusOnTask(${this.id});"></span>
                    </div>
                    <div>
                        <span   class="close-task fas fa-times" 
                                id="close${this.id}" 
                                onclick="removeTaskById(${this.id})"></span>
                    </div>
                </div>
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
};

// this function auto saves changes content changes in tasks.

function editTask(id) {
    const newContent = document.querySelector(`#content${id}`).value;
    tasks.map((task) => (task.id === id ? (task.content = newContent) : ""));
};

// this function creates a task with identical values of the one chosen, and displays it immediately.

function duplicateTask(id) {
    let taskToDuplicate = tasks.filter((task) => task.id == id)[0];
    new Task(taskToDuplicate.content, taskToDuplicate.date, taskToDuplicate.time, taskToDuplicate.pin).addToTasks();
    displayTasks();
};