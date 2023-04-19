function bar(xName, yName, results) {
  const ctx = document.getElementById('chart');

  new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [xName, yName],
        datasets: [{
          label: 'Anzahl',
          data: results,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
      });
}