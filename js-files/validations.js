function validateDate() {
    let inputDate = {
        date: document.querySelector("#date").value,
        time: document.querySelector("#time").value || ""
    };
    formattedInputDate = formatToFullDate({date: inputDate.date, time: inputDate.time});
    let rightNow = new Date();
    let today = new Date().getFullYear() +"-"+  (new Date().getMonth()+1) +"-"+ new Date().getDate();

    if(inputDate.date===today && inputDate.time==false){
        displayNotice();
        resetCreateTaskBtn();
        document.querySelector("#date").style.border = "1px solid #dfdede";
    }else if(formattedInputDate<rightNow){
        displayNotice("Tasks are usually for the future.");
        disableCreateTaskBtn();
    } else {
        displayNotice();
        resetCreateTaskBtn();
        document.querySelector("#date").style.border = "1px solid #dfdede";
    };
};

function disableCreateTaskBtn() {
    document.querySelector("#create").setAttribute("disabled", true);
};

function resetCreateTaskBtn() {
    document.querySelector("#create").removeAttribute("disabled");
};

// formatToFullDate({date: task.date, time: task.time}

function validateInputs(inputID, inputValue , message){
    if (!inputValue) {
        displayNotice(message);
        document.querySelector(`#${inputID}`).style.border = "1px solid red";
        return false;
    };
    return true;
};