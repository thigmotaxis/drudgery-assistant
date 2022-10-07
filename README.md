# drudgery-assistant

Wrestle your life into submission with this modest to-do app

Features:

- add/edit/delete tasks
- sort by time period/category/priority/completeness (each sort function also secondarily sorts by date and priority)
- tasks are stored via session storage, so they will persist until the user closes the browser tab

Known Bugs and Future Development Plans:

1. The button that toggles the display menu on mobile devices toggles a muting effect on tasks as well - this effect is removed if a task edit button is clicked or if a sort option is clicked. Also, the effect is not removed if the browser is resized (causing the toggle button to disappear). Possible fixes below:

- Z-indexed layer over .toDos with a transparent background to prevent edit button clicks
- Add a "muted" property to task objects and modify renderTasks() to display muted tasks as muted
- Create a media query to set task opacity to 1 if browser is resized to width: 600px or larger

2. Improve layout. I have added a few hover and mouseover effects to make clickable elements more obviously interactive, but there's still room to improve. Buttons could move slightly/alter shadow effects on click.

3. Fix minor bug with "thisMonth" sort. Currently, it displays a task due 10/1 (this is almost certainly a timezone issue and an easy fix).

4. refactor "thisWeek" sort so that it displays tasks due in the current week rather than one week from today.

5. Add a dark mode? Never done this before, but it seems like it'd be pretty easy to implement.

Challenges So Far:

1. Matching task DOM elements with the associated task object when deleting tasks from the display and the storage array.

- I initally used Array.splice() to remove taskObjects from the taskList array, but the object's index in the taskList array only matches the dataIndex attribute of the corresponding DOM element if the user only ever deletes the most recently added task.
- To fix this problem, I added a dataIndex property to each object created by the taskFactory function and used Array.findIndex to match the data-index dom attribute with the dataIndex object property

2. Refactoring render.renderTasks() to accept a taskList parameter resulted in a "taskList is undefined" error because the render module is an IFFE and renderTasks() is returned for export

- I solved this by setting a default value for the taskList parameter (in this case taskList = storage.getTaskList). Now renderTasks can be invoked to display sorted task lists, and it will default to the full task list if no argument is passed. I should start using default values more often!

3. Adding task sorting features broke removeTask() because they change the dataIndex property of the sorted taskObjects without updating the corresponding DOM element's data-index attribute.

- Possible solutions:
  1. update the dom elements' data-index attributes when sorting
  2. don't change the dataIndex property
- Turns out I was wrong about this and the actual problem was that storage.removeTask was using strict equality to compare string and int values in its findIndex invocation. This caused findIndex to return -1, which meant that the next line always called Array.splice(-1, 1), causing it to remove the final taskObject rather than the object represented by the clicked DOM element.
  - Some good debugging practice!

4. JS dates are kind of a pain, but digging into date-fns a bit was really interesting. Good experience using a library.
