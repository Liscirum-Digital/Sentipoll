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