import {storage} from "./taskStorage.js"
import createElement from "./createComponents.js";
import logoPH from "./images/logoPH.jpg";
import editPH from "./images/editPH.jpg";
import deletePH from "./images/deletePH.jpg";
import {handlers} from "./eventHandlers.js";

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

// CREATE REFERENCE TO THE PARENT OF OUR TASK ELEMENTS
  const tasksParent = document.querySelector(".toDos");

// ADD LOGIC TO CREATE NEW TASK FORM ELEMENTS
  const renderTaskForm = () => {
    console.log("PLACEHOLDER FUNCTION TO RENDER NEW TASK FORM")
  };

  const createNewTaskListener = (() => {
    const addTaskBtn = document.querySelector(".addTask")
    addTaskBtn.addEventListener("click", renderTaskForm)
  })();

  return {tasksParent}
})();

export const modifyDOM = (() => {

  const tasksParent = document.querySelector(".toDos");

  const clearTasks = () => {
    const taskElements = document.querySelectorAll(".task");
    for (let i = 0; i < taskElements.length; i++) {
      tasksParent.removeChild(taskElements[i]);
    };
  };

  const renderTasks = () => {
    const taskList = storage.getTaskList();  // retrieves taskList so the loop can populate DOM elements with task object properties

    for (let i = 0; i < taskList.length; i++){
      const taskElement = createElement("div", ["task"], tasksParent);

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
      taskElement.appendChild(deleteIcon);
    };
  };

  return {clearTasks, renderTasks}

  // will need to add functions to remove single elements (with listener on deleteIcon) and functions to edit element display (taskStorage.js should also
  // have a function to edit the internal object properties)
  // add task object property "expanded: t/f" then add render logic that (make an toggleDescDisplay fx?) shows a description element if expanded = true


})();
