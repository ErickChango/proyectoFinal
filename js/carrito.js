
const contadorCarrito = document.getElementById('contadorCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const totalCompraElement = document.getElementById('totalCompra');
const vaciarCarritoBtn = document.getElementById('vaciarCarrito');

const obtenerCarritoLocal = () => {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
};

const guardarCarritoLocal = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const agregarProductoAlCarrito = (nombre, precio) => {
    let carrito = obtenerCarritoLocal();
    const productoExistenteIndex = carrito.findIndex(item => item.nombre === nombre);

    if (productoExistenteIndex > -1) {
        carrito[productoExistenteIndex].cantidad = (carrito[productoExistenteIndex].cantidad || 1) + 1;
        console.log(`Cantidad de ${nombre} actualizada en el carrito local.`);
    } else {
        carrito.push({ nombre, precio, cantidad: 1, id: Date.now().toString() });
        console.log(`${nombre} añadido al carrito local.`);
    }

    guardarCarritoLocal(carrito);
    actualizarContadorCarritoUI();
    alert(`${nombre} ha sido añadido al carrito.`);

    if (window.location.pathname.endsWith('/carrito.html') || window.location.pathname.endsWith('/carrito/')) {
        cargarCarritoUI();
    }
};

const cargarCarritoUI = () => {
    if (!listaCarrito || !totalCompraElement) {
        actualizarContadorCarritoUI();
        return;
    }

    listaCarrito.innerHTML = "";
    let total = 0;
    let cantidadProductosTotal = 0;
    const carrito = obtenerCarritoLocal();

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li class="list-group-item d-flex justify-content-between align-items-center">El carrito está vacío.</li>';
    } else {
        carrito.forEach(item => {
            const docId = item.id;
            const cantidad = item.cantidad || 1;

            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                ${item.nombre} - $${item.precio.toFixed(2)} x ${cantidad}
                <span>
                    <button class="btn btn-sm btn-outline-secondary disminuir-cantidad" data-id="${docId}">-</button>
                    <button class="btn btn-sm btn-outline-secondary aumentar-cantidad" data-id="${docId}">+</button>
                    <button class="btn btn-sm btn-danger ms-2 eliminar-producto" data-id="${docId}">Eliminar</button>
                </span>
            `;
            listaCarrito.appendChild(li);

            total += item.precio * cantidad;
            cantidadProductosTotal += cantidad;
        });
    }

    totalCompraElement.textContent = `Total: $${total.toFixed(2)}`;
    actualizarContadorCarritoUI(cantidadProductosTotal);
};

const actualizarContadorCarritoUI = (cantidadTotalDesdeCarga = null) => {
    if (contadorCarrito) {
        if (cantidadTotalDesdeCarga !== null) {
            contadorCarrito.textContent = cantidadTotalDesdeCarga;
            return;
        }

        const carrito = obtenerCarritoLocal();
        let totalItems = 0;
        carrito.forEach(item => {
            totalItems += item.cantidad || 1;
        });
        contadorCarrito.textContent = totalItems;
    }
};

const eliminarProductoLocal = (docId) => {
    let carrito = obtenerCarritoLocal();
    carrito = carrito.filter(item => item.id !== docId);
    guardarCarritoLocal(carrito);
    console.log(`Producto con ID ${docId} eliminado del carrito local.`);
    cargarCarritoUI();
};

const disminuirCantidadProductoLocal = (docId) => {
    let carrito = obtenerCarritoLocal();
    const productoIndex = carrito.findIndex(item => item.id === docId);

    if (productoIndex > -1) {
        let currentCantidad = carrito[productoIndex].cantidad || 1;
        if (currentCantidad > 1) {
            carrito[productoIndex].cantidad = currentCantidad - 1;
            console.log(`Cantidad de ${carrito[productoIndex].nombre} disminuida.`);
        } else {
            carrito.splice(productoIndex, 1);
            console.log(`Producto ${carrito[productoIndex].nombre} eliminado (cantidad 0).`);
        }
        guardarCarritoLocal(carrito);
        cargarCarritoUI();
    }
};

const aumentarCantidadProductoLocal = (docId) => {
    let carrito = obtenerCarritoLocal();
    const productoIndex = carrito.findIndex(item => item.id === docId);

    if (productoIndex > -1) {
        carrito[productoIndex].cantidad = (carrito[productoIndex].cantidad || 1) + 1;
        guardarCarritoLocal(carrito);
        console.log(`Cantidad de ${carrito[productoIndex].nombre} aumentada.`);
        cargarCarritoUI();
    }
};

const vaciarCarritoLocal = () => {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        console.log("Carrito vaciado con éxito en localStorage.");
        cargarCarritoUI();
        alert("El carrito ha sido vaciado.");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    botonesAgregar.forEach(button => {
        button.addEventListener('click', () => {
            const nombre = button.dataset.nombre;
            const precio = parseFloat(button.dataset.precio);
            agregarProductoAlCarrito(nombre, precio);
        });
    });

    if (window.location.pathname.endsWith('/carrito.html') || window.location.pathname.endsWith('/carrito/')) {
        cargarCarritoUI();

        if (listaCarrito) {
            listaCarrito.addEventListener('click', (event) => {
                const target = event.target;
                const docId = target.dataset.id;

                if (target.classList.contains('eliminar-producto') && docId) {
                    eliminarProductoLocal(docId);
                } else if (target.classList.contains('disminuir-cantidad') && docId) {
                    disminuirCantidadProductoLocal(docId);
                } else if (target.classList.contains('aumentar-cantidad') && docId) {
                    aumentarCantidadProductoLocal(docId);
                }
            });
        }

        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.addEventListener('click', vaciarCarritoLocal);
        }
    }

    actualizarContadorCarritoUI();
});