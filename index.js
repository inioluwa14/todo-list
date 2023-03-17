//  Initialize variables
const newTask = document.querySelector("#new-task input");
const addBtn = document.querySelector("#add");
const todoTasks =  document.querySelector("#todo-list");
let deleteItems, editItems, tasks;
let updateNote = "";
let count;

window.addEventListener("onload", () => {
    updateNote = "";
    count = Object.keys(localStorage).length;
    displayTasks();
});

// Function to display the tasks
const displayTasks = () => {
    if(Object.keys(localStorage).length > 0){
        todoTasks.style.display = "inline-block";
    }else{
        todoTasks.style.display = "none";
    }
    // Clear the tasks
    todoTasks.innerHTML = "";

    // Fetch All the keys in local storage
    let tasks = Object.keys(localStorage);
    tasks = tasks.sort();

    for(let key of tasks){
        let classValue = "";

        // Get all values
        let value = localStorage.getItem(key);
        let taskInnerDiv = document.createElement("div");
        taskInnerDiv.classList.add("task");
        taskInnerDiv.setAttribute("id", key);
        taskInnerDiv.innerHTML = `<span id= "taskname">${key.split("_")[1]}</span>`;

        // localstorage would store boolean as string so we parseit to boolean back
        let editBtn = document.createElement("button");
        editBtn.classList.add("edit");
        editBtn.innerHTML = `<i class="bi bi-pencil-square"></i>`;
        if(!JSON.parse(value)){
            editBtn.style.visibility = "visible";
        }else{
            editBtn.style.visibility = "hidden";
            taskInnerDiv.classList.add("completed");
        }
        taskInnerDiv.appendChild(editBtn);
        taskInnerDiv.innerHTML += `<button class="delete"><i class="bi bi-trash-fill"></i></button>`;
        todoTasks.appendChild(taskInnerDiv);
    }
    tasks = document.querySelectorAll(".task");
    tasks.forEach((element, index) => {
        element.onclick = () => {
            // local storage update
            if(element.classList.contains("completed")){
                updateStorage(element.id.split("_")[0],element.innerText, false);
            }else{
                updateStorage(element.id.split("_")[0],element.innerText, true);
            }
        }
    });
    // Edit tasks
    editTasks = document.getElementsByClassName("edit");
    Array.from(editTasks).forEach((element, index) => {
        element.addEventListener("click", (e) =>{
            e.stopPropagation();

            // disable other edit button when one task is being edited
            disableBtns(true);

            // update input value and remove div
            let parent = element.parentElement;
            newTask.value = parent.querySelector("#taskname").innerText;

            // set updateNote to the task that is being edited
            updateNote = parent.id;

            // remove task
            parent.remove();
        })
    })
    // Delete Tasks
    deleteItems = document.getElementsByClassName("delete");
    Array.from(deleteItems).forEach((element,index) =>{
        element.addEventListener("click",(e) => {
            e.stopPropagation();

            let parent = element.parentElement;
            removeTask(parent.id);
            parent.remove();
            count-=1;
        })
    })
};

// Disable edit button
const disableBtns = (bool) => {
    let editButtons =  document.getElementsByClassName("edit");
    Array.from(editButtons).forEach(element => {
        element.disabled = bool;
    })
}

// Remove Task from local storage
const removeTask =  (taskValue) => {
    localStorage.removeItem(taskValue);
    displayTasks();
}

// Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
    localStorage.setItem(`${index}_${taskValue}`,completed);
    displayTasks();
}

// Function to add new tasks
document.querySelector("#add").addEventListener("click",
() =>{
    // enable the edit button
    disableBtns(false);
    if(newTask.value.length == 0){
        alert("Pleas Enter A Task");
    }else{
        // Store locally and display from local storage
        if (updateNote == ""){
            // new task
            updateStorage(count, newTask.value, false);
        }else{
            // update task
            let existingCount = updateNote.split("_")[0];
            removeTask(updateNote);
            updateStorage(existingCount, newTask.value, false);
            updateNote = "";
        }
        count +=1;
        newTask.value = "";
    }
})