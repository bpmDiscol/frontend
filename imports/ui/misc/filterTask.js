export function filterTasks(taskList, comparator) {
  if (taskList.length)
    return taskList.filter((taskData) => {
      let res = false;
      comparator.forEach((element) => {
        if (taskData.assigned_id == element) res = true;
      });
      return res;
    });
}
