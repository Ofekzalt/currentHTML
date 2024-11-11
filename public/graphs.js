fetch('/views/products.json')
    .then(response => response.json())  // Parse the JSON data
    .then(products => {
        // Extract the product names and prices
        const productNames = products.map(product => product.name);
        const productPrices = products.map(product => product.price);

        // Define an array of pastel colors for each bar
        const pastelColors = [
            '#a3c4f3',  // Pastel Blue
            '#a7d8b9',  // Pastel Green
            '#f5c1d1',  // Pastel Pink
            '#f3e0b5',  // Pastel Yellow
            '#d6a5e3',  // Pastel Purple
            '#f9b5b8',  // Pastel Red
            '#e0c5a2',  // Pastel Beige
            '#f7a8b8',  // Pastel Peach
            '#f3b7a1',  // Pastel Coral
            '#f1d3d3'   // Pastel Lavender
        ];

        // If there are more products than colors, loop over the pastel colors array
        const productColors = productNames.map((_, index) => {
            return pastelColors[index % pastelColors.length]; // Repeats colors if more bars than colors
        });

        // Create the bar chart using Chart.js
        const ctx = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar', // Bar chart type
            data: {
                labels: productNames,  // Product names on the X-axis
                datasets: [{
                    label: 'Product Price ($)',  // Label for the dataset
                    data: productPrices,  // Product prices on the Y-axis
                    backgroundColor: productColors,  // Set the pastel colors for each bar
                    borderColor: '#ccc',  // Light gray border for all bars
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,  // Start the Y-axis from 0
                        ticks: {
                            stepSize: 20  // Make the Y-axis ticks step by 20 for better clarity
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: true,  // Skip some X-axis labels if they're too crowded
                            maxRotation: 45,  // Rotate X-axis labels to avoid overlap
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false  // Hide the legend
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error loading the product data:', error));  // Handle errors if the JSON file can't be fetched
