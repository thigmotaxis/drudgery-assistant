export const storage = (() => {
  const taskList = [];

  const storeTask = (obj) => {
    taskList.push(obj)
// SET dataIndex PROPERTY SO INDIVIDUAL TASKS CAN BE REFERENCED ELSEWHERE
    for (let i = 0; i < taskList.length; i++) {
      taskList[i].dataIndex = i;
    }
  };

  const removeTask = (taskToDelete) => {
    const domIndex = parseInt(taskToDelete.getAttribute("data-index"));
    const taskList = getTaskList();
    console.log(taskList)
    for (let i = 0; i < taskList.length; i++) {
      const objectDataIndex = taskList[i].dataIndex
      if (domIndex === objectDataIndex) {
        taskList.splice(taskList.indexOf(taskList[i]), 1);
        return;
      };
    };
  };
  const getTaskList = () => {
    return taskList;
  };
  const sortTaskList = (category) => {
    // THIS FUNCTION WILL SORT TASK LIST BASED ON THE SPECIFIED CATEGORY (e.g. DATE OR PROJECT), WILL LIKELY HAVE TO REWORK getTaskList
  };
  return {storeTask, removeTask, getTaskList}
})();
