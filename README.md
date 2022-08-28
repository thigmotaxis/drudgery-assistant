# drudgery-assistant
Wrestle your life into submission with this modest to-do app

webpack/module/OOP practice

Challenges so far:

Matching task DOM elements with the associated task object when deleting tasks from the display and the storage array.
  - I initally used Array.splice() to remove taskObjects from the taskList array, but the object's index in the taskList array only matches the dataIndex attribute of the corresponding DOM element if the user only ever deletes the most recently added task.
  - To fix this problem, I added a dataIndex property to each object created by the taskFactory function.
  - Now I need to figure out how to select an object based on its dataIndex property
