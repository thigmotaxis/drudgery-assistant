import {renderPage} from "./render.js";
import {format, add, isSameMonth} from "date-fns";

export const storage = (() => {
  const taskFactory = (dueDate, taskName, priority, category, description,) => {
    let dataIndex = undefined;
    let complete = false;

    return {dueDate, taskName, priority, category, description, dataIndex, complete};
  };

// RETRIEVE currentTaskList from SESSION STORAGE
  const getTaskListFromSession = () => {
    let currentTaskList = JSON.parse(window.sessionStorage.getItem("currentTaskList"));
    if (!currentTaskList) return [];
    return currentTaskList;
  };

  let taskList = [];
// CHECK STORAGE FOR taskList AND UPDATE IF FOUND
  if (window.sessionStorage.getItem("currentTaskList")) {
    taskList = getTaskListFromSession()
  }

// SORTS taskList BY dueDate AND SECONDARILY BY priority
  const sortTaskList = (taskList) => {
    const chronoTaskList = taskList.sort((a, b) => {if (a.dueDate == b.dueDate) {
      return a.priority > b.priority ? 1 : -1;
    } else return a.dueDate > b.dueDate ? 1 : -1});
    return chronoTaskList;
  };

  const storeTaskListInSession = (taskList) => {
    const chronoTaskList = sortTaskList(taskList)
    window.sessionStorage.setItem("currentTaskList", JSON.stringify(chronoTaskList));
  };

// added for testing purposes, should clear this from exports and from index.js when feature completed
  const clearSessionStorage = () => {
    sessionStorage.clear();
  };

  const storeTask = (obj) => {
    taskList.push(obj)
// SORT TASKS CHRONOLOGICALLY
    const chronoTaskList = taskList.sort((previous, next) => previous.dueDate > next.dueDate ? 1 : -1);
    taskList = chronoTaskList;
// SETS dataIndex PROPERTY SO INDIVIDUAL TASKS CAN BE REFERENCED ELSEWHERE
    for (let i = 0; i < taskList.length; i++) {
      taskList[i].dataIndex = i;
    };
    storeTaskListInSession(taskList);
  };

  const retrieveTaskObject = (domIndex) => {
    const objectDataIndex = taskList.findIndex(task => task.dataIndex == domIndex);
    return taskList[objectDataIndex];
  };

  const toggleTaskComplete = (domIndex) => {
    const objectDataIndex = taskList.findIndex(task => task.dataIndex == domIndex);
    if (taskList[objectDataIndex].complete !== true) {taskList[objectDataIndex].complete = true}
    else taskList[objectDataIndex].complete = false;
    storeTaskListInSession(taskList)
  };

  const editTask = (objectToEdit) => {
    objectToEdit.dueDate = document.getElementById("ntDueDate").value;
    objectToEdit.taskName = document.getElementById("ntName").value;
    objectToEdit.priority = document.getElementById("ntPriority").value;
    objectToEdit.category = document.getElementById("ntCategory").value;
    objectToEdit.description = document.getElementById("ntDesc").value;
    storeTaskListInSession(taskList)
  }

  const removeTask = (domIndex) => {
    const objectDataIndex = taskList.findIndex(task => task.dataIndex === parseInt(domIndex));
    taskList.splice(objectDataIndex, 1);
    storeTaskListInSession(taskList);
  };

  const sortTasksByPriority = (priority) => {
    if (priority === "allTasks") return taskList;
    if (priority === "urgent") return taskList.filter(task => task.priority === "high");
  };

  const sortTasksByDate = (date) => {
    const today = new Date();
    const oneWeekFromToday = add(today, {weeks : 1});
    const weekStart = format(today, "yyyy-MM-dd");
    const weekEnd = format(oneWeekFromToday, "yyyy-MM-dd");
    if (date === "today") return taskList.filter(task => task.dueDate === format(today, "yyyy-MM-dd"));
    if (date === "thisWeek") return taskList.filter(task => task.dueDate >= weekStart && task.dueDate <= weekEnd);
    if (date === "thisMonth") return taskList.filter(task => isSameMonth(today, new Date(task.dueDate)));
  };

  const sortTasksByCategory = (category) => {
    if (category === "personal") return taskList.filter(task => task.category === "personal")
    if (category === "professional") return taskList.filter(task => task.category === "professional")
    if (category === "academic") return taskList.filter(task => task.category === "academic")
  };
  return {taskFactory, clearSessionStorage, storeTask, retrieveTaskObject, toggleTaskComplete, editTask, removeTask, getTaskListFromSession, sortTasksByPriority, sortTasksByDate, sortTasksByCategory}
})();
