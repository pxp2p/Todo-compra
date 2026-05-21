// =====================
// STORAGE
// =====================
function cargarCarrito() {
    let data = localStorage.getItem("carrito");
    return data ? JSON.parse(data) : [];
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

let carrito = cargarCarrito();

// =====================
// PRODUCTOS
// =====================
function productoClick(nombre, precio, imagen) {
    let producto = carrito.find(p => p.nombre === nombre);

    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }

    guardarCarrito();
    mostrarMensaje(nombre + " agregado al carrito");
    mostrarCarrito();
    mostrarTotal();
}

// =====================
// TOTAL (SIEMPRE VISIBLE)
// =====================
function mostrarTotal() {
    let contenedorTotal = document.getElementById("totalCarrito");
    if (!contenedorTotal) return;

    let total = 0;

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
    });

    contenedorTotal.textContent = "Total: $" + total;
}

// =====================
// CARRITO EN PANTALLA (SOLO FINALIZAR)
// =====================
function mostrarCarrito() {
    let contenedor = document.getElementById("carrito");
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

    let html = "<ul>";

    carrito.forEach((p, index) => {
        let subtotal = p.precio * p.cantidad;

        html += `
    <li>
        <section class="karrito">
        <img src="${p.imagen}" style="width:60px; height:60px; object-fit:cover;">
        <strong>${p.nombre}</strong>
        $${p.precio} x ${p.cantidad}
        </section>
        <section class="karrito2">
        <button onclick="cambiarCantidad(${index}, -1)">➖</button>
        <button onclick="cambiarCantidad(${index}, 1)">➕</button>
        <span> Subtotal: $${subtotal}</span>
        </section>
    </li>
`;
    });

    html += `</ul>`;
    contenedor.innerHTML = html;
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    mostrarCarrito();
    mostrarTotal();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
    mostrarTotal();
}

// =====================
// MENSAJES
// =====================
function mostrarMensaje(texto) {
    let mensaje = document.getElementById("mensaje");
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.classList.add("activo");

    setTimeout(() => {
        mensaje.classList.remove("activo");
    }, 2500);
}

// =====================
// VALIDACIÓN
// =====================
function obtenerDatosCliente() {
    let nombre = document.getElementById("clienteNombre").value.trim();
    let telefono = document.getElementById("clienteTelefono").value.trim();
    let provincia = document.getElementById("clienteProvincia").value.trim();
    let direccion = document.getElementById("clienteDireccion").value.trim();

    if (!nombre || !telefono || !provincia || !direccion) {
        mostrarMensaje("Completa todos los datos");
        return null;
    }

    return { nombre, telefono, provincia, direccion };
}

// =====================
// GENERAR MENSAJE
// =====================
function generarMensaje(datos) {
    let fecha = new Date().toLocaleString();

    let texto = `📦 PEDIDO - Distribuidora Noé\n`;
    texto += `📅 Fecha: ${fecha}\n\n`;

    texto += `👤 Cliente: ${datos.nombre}\n`;
    texto += `📞 Teléfono: ${datos.telefono}\n`;
    texto += `📍 Provincia: ${datos.provincia}\n`;
    texto += `🏠 Dirección: ${datos.direccion}\n\n`;

    texto += `🛒 Productos:\n`;

    let total = 0;

    carrito.forEach(p => {
        let subtotal = p.precio * p.cantidad;
        total += subtotal;

        texto += `- ${p.nombre} x${p.cantidad} ($${subtotal})\n`;
    });

    texto += `\n💰 Total: $${total}`;

    return texto;
}

// =====================
// ENVÍO FINAL
// =====================
function enviarWhatsApp() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío");
        return;
    }

    let datos = obtenerDatosCliente();
    if (!datos) return;

    let mensaje = generarMensaje(datos);

    // WHATSAPP (ENVÍA EL PEDIDO REAL)
    let url = "https://wa.me/5491128884710?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");

    vaciarCarrito();
    mostrarMensaje("Pedido enviado");
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito(); // solo si existe
    mostrarTotal();   // siempre visible
});
