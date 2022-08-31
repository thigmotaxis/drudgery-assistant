import "./style.css";
import {renderPage, modifyDOM} from "./render.js";
import {storage} from "./taskStorage.js";




// EVERYTHING BELOW HERE R/T TASK CREATION AND STORAGE WILL EVENTUALLY BE CALLED BY EVENTHANDLERS CREATED BY THE HANDLER MODULE
const obj = storage.taskFactory("2022-12-19", "Birthday Party", "normal", "academic", "Make Abe feel uncomfortable by giving him a lot of attention");
storage.storeTask(obj)
const obj2 = storage.taskFactory("2022-10-12", "Birthday Party", "high", "personal", "Say HBD to Alex");
storage.storeTask(obj2)
modifyDOM.renderTasks()

const test = document.querySelector(".logo")
test.addEventListener("click", () => {
  modifyDOM.clearTasks();
});
