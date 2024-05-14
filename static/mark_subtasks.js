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
    }    
    else {
      subtasks_done = JSON.parse(localStorage.subtasks_done);
      subtasks_done.splice(subtasks_done.indexOf(elementId), 1);
      localStorage.subtasks_done = JSON.stringify(subtasks_done);
      fetch("/subtask/undone?id="+elementId)
      .then((response) => response.json())
      .then((json) => console.log(json));
    }
  }