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
                       href="https://wa.me/18094478191?text=${encodeURIComponent(`Hola, estoy interesado en ${p.name} por ${money(p.price)}. Cantidad: 1. ¿Está disponible?`)}">
                       Pedir por WhatsApp 1
                    </a>

                    <a class="btn" target="_blank" rel="noopener noreferrer"
                       href="https://wa.me/18096171413?text=${encodeURIComponent(`Hola, estoy interesado en ${p.name} por ${money(p.price)}. Cantidad: 1. ¿Está disponible?`)}">
                       Pedir por WhatsApp 2
                    </a>
                </div>
            </div>
        </article>
    `).join("") || "<p>Aún no hay productos publicados.</p>";

    const count = document.getElementById("cartCount");

    if (count) {
        count.textContent = cart.reduce((a, b) => a + b.qty, 0);
    }
}
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
function checkout() {

    if (!cart.length) {
        return alert("Agrega productos al carrito.");
    }

    let name = document.getElementById("customerName").value.trim();

    let phone = document.getElementById("customerPhone").value.trim();

    let address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone) {
        return alert("Completa tu nombre y teléfono.");
    }

    let msg = `Hola, quiero realizar este pedido en Damaso de Todo Store:

${cart.map(p => `• ${p.name} x${p.qty}: ${money(p.price * p.qty)}`).join("\n")}

Total: ${money(cart.reduce((a, p) => a + p.price * p.qty, 0))}

Nombre: ${name}
Teléfono: ${phone}
Entrega: ${address}`;

    window.open(
        `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(msg)}`,
        "_blank"
    );
}

// AÑO Y ENLACE DE WHATSAPP
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

const wa = document.getElementById("waLink");

if (wa) {
    wa.href = `https://wa.me/${STORE_WHATSAPP}`;
}

// INICIAR CATÁLOGO
loadProducts();
