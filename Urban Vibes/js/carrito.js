// carrito.js - Archivo para mostrar los productos del carrito

function mostrarProductosCarrito() {
    // Obtener productos del carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Contenedor donde se mostrarán los productos
    const container = document.querySelector('#carritoItems');
    const carritoVacio = document.querySelector('#carritoVacio');
    const itemCount = document.querySelector('#itemCount');
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    if (carrito.length === 0) {
        container.style.display = 'none';
        carritoVacio.style.display = 'block';
        itemCount.textContent = '0 productos en tu carrito';
        actualizarResumen(0, 0, 0);
        return;
    }
    
    // Mostrar contenedor de productos y ocultar mensaje vacío
    container.style.display = 'block';
    carritoVacio.style.display = 'none';
    
    // Actualizar contador de productos
    const totalItems = carrito.reduce((sum, producto) => sum + (producto.cantidad || 1), 0);
    itemCount.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''} en tu carrito`;
    
    // Mostrar cada producto del carrito
    carrito.forEach((producto, index) => {
        const cantidad = producto.cantidad || 1;
        const subtotal = producto.precio * cantidad;
        
        const productoHTML = `
            <div class="carrito-item" data-producto-id="${producto.id}">
                <img src="../assets/images/${producto.id}.jpg" alt="${producto.nombre}" class="item-image">
                <div class="item-details">
                    <div class="item-name">${producto.nombre}</div>
                    <div class="item-description">${producto.descripcion}</div>
                    <div class="item-price">$${producto.precio.toLocaleString()}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cambiarCantidad('${producto.id}', -1)">-</button>
                    <span class="quantity-display">${cantidad}</span>
                    <button class="quantity-btn" onclick="cambiarCantidad('${producto.id}', 1)">+</button>
                </div>
                <div class="item-subtotal">$${subtotal.toLocaleString()}</div>
                <button class="remove-btn" onclick="eliminarItem('${producto.id}')">Eliminar</button>
            </div>
        `;
        container.innerHTML += productoHTML;
    });
    
    // Actualizar resumen
    actualizarResumen();
}

function cambiarCantidad(productoId, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(item => item.id === productoId);
    
    if (producto) {
        producto.cantidad = (producto.cantidad || 1) + cambio;
        
        // Si la cantidad llega a 0, eliminar el producto
        if (producto.cantidad <= 0) {
            eliminarItem(productoId);
            return;
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarProductosCarrito();
    }
}

function eliminarItem(productoId) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarProductosCarrito();
}

function limpiarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        mostrarProductosCarrito();
    }
}

function actualizarResumen() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Calcular subtotal
    const subtotal = carrito.reduce((sum, producto) => {
        return sum + (producto.precio * (producto.cantidad || 1));
    }, 0);
    
    // Calcular envío (gratis si el subtotal es mayor a $50,000)
    const envio = subtotal > 50000 ? 0 : 5000;
    
    // Calcular descuento (10% si el subtotal es mayor a $30,000)
    const descuento = subtotal > 30000 ? subtotal * 0.1 : 0;
    
    // Calcular total
    const total = subtotal + envio - descuento;
    
    // Actualizar elementos del DOM
    document.querySelector('#subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.querySelector('#envio').textContent = envio === 0 ? 'Gratis' : `$${envio.toLocaleString()}`;
    document.querySelector('#descuento').textContent = descuento === 0 ? '$0' : `-$${descuento.toLocaleString()}`;
    document.querySelector('#total').textContent = `$${total.toLocaleString()}`;
    
    // Mostrar/ocultar descuento
    const descuentoElement = document.querySelector('#descuento');
    if (descuento > 0) {
        descuentoElement.style.color = '#27ae60';
        descuentoElement.parentElement.style.display = 'flex';
    } else {
        descuentoElement.parentElement.style.display = 'none';
    }
}

function procederCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos antes de proceder al pago.');
        return;
    }
    

    // Llamar a la función de pago con QR
    if (typeof procederAlPagoConQR === 'function') {
        procederAlPagoConQR();
    } else {
        // Fallback si no está disponible el sistema de QR
        alert('¡Gracias por tu compra! Tu pedido ha sido procesado.');
        localStorage.removeItem('carrito');
        mostrarProductosCarrito();
    }
}

// Llamar la función cuando cargue la página del carrito
document.addEventListener('DOMContentLoaded', mostrarProductosCarrito);


