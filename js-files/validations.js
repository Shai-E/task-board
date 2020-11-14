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

function validateInputs(inputID, inputValue , message){
    if (!inputValue) {
        console.log(inputValue)
        displayNotice(message);
        document.querySelector(`#${inputID}`).style.border = "1px solid red";
        return false;
    }
    console.log(inputValue)
    return true;
}