const socket = io();

// Función para renderizar Lista de Productos
function renderProducts(products) {
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
                    <button type="button" class="btnSecondary" onclick="getProductById('${product._id}')">Ver más</button>
                    <button type="button" class="btnDanger" onclick="deleteProductById('${product._id}')">Eliminar Producto</button>
                </div>
                <input type="number" min="1" max="${product.stock}" value="1" id="qty-${product._id}">
                <button type="button" class="btnSuccess" onclick="addProductToCart('${product._id}')">Agregar al Carrito</button>
            </div>
        </article>
    `).join('');
}

//Paginación
let currentPage = 1;
let currentCategory = "";
let currentSort = "";
async function loadProducts() {
    try {
        let url = `/api/products?page=${currentPage}`;
        if (currentCategory) {
            url += `&category=${currentCategory}`;
        }
        if (currentSort) {
            url += `&sort=${currentSort}`;
        }
        const resp = await fetch(url);
        const data = await resp.json();
        renderProducts(data.products);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
};
async function changePage(direction) {
    const nextPage = currentPage + direction;
    if (nextPage < 1) return;
    currentPage = nextPage;
    await loadProducts();
};

// Función para renderizar categorías en el select
function renderCategories(categories) {

    const select = document.getElementById('categorySelect');
    if (!select) return;

    select.innerHTML = `
        <option value="">Todas</option>
        ${categories.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('')}
    `;
};

function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1; 
    loadProducts();
};

function sortByPrice(order) {
    currentSort = order;
    currentPage = 1;
    loadProducts();
};

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
    try {
        const resp = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        const data = await resp.json();
        if (!data.ok) alert('No se pudo agregar el producto');
        alert("Producto agregado correctamente");
    } catch (error) {
        console.error("Error al agregar producto:", error);
    }
};

// Actualizar producto
async function updateProduct() {
    const form = document.getElementById('updateProductForm');
    const code = form.productCode.value;
    const updatedFields = {
        stock: Number(form.stock.value),
        status: form.status.value === 'true'
    };
    try {
        const resp = await fetch(`/api/products/code/${code}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields)
        });
        const data = await resp.json();
        if (!data.ok) alert('No se pudo actualizar el producto');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
    }
}

//Revisar si existe un carro
let currentCartId = null;
document.addEventListener('DOMContentLoaded', async () => {await loadProducts();
    const respCategories = await fetch('/api/products/categories');
    renderCategories(await respCategories.json());
    const cartResp = await fetch('/api/carts', { method: 'POST' });
    const cartData = await cartResp.json();
    currentCartId = cartData._id;
});

//Agregar producto al carro por id
async function addProductToCart(pid) {
    const qtyInput = document.getElementById(`qty-${pid}`);
    const quantity = Number(qtyInput.value);
    const resp = await fetch(`/api/carts/${currentCartId}/products/${pid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
    });
};

//Borrar producto por id
async function deleteProductById(pid) {
    const resp = await fetch(`/api/products/${pid}`, {
        method: 'DELETE'
    });
    const data = await resp.json();
    if (!data.ok) {
        alert("Error al eliminar");
    }
};

//Función renderizar Carrito de compras
function renderCart(cart) {
    const container = document.querySelector('#cartSection .vistaCarro');
    if (!container) return;
    if (!cart || cart.products.length === 0) {
        container.innerHTML =
        `<div class="cartDetails">
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
                    <button type="button" class="btnDanger" onclick="deleteCartCollection()">Eliminar Carro</button>
                </article>`
    ).join('');
}

//Borrar producto del carro por id
async function deleteProductInCartById(cid, pid) {
    try {
        const resp = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: 'DELETE'
        });
        const data = await resp.json();
        if (!data.ok) {
            alert('No se pudo eliminar el producto');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}

// Funciones llamadas desde los botones
window.deleteCartCollection = async () => {
    try {
        const resp = await fetch('/api/carts/all', { method: 'DELETE' });
        const data = await resp.json();
        if (data.ok) {
            alert('El carro de compras fue eliminado.');
        }
    } catch (error) {
        console.error('Error al eliminar el carro de compras:', error);
    }
};


window.deleteProductsCollection = async () => {
    try {
        const resp = await fetch('/api/products/all', { method: 'DELETE' });
        const data = await resp.json();
        if (data.ok) {
            alert('Todos los productos fueron eliminados.');
        }
    } catch (error) {
        console.error('Error al eliminar todos los productos:', error);
    }
};

window.createProductsCollection = async () => {
    try {
        const resp = await fetch('/api/products/reset', { method: 'POST' });
        const data = await resp.json();
        if (data.ok) {
            alert('Productos restaurados.');
        }
    } catch (error) {
        console.error('Error al restaurar productos:', error);
    }
};

// Socket emits en tiempo real
socket.on('connect', () => {
    console.log('Conectado al servidor de sockets con ID:', socket.id);
});

socket.on('productsUpdated', (products) => {
    renderProducts(products);
});

socket.on('cartsUpdated', (carts) => {
    renderCart(carts);
});