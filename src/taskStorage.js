export const storage = (() => {
  const taskList = [];
  const storeTask = (obj) => {
    taskList.push(obj)
    for (let i = 0; i < taskList.length; i++) {
      taskList[i].dataIndex = i;
    }
  };
  const getTaskList = () => {
    return taskList;
  };
  const sortTaskList = (category) => {
    // THIS FUNCTION WILL SORT TASK LIST BASED ON THE SPECIFIED CATEGORY (e.g. DATE OR PROJECT), WILL LIKELY HAVE TO REWORK getTaskList
  };
  return {storeTask, getTaskList}
})();
