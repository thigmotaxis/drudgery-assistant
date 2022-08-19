const taskList = [];

export function receiveTask(object) {
  taskList.push(object);
  return taskList;
}
