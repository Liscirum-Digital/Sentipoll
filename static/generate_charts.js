var results = []
var title = ""
var xName = ""
var yName = ""


function init(surveyTitle, x, y) {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  title=surveyTitle;
  xName=x;
  yName=y;
  setInterval(function() {
    updatePage();
  }, 1000);
}

// AJAX requests
function updatePage() {
    currentToken = document.getElementById('token').value;
    fetch(`/update/${currentToken}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        results = data;
    })
    .catch(error => console.error('Error:', error));

    drawChart();
}

function drawChart() {
  data = [[xName, yName]];
  // get axis scaling
  xScaling = 'linear';
  yScaling = 'linear';
  if (document.getElementById('xLog').checked) {
    xScaling = 'log';
  }
  if (document.getElementById('yLog').checked) {
    yScaling = 'log';
  }

  for (var i = 0; i < results.length; i++) {
      result = [parseFloat(results[i][0]), parseFloat(results[i][1])]
      data.push(result);
  }

  var chartData = google.visualization.arrayToDataTable(data);

  var options = {
    title: `${yName} in Abhängigkeit von ${xName}`,
    hAxis: {
      title: xName,
      scaleType: xScaling,
      viewWindowMode:'explicit',
      viewWindow: {
        min: parseFloat(document.getElementById('xRangeMin').value),
        max: parseFloat(document.getElementById('xRangeMax').value),
      }
    },
    vAxis: {
      title: yName,
      scaleType: yScaling,
      viewWindowMode:'explicit',
      viewWindow: {
        min: parseFloat(document.getElementById('yRangeMin').value),
        max: parseFloat(document.getElementById('yRangeMax').value),
      }
    },
    width: '100%',
    height: '100%',
    legend: 'none'
  };

  var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

  chart.draw(chartData, options);
}
