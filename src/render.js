import {storage} from "./taskStorage.js"
import createElement from "./createComponents.js";
import logoPH from "./images/logoPH.jpg";
import editPH from "./images/editPH.jpg";
import deletePH from "./images/deletePH.jpg";

// BEGIN RENDERING OF STATIC ELEMENTS

export const renderPage = (() => {

  const body = document.querySelector("body");

  const renderHeader = (() =>{
    const headerBar = createElement("div", ["headerBar"], body);
    const logo = new Image();
    logo.classList.add("logo");
    logo.setAttribute("src", logoPH);
    logo.setAttribute("alt", "oh just an avocado placeholder");
    headerBar.appendChild(logo);

    const headerText = createElement("div", ["headerText"], headerBar);
    headerText.innerHTML = "Drudgery Assistant";
  })();

  const content = createElement("div", ["content"], body);

  const renderSideBar = (() => {

    const sideBar = createElement("div", ["sideBar"], content);

    const dateClasses = ["allTasks", "today", "thisWeek"];
    const dateText = ["All Tasks", "Today", "This Week"];
    const dates = createElement("div", ["dates"], sideBar);

    for (let i = 0; i < dateClasses.length; i++) {
      const element = createElement("div", [dateClasses[i]], dates);
      element.innerHTML = dateText[i];
    };

    const projects = createElement("div", ["projects"], sideBar);
    projects.innerHTML = "Projects";

    const projectClasses = ["professional", "academic", "personal"];

    for (let i = 0; i < projectClasses.length; i++) {
      const element = createElement("div", [projectClasses[i]], projects);
      element.innerHTML = projectClasses[i].slice(0, 1).toUpperCase() + projectClasses[i].slice(1);
    };

    const addProject = createElement("button", ["addProject"], projects);
    addProject.innerHTML = "Add New Project";

    const addTask = createElement("button", ["addTask"], sideBar);
    addTask.innerHTML = "Add New Task";
  })();


  const renderToDos = (() =>{
    const toDos = createElement("div", ["toDos"], content);
    const title = createElement("div", ["title"], toDos);
    title.innerHTML = "Unfinished Business";
  })();

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
      taskToDelete.remove();                        // removes task element from the DOM
  };

  const toggleTaskComplete = (e) => {
    const radioButton = e.target;
    const taskToToggle = radioButton.parentElement;
    const checked = taskToToggle.classList.toggle("complete");
    if (checked !== true) radioButton.checked = false;
    const dataIndex = parseInt(taskToToggle.getAttribute("data-index"));
    storage.toggleTaskComplete(dataIndex)
  };

// REFACTOR renderTasks() SO IT TAKES storage.getTaskList() AS A PARAMETER
  const renderTasks = () => {
    const taskList = storage.getTaskList();  // retrieves taskList so the loop can populate DOM elements with task object properties
    for (let i = 0; i < taskList.length; i++){
      const taskElement = createElement("div", ["task"], tasksParent);
      taskElement.setAttribute("data-index", taskList[i].dataIndex);
      taskElement.classList.add(`${taskList[i].priority}Priority`);
      if (taskList[i].complete === true) taskElement.classList.add("complete");

      const radio = createElement("input", ["completeTask"], taskElement);
      radio.setAttribute("type", "radio");
      radio.addEventListener("click", toggleTaskComplete);

      const dueDate = createElement("div", ["dueDate"], taskElement);
      dueDate.innerHTML = taskList[i].dueDate;

      const taskName = createElement("div", ["taskName"], taskElement);
      taskName.innerHTML = taskList[i].taskName;

      const editIcon = new Image();
      editIcon.classList.add("editIcon");
      editIcon.setAttribute("src", editPH);
      editIcon.setAttribute("alt", "oh just an avocado placeholder");
      taskElement.appendChild(editIcon);

      const deleteIcon = new Image();
      deleteIcon.classList.add("deleteIcon");
      deleteIcon.setAttribute("src", deletePH);
      deleteIcon.setAttribute("alt", "oh just an avocado placeholder");
      deleteIcon.addEventListener("click", removeTask), {once: true};
      taskElement.appendChild(deleteIcon);
    };
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
      const formContainer = createElement("div", ["formContainer"], tasksParent)

      const formTags = ["input", "input", "select", "select", "textarea"];
      const formLabels = ["Task Name:", "Due Date:", "Priority:", "Category:", "Task Description:"];
      const formIds = ["ntName", "ntDueDate", "ntPriority", "ntCategory", "ntDesc"];
      for (let i = 0; i < 5; i++) {
        const inputGroup = createElement("div", ["inputGroup"], formContainer);
        const label = createElement("label", ["formLabel"], inputGroup);
        label.innerHTML = formLabels[i];
        label.setAttribute("for", formIds[i]);

        const input = createElement(formTags[i], ["formInput"], inputGroup);
        input.setAttribute("id", formIds[i]);
        if (formIds[i] === "ntDueDate") input.setAttribute("type", "date");
        // RENDER PRIORITY DROPDOWN
        if (formIds[i] === "ntPriority") {
          const dropDownOptions = ["high", "normal"];
          for (let i = 0; i < dropDownOptions.length; i ++) {
            const option = createElement("option", ["option"], input);
            option.setAttribute("value", dropDownOptions[i]);
            option.innerHTML = dropDownOptions[i].slice(0, 1).toUpperCase() + dropDownOptions[i].slice(1);
            if (dropDownOptions[i] === "normal") {
              option.setAttribute("selected", "selected");
            };
          };
        };
        // RENDER CATEGORY DROPDOWN
        if (formIds[i] === "ntCategory") {
          const dropDownOptions = ["professional", "academic", "personal"];
          for (let i = 0; i < dropDownOptions.length; i ++) {
            const option = createElement("option", ["option"], input);
            option.setAttribute("value", dropDownOptions[i]);
            option.innerHTML = dropDownOptions[i].slice(0, 1).toUpperCase() + dropDownOptions[i].slice(1);
            if (dropDownOptions[i] === "personal") {
              option.setAttribute("selected", "selected");
            };
          };
        };
      };

      const formButton = createElement("button", ["submitNewTask"], formContainer);
      formButton.innerHTML = "Add Task"
      formButton.addEventListener("click", handleNewTaskSubmission);
    };

    const addTaskBtn = document.querySelector(".addTask")
    addTaskBtn.addEventListener("click", renderTaskForm);
  // END NEW TASK FORM LOGIC

    const sortTasksByCategory = (e) => {
      const category = e.target.className;
      const sortedTaskList = storage.sortTasksByCategory(category)
      console.log(sortedTaskList)
    }

    const addSideBarHandlers = (() => {
      const projects = document.querySelectorAll(".projects div")
      projects.forEach((project) => {
        project.addEventListener("click", sortTasksByCategory)
      });
    })();

  return {clearTasks, renderTasks}

  // will need to add functions to remove single elements (with listener on deleteIcon) and functions to edit element display (taskStorage.js should also
  // have a function to edit the internal object properties)
  // add task object property "expanded: t/f" then add render logic that (make an toggleDescDisplay fx?) shows a description element if expanded = true


})();
