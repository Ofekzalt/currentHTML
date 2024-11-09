function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    cartItems.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        const name = item.name || "לא מוגדר";
        const price = item.price || "0.00";
        const quantity = item.quantity || 1;

        itemDiv.innerHTML = `
            <div class="item-info">
                <img src="${item.image || 'path/to/default-image.jpg'}" alt="${name}" class="cart-item-image">
                <div class="item-details">
                    <span class="item-name">${name}</span>
                    <span class="item-price">מחיר: ${price}</span>
                    <div class="quantity-control">
                        <button class="decrease-quantity" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${quantity}</span>
                        <button class="increase-quantity" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}" onclick="removeItemFromCart(${item.id})">הסר</button>
        `;

        cartContainer.appendChild(itemDiv);
    });

    updateTotalPrice();
}

function updateQuantity(id, amount) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cartItems.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + amount);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        displayCartItems();
    }
}

function updateTotalPrice() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.price.replace('₪', '')) * item.quantity), 0);
    document.getElementById('total-price').innerText = `₪${totalPrice.toFixed(2)}`;
}

// פונקציה להסרת פריט מהעגלה
function removeItemFromCart(id) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems();
}

// אתחול תצוגת העגלה בעת טעינת הדף
window.onload = displayCartItems;

console.log(JSON.parse(localStorage.getItem('cart')));
