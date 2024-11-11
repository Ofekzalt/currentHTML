//script.js
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function loadProduct() {
    const productId = getProductIdFromUrl();
    if (!productId) return;

    fetch('product-data.json')
        .then(response => response.json())
        .then(data => { 
            const product = data.products.find(item => item.id == productId);

            if (product) {
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-price').textContent = product.price;
                document.getElementById('product-image').src = product.image;
                document.getElementById('product-caption').textContent = product.caption;

                const sizeSelect = document.getElementById('product-size');
                sizeSelect.innerHTML = '';
                product.sizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    sizeSelect.appendChild(option);
                });

                document.querySelector(".Add-Cart").addEventListener("click", () => addToCart(product));
            } else {
                console.error("Product not found");
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
}

// פונקציה להוספת מוצר לעגלה
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch product details from the server or from the DOM
    fetch(`/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const existingItem = cart.find(item => item.id === product._id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product._id, // Use the product's _id as the id
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart after adding item:', cart);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}




console.log(JSON.parse(localStorage.getItem('cart')));
console.log(localStorage.getItem('cart'));


document.addEventListener('DOMContentLoaded', loadProduct);