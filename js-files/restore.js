// a function responsible for removing tasks by id.

function removeTaskById(id) {
    document.querySelector(`#task${id}`).classList = "task fade-out";
    setTimeout(()=>{
        deletedTasks.push(...tasks.filter((task) => task.id === id));
        tasks = tasks.filter((task) => task.id !== id);
        displayNotice("restore deleted");
        saveTasksToLocalStorage();
        let task = document.querySelector(`#task${id}`);
        // replaces displayTasks()
        task.parentNode.removeChild(task);
        closeMinimizer();
    },550);
};

// a function that removes all active tasks from task board.

function clearTaskboard() {
    deletedTasks = [...tasks, ...deletedTasks];
    tasks = [];
    displayTasks();
    closeMinimizer();
};

// a function responsible for restoring the last task that was removed.

function restoreLastTask() {
    if (deletedTasks.length === 0) {
        return;
    };
    currentTaskId = deletedTasks[deletedTasks.length - 1].id;
    tasks = [...tasks, deletedTasks[deletedTasks.length - 1]];
    deletedTasks.pop();
    displayTasks();
};

// a function responsible for restoring all the removed tasks if they were'nt permanently removed.

function restoreAllTasks() {
    if (deletedTasks.length === 0) {
        return;
    };
    tasks = [...tasks, ...deletedTasks];
    deletedTasks = [];
    displayTasks();
};

// a function that deletes the removed tasks permanently.

function deleteRemovedTasks() {
    deletedTasks = [];
    if(tasks.length===0){
        displayNotice();
    };
    closeMinimizer();
};