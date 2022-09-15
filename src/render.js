import {storage} from "./taskStorage.js"
import {format} from "date-fns";
import createElement from "./createComponents.js";
import logoPH from "./images/logoPH.jpg";
import copyrightSymbol from "./images/copyright.png";
import editPH from "./images/editPH.jpg";
import deletePH from "./images/deletePH.jpg";

// BEGIN RENDERING OF STATIC ELEMENTS

export const renderPage = (() => {

  const body = document.querySelector("body");

  // NEED TO FIGURE OUT IF THE src ATTRIBUTE FOR MY IMAGE TAGS WILL BREAK WHEN DEPLOYED

  body.insertAdjacentHTML("afterbegin",
  `<div class="headerBar">
    <img src="file:///home/abe/repos/drudgery-assistant/dist/1a298f8658946c1d8f79.jpg" alt="oh just an avocado placeholder image" class="logo">
    <div class="headerText">Drudgery Assistant</div>
  </div>
  `)
  const header = document.querySelector(".headerBar")

  header.insertAdjacentHTML("afterend",
  `<div class="content">
    <div class="sideBar">
      <div class="allTasks">Display All</div>
      <div class="urgent">Display Urgent</div>
      <div class="incomplete">Display Incomplete</div>
      <div class="dateRanges">Sort by Time
        <div id="today" class="dateRange">Today</div>
        <div id="thisWeek" class="dateRange">This Week</div>
        <div id="thisMonth" class="dateRange">This Month</div>
      </div>
      <div class="categories">Sort by Category
        <div id="personal" class="category">Personal</div>
        <div id="professional" class="category">Professional</div>
        <div id="academic" class="category">Academic</div>
      </div>

      <button class="addTask">Add New Task</button>

      <div class="copyright">
        <img src="file:///home/abe/repos/drudgery-assistant/dist/784323dd6f14334269b7.png" alt="The copyright symbol" class="footerImage">
        <div>2022 Abe Industries</div>
      </div>
    </div>
  </div>`)

  const sideBar = document.querySelector(".sideBar")
  sideBar.insertAdjacentHTML("afterend",
  `<div class="toDos">
    <div class="title">Unfinished Business</div>
  </div>`)

  // const renderHeader = (() =>{
  //   const headerBar = createElement("div", ["headerBar"], body);
  //   const logo = new Image();
  //   logo.classList.add("logo");
  //   logo.setAttribute("src", logoPH);
  //   logo.setAttribute("alt", "oh just an avocado placeholder");
  //   headerBar.appendChild(logo);
  //
  //   const headerText = createElement("div", ["headerText"], headerBar);
  //   headerText.innerHTML = "Drudgery Assistant";
  // })();

  // const content = createElement("div", ["content"], body);

//   const renderSideBar = (() => {
//
//     const sideBar = createElement("div", ["sideBar"], content);
//
//     const dateClasses = ["allTasks", "today", "thisWeek"];
//     const dateText = ["All Tasks", "Today", "This Week"];
//     const dates = createElement("div", ["dates"], sideBar);
//
//     for (let i = 0; i < dateClasses.length; i++) {
//       const element = createElement("div", [dateClasses[i]], dates);
//       element.innerHTML = dateText[i];
//     };
//
//     const projects = createElement("div", ["projects"], sideBar);
//     projects.innerHTML = "Projects";
//
//     const projectClasses = ["professional", "academic", "personal"];
//
//     for (let i = 0; i < projectClasses.length; i++) {
//       const element = createElement("div", [projectClasses[i]], projects);
//       element.innerHTML = projectClasses[i].slice(0, 1).toUpperCase() + projectClasses[i].slice(1);
//     };
//
//     const addTask = createElement("button", ["addTask"], sideBar);
//     addTask.innerHTML = "Add New Task";
// // RENDER FOOTER
//     const copyright = createElement("div", ["copyright"], sideBar)
//     const footerImage = new Image();
//     footerImage.classList.add("footerImage");
//     footerImage.setAttribute("src", copyrightSymbol);
//     footerImage.setAttribute("alt", "The copyright symbol");
//     copyright.appendChild(footerImage);
//     const footerText = createElement("div", ["footerText"], copyright)
//     footerText.innerHTML = "2022 Abe Industries";
//   })();



  // const renderToDos = (() =>{
  //   const toDos = createElement("div", ["toDos"], content);
  //   const title = createElement("div", ["title"], toDos);
  //   title.innerHTML = "Unfinished Business";
  // })();

})();

// END RENDERING OF STATIC ELEMENTS

export const modifyDOM = (() => {

  const tasksParent = document.querySelector(".toDos");

  const clearTasks = () => {
    const taskElements = document.querySelectorAll(".task");
    for (let i = 0; i < taskElements.length; i++) {
      tasksParent.removeChild(taskElements[i]);
    };
  };

  const removeTask = (e) => {
      const taskToDelete = e.target.parentElement;
      const dataIndex = taskToDelete.getAttribute("data-index");
      taskToDelete.firstElementChild.removeEventListener("click", toggleTaskComplete)
// *** AFTER IMPLEMENTING EDIT BUTTON FUNCTIONALITY, USE taskToDelete.childNodes TO REMOVE LISTENER
// *** PROBABLY NEED TO REFACTOR SO THAT TASKS ARE NOT DELETED EVERY TIME renderTaskForm IS CALLED - OTHERWISE LISTENERS NEED TO BE REMOVED WHEN THEY ARE
      // - but I will need to delete tasks from the DOM when displaying tasks by category, so maybe I just need to remove and reapply listeners each time
      storage.removeTask(dataIndex);  // removes task object from taskList array
      taskToDelete.remove();          // removes task element from the DOM
  };

  const handleTaskEdit = (e) => {
    renderTaskForm();
    const domIndex = e.target.parentElement.getAttribute("data-index");
    const objectToEdit = storage.retrieveTaskObject(domIndex);
// READ OBJECT VALUES INTO FORM
    document.getElementById("ntDueDate").value = objectToEdit.dueDate;
    document.getElementById("ntName").value = objectToEdit.taskName;
    document.getElementById("ntPriority").value = objectToEdit.priority;
    document.getElementById("ntCategory").value = objectToEdit.category;
    document.getElementById("ntDesc").value = objectToEdit.description;

    const addTaskButton = document.querySelector(".submitNewTask");
    addTaskButton.removeEventListener("click", handleNewTaskSubmission);
// LISTENER PUSHES FORM VALUES TO OBJECT
    addTaskButton.addEventListener("click", () => {
      storage.editTask(objectToEdit)
    }), {once: true};
    addTaskButton.addEventListener("click", () => {
      const form = document.querySelector(".formContainer");
      form.remove(), {once: true};
    });
    addTaskButton.addEventListener("click", () => renderTasks(storage.getTaskListFromSession())), {once: true};
  };

  const toggleTaskComplete = (e) => {
    const radioButton = e.target;
    const taskToToggle = radioButton.parentElement;
    const checked = taskToToggle.classList.toggle("complete");
    if (checked !== true) radioButton.checked = false;
    const dataIndex = parseInt(taskToToggle.getAttribute("data-index"));
    storage.toggleTaskComplete(dataIndex)
  };

  const expandTask = (e) => {
    const taskElement = e.target;
    const taskDescription = createElement("div", ["taskDescription"], taskElement);
    const domDataIndex = taskElement.getAttribute("data-index")
    const taskList = storage.getTaskListFromSession();
    const objectDataIndex = taskList.findIndex(task => task.dataIndex == domDataIndex);
    taskDescription.innerHTML = taskList[objectDataIndex].description;
  };

  const shrinkTask = (e) => {
    const taskElement = e.target;
    taskElement.lastChild.remove();
  };

  const formatDueDateDisplay = (objectDueDate) => {
    const displayDueDate = format(new Date(`${objectDueDate}T00:00`), "M/dd/yy");
    return displayDueDate;
  };

  const renderTasks = (taskList = storage.getTaskListFromSession()) => {
    if (document.querySelector(".formContainer")) return;
    const toDo = document.querySelector(".toDos")
    for (let i = 0; i < taskList.length; i++){

      toDo.insertAdjacentHTML("beforeend",
      `<div class="task ${taskList[i].priority}Priority" data-index="${taskList[i].dataIndex}">
        <input class="completeTask" type="radio">
        <div class="dueDate">${formatDueDateDisplay(taskList[i].dueDate)}</div>
        <div class="taskName">${taskList[i].taskName}</div>
        <img class="editIcon" src="file:///home/abe/repos/drudgery-assistant/dist/cf6da241771896690fb9.jpg" alt="oh just an avocado placeholder">
        <img class="deleteIcon" src="file:///home/abe/repos/drudgery-assistant/dist/7491da0f585923c16e6c.jpg" alt="oh just an avocado placeholder">
      </div>`)
      const radioButton = document.querySelector(`[data-index="${taskList[i].dataIndex}"]`).firstElementChild
      if (taskList[i].complete === true) radioButton.checked = true;
    };
    const taskElements = document.querySelectorAll(".task").length
    for (let i = 0; i < taskElements; i++) {
      const task = document.querySelector(`[data-index="${taskList[i].dataIndex}"]`);
      task.addEventListener("mouseenter", expandTask);
      task.addEventListener("mouseleave", shrinkTask);
      const radio = document.querySelector(`[data-index="${taskList[i].dataIndex}"] input`);
      if (taskList[i].complete === true) task.classList.add("complete");
      radio.addEventListener("click", toggleTaskComplete);
      const editIcon = document.querySelector(`[data-index="${taskList[i].dataIndex}"] .editIcon`)
      editIcon.addEventListener("click", handleTaskEdit)
      const deleteIcon = document.querySelector(`[data-index="${taskList[i].dataIndex}"] .deleteIcon`)
      deleteIcon.addEventListener("click", removeTask), {once: true};
    }
  };

  // LOGIC TO SUBMIT NEW TASK FORM
  const storeFormValues = () => {
    const dueDate = document.getElementById("ntDueDate").value;
    const taskName = document.getElementById("ntName").value;
    const priority = document.getElementById("ntPriority").value;
    const category = document.getElementById("ntCategory").value
    const description = document.getElementById("ntDesc").value;
    // CONFIRMS ALL FORM ELEMENTS HAVE VALUES
    if (!dueDate || !taskName || !description) {
      alert("Please complete the form before submitting a new task");
      return
    };
    const taskObject = storage.taskFactory(dueDate, taskName, priority, category, description);
    return taskObject;
  };

  const handleNewTaskSubmission = () => {
// CREATES AND STORES NEW OBJECT
    const taskObject = storeFormValues();
    if (!taskObject) return;
    storage.storeTask(taskObject);
// REMOVES FORM ELEMENTS AND LISTENER
    const formButton = document.querySelector(".submitNewTask")
    formButton.removeEventListener("click", handleNewTaskSubmission);

    const form = document.querySelector(".formContainer");
    tasksParent.removeChild(form);
// REFRESHES DISPLAYED TASKLIST
    clearTasks();
    renderTasks();
  };

  // ADD LOGIC TO CREATE NEW TASK FORM ELEMENTS
    const renderTaskForm = () => {
      if (document.querySelector(".formContainer")) return;  // prevents rendering of multiple forms
      clearTasks();

      const toDos = document.querySelector(".toDos")
      toDos.insertAdjacentHTML("beforeend",
      `<div class="formContainer">
        <div class="inputGroup">
          <label class="formLabel" for="ntName">Task Name:</label>
          <input class="formInput" id="ntName">
        </div>
        <div class="inputGroup">
          <label class="formLabel" for="ntDueDate">Due Date:</label>
          <input class="formInput" id="ntDueDate" type="date">
        </div>
        <div class="inputGroup">
        <label class="formLabel" for="ntPriority">Priority:</label>
          <select class="formInput" id="ntPriority">
            <option class="option" value="normal" selected="selected">Normal</option>
            <option class="option" value="high">High</option>
          </select>
        </div>
        <div class="inputGroup">
          <label class="formLabel" for="ntCategory">Category:</label>
          <select class="formInput" id="ntCategory">
          <option class="option" value="personal" selected="selected">Personal</option>
            <option class="option" value="professional">Professional</option>
            <option class="option" value="academic">Academic</option>
          </select>
        </div>
        <div class="inputGroup">
          <label class="formLabel" for="ntDesc">Task Description:</label>
          <textarea class="formInput" id="ntDesc"></textarea>
        </div>
          <button class="submitNewTask">Add Task</button>
        </div>`)
      const formButton = document.querySelector(".submitNewTask")
      formButton.addEventListener("click", handleNewTaskSubmission);
    };

    const addTaskBtn = document.querySelector(".addTask")
    addTaskBtn.addEventListener("click", renderTaskForm);
  // END NEW TASK FORM LOGIC

  // START SIDEBAR HANDLER LOGIC

    const sortTasksByPriority = (e) => {
      const priority = e.target.className;
      const sortedTaskList = storage.sortTasksByPriority(priority);
      renderTasks(sortedTaskList);
    };

    const sortTasksByDate = (e) => {
      const date = e.target.id;
      const sortedTaskList = storage.sortTasksByDate(date);
      renderTasks(sortedTaskList);
    };

    const sortTasksByCategory = (e) => {
      const category = e.target.id;
      const sortedTaskList = storage.sortTasksByCategory(category)
      renderTasks(sortedTaskList);
    };

    const addSideBarHandlers = (() => {

      const allTasks = document.querySelector(".allTasks");
      allTasks.addEventListener("click", clearTasks);
      allTasks.addEventListener("click", sortTasksByPriority);

      const urgent = document.querySelector(".urgent");
      urgent.addEventListener("click", clearTasks);
      urgent.addEventListener("click", sortTasksByPriority);

      const dates = document.querySelectorAll(".dateRange");
      dates.forEach((dateRange) => {
        dateRange.addEventListener("click", clearTasks);
        dateRange.addEventListener("click", sortTasksByDate);
      });

      const categories = document.querySelectorAll(".category");
      categories.forEach((category) => {
        category.addEventListener("click", clearTasks);
        category.addEventListener("click", sortTasksByCategory);
      });
    })();
// END SIDEBAR HANDLER LOGIC

  return {clearTasks, renderTasks}

})();
