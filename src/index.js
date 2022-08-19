import "./style.css";
import renderPage from "./render.js";
import {taskFactory} from "./taskFactory.js";
import {receiveTask} from "./taskStorage.js"

renderPage();
const obj = taskFactory("12/19/2022", "Birthday Party", "Make Abe feel uncomfortable by giving him a lot of attention");
const obj2 = taskFactory("10/12/2022", "Birthday Party", "Say HBD to Alex");
const test = receiveTask(obj);
const test2 = receiveTask(obj2)
console.log(test);
