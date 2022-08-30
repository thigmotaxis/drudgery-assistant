export const storage = (() => {
  const taskFactory = (dueDate, taskName, priority, description) => {
    const dataIndex = undefined;
    let complete = false;

    return {dueDate, taskName, priority, description, dataIndex, complete};
  };

  const taskList = [];

  const storeTask = (obj) => {
    taskList.push(obj)
// SETS dataIndex PROPERTY SO INDIVIDUAL TASKS CAN BE REFERENCED ELSEWHERE
    for (let i = 0; i < taskList.length; i++) {
      taskList[i].dataIndex = i;
    }
  };

  const toggleTaskComplete = (domIndex) => {
    const taskList = getTaskList();
    const objectDataIndex = taskList.findIndex(task => task.dataIndex == domIndex);
    if (taskList[objectDataIndex].complete !== true) {taskList[objectDataIndex].complete = true}
    else taskList[objectDataIndex].complete = false;
  };

  const removeTask = (domIndex) => {
    const taskList = getTaskList();
    const objectDataIndex = taskList.findIndex(task => task.dataIndex === domIndex);
    taskList.splice(objectDataIndex, 1);
  };

  const getTaskList = () => {
    return taskList;
  };
  const sortTaskList = (category) => {
    // THIS FUNCTION WILL SORT TASK LIST BASED ON THE SPECIFIED CATEGORY (e.g. DATE OR PROJECT), WILL LIKELY HAVE TO REWORK getTaskList
  };
  return {taskFactory, storeTask, toggleTaskComplete, removeTask, getTaskList}
})();
