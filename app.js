// DAMASO DE TODO STORE
// Catálogo conectado a Supabase

const STORE_WHATSAPP = "18090000000"; // Luego colocaremos tu número real.

const SUPABASE_URL = "https://nxaitlmgszqokjqccccz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_igQfW_x-Dz1QdMxxVYicTQ_wgznRMre";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

let products = [];

// RECUPERAR EL CARRITO GUARDADO
let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("damasoCart") || "[]"
    );

    cart = Array.isArray(savedCart) ? savedCart : [];
} catch (error) {
    cart = [];
}

let category = "Todos";

// GUARDAR EL CARRITO
function saveCart() {
    localStorage.setItem("damasoCart", JSON.stringify(cart));
}

const money = n => "RD$" + Number(n || 0).toLocaleString("es-DO");

function safe(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

// CARGAR PRODUCTOS DESDE SUPABASE
async function loadProducts() {

    const { data, error } = await db
        .from("products")
        .select("id,name,category,price,image_url,description,stock,active")
        .eq("active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error Supabase:", error.message);

        const grid = document.getElementById("grid");

        if (grid) {
            grid.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
        }

        return;
    }

    products = (data || []).map(p => ({
        ...p,
        image: p.image_url || ""
    }));

    render();
}

// MOSTRAR PRODUCTOS
function render() {
    const filters = document.getElementById("filters");
    const grid = document.getElementById("grid");

    if (!filters || !grid) return;

    let searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        filters.insertAdjacentHTML("beforebegin", `
            <input
                type="search"
                id="searchInput"
                placeholder="🔍 Buscar productos..."
                style="width:90%; max-width:500px; padding:12px; margin:15px auto; display:block; border-radius:10px; border:1px solid #ccc;"
            >
        `);

        searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", render);
    }

    const searchText = searchInput.value.trim().toLowerCase();

    const cats = [
        "Todos",
        ...new Set(products.map(p => p.category || "Otros"))
    ];

    filters.innerHTML = cats.map(c => `
        <button
            class="filter ${c === category ? "active" : ""}"
            onclick="category='${c.replace(/'/g, "\\'")}';render()">
            ${safe(c)}
        </button>
    `).join("");

    const shown = products.filter(p => {
        const matchesCategory =
            category === "Todos" ||
            (p.category || "Otros") === category;

        const matchesSearch =
            (p.name || "").toLowerCase().includes(searchText) ||
            (p.category || "Otros").toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = shown.map(p => `
        <article class="product">
            <img
                src="${safe(p.image)}"
                alt="${safe(p.name)}"
                onerror="this.src='https://placehold.co/600x600/171717/d6b15e?text=Damaso+Store'">

            <div class="pbody">
                <div class="category">${safe(p.category || "Otros")}</div>
                <h3>${safe(p.name)}</h3>
                <div class="price">${money(p.price)}</div>

                <label for="qty-${p.id}">Cantidad:</label>
                <input
                    type="number"
                    id="qty-${p.id}"
                    value="1"
                    min="1"
                    max="${p.stock || 99}"
                    style="width:70px; padding:8px; margin-bottom:10px;">

                <button class="btn" onclick="addToCart('${p.id}')">
                    Agregar al carrito
                </button>

                <div class="whatsapp-buttons">
                    <a class="btn" target="_blank" rel="noopener noreferrer"
                      <div class="whatsapp-buttons">

    <a class="whatsapp-btn"
       target="_blank"
       rel="noopener noreferrer"
       <div class="whatsapp-buttons">
    <a class="whatsapp-btn" target="_blank" rel="noopener noreferrer"
       href="https://wa.me/18094478191?text=${encodeURIComponent(`Hola, estoy interesado en ${p.name} por ${money(p.price)}. Cantidad: 1. ¿Está disponible?`)}">

        <span class="whatsapp-icon">
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.5 10.5 0 0 1-5.3-1.4l-.4-.2-3.9 1 1-3.8-.3-.4A10.5 10.5 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.6 8.6 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.4.3-.6s0-.4 0-.6-.7-1.7-1-2.3-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4 2.4 3.7 5.8 5.1c.8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z"/>
            </svg>
        </span>
        Pedir por WhatsApp 1
    </a>

    <a class="whatsapp-btn" target="_blank" rel="noopener noreferrer"
       href="https://wa.me/18096171413?text=${encodeURIComponent(`Hola, estoy interesado en ${p.name} por ${money(p.price)}. Cantidad: 1. ¿Está disponible?`)}">

        <span class="whatsapp-icon">
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.5 10.5 0 0 1-5.3-1.4l-.4-.2-3.9 1 1-3.8-.3-.4A10.5 10.5 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.6 8.6 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.4.3-.6s0-.4 0-.6-.7-1.7-1-2.3-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4 2.4 3.7 5.8 5.1c.8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z"/>
            </svg>
        </span>
        Pedir por WhatsApp 2
    </a>
</div>

</div>
// AGREGAR PRODUCTOS AL CARRITO
function addToCart(id) {
    const product = products.find(p => String(p.id) === String(id));

    if (!product) {
        alert("No se encontró este producto.");
        return;
    }

    const qtyInput = document.getElementById(`qty-${product.id}`);
    const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

    if (qty < 1) {
        alert("La cantidad debe ser mayor que cero.");
        return;
    }

    if (product.stock !== undefined && qty > product.stock) {
        alert(`Solo hay ${product.stock} unidades disponibles.`);
        return;
    }

    const existing = cart.find(p => String(p.id) === String(product.id));

    if (existing) {
        if (product.stock !== undefined && existing.qty + qty > product.stock) {
            alert(`Solo hay ${product.stock} unidades disponibles.`);
            return;
        }

        existing.qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            qty: qty
        });
    }

    // GUARDAR EL CARRITO
    saveCart();

    // ACTUALIZAR CONTADOR
    updateCartCount();

    alert(`${product.name} se agregó al carrito.`);
}

    
// MOSTRAR LOS PRODUCTOS DEL CARRITO
function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
        cartTotal.textContent = money(0);
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin:12px 0;padding:10px;border-bottom:1px solid #ddd;">
            <div>
                <strong>${safe(item.name)}</strong><br>
                <span>${money(item.price)} × ${item.qty}</span>
            </div>

            <div>
                <strong>${money(item.price * item.qty)}</strong><br>
                <button onclick="changeCartQty(${index}, -1)">−</button>
                <button onclick="changeCartQty(${index}, 1)">+</button>
                <button onclick="removeFromCart(${index})">Quitar</button>
            </div>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.qty,
        0
    );

    cartTotal.textContent = money(total);
}

// ABRIR CARRITO
function openCart() {
    renderCart();

    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.style.display = "flex";
    }
}

// CERRAR CARRITO
function closeCart() {
    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.style.display = "none";
    }
}

// CAMBIAR CANTIDAD
function changeCartQty(index, amount) {
    if (!cart[index]) return;

    cart[index].qty += amount;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartCount();
    renderCart();
}

// QUITAR PRODUCTO
function removeFromCart(index) {
    cart.splice(index, 1);

    saveCart();
    updateCartCount();
    renderCart();
}

// ACTUALIZAR CONTADOR
function updateCartCount() {
    const count = document.getElementById("cartCount");

    if (count) {
        count.textContent = cart.reduce(
            (total, item) => total + item.qty,
            0
        );
    }
}

// REALIZAR PEDIDO POR WHATSAPP
async function checkout() {

    if (!cart.length) {
        return alert("Agrega productos al carrito.");
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone) {
        return alert("Completa tu nombre y teléfono.");
    }

    const lista = cart.map(function(p) {
        return "• " + p.name + " x" + p.qty + ": " + money(p.price * p.qty);
    }).join("\n");

    const total = cart.reduce(function(a, p) {
        return a + (Number(p.price) * Number(p.qty));
    }, 0);

    const msg = "Hola, quiero realizar este pedido en Damaso de Todo Store:\n\n" +
        lista + "\n\n" +
        "Total: " + money(total) + "\n\n" +
        "Nombre: " + name + "\n" +
        "Teléfono: " + phone + "\n" +
        "Entrega: " + address;

    const mensaje = encodeURIComponent(msg);

    const wa1 = window.open("about:blank", "_blank");
    const wa2 = window.open("about:blank", "_blank");

    const pedido = {
        customer_name: name,
        customer_phone: phone,
        delivery_address: address,
        items: cart.map(function(p) {
            return {
                product_id: p.id,
                name: p.name,
                price: Number(p.price),
                quantity: Number(p.qty)
            };
        }),
        total: total,
        status: "Pendiente"
    };

    const { error } = await db.from("orders").insert([pedido]);

    if (error) {
        if (wa1) wa1.close();
        if (wa2) wa2.close();

        console.error("Error guardando pedido:", error.message);
        return alert("No se pudo guardar el pedido. Inténtalo nuevamente.");
    }

    if (wa1) {
        wa1.location.href = "https://wa.me/18094478191?text=" + mensaje;
    }

    if (wa2) {
        wa2.location.href = "https://wa.me/18096171413?text=" + mensaje;
    }

    if (!wa1 || !wa2) {
        alert("Pedido guardado. Si no se abrieron los dos WhatsApp, permite las ventanas emergentes del sitio.");
    }
}

// AÑO Y ENLACE DE WHATSAPP
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

const wa = document.getElementById("waLink");

if (wa) {
    wa.href = "https://wa.me/" + STORE_WHATSAPP;
}

// INICIAR CATÁLOGO
loadProducts();
