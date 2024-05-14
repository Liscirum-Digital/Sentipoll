taskDone = false;

function all_subtasks_done() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"][name="subtask_solved"]');
  subtasks_done = JSON.parse(localStorage.subtasks_done);
  allDone = true;
  checkboxes.forEach(function(checkbox) {
    if (!subtasks_done.includes(checkbox.id)) {
      allDone = false;
    }
  });
  return allDone;
}

function send_solved(elementId) {
    if (!(localStorage && 'subtasks_done' in localStorage)) {
      localStorage;
      localStorage.subtasks_done = JSON.stringify([elementId]);
      fetch("/subtask/done?id="+elementId)
      .then((response) => response.json())
      .then((json) => console.log(json));
    }
    else if (!(JSON.parse(localStorage.subtasks_done).includes(elementId))) {
      subtasks_done = JSON.parse(localStorage.subtasks_done);
      subtasks_done.push(elementId);
      localStorage.subtasks_done = JSON.stringify(subtasks_done);
      fetch("/subtask/done?id="+elementId)
      .then((response) => response.json())
      .then((json) => console.log(json));

      //entire task is done
      if (all_subtasks_done()) { 
        taskDone = true;
        fetch("/task/done?token="+document.getElementById("taskId").value)
        .then((response) => response.json())
        .then((json) => console.log(json));
      }
    }    
    else {
      subtasks_done = JSON.parse(localStorage.subtasks_done);
      subtasks_done.splice(subtasks_done.indexOf(elementId), 1);
      localStorage.subtasks_done = JSON.stringify(subtasks_done);
      fetch("/subtask/undone?id="+elementId)
      .then((response) => response.json())
      .then((json) => console.log(json));
      if (taskDone) {
        fetch("/task/undone?token="+document.getElementById("taskId").value)
        .then((response) => response.json())
        .then((json) => console.log(json));
      }
      
    }
  }