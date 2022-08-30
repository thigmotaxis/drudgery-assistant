export const storage = (() => {
  const taskFactory = (dueDate, taskName, priority, category, description,) => {
    const dataIndex = undefined;
    let complete = false;

    return {dueDate, taskName, priority, category, description, dataIndex, complete};
  };

  let taskList = [];

  const storeTask = (obj) => {
    taskList.push(obj)
// SETS dataIndex PROPERTY SO INDIVIDUAL TASKS CAN BE REFERENCED ELSEWHERE
    for (let i = 0; i < taskList.length; i++) {
      taskList[i].dataIndex = i;
    };
// SORT TASKS CHRONOLOGICALLY
    const chronoTaskList = taskList.sort((previous, next) => previous.dueDate > next.dueDate ? 1 : -1);
    taskList = chronoTaskList;
  };

  const toggleTaskComplete = (domIndex) => {
    const objectDataIndex = taskList.findIndex(task => task.dataIndex == domIndex);
    if (taskList[objectDataIndex].complete !== true) {taskList[objectDataIndex].complete = true}
    else taskList[objectDataIndex].complete = false;
  };

  const removeTask = (domIndex) => {
    const objectDataIndex = taskList.findIndex(task => task.dataIndex === domIndex);
    taskList.splice(objectDataIndex, 1);
  };

  const getTaskList = () => {
    return taskList;
  };
  const sortTasksByCategory = (category) => {
    if (category === "professional") return taskList.filter(task => task.category === "professional")
    if (category === "academic") return taskList.filter(task => task.category === "academic")
    if (category === "personal") return taskList.filter(task => task.category === "personal")
  };
  return {taskFactory, storeTask, toggleTaskComplete, removeTask, getTaskList, sortTasksByCategory}
})();
