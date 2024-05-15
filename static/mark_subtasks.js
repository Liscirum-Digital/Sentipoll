taskDone = false;

function all_subtasks_done() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"][name="subtask_solved"]');
  subtasks_done = JSON.parse(localStorage.subtasks_done);
  allDone = true;
  checkboxes.forEach(function(checkbox) {
    if (!subtasks_done.includes(checkbox.id.split('_')[1])) {
      allDone = false;
    }
  });
  return allDone;
}

function send_solved(elementId) {
    var subtaskId = elementId.split('_')[1];
    if (!(localStorage && 'subtasks_done' in localStorage)) {
      localStorage;
      localStorage.subtasks_done = JSON.stringify([subtaskId]);
      fetch("/subtask/done?id="+subtaskId)
      .then((response) => response.json())
      .then((json) => console.log(json));
    }
    else if (!(JSON.parse(localStorage.subtasks_done).includes(subtaskId))) {
      subtasks_done = JSON.parse(localStorage.subtasks_done);
      subtasks_done.push(subtaskId);
      localStorage.subtasks_done = JSON.stringify(subtasks_done);
      fetch("/subtask/done?id="+subtaskId)
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
      subtasks_done.splice(subtasks_done.indexOf(subtaskId), 1);
      localStorage.subtasks_done = JSON.stringify(subtasks_done);
      fetch("/subtask/undone?id="+subtaskId)
      .then((response) => response.json())
      .then((json) => console.log(json));
      if (taskDone) {
        fetch("/task/undone?token="+document.getElementById("taskId").value)
        .then((response) => response.json())
        .then((json) => console.log(json));
        taskDone = false;
      }
      
    }
  }

function send_problem(elementId) {
  var subtaskId = elementId.split('_')[1];
  if (!(localStorage && 'subtasks_problem' in localStorage)) {
    localStorage;
    localStorage.subtasks_problem = JSON.stringify([subtaskId]);
    fetch("/subtask/problem?id="+subtaskId)
    .then((response) => response.json())
    .then((json) => console.log(json));
  }
  else if (!(JSON.parse(localStorage.subtasks_problem).includes(subtaskId))) {
    subtasks_problem = JSON.parse(localStorage.subtasks_problem);
    subtasks_problem.push(subtaskId);
    localStorage.subtasks_problem = JSON.stringify(subtasks_problem);
    fetch("/subtask/problem?id="+subtaskId)
    .then((response) => response.json())
    .then((json) => console.log(json));
  }    
  else {
    subtasks_problem = JSON.parse(localStorage.subtasks_problem);
    subtasks_problem.splice(subtasks_problem.indexOf(subtaskId), 1);
    localStorage.subtasks_problem = JSON.stringify(subtasks_problem);
    fetch("/subtask/unproblem?id="+subtaskId)
    .then((response) => response.json())
    .then((json) => console.log(json));
  }
}