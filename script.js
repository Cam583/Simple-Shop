let products = [];
let currentPage = 1;
const itemsPerPage = 6;
let cart = [];

// Load Products (same as before)
fetch("products.json")
    .then(response => response.json())
    .then(data => {
        products = data;
        renderProducts();
    })
    .catch(error => console.error("Error loading products:", error));

// Render products (same as before)
function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = products.slice(start, end);

    pageProducts.forEach(product => {
        const productEl = document.createElement("div");
        productEl.className = "product";
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productEl);
    });

    document.getElementById("page-indicator").textContent = `Page ${currentPage}`;
}

// Pagination (same as before)
function changePage(direction) {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderProducts();
}

// Cart Functions with Quantity Support
function addToCart(id) {
    const product = products.find(p => p.id === id);
    // Check if product already in cart
    const cartItem = cart.find(item => item.product.id === id);
    if (cartItem) {
        // Increase quantity
        cartItem.quantity += 1;
    } else {
        // Add new product with quantity 1
        cart.push({ product, quantity: 1 });
    }
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.product.name} - $${item.product.price} x ${item.quantity} = $${itemTotal.toFixed(2)}
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(li);
    });

    document.getElementById("total").textContent = total.toFixed(2);
}

function removeFromCart(index) {
    // Remove one quantity or the entire item
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

// Initialize
renderProducts();
