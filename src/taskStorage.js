export const storage = (() => {
  const taskFactory = (dueDate, taskName, priority, category, description,) => {
    let dataIndex = undefined;
    let complete = false;

    return {dueDate, taskName, priority, category, description, dataIndex, complete};
  };

  let taskList = [];

  const storeTask = (obj) => {
    taskList.push(obj)
// SORT TASKS CHRONOLOGICALLY
    const chronoTaskList = taskList.sort((previous, next) => previous.dueDate > next.dueDate ? 1 : -1);
    taskList = chronoTaskList;
// SETS dataIndex PROPERTY SO INDIVIDUAL TASKS CAN BE REFERENCED ELSEWHERE
    for (let i = 0; i < taskList.length; i++) {
      taskList[i].dataIndex = i;
    };
  };

  const toggleTaskComplete = (domIndex) => {
    const objectDataIndex = taskList.findIndex(task => task.dataIndex == domIndex);
    if (taskList[objectDataIndex].complete !== true) {taskList[objectDataIndex].complete = true}
    else taskList[objectDataIndex].complete = false;
  };

  const removeTask = (domIndex) => {
    const objectDataIndex = taskList.findIndex(task => task.dataIndex === parseInt(domIndex));
    taskList.splice(objectDataIndex, 1);
  };

  const getTaskList = () => {
    return taskList;
  };

  const sortTasksByDate = (date) => {
    const today = new Date().toISOString().slice(0, 10);          // gets todays date and returns it in the same format as taskObject.dueDate.
                                                                  // this will need to be updated once I dig into the date formatting library 
    if (date === "today") return taskList.filter(task => task.dueDate === today);
  };

  const sortTasksByCategory = (category) => {
    if (category === "professional") return taskList.filter(task => task.category === "professional")
    if (category === "academic") return taskList.filter(task => task.category === "academic")
    if (category === "personal") return taskList.filter(task => task.category === "personal")
  };
  return {taskFactory, storeTask, toggleTaskComplete, removeTask, getTaskList, sortTasksByDate, sortTasksByCategory}
})();
