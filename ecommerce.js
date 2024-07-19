document.addEventListener('DOMContentLoaded', function () {

    applySavedTheme();

    const username = sessionStorage.getItem('user');
    if (!username) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('username-display').textContent = `Bienvenido a nuestra tienda, ${username}!`;
    }

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            window.products = products;
            displayProducts(products);
        })
        .catch(error => console.error('Error cargando productos:', error));
});

document.getElementById('logout-btn').addEventListener('click', function () {
    sessionStorage.removeItem('user');
    Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        text: 'Ha cerrado sesión correctamente.',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        window.location.href = 'index.html';
    });
});

document.getElementById('theme-toggle').addEventListener('click', function () {
    toggleTheme();
});

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        document.body.classList.add('light-theme');
    }
}

function toggleTheme() {
    if (document.body.classList.contains('light-theme')) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
}

let cart = [];

function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('col-md-4');
        productElement.innerHTML = `
            <div class="card mb-4">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Precio: $${product.price}</p>
                    <p class="card-text">Stock: ${product.stock}</p>
                    <input type="number" id="quantity-${product.id}" min="1" max="${product.stock}" value="1" class="form-control mb-2" />
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
                        ${product.stock <= 0 ? 'Agotado' : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

function addToCart(productId) {
    const product = window.products.find(p => p.id === productId);
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (product && product.stock >= quantity) {
        const existingProductInCart = cart.find(p => p.id === productId);
        if (existingProductInCart) {
            existingProductInCart.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        product.stock -= quantity;
        displayProducts(window.products);
        displayCart();

        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Stock insuficiente',
            text: 'No hay suficiente stock para la cantidad seleccionada.',
            confirmButtonText: 'Aceptar'
        });
    }
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('card', 'mb-2');
        cartItem.innerHTML = `
            <div class="card-body d-flex align-items-center">
                <img src="${product.image}" alt="${product.name}" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                <div>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Precio: $${product.price}</p>
                    <p class="card-text">Cantidad: ${product.quantity}</p>
                    <button class="btn btn-danger" onclick="removeFromCart(${product.id})">Quitar uno</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    const checkoutContainer = document.getElementById('checkout-container');
    checkoutContainer.innerHTML = '';

    if (cart.length > 0) {
        const total = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

        checkoutContainer.innerHTML = `
            <h4>Total: $${total.toFixed(2)}</h4>
            <button class="btn btn-success" onclick="checkout()">Pagar</button>
        `;
    }
}


function removeFromCart(productId) {
    const productIndex = cart.findIndex(p => p.id === productId);
    if (productIndex > -1) {
        const product = cart[productIndex];
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantityInput.value);

        if (product.quantity > quantity) {
            product.quantity -= quantity;
        } else {
            cart.splice(productIndex, 1);
        }
        const originalProduct = window.products.find(p => p.id === productId);
        if (originalProduct) {
            originalProduct.stock += quantity;
        }
        displayProducts(window.products);
        displayCart();

        Toastify({
            text: "Producto eliminado del carrito",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }).showToast();
    }
}

function checkout() {
    Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: '¡Gracias por tu compra!',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        cart = [];
        displayCart();
        displayProducts(window.products);
    });
}
