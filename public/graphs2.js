fetch('/views/products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch products.json');
        }
        return response.json();
    })
    .then(products => {
        // Initialize counters for each gender category
        const genderCounts = {
            Male: 0,
            Female: 0,
            Unisex: 0
        };

        // Count the number of products for each gender category
        products.forEach(product => {
            const gender = product.gender;
            if (genderCounts.hasOwnProperty(gender)) {
                genderCounts[gender]++;
            }
        });

        // Prepare the data for the pie chart
        const chartData = {
            labels: ['Male', 'Female', 'Unisex'],
            datasets: [{
                data: [genderCounts.Male, genderCounts.Female, genderCounts.Unisex],
                backgroundColor: [
                    '#a3c4f3',  // Pastel Blue
                    '#a7d8b9',  // Pastel Green
                    '#f5c1d1'   // Pastel Pink
                ],
                borderColor: [
                    '#7fa9d4',  // Slightly darker pastel blue
                    '#8bcf9d',  // Slightly darker pastel green
                    '#f0a1b3'   // Slightly darker pastel pink
                ],
                borderWidth: 1
            }]
        };

        // Create the pie chart using Chart.js
        const ctx = document.getElementById('chart2').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const value = tooltipItem.raw;
                                const percentage = (value / tooltipItem.dataset._meta[0].total) * 100;
                                return `${tooltipItem.label}: ${value} products (${percentage.toFixed(2)}%)`;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error loading the product data:', error);
        alert('There was an error loading the product data.');
    });
