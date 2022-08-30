# drudgery-assistant
Wrestle your life into submission with this modest to-do app

webpack/module/OOP practice

Future Issues to Address:

1) dig into date management library and refactor sortTasksByDate()


Challenges So Far:

1) Matching task DOM elements with the associated task object when deleting tasks from the display and the storage array.
  - I initally used Array.splice() to remove taskObjects from the taskList array, but the object's index in the taskList array only matches the dataIndex attribute of the corresponding DOM element if the user only ever deletes the most recently added task.
  - To fix this problem, I added a dataIndex property to each object created by the taskFactory function and used Array.findIndex to match the data-index dom attribute with the dataIndex object property

2) Refactoring render.renderTasks() to accept a taskList parameter resulted in a "taskList is undefined" error because the render module is an IFFE and renderTasks() is returned for export
  - I solved this by setting a default value for the taskList parameter (in this case taskList = storage.getTaskList). Now renderTasks can be invoked to display sorted task lists, and it will default to the full task list if no argument is passed. I should start using default values more often!

3) Adding task sorting features broke removeTask() because they change the dataIndex property of the sorted taskObjects without updating the corresponding DOM element's data-index attribute.
  - Possible solutions:
    1) update the dom elements' data-index attributes when sorting
    2) don't change the dataIndex property
  - Turns out I was wrong about this and the actual problem was that storage.removeTask was using strict equality to compare string and int values in its findIndex invocation. This caused findIndex to return -1, which meant that the next line always called Array.splice(-1, 1), causing it to remove the final taskObject rather than the object represented by the clicked DOM element.
    - Some good debugging practice!
