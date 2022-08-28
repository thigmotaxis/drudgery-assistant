export const storage = (() => {
  const taskList = [];

  const storeTask = (obj) => {
    taskList.push(obj)
// SET dataIndex PROPERTY SO INDIVIDUAL TASKS CAN BE REFERENCED ELSEWHERE
    for (let i = 0; i < taskList.length; i++) {
      taskList[i].dataIndex = i;
    }
  };

  const removeTask = (taskToDelete, domIndex) => {
    const taskList = getTaskList();
    const doesMatch = (item) => item.dataIndex === domIndex;
    const objectDataIndex = taskList.findIndex(doesMatch);
    taskList.splice(objectDataIndex, 1);
  };

  const getTaskList = () => {
    return taskList;
  };
  const sortTaskList = (category) => {
    // THIS FUNCTION WILL SORT TASK LIST BASED ON THE SPECIFIED CATEGORY (e.g. DATE OR PROJECT), WILL LIKELY HAVE TO REWORK getTaskList
  };
  return {storeTask, removeTask, getTaskList}
})();
