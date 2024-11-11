// checkout.js

document.getElementById('checkout-button').addEventListener('click', createOrder);

async function createOrder() {
    try {
        const orderData = {
            products: getCartProducts(),
        };
        console.log('Order data being sent:', orderData);

        if (orderData.products.length === 0) {
            alert('Your cart is empty. Please add products to your cart before checking out.');
            return;
        }

        const response = await fetch('/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include authentication headers if necessary
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Order placed successfully!');
            localStorage.removeItem('cart'); // Clear the cart after successful order
            window.location.href = '/order/orderHistory';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error creating order:', error);
        alert('An error occurred while placing your order. Please try again.');
    }
}

function getCartProducts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart items:', cart);

    return cart.map(item => {
        const productId = item.id || item.productId || item._id;
        if (!productId) {
            console.error('Product ID is missing in cart item:', item);
        }
        return {
            product: productId,
            quantity: item.quantity,
        };
    });
}
