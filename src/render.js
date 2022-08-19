import createComponents from "./createComponents.js";
import logoPH from "./images/logoPH.jpg";

export default function renderPage() {

  const body = document.querySelector("body");

// RENDER HEADER
  (() =>{
    const headerBar = createComponents("div", ["headerBar"], body);
    const logo = new Image();
    logo.classList.add("logo");
    logo.setAttribute("src", logoPH);
    logo.setAttribute("alt", "oh just an avocado placeholder");
    headerBar.appendChild(logo);

    const headerText = createComponents("div", ["headerText"], headerBar);
    headerText.innerHTML = "Drudgery Assistant";
  })();

// RENDER SIDEBAR
  const content = createComponents("div", ["content"], body);
  (() => {

    const sideBar = createComponents("div", ["sideBar"], content);

    const dateClasses = ["home", "today", "thisWeek"];
    const dateText = ["Home", "Today", "This Week"];
    const dates = createComponents("div", ["dates"], sideBar);

    for (let i = 0; i < dateClasses.length; i++) {
      const element = createComponents("div", [dateClasses[i]], dates);
      element.innerHTML = dateText[i];
    };

    const projects = createComponents("div", ["projects"], sideBar);
    projects.innerHTML = "Projects";

    const projText = ["Professional", "Academic", "Personal"];

    for (let i = 0; i < projText.length; i++) {
      const element = createComponents("div", ["project"], projects);
      element.innerHTML = projText[i];
    };

    const addProject = createComponents("button", ["addProject"], projects);
    addProject.innerHTML = "Add New Project";

    const addTask = createComponents("button", ["addTask"], sideBar);
    addTask.innerHTML = "Add New Task";
  })();


  (() =>{
    const toDos = createComponents("div", ["toDos"], content);
    const title = createComponents("div", ["title"], toDos);
    title.innerHTML = "Unfinished Business";
  })();
};
