google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(draw_chart);
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
        draw_chart();
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

function draw_chart() {
  var chartData = new google.visualization.DataTable();
  chartData.addColumn('string', 'Aufgabe');
  chartData.addColumn('number', 'Erledigt');

  var table = document.getElementById('subtasksTable');
  for (var i=0;i<doneSubtasks.length; i++) {
    var row = table.rows[i+1];
    var titleCell = row.cells[0];
    console.log([[String(titleCell.innerHTML), doneSubtasks[i]],])
    chartData.addRows([[String(titleCell.innerHTML), doneSubtasks[i]],]);
  }

  var options = {
    hAxis: {
      title: 'Aufgabe',
    },
    vAxis: {
      title: 'Erledigt'
    }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

  chart.draw(chartData, options);
}