document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const genderFilter = document.getElementById('gender-filter');
    const priceSortAsc = document.getElementById('price-sort-asc');
    const priceSortDesc = document.getElementById('price-sort-desc');
    const colorFilter = document.getElementById('color-filter');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    

    // Store all products for filtering and sorting
    let allProducts = Array.from(document.querySelectorAll('.product'));

    // Function to display products on the page
    function displayProducts(products) {
        productList.innerHTML = '';
        if (products.length > 0) {
            products.forEach(product => {
                productList.appendChild(product);
            });
        } else {
            productList.innerHTML = '<p>No products match your criteria.</p>';
        }
    }

    // Function to show loading spinner
    function showLoading() {
        loadingSpinner.style.display = 'block';
    }

    // Function to hide loading spinner
    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }

    // Function to apply all filters and sorting
    function applyFiltersAndSort() {
        showLoading();
        setTimeout(() => { // Simulate loading delay
            let filtered = [...allProducts];

            // Apply color filter
            const selectedColor = colorFilter.value.toLowerCase();
            if (selectedColor) {
                filtered = filtered.filter(product => {
                    const color = product.getAttribute('data-color') || '';
                    return color.toLowerCase() === selectedColor;
                });
            }

            // Apply gender filter
            const selectedGender = genderFilter.value.toLowerCase();
            if (selectedGender) {
                filtered = filtered.filter(product => {
                    const gender = product.getAttribute('data-gender') || '';
                    return gender.toLowerCase() === selectedGender;
                });
            }

            // Apply search filter
            const searchQuery = searchInput.value.toLowerCase();
            if (searchQuery) {
                filtered = filtered.filter(product => {
                    const name = product.querySelector('h3').innerText.toLowerCase();
                    const caption = product.querySelector('p').innerText.toLowerCase();
                    return name.includes(searchQuery) || caption.includes(searchQuery);
                });
            }

            // Apply sorting
            const sortOrder = document.querySelector('.sort-filters').getAttribute('data-sort-order');
            if (sortOrder === 'asc') {
                filtered.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.price').innerText);
                    const priceB = parseFloat(b.querySelector('.price').innerText);
                    return priceA - priceB;
                });
            } else if (sortOrder === 'desc') {
                filtered.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.price').innerText);
                    const priceB = parseFloat(b.querySelector('.price').innerText);
                    return priceB - priceA;
                });
            }

            displayProducts(filtered);
            hideLoading();
        }, 500); // Adjust delay as needed
    }

    // Event listeners for filters and sorting
    colorFilter.addEventListener('change', applyFiltersAndSort);
    genderFilter.addEventListener('change', applyFiltersAndSort);

    priceSortAsc.addEventListener('click', () => {
        document.querySelector('.sort-filters').setAttribute('data-sort-order', 'asc');
        applyFiltersAndSort();
    });

    priceSortDesc.addEventListener('click', () => {
        document.querySelector('.sort-filters').setAttribute('data-sort-order', 'desc');
        applyFiltersAndSort();
    });

    // Event listener for search
    searchButton.addEventListener('click', applyFiltersAndSort);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFiltersAndSort();
        }
    });

    // Initial display
    applyFiltersAndSort();
});