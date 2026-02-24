const socket = io();
const path = window.location.pathname;

/* Productos */
//Paginación, Filtros y Sort
let currentPage = 1;
let currentCategory = "";
let currentSort = "";

//Función para renderizar Lista de Productos
function renderProducts(products) {
    if (!Array.isArray(products)) return
    const container = document.querySelector('#productsSection .vistaProductos');
    if (!container) return;
    if (products.length === 0) {
        container.innerHTML = 
        `<div class="productDetails">
            <h4>Los productos han sido borrados</h4>
            <p>Si quieres ver los juegos disponibles, haz click en Restaurar Lista de productos</p>
        </div>`;
        return;
    }
    container.innerHTML = products.map(product => 
        `<article class="productCard" >
            <h4>${product.title}</h4>
            <img class="cardImg" src="${product.thumbnail}" alt="${product.title}">
            <p>${product.description}</p>
            <div class="productDetails">
                <ul>
                    <li>Precio: $${product.price}</li>
                    <li>Categoría: ${product.category}</li>
                    <li>Stock: ${product.stock}</li>
                </ul>
                <div class="cardCTA">
                    <a href="/products/${product._id}" class="btnSecondary">Ver más</a>
                    <button type="button" class="btnDanger" onclick="deleteProductById('${product._id}')">Eliminar Producto</button>
                </div>
                <input type="number" min="1" max="${product.stock}" value="1" id="qty-${product._id}">
                <button type="button" class="btnSuccess" onclick="addProductToCart('${product._id}')">Agregar al Carrito</button>
            </div>
        </article>
    `).join('');
};

//Cargar Productos
async function loadProducts() {
    try {
        let url = `/api/products?page=${currentPage}`;
        if (currentCategory) url += `&category=${currentCategory}`;
        if (currentSort) url += `&sort=${currentSort}`;
        const resp = await fetch(url);
        const data = await resp.json();
        renderProducts(data.docs || data.products);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
};

//Cargar categorías
async function loadCategories() {
    try {
        const res = await fetch('/api/products/categories');
        const data = await res.json();
        renderCategories(data);
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
};

//Función para renderizar categorías en el select
function renderCategories(categories) {
    if (!Array.isArray(categories)) return;
    const select = document.getElementById('categorySelect');
    if (!select) return;
    select.innerHTML = `
        <option value="">Todas</option>
        ${categories.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('')}
    `;
};

//Filtrar por categoría
function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1; 
    loadProducts();
};

//Función para ordenar por precio
function sortByPrice(order) {
    currentSort = order;
    currentPage = 1;
    loadProducts();
};

//Cambiar página
async function changePage(direction) {
    const nextPage = currentPage + direction;
    if (nextPage < 1) return;
    currentPage = nextPage;
    await loadProducts();
};

/* CRUD Productos */
// Agregar producto
async function addProduct() {
    const form = document.getElementById("createProductForm");
    const product = {
        title: form.title.value,
        description: form.description.value,
        category: form.category.value,
        price: Number(form.price.value),
        stock: Number(form.stock.value),
        status: form.status.value === "true",
        code: form.code.value,
        thumbnail: form.thumbnail.value
    };
    const resp = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    const data = await resp.json();
    if (!data.ok) alert('No se pudo agregar el producto');
    alert("Producto agregado correctamente");
    await loadProducts();
};

// Actualizar producto
async function updateProduct() {
    const form = document.getElementById('updateProductForm');
    if (!form) return;
    const code = form.productCode.value;
    const resp = await fetch(`/api/products/code/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            stock: Number(form.stock.value),
            status: form.status.value === 'true'
        })
    });
    const data = await resp.json();
    if (!data.ok) alert('No se pudo actualizar el producto');
    alert("Producto actualizado correctamente");
    await loadProducts();
}

//Borrar producto por id
async function deleteProductById(pid) {
    const resp = await fetch(`/api/products/${pid}`, {
        method: 'DELETE'
    });
    const data = await resp.json();
    if (!data.ok) {
        alert("Error al eliminar"); return;
    } await loadProducts();
};

window.deleteProductsCollection = async () => {
    try {
        const resp = await fetch('/api/products/all', { method: 'DELETE' });
        const data = await resp.json();
        if (!data.ok) {
            alert('Error al eliminar todos los productos.');
            return;
        }
        alert('Todos los productos han sido eliminados.');
        await loadProducts();
    } catch (error) {
        console.error('Error al eliminar todos los productos:', error);
    }
};

window.createProductsCollection = async () => {
    try {
        const resp = await fetch('/api/products/reset', { method: 'POST' });
        const data = await resp.json();
        if (!data.ok) {
            alert('No se pudieron restaurar los productos.');
            return;
        }
        alert('Productos restaurados.');
        await loadProducts();
    } catch (error) {
        console.error('Error al restaurar productos:', error);
    }
};

/* Carro de Compras */
//Revisar si existe un carro
//let currentCartId = sessionStorage.getItem('cartId');

//Crear carro
async function createCart() {
    const res = await fetch('/api/carts', { method: 'POST' });
    const data = await res.json();
    sessionStorage.setItem('cartId', data.cart._id);
};

//Función renderizar Carrito de compras
function renderCart(cart) {
    const container = document.querySelector('#cartSection .vistaCarro');
    if (!container) return;
    if (!cart || !cart.products || cart.products.length === 0) {
        container.innerHTML =
        `<div class="productDetails">
            <h4>El carrito de compras está vacío</h4>
            <p>Agrega productos al carrito para verlos aquí</p>
        </div>`;
        return;
    }
    container.innerHTML = cart.products.map(item =>
        `<article class="cartCard" >
                    <div class="cartDetails">
                        <img src="${item.product.thumbnail}" alt="${item.product.title}" class="cartImg"/>
                        <p>${item.product.title}</p>
                        <p>${item.quantity}</p>
                        <button type="button" class="btnDanger" onclick="deleteProductInCartById('${cart._id}', '${item.product._id}')">X</button>                        
                    </div>
                </article>`
    ).join('');
}

//Función para cargar el carro a la vista
async function loadCart() {
    const currentCartId = sessionStorage.getItem('cartId');
    if (!currentCartId) return;
    const response = await fetch(`/api/carts/${currentCartId}`);
    const data = await response.json();
    if (!data || !data.cart || data.cart.length === 0) {
        renderCart(null);
        return;
    }
    renderCart(data.cart[0]);
};

//Agregar producto al carro por id
async function addProductToCart(pid) {
    const currentCartId = sessionStorage.getItem('cartId');
    if (!currentCartId) { await createCart(); }
    const qtyInput = document.getElementById(`qty-${pid}`);
    const quantity = Number(qtyInput.value);
    const resp = await fetch(`/api/carts/${currentCartId}/products/${pid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
    });
    const data = await resp.json();
    if (!data.ok) {alert(data.msg); return;}
    await loadCart();
};

//Borrar producto del carro por id
async function deleteProductInCartById(cid, pid) {
    await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'DELETE'
    });
};

//Borrar los datos de la colección Carts
window.deleteCartCollection = async () => {
    const resp = await fetch('/api/carts/all', { method: 'DELETE' });
    const data = await resp.json();
    if (data.ok) {
        sessionStorage.clear();
        const currentCartId = sessionStorage.getItem('cartId');
        currentCartId = null;
        alert('El carro de compras fue eliminado.');
    }
};

/* Inicialización */
document.addEventListener('DOMContentLoaded', async () => {
    const currentCartId = sessionStorage.getItem('cartId');
    if (!currentCartId) {
        await createCart();
    }
    if (path.startsWith('/products')) {
        await loadProducts();
        await loadCategories();
    }
    if (path.startsWith('/carts')) {
        await loadCart();
    }
});

// Socket emits en tiempo real
socket.on('connect', () => {
    console.log('Conectado al servidor de sockets con ID:', socket.id);
});

socket.on('productsUpdated', (products) => {
    if (path !== '/products') return;
    renderProducts(products);
});

socket.on('cartsUpdated', (cart) => {
    if (path !== '/carts') return;
        renderCart(cart);
});