var results = []
var title = ""
var xName = ""
var yName = ""
var coordinates = [0, 0]

var chartDiv = document.getElementById("chart_div")


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
      if (JSON.stringify(data)!=JSON.stringify(results)) {
        results = data;
        drawChart();
      }
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

  if (results.length == 0) {
    data.push([document.getElementById('xNumberMin').value-2, document.getElementById('yNumberMin').value-2]);
  }

  for (var i = 0; i < results.length; i++) {
      result = [parseFloat(results[i][0]), parseFloat(results[i][1])]
      data.push(result);
  }

  var chartData = google.visualization.arrayToDataTable(data);

  var options = {
    title: `${title}: ${yName} in Abhängigkeit von ${xName}`,
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
    legend: 'none',
    chartArea:{left:100,top:100,bottom:100,right:20,width:"100%",height:"100%"}
  };

  if (document.getElementById('lineChart').checked) {
    var chart = new google.visualization.LineChart(chartDiv);
  }
  else {
    var chart = new google.visualization.ScatterChart(chartDiv);
  }

  function selectHandler() {
    var selectedItem = chart.getSelection()[0];
    if (selectedItem) {
      document.getElementById('deleteSubmit').disabled = false;
      document.getElementById('deleteX').value = chartData.getValue(selectedItem.row, 0);
      document.getElementById('deleteY').value = chartData.getValue(selectedItem.row, 1);
    }
  }

  google.visualization.events.addListener(chart, 'select', selectHandler);  

  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
    chartDiv.style.padding = "0px";
  }
  else {
    chartDiv.style.padding = "20px";
  }
  chart.draw(chartData, options);
}

window.onresize = drawChart;
