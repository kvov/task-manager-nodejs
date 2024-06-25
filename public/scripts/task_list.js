"use strict";

const displayTasks = () => {
    // Load tasks from the server using AJAX
    $.ajax({
        url: "/tasks",
        method: "GET",
        success: (data) => {
            console.log("Received tasks:", data);
            // Clear the current tasks
            $("#tasks").empty();

            for (const task of data) {
                // Set background color based on priority
                let backgroundColor;
                switch (task.priority) {
                    case "High":
                        backgroundColor = "#F88379";
                        break;
                    case "Medium":
                        backgroundColor = "#fcd9b1";
                        break;
                    case "Low":
                        backgroundColor = "#73a15e";
                        break;
                    default:
                        backgroundColor = ""; 
                        break;
                }
            
                const taskHtml = `<div class="task">
                    <div class="task-item" data-id="${task.id}" style="background-color: ${backgroundColor}">
                        <div>
                            <h5>Task</h5>
                            <input type="text" class="new-task-created" name="task-description" value="${task.description}" readonly />
                        </div>
                        <div>
                            <h5>Priority</h5>
                            <input type="text" class="priority" name="task-priority" value="${task.priority}" readonly />
                        </div>
                        <div>
                            <h5>Responsibility</h5>
                            <input type="text" class="responsible" name="task-responsible" value="${task.responsible}" readonly />
                        </div>
                        <div>
                            <h5>Start Date</h5>
                            <input type="text" class="start-date" name="task-start-date" value="${new Date(task.startDate).toDateString()}" readonly />
                        </div>
                        <div>
                            <h5>Due Date</h5>
                            <input type="text" class="due-date" name="task-due-date" value="${new Date(task.dueDate).toDateString()}" readonly />
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="btn_edit" data-id="${task.id}">Edit</button>
                        <button class="btn_delete" data-id="${task.id}">Delete</button>
                    </div>
                </div>`;

            
                // Append the taskHtml string to the DOM
                $("#tasks").append(taskHtml);
            }


            // Add click() event handler to each Delete button
            $("#tasks").find(".btn_delete").each((index, el) => {
                $(el).click(evt => {
                    const taskId = $(el).data('id');
                    $.ajax({
                        url: `/tasks/${taskId}`,
                        method: 'DELETE',
                        success: () => {
                            taskList.load();
                            displayTasks();
                        },
                    });
                    evt.preventDefault();
                    $("input:first").focus();
                });
            });

            // add click() event handler to Edit button
            $("#tasks").find(".btn_edit").each((index, el) => {
                $(el).click(evt => {

                    let editEl = evt.target.closest(".task");
                    editEl.style.backgroundColor = "#ffffff";
                    let taskUpdate = editEl.querySelector(".new-task-created");
                    let priorityUpdate = editEl.querySelector(".priority");
                    let respUpdate = editEl.querySelector(".responsible");
                    let startUpdate = editEl.querySelector(".start-date");
                    let dueUpdate = editEl.querySelector(".due-date");
                    let editBtn = editEl.querySelector(".btn_edit");

                    let taskId = $(el).data('id');

                    if (editBtn.innerHTML == "Edit") {
                        taskUpdate.readOnly = false;
                        respUpdate.readOnly = false;
                        startUpdate.readOnly = false;
                        dueUpdate.readOnly = false;
                        taskUpdate.focus();

                        editBtn.innerHTML = "Save";
                        // editEl.classList.add("editing");

                        let editStartDate = new Date(startUpdate.value);
                        const startYear = editStartDate.getFullYear();
                        const startMonth = editStartDate.getMonth() + 1;
                        const startDay = editStartDate.getDate();
                        editStartDate = `${startMonth.toString().padStart(2, "0")}/${startDay.toString().padStart(2, "0")}/${startYear}`;
                        startUpdate.value = editStartDate;

                        let editDueDate = new Date(dueUpdate.value);
                        const dueYear = editDueDate.getFullYear();
                        const dueMonth = editDueDate.getMonth() + 1;
                        const dueDay = editDueDate.getDate();
                        editDueDate = `${dueMonth.toString().padStart(2, "0")}/${dueDay.toString().padStart(2, "0")}/${dueYear}`;
                        dueUpdate.value = editDueDate;

                    }
                    else {
                        taskUpdate.readOnly = true;
                        respUpdate.readOnly = true;
                        startUpdate.readOnly = true;
                        startUpdate.readOnly = true;
                        editBtn.innerHTML = "Edit";
                        

                        const taskObj = {
                            description: taskUpdate.value,
                            priority: priorityUpdate.value,
                            responsible: respUpdate.value,
                            startDate: startUpdate.value,
                            dueDate: dueUpdate.value
                        };
                        const updatedTask = new Task(taskObj);  

                        if (updatedTask.isValid) {
                            $.ajax({
                                url: `/tasks/${taskId}`, // Include the task ID in the URL
                                method: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify(updatedTask),
                                success: (data) => {
                                    console.log(data);
                                    taskList.load();
                                    displayTasks();
                                },
                                error: (xhr, textStatus, errorThrown) => {
                                    console.error("Error updating task:", textStatus, errorThrown);
                                }
                            });
                            // taskList.load().edit(index, updatedTask).save();
                            // displayTasks();
                        } else {
                            alert(`Please fill in all fields. \nTask and Responsible shall not be a number. \nDates shall be in mm/dd/yyyy format.`);
                        }
                    }
                })
            });
        }
    })
};


$(document).ready(() => {
    displayTasks();
    
    //get searchInput field
    const searchInput = document.querySelector("#search");
    const addTaskButton = document.querySelector("#tasks");

    //on keyup event this will filter out tasks
    searchInput.addEventListener("input", (e) => {
        e.preventDefault();
        let searchedWord = e.target.value.toLowerCase();
    
        const taskItems = document.querySelectorAll(".task");
        taskItems.forEach((taskItem) => {
            const descriptionElement = taskItem.querySelector("div:nth-child(1) > input");
            const priorityElement = taskItem.querySelector("div:nth-child(2) > input");
            const responsibleElement = taskItem.querySelector("div:nth-child(3) > input");
    
            let taskText = descriptionElement ? descriptionElement.value.toLowerCase() : '';
            let priorityText = priorityElement ? priorityElement.value.toLowerCase() : '';
            let nameText = responsibleElement ? responsibleElement.value.toLowerCase() : '';
    
            if (taskText.includes(searchedWord) || priorityText.includes(searchedWord) || nameText.includes(searchedWord)) {
                taskItem.classList.remove('hidden');
            } else {
                taskItem.classList.add('hidden');
            }
        });
    });



    $("#add_task").click(() => {

        //format Task and Name inputs to start with upper case
        let formattedTask = $("#task").val().charAt(0).toUpperCase() + $("#task").val().slice(1);
        let formattedName = $("#responsible").val().charAt(0).toUpperCase() + $("#responsible").val().slice(1);
        
        
        
        const taskObj = {
            description: formattedTask,
            responsible: formattedName,
            startDate: $("#start_date").val(),
            dueDate: $("#due_date").val()
        };
        const newTask = new Task(taskObj);  // Task object



        if (newTask.isValid) {
            $.ajax({
                url: '/tasks',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newTask),
                success: () => {
                    addTaskButton.style.display = "flex";
                    displayTasks();
                    $("#task").val("");
                    $("#responsible").val("");
                    $("#start_date").val("");
                    $("#due_date").val("");
                },
            });
        } else {
            alert(`Please fill in all fields. \nTask and Responsible shall not be a number. \nDates shall be in mm/dd/yyyy format.`);
        }
    
        $("#task").select();
    });
    
    $("#clear_tasks").click(() => {
        // Clear tasks from the UI
        taskList.clear();
        $("#tasks").html("");
    
        // Clear tasks from the server (tasks.json file)
        $.ajax({
            url: '/tasks',
            method: 'DELETE',
            success: () => {
                $("#task").val("");
                $("#responsible").val("");
                $("#start_date").val("");
                $("#due_date").val("");
                $("#task").focus();
                addTaskButton.style.display = "none";
            },
            error: (xhr, textStatus, errorThrown) => {
                console.error("Error clearing tasks:", textStatus, errorThrown);
            }
        });
    });
    

    taskList.load()
    displayTasks();
    $("#task").focus();
});


