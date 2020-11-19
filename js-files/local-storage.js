function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
    localStorage.setItem("taskIdCounter", JSON.stringify(taskIdCounter));
};

function saveFormValueToLocalStorage() {
    localStorage.setItem("formContent", JSON.stringify(formContent.value));
    localStorage.setItem("formDate", JSON.stringify(formDate.value));
    localStorage.setItem("formTime", JSON.stringify(formTime.value));
};

function removeFormValuesFromLocalStorage() {
    localStorage.setItem("formContent", JSON.stringify(""));
    localStorage.setItem("formDate", JSON.stringify(""));
    localStorage.setItem("formTime", JSON.stringify(""));
};