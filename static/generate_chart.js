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
  currentToken = document.getElementById('token').value;
  fetch(`/update/${currentToken}`, {
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
      drawChart();
  })
  .catch(error => console.error('Error:', error));
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

  if (document.getElementById('pointShapeSelect').value == 'cross') {
    userPointShape = { type: 'star', sides: 4, dent: 0.2, rotation: 45 };
  }

  else {
    userPointShape = document.getElementById('pointShapeSelect').value;
  }

  for (var i = 0; i < results.length; i++) {
      result = [parseFloat(results[i][0]), parseFloat(results[i][1])]
      data.push(result);
  }

  var chartData = google.visualization.arrayToDataTable(data);

  var options = {
    title: `${yName} in Abhängigkeit von ${xName}`,
    titleTextStyle: {
      fontSize: document.getElementById('fontSize').value*1.3,
    },
    hAxis: {
      title: xName,
      scaleType: xScaling,
      viewWindowMode:'explicit',
      viewWindow: {
        min: parseFloat(document.getElementById('xRangeMin').value),
        max: parseFloat(document.getElementById('xRangeMax').value),
      },
      textStyle : {
        fontSize: document.getElementById('fontSize').value,
      },
      titleTextStyle: {
        fontSize: document.getElementById('fontSize').value,
      }
    },
    vAxis: {
      title: yName,
      scaleType: yScaling,
      viewWindowMode:'explicit',
      viewWindow: {
        min: parseFloat(document.getElementById('yRangeMin').value),
        max: parseFloat(document.getElementById('yRangeMax').value),
      },
      textStyle : {
        fontSize: document.getElementById('fontSize').value,
      },
      titleTextStyle: {
        fontSize: document.getElementById('fontSize').value,
      }
    },
    pointSize: document.getElementById('pointSize').value,
    pointShape: userPointShape,
    width: '2000',
    height: '870',
    legend: 'none'
  };

  if (document.getElementById('lineChart').checked) {
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  }
  else {
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
  }

  

  chart.draw(chartData, options);
}
