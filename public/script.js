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

function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
        alert(`כמות המוצר ${product.name} עודכנה לעת ${existingItem.quantity}.`);

    } else {
        product.quantity = 1;
        cart.push(product);
        alert(`המוצר ${product.name} נוסף לעגלה.`);

    }

    localStorage.setItem('cart', JSON.stringify(cart));
     // שואל את המשתמש אם הוא רוצה לעבור לעגלה
     if (confirm("האם אתה רוצה לעבור לעגלה?")) {
        window.location.href = "cart.html";
     }
}

document.addEventListener('DOMContentLoaded', loadProduct);
