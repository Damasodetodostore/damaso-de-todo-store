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
let cart = [];
let category = "Todos";

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

    const shown = category === "Todos"
        ? products
        : products.filter(p => p.category === category);

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
       href="https://wa.me/18094478191?text=${encodeURIComponent(`Hola, estoy interesado en ${p.name} por ${money(p.price)}. Cantidad: ${document.getElementById('qty-' + p.id).value}. ¿Está disponible?`)}">
       Pedir por WhatsApp 1
    </a>
href="https://wa.me/18096171413?text=${encodeURIComponent(`Hola, estoy interesado en ${p.name} por ${money(p.price)}. Cantidad: ${document.getElementById('qty-' + p.id).value}. ¿Está disponible?`)}">
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

// AGREGAR AL CARRITO
function addToCart(id) {

    let p = products.find(x => String(x.id) === String(id));

    if (!p) return;

    let c = cart.find(x => String(x.id) === String(id));

    if (c) {
        c.qty++;
    } else {
        cart.push({ ...p, qty: 1 });
    }

    render();
}

// ABRIR CARRITO
function openCart() {
    document.getElementById("cartModal")?.classList.add("show");
    renderCart();
}

// CERRAR CARRITO
function closeCart() {
    document.getElementById("cartModal")?.classList.remove("show");
}

// MOSTRAR CARRITO
function renderCart() {

    let items = document.getElementById("cartItems");
    let total = document.getElementById("cartTotal");

    if (items) {
        items.innerHTML = cart.map(p => `
            <div class="cartline">
                <span>${safe(p.name)} × ${p.qty}</span>
                <strong>${money(p.price * p.qty)}</strong>
            </div>
        `).join("") || "<p>Tu carrito está vacío.</p>";
    }

    if (total) {
        total.textContent = money(
            cart.reduce((a, p) => a + p.price * p.qty, 0)
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
