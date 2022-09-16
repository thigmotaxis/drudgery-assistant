# drudgery-assistant
Wrestle your life into submission with this modest to-do app

webpack/module/OOP practice

Future Features to Add:

1) Improve layout. I have added a few hover and mouseover effects to make clickable elements more obviously interactive, but there's still room to improve. Buttons could move slightly/alter shadow effects on click. I also need to add min/max size rules to prevent the display from distorting on browser resize.

2) Fix minor bug with "thisMonth" sort. Currently, it displays a task due 10/1 (this is almost certainly a timezone issue and an easy fix).

3) refactor "thisWeek" sort so that it displays tasks due in the current week rather than one week from today.

4) Add a dark mode? Never done this before, but it seems like it'd be pretty easy to implement.

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
    
4) JS dates are kind of a pain, but digging into date-fns a bit was really interesting. Good experience using a library.
