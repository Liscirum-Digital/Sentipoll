var doneSubtasks = []
currentToken = "";

function init(token) {
  currentToken = token;
  fetch(`/task/update/${currentToken}`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      }
  })
  updatePage();
  setInterval(function() {
    updatePage();
  }, 5000);
}

// AJAX requests
function updatePage() {
  fetch(`/task/update/${currentToken}`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (JSON.stringify(data)!=JSON.stringify(doneSubtasks)) {
        doneSubtasks = data;
        edit_table();
      }
  })
  .catch(error => console.error('Error:', error));
}

function edit_table() {
  var table = document.getElementById('subtasksTable');
  for (var i=0;i<doneSubtasks.length; i++) {
    var row = table.rows[i+1];
    var cell = row.cells[1];
    cell.innerHTML = doneSubtasks[i];
  }
}