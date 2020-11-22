function initBody() {
    displayTasks();
    displayNotice();
    validateDate();
    initRadioBtn();
};

function initFormDateTime() {
    validateDate();
    saveFormValueToLocalStorage();
};

function initFormTextareaKeyup() {
    formatContent('#content');
    saveFormValueToLocalStorage();
};

function initFormTextareaChange() {
    resetContentInputDisplay();
};

function initMinimizer() {
    minimizeRestOfTasks();
    hideAllAlertOptions();
    hideAllPalettes();
};

function initCreateBtn() {
    createTask();
    saveTasksToLocalStorage();
    saveFormValueToLocalStorage();
    initRadioBtn();
};

function initResetBtn() {
    removeFormValuesFromLocalStorage();
    displayNotice();
    resetCreateTaskBtn();
    initRadioBtn();
};

function initRadioBtn() {
    document.querySelector("input[data-color='rainbow']").checked = true;
};