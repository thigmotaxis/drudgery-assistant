import {storage} from "./taskStorage.js"
import createElement from "./createComponents.js";
import logoPH from "./images/logoPH.jpg";
import editPH from "./images/editPH.jpg";
import deletePH from "./images/deletePH.jpg";
import {taskFactory} from "./taskFactory.js";

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

    const projText = ["Professional", "Academic", "Personal"];

    for (let i = 0; i < projText.length; i++) {
      const element = createElement("div", ["project"], projects);
      element.innerHTML = projText[i];
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

  const createDeleteTaskListener = (taskElement) => {
    taskElement.addEventListener("click", (e) => {
      const taskToDelete = e.target.parentElement;
      taskToDelete.remove();
    });
  };

// REFACTOR renderTasks() SO IT TAKES storage.getTaskList() AS A PARAMETER
  const renderTasks = () => {
    const taskList = storage.getTaskList();  // retrieves taskList so the loop can populate DOM elements with task object properties
    for (let i = 0; i < taskList.length; i++){
      const taskElement = createElement("div", ["task"], tasksParent);
      taskElement.setAttribute("data-index", taskList[i].dataIndex);

      const radio = createElement("input", ["completeTask"], taskElement);
      radio.setAttribute("type", "radio");

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
      createDeleteTaskListener(deleteIcon);
      taskElement.appendChild(deleteIcon);
    };
  };

  // LOGIC TO SUBMIT NEW TASK FORM
  const storeFormValues = () => {
    const dueDate = document.getElementById("ntDueDate").value;
    const taskName = document.getElementById("ntName").value;
    const description = document.getElementById("ntDesc").value;
    // CONFIRMS ALL FORM ELEMENTS HAVE VALUES
    if (!dueDate || !taskName || !description) {
      alert("Please complete the form before submitting a new task");
      return
    };
    const taskObject = taskFactory(dueDate, taskName, description);
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
      clearTasks();
      const formContainer = createElement("div", ["formContainer"], tasksParent)

      const formTags = ["input", "input", "textarea"];
      const formLabels = ["Task Name:", "Due Date:", "Task Description:"];
      const formIds = ["ntName", "ntDueDate", "ntDesc"];
      for (let i = 0; i < 3; i++) {
        const inputGroup = createElement("div", ["inputGroup"], formContainer);
        const label = createElement("label", ["formLabel"], inputGroup);
        label.innerHTML = formLabels[i];
        label.setAttribute("for", formIds[i]);

        const input = createElement(formTags[i], ["formInput"], inputGroup);
        input.setAttribute("id", formIds[i]);
        if (i === 1) input.setAttribute("type", "date");
      };

      const formButton = createElement("button", ["submitNewTask"], formContainer);
      formButton.innerHTML = "Add Task"
      formButton.addEventListener("click", handleNewTaskSubmission);
    };

    const createNewTaskListener = (() => {
      const addTaskBtn = document.querySelector(".addTask")
      addTaskBtn.addEventListener("click", renderTaskForm)
    })();

  return {clearTasks, renderTasks}

  // will need to add functions to remove single elements (with listener on deleteIcon) and functions to edit element display (taskStorage.js should also
  // have a function to edit the internal object properties)
  // add task object property "expanded: t/f" then add render logic that (make an toggleDescDisplay fx?) shows a description element if expanded = true


})();
