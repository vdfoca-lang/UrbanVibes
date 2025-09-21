

// define las constantes de las cards
const conjuntos = {
    conjuntoSlim: {
        nombre: "Conjunto Slim",
        id: "conjuntoSlim",
        precio: 15000,
        descripcion: "Conjunto slim fit moderno y cómodo",
        
    }
};
localStorage.setItem("CONJUNTOS", JSON.stringify(conjuntos));


const  camperas = {
    camperaUrban: {
        nombre: "Campera Urban",
        id: "camperaUrban",
        precio: 15000,
        descripcion: "Campera Urban, linda, fresco y comodo"

    }
};
localStorage.setItem("CAMPERAS", JSON.stringify(camperas));


const  zapatillas = {
    zapatillasUrban: {
        nombre: "Zapatillas Urban",
        id: "zapatillasUrban",
        precio: 15000,
        descripcion: "Zapatillas Urban, comodidad ante todo"

    }
};
localStorage.setItem("ZAPATILLAS", JSON.stringify(zapatillas));



const  remeras = {
    remeraUrban: {
        nombre: "Remera Urban",
        id: "remeraUrban",
        precio: 15000,
        descripcion: "Remera Urban, lo mejor de lo mejor"

    }
};
localStorage.setItem("REMERAS", JSON.stringify(remeras));


const  hoodies = {
    hoodieUrban: {
        nombre: "Hoodie Urban",
        id: "hoodieUrban",
        precio: 15000,
        descripcion: "Hoodie Urban, lindo, fresco y comodo"

    }
};
localStorage.setItem("HOODIES", JSON.stringify(hoodies));

const  gorras = {
    gorraUrban: {
        nombre: "Gorra Urban",
        id: "gorraUrban",
        precio: 15000,
        descripcion: "Gorra Urban, lindo, fresco y comodo"
    }
};
localStorage.setItem("GORRAS", JSON.stringify(gorras));
// Función para recuperar datos del localStorage y mostrarlos como cards
function mostrarCardsDesdeLocalStorage() {
    // Obtener datos del localStorage
    const conjuntos = JSON.parse(localStorage.getItem('CONJUNTOS')) || {};
    const camperas = JSON.parse(localStorage.getItem('CAMPERAS')) || {};
    const zapatillas = JSON.parse(localStorage.getItem('ZAPATILLAS')) || {};
    const remeras = JSON.parse(localStorage.getItem('REMERAS')) || {};
    const hoodies = JSON.parse(localStorage.getItem('HOODIES')) || {};
    const gorras = JSON.parse(localStorage.getItem('GORRAS')) || {};

    // Contenedor donde se mostrarán las cards
    const container = document.querySelector('.catalogo');

    // Limpiar contenedor
    container.innerHTML = '';

    // Función para crear una card
    function crearCard(producto) {
        return `
            <div class="card" id="${producto.id}" name="${producto.id}">
                <img src="../assets/images/${producto.id}.jpg" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="precio">$${producto.precio}</p>
                    <a class="btn btn-primary botonAgregarCarrito" data-producto-id="${producto.id}" >Agregar al carrito</a>
                </div>
            </div>
        `;
    }

    // Mostrar productos de cada categoría
    Object.values(conjuntos).forEach(producto => {
        container.innerHTML += crearCard(producto);
    });

    Object.values(camperas).forEach(producto => {
        container.innerHTML += crearCard(producto);
    });

    Object.values(zapatillas).forEach(producto => {
        container.innerHTML += crearCard(producto);
    });

    Object.values(remeras).forEach(producto => {
        container.innerHTML += crearCard(producto);
    });

    Object.values(hoodies).forEach(producto => {
        container.innerHTML += crearCard(producto);
    });

    Object.values(gorras).forEach(producto => {
        container.innerHTML += crearCard(producto);
    });
    agregarEventListenersCarrito();
}

// Llamar la función cuando la página cargue
document.addEventListener('DOMContentLoaded', mostrarCardsDesdeLocalStorage);


    function agregarEventListenersCarrito() {
    const botones = document.getElementsByClassName('botonAgregarCarrito');
    
    // Convertir HTMLCollection a Array para usar forEach
    Array.from(botones).forEach(boton => {
        boton.addEventListener('click', function() {
            const productoId = this.getAttribute('data-producto-id');
            const productoData = obtenerDataProducto(productoId);
            
            if (productoData) {
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                
                // Verificar si el producto ya existe en el carrito
                const productoExistente = carrito.find(item => item.id === productoId);
                
                if (productoExistente) {
                    // Si ya existe, incrementar la cantidad
                    productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
                } else {
                    // Si no existe, agregarlo con cantidad 1
                    productoData.cantidad = 1;
                    carrito.push(productoData);
                }
                
                localStorage.setItem('carrito', JSON.stringify(carrito));
                
                // Mostrar mensaje de confirmación
                this.textContent = '¡Agregado!';
                this.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    this.textContent = 'Agregar al carrito';
                    this.style.backgroundColor = '';
                }, 1500);
                
                console.log("Producto agregado al carrito:", productoData);
            } else {
                console.error("No se pudo encontrar el producto con ID:", productoId);
            }
        });
    });
}
function obtenerDataProducto(productoId) {
    // Buscar en todas las categorías
    const categorias = ['CONJUNTOS', 'CAMPERAS', 'ZAPATILLAS', 'REMERAS', 'HOODIES', 'GORRAS'];
    
    for (let categoria of categorias) {
        const productos = JSON.parse(localStorage.getItem(categoria)) || {};
        
        // Buscar el producto por ID
        for (let key in productos) {
            if (productos[key].id === productoId) {
                return productos[key];
            }
        }
    }
    
    return null; // No se encontró el producto
}



