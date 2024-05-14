google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(draw_chart);
var doneSubtasks = []
var allDone = 0;
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
      if (JSON.stringify(data[1])!=JSON.stringify(doneSubtasks)) {
        doneSubtasks = data[1];
        allDone = data[0];
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
  chartData.addColumn('number', 'Fertig');

  var table = document.getElementById('subtasksTable');
  for (var i=0;i<doneSubtasks.length; i++) {
    var row = table.rows[i+1];
    var titleCell = row.cells[0];
    console.log([[String(titleCell.innerHTML), doneSubtasks[i]],])
    chartData.addRows([[String(titleCell.innerHTML), doneSubtasks[i], allDone]]);
  }

  var options = {
    hAxis: {
      title: 'Aufgabe',
    },
    vAxis: {
      title: 'Erledigt'
    },
    seriesType: 'bars',
    series: {1: {type: 'line'}}
  };

  var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));

  chart.draw(chartData, options);
}