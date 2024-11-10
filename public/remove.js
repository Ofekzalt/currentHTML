let users = [];
let products = [];

// Function to fetch JSON data
async function fetchData() {
    try {
        //const usersResponse = await fetch('/views/users.json');
        const productsResponse = await fetch('/views/products.json');

        if (usersResponse.ok && productsResponse.ok) {
            users = await usersResponse.json();
            products = await productsResponse.json();
        } else {
            console.error('Failed to fetch data from JSON files');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to remove a user by ID
function removeUser() {
    const userId = document.getElementById('remove-user-id').value;
    const userIndex = users.findIndex(user => user.id === parseInt(userId));

    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Remove user from the array
        alert('User removed successfully');
    } else {
        alert('User not found');
    }
}

// Function to remove a product by ID
function removeProduct() {
    const productId = document.getElementById('remove-product-id').value;
    const productIndex = products.findIndex(product => product.id === parseInt(productId));

    if (productIndex !== -1) {
        products.splice(productIndex, 1); // Remove product from the array
        alert('Product removed successfully');
    } else {
        alert('Product not found');
    }
}

// Initial fetch of data when the page loads
window.onload = fetchData;
