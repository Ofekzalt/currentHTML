// Define utility functions if not already defined


// Define actions
const actions = [
    // ... (your actions code here)
];


const data = {
    labels: ['Air Jordan 1', 'Air Jordan 3', 'Air Jordan 4', 'Air Jordan 11', 'Air Jordan 6', 'Air Jordan 5', 'Air Jordan 12', 'Air Jordan 13'],
    datasets: [
      {
        label: 'Jordan Shoe Sales',
        data: [1500, 1200, 1000, 800, 600, 500, 400, 300],
        backgroundColor: [
          '#FF4C4C',  // Bright Red
          '#FF6B6B',  // Light Red
          '#FF8989',  // Soft Red
          '#FFB3B3',  // Pale Red
          '#FF9999',  // Light Pinkish Red
          '#FFCCCC',  // Very Light Red
          '#FF2E2E',  // Strong Red
          '#FF7F7F'   // Medium Light Red
        ],
      }
    ]
  };
  

// Define chart configuration
const config = {
    type: 'pie',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Pie Chart'
            }
        }
    },
};

// Render the chart
const myChart = new Chart(document.getElementById('myChart'), config);

// Create action buttons
actions.forEach(action => {
    const button = document.createElement('button');
    button.innerText = action.name;
    button.onclick = () => action.handler(myChart);
    document.getElementById('actions').appendChild(button);
});
