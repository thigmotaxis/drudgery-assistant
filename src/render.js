import { storage } from "./taskStorage.js";
import { format } from "date-fns";
import createElement from "./createComponents.js";
import logoImage from "./images/logo-120w.png";
import newTaskImg from "./images/addTask-48w.png";
import copyrightSymbol from "./images/copyright-24w.png";
import settings from "./images/settings-48w.png";
import editIcon from "./images/edit.png";
import deleteIcon from "./images/delete.png";

// BEGIN RENDERING OF STATIC ELEMENTS

export const renderPage = (() => {
  const body = document.querySelector("body");

  const headerBar = createElement("div", ["headerBar"], body);
  const logo = new Image();
  logo.classList.add("logo");
  logo.setAttribute("src", logoImage);
  logo.setAttribute("alt", "a man pushing a rock up a hill");
  headerBar.appendChild(logo);
  const headerText = createElement("div", ["headerText"], headerBar);
  headerText.innerHTML = "Drudgery Assistant";

  const header = document.querySelector(".headerBar");

  header.insertAdjacentHTML(
    "afterend",
    `<div class="content">
      <div class="sideBar">
        <div class="allTasks">Display All</div>
        <div class="urgent">Display Urgent</div>
        <div class="incomplete">Display Incomplete</div>
        <div class="dateRanges">Sort by Due Date
          <div id="today" class="dateRange">Today</div>
          <div id="thisWeek" class="dateRange">This Week</div>
          <div id="thisMonth" class="dateRange">This Month</div>
        </div>
        <div class="categories">Sort by Category
          <div id="personal" class="category">Personal</div>
          <div id="professional" class="category">Professional</div>
          <div id="academic" class="category">Academic</div>
      </div>
  </div>`
  );
  const sideBar = document.querySelector(".sideBar");
  sideBar.insertAdjacentHTML(
    "afterend",
    `<div class="toDos">
    <div class="title">Unfinished Business</div>
  </div>
  <div class= "footer"></div>`
  );
  const footer = document.querySelector(".footer");

  const newTaskContainer = createElement("div", ["newTaskContainer"], footer);
  const newTaskButton = new Image();
  newTaskButton.classList.add("addTask", "footerButton");
  newTaskButton.setAttribute("src", newTaskImg);
  newTaskContainer.appendChild(newTaskButton);

  const newTaskText = createElement("div", ["newTaskText"], newTaskContainer);
  newTaskText.innerHTML = "Add Task";

  const copyright = createElement("div", ["copyright"], footer);

  const copyrightImage = new Image();
  copyrightImage.classList.add("footerImage");
  copyrightImage.setAttribute("src", copyrightSymbol);
  copyrightImage.setAttribute("alt", "The copyright symbol");
  copyright.appendChild(copyrightImage);

  const copyrightText = document.createElement("div");
  copyrightText.innerHTML = "2022 Abe Industries";
  copyright.appendChild(copyrightText);

  const settingsButton = new Image();
  settingsButton.classList.add("toggleSettings", "footerButton");
  settingsButton.setAttribute("src", settings);
  settingsButton.setAttribute("alt", "");
  footer.appendChild(settingsButton);
})();

// END RENDERING OF STATIC ELEMENTS

export const modifyDOM = (() => {
  const tasksParent = document.querySelector(".toDos");

  const clearTasks = () => {
    const taskElements = document.querySelectorAll(".task");
    for (let i = 0; i < taskElements.length; i++) {
      tasksParent.removeChild(taskElements[i]);
    }
  };

  const removeTask = (e) => {
    const taskToDelete = e.target.parentElement;
    const dataIndex = taskToDelete.getAttribute("data-index");
    taskToDelete.firstElementChild.removeEventListener(
      "click",
      toggleTaskComplete
    );
    storage.removeTask(dataIndex); // removes task object from taskList array
    taskToDelete.remove(); // removes task element from the DOM
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
      storage.editTask(objectToEdit);
    }),
      { once: true };
    addTaskButton.addEventListener("click", () => {
      const form = document.querySelector(".formContainer");
      form.remove(), { once: true };
    });
    addTaskButton.addEventListener("click", () =>
      renderTasks(storage.getTaskListFromSession())
    ),
      { once: true };
  };

  const toggleTaskComplete = (e) => {
    const radioButton = e.target;
    const taskToToggle = radioButton.parentElement;
    const checked = taskToToggle.classList.toggle("complete");
    if (checked !== true) radioButton.checked = false;
    const dataIndex = parseInt(taskToToggle.getAttribute("data-index"));
    storage.toggleTaskComplete(dataIndex);
  };

  const expandTask = (e) => {
    const taskElement = e.target;
    const taskDescription = createElement(
      "div",
      ["taskDescription"],
      taskElement
    );
    const domDataIndex = taskElement.getAttribute("data-index");
    const taskList = storage.getTaskListFromSession();
    const objectDataIndex = taskList.findIndex(
      (task) => task.dataIndex == domDataIndex
    );
    taskDescription.innerHTML = taskList[objectDataIndex].description;
  };

  const shrinkTask = (e) => {
    const taskElement = e.target;
    taskElement.lastChild.remove();
  };

  const formatDueDateDisplay = (objectDueDate) => {
    const displayDueDate = format(
      new Date(`${objectDueDate}T00:00`),
      "M/dd/yy"
    );
    return displayDueDate;
  };

  const renderTasks = (taskList = storage.getTaskListFromSession()) => {
    if (document.querySelector(".formContainer")) return;
    const toDo = document.querySelector(".toDos");
    for (let i = 0; i < taskList.length; i++) {
      toDo.insertAdjacentHTML(
        "beforeend",
        `<div class="task ${taskList[i].priority}Priority" data-index="${
          taskList[i].dataIndex
        }">
        <input class="completeTask" type="radio">
        <div class="dueDate">${formatDueDateDisplay(taskList[i].dueDate)}</div>
        <div class="taskName">${taskList[i].taskName}</div>
      </div>`
      );

      const task = document.querySelector(
        `[data-index="${parseInt(taskList[i].dataIndex)}`
      );
      const edit = new Image();
      edit.setAttribute("src", editIcon);
      edit.setAttribute("alt", "oh just an edit icon shaped like a pencil");
      edit.classList.add("editIcon");
      task.appendChild(edit);

      const del = new Image();
      del.setAttribute("src", deleteIcon);
      del.setAttribute("alt", "oh just a delete icon shaped like a trash can");
      del.classList.add("deleteIcon");
      task.appendChild(del);

      const radioButton = document.querySelector(
        `[data-index="${taskList[i].dataIndex}"]`
      ).firstElementChild;
      if (taskList[i].complete === true) radioButton.checked = true;
    }
    const taskElements = document.querySelectorAll(".task").length;
    for (let i = 0; i < taskElements; i++) {
      const task = document.querySelector(
        `[data-index="${taskList[i].dataIndex}"]`
      );
      task.addEventListener("mouseenter", expandTask);
      task.addEventListener("mouseleave", shrinkTask);
      const radio = document.querySelector(
        `[data-index="${taskList[i].dataIndex}"] input`
      );
      if (taskList[i].complete === true) task.classList.add("complete");
      radio.addEventListener("click", toggleTaskComplete);
      const editIcon = document.querySelector(
        `[data-index="${taskList[i].dataIndex}"] .editIcon`
      );
      editIcon.addEventListener("click", handleTaskEdit);
      const deleteIcon = document.querySelector(
        `[data-index="${taskList[i].dataIndex}"] .deleteIcon`
      );
      deleteIcon.addEventListener("click", removeTask), { once: true };
    }
  };

  // LOGIC TO SUBMIT NEW TASK FORM
  const storeFormValues = () => {
    const dueDate = document.getElementById("ntDueDate").value;
    const taskName = document.getElementById("ntName").value;
    const priority = document.getElementById("ntPriority").value;
    const category = document.getElementById("ntCategory").value;
    const description = document.getElementById("ntDesc").value;
    // CONFIRMS ALL FORM ELEMENTS HAVE VALUES
    if (!dueDate || !taskName) {
      alert("Please complete the form before submitting a new task");
      return;
    }
    const taskObject = storage.taskFactory(
      dueDate,
      taskName,
      priority,
      category,
      description
    );
    return taskObject;
  };

  const handleNewTaskSubmission = () => {
    // CREATES AND STORES NEW OBJECT
    const taskObject = storeFormValues();
    if (!taskObject) return;
    storage.storeTask(taskObject);
    // REMOVES FORM ELEMENTS AND LISTENER
    const formButton = document.querySelector(".submitNewTask");
    formButton.removeEventListener("click", handleNewTaskSubmission);

    const form = document.querySelector(".formContainer");
    tasksParent.removeChild(form);
    // REFRESHES DISPLAYED TASKLIST
    clearTasks();
    renderTasks();
  };

  // ADD LOGIC TO CREATE NEW TASK FORM ELEMENTS
  const renderTaskForm = () => {
    if (document.querySelector(".formContainer")) return; // prevents rendering of multiple forms
    clearTasks();

    const toDos = document.querySelector(".toDos");
    toDos.insertAdjacentHTML(
      "beforeend",
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
          <textarea class="formInput" id="ntDesc" placeholder="Optional description"></textarea>
        </div>
          <button class="submitNewTask">Submit</button>
        </div>`
    );
    const formButton = document.querySelector(".submitNewTask");
    formButton.addEventListener("click", handleNewTaskSubmission);
  };

  const addTaskBtn = document.querySelector(".newTaskContainer");
  addTaskBtn.addEventListener("click", renderTaskForm);
  // END NEW TASK FORM LOGIC

  // START SIDEBAR HANDLER LOGIC

  const sortTasksByAttribute = (e) => {
    const attribute = e.target.className;
    const sortedTaskList = storage.sortTasksByAttribute(attribute);
    renderTasks(sortedTaskList);
  };

  const sortTasksByDate = (e) => {
    const date = e.target.id;
    const sortedTaskList = storage.sortTasksByDate(date);
    renderTasks(sortedTaskList);
  };

  const sortTasksByCategory = (e) => {
    const category = e.target.id;
    const sortedTaskList = storage.sortTasksByCategory(category);
    renderTasks(sortedTaskList);
  };
  // Assign sidebar handlers
  (() => {
    const allTasks = document.querySelector(".allTasks");
    allTasks.addEventListener("click", clearTasks);
    allTasks.addEventListener("click", sortTasksByAttribute);

    const urgent = document.querySelector(".urgent");
    urgent.addEventListener("click", clearTasks);
    urgent.addEventListener("click", sortTasksByAttribute);

    const incomplete = document.querySelector(".incomplete");
    incomplete.addEventListener("click", clearTasks);
    incomplete.addEventListener("click", sortTasksByAttribute);

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

  // START FOOTER HANDLER LOGIC
  // ASSIGN FOOTER HANDLER
  // let toggled = false;
  const toggleSidebar = () => {
    // const sideBar = document.querySelector(".sideBar");
    // const tasks = document.querySelectorAll(".task");
    // if (toggled === false) {
    //   for (let i = 0; i < tasks.length; i++) {
    //     tasks[i].classList.add("muted");
    //   }
    //   sideBar.classList.add("toggledOn");
    //   toggled = true;
    //   console.log(toggled);
    // } else {
    //   for (let i = 0; i < tasks.length; i++) {
    //     tasks[i].classList.remove("muted");
    //   }
    //   sideBar.classList.remove("toggledOn");
    //   toggled = false;
    //   console.log(toggled);
    // }
    alert("this feature is broken, will be fixed in next release");
  };

  (() => {
    const settingsButton = document.querySelector(".toggleSettings");
    settingsButton.addEventListener("click", toggleSidebar);
  })();

  return { clearTasks, renderTasks };
})();
