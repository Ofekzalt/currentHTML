// orderHistory.js

// Since we're not fetching data via JavaScript anymore, you can remove this code.
// If you have other functions in this file, ensure they don't reference the date.

// If you decide to keep the fetch functionality, adjust the displayOrders function:

async function fetchOrderHistory() {
    try {
        const response = await fetch("/order/api/orderHistory"); // Adjusted endpoint
        if (!response.ok) throw new Error("Failed to load order history");

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error("Error fetching order history:", error);
    }
}

// Function to display orders in the table
function displayOrders(orders) {
    const tableBody = document.querySelector("#orders-table tbody");
    tableBody.innerHTML = "";

    orders.forEach(order => {
        order.products.forEach(item => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <!-- Removed the date column data -->
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>${(item.product.price * item.quantity).toFixed(2)} ₪</td>
            `;

            tableBody.appendChild(row);
        });
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchOrderHistory();
});
