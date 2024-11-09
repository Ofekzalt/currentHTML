document.addEventListener("DOMContentLoaded", () => {
    // loadNavbar();
    // loadProducts();
});

// Fetch the token (from cookies or localStorage)
function getToken() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('auth_token='));
    return cookie ? cookie.split('=')[1] : null;
}

// Check if the user is logged in
async function checkAuth() {
    const token = getToken();

    if (token) {
        try {
            // Send a request to check if the user is authenticated
            const response = await fetch('../middlewares/checkAuth', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                return data.isLoggedIn; // Return true or false based on the response
            } else {
                return false; // If the response is not OK, return false
            }
        } catch (error) {
            console.error("Error checking auth:", error);
            return false;
        }
    } else {
        return false; // No token found, return false
    }
}

// Check the number of items in the user's cart
async function checkItems() {
    const token = getToken();

    if (token) {
        try {
            // Send a request to get the cart item count
            const response = await fetch('/api/checkItems', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                return data.cartItemCount; // Return the number of items in the cart
            } else {
                return 0; // If the response is not OK, return 0
            }
        } catch (error) {
            console.error("Error checking cart items:", error);
            return 0; // In case of error, return 0
        }
    } else {
        return 0; // No token found, return 0
    }
}

// async function loadNavbar() {
//     const isLoggedIn = await checkAuth(); // Get the current login status
//     const cartItemCount = await checkItems(); // Get the number of items in the cart

//     // Select the login link and cart icon
//     const loginLink = document.querySelector('a[href="login.ejs"]');
//     const cartIcon = document.querySelector('a[href="cart.ejs"] img');
    
//     // Update the login link based on user state
//     if (isLoggedIn) {
//         loginLink.textContent = "LogOut";
//         loginLink.href = "logout.ejs"; // Update to your actual logout route
//     } else {
//         loginLink.textContent = "LogIn";
//         loginLink.href = "login.ejs";  // Keep the login link if the user is not logged in
//     }

//     // Update the cart icon with the number of items in the cart
//     const cartIconSrc = cartIcon.getAttribute("src");
//     cartIcon.setAttribute("alt", `Cart (${cartItemCount} items)`);
//     cartIcon.setAttribute("title", `Cart (${cartItemCount} items)`);

//     // Dynamically update the cart item count in the navbar
//     const cartBadge = document.createElement("span");
//     cartBadge.classList.add("cart-badge");
//     cartBadge.textContent = cartItemCount;
//     cartIcon.parentElement.appendChild(cartBadge);
// }

// Your existing product loading function
// async function loadProducts() {
//     try {
//         const response = await fetch('../controllers/productController'); // Replace with actual API route
//         const products = await response.json();

//         const featuredList = document.getElementById("product-list");
//         featuredList.ejs = "";

//         const newArrivalList = document.getElementById("new-arrival-list");
//         newArrivalList.ejs = "";

//         products.forEach(product => {
//             const productDiv = document.createElement("div");
//             productDiv.classList.add("pro");
//             productDiv.ejs = `

//                 <img src="${product.image}" alt="${product.name}">
//                 <h4>${product.name}</h4>
//                 <p>${product.price}</p>
//                 <button>Add to Cart</button>
//             `;
//             featuredList.appendChild(productDiv);
//             newArrivalList.appendChild(productDiv.cloneNode(true));
//         });
//     } catch (error) {
//         console.error("Error loading products:", error);
//     }
// }