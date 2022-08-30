# drudgery-assistant
Wrestle your life into submission with this modest to-do app

webpack/module/OOP practice

Challenges so far:

Matching task DOM elements with the associated task object when deleting tasks from the display and the storage array.
  - I initally used Array.splice() to remove taskObjects from the taskList array, but the object's index in the taskList array only matches the dataIndex attribute of the corresponding DOM element if the user only ever deletes the most recently added task.
  - To fix this problem, I added a dataIndex property to each object created by the taskFactory function and used Array.findIndex to match the data-index dom attribute with the dataIndex object property

Refactoring render.renderTasks() to accept a taskList parameter resulted in a "taskList is undefined" error because the render module is an IFFE and renderTasks() is returned for export
  - I solved this by setting a default value for the taskList parameter (in this case taskList = storage.getTaskList). Now renderTasks can be invoked to display sorted task lists, and it will default to the full task list if no argument is passed. I should start using default values more often!
