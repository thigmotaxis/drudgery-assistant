import "./style.css";
import { modifyDOM } from "./render.js";
import { storage } from "./taskStorage.js";

modifyDOM.renderTasks();

const test = document.querySelector(".logo");
test.addEventListener("click", () => {
  modifyDOM.clearTasks();
  storage.clearSessionStorage();
});
