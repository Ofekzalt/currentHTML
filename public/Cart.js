// cart.js

// Function to display cart items on the page
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <div class="item-info">
                <img src="${item.image || 'path/to/default-image.jpg'}" alt="${item.name}" class="cart-item-image">
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">מחיר: ${item.price}</span>
                    <span class="quantity">כמות: ${item.quantity}</span>
                </div>
            </div>
            <div class="item-actions">
                <button onclick="updateQuantity('${item.id}', -1)">-</button>
                <button onclick="updateQuantity('${item.id}', 1)">+</button>
                <button onclick="removeItemFromCart('${item.id}')">Remove</button>
            </div>
        `;
        cartContainer.appendChild(itemDiv);
    });

    updateTotalPrice();
}

// Function to update the quantity of a cart item
function updateQuantity(id, amount) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cartItems.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + amount);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        displayCartItems();
    }
}

// Function to update the total price displayed
function updateTotalPrice() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + (price * item.quantity);
    }, 0);
    document.getElementById('total-price').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeItemFromCart(id) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems();
}

// window.onload ensures that the displayCartItems function runs when the page loads
window.onload = displayCartItems;

// Optional: Log the cart contents to the console for debugging
console.log('Current cart contents:', JSON.parse(localStorage.getItem('cart')));
