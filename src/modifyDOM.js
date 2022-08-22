import {storage} from "./taskStorage.js"
import createElement from "./createComponents.js";
import editPH from "./images/editPH.jpg";
import deletePH from "./images/deletePH.jpg";


export const modifyDOM = (() => {

  const parent = document.querySelector(".toDos");

  const clearElements = () => {
    const taskElements = document.querySelectorAll(".task");
    for (let i = 0; i < taskElements.length; i++) {
      parent.removeChild(taskElements[i]);
    };
  };

  const renderElements = () => {

    const taskList = storage.getTaskList();  // retrieves taskList so the loop can populate DOM elements with task object properties

    for (let i = 0; i < taskList.length; i++){
      const taskElement = createElement("div", ["task"], parent);

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
  return {parent, renderElements, clearElements};
})();

// will need to add functions to remove single elements (with listener on deleteIcon) and functions to edit element display (taskStorage.js should also
// have a function to edit the internal object properties)
// add task object property "expanded: t/f" then add render logic that (make an toggleDescDisplay fx?) shows a description element if expanded = true
