// EJERCICIO 2 - Cambio de colores
let cajaContenedor = document.querySelector(".contenedor");

const cambiarBG = () => {
    cajaContenedor.style.backgroundColor = "purple";
}

const cambiarBGDos = () => {
    cajaContenedor.style.backgroundColor = "orange";
}

const cambiarBGTres = () => {
    if(confirm("¿Quieres cambiar el color a verde?")) {
        cajaContenedor.style.backgroundColor = "green";
    }
}

cajaContenedor.addEventListener("mouseenter", cambiarBG);    
cajaContenedor.addEventListener("mouseleave", cambiarBGDos); 
cajaContenedor.addEventListener("click", cambiarBGTres);

// EJERCICIO 3 - Cambio de imágenes
const img = document.querySelector('#imagen-principal'); 

// Ajustar tamaño de la imagen
img.style.width = '300px';  // Ancho fijo
img.style.height = 'auto';  // Mantiene proporciones
img.style.maxWidth = '100%'; // Responsive

const imagenUno = () => {
    img.src = '../imagenes/sebastian-svenson-d2w-_1LJioQ-unsplash.jpg';
};

const imagenDos = () => {
    img.src = '../imagenes/david-mercier-7mCIrAeWda0-unsplash.jpg'; 
};

img.addEventListener('mouseenter', imagenUno);
img.addEventListener('mouseleave', imagenDos);

// EJERCICIO 4 - Impresión de mensaje
const btnImprimir = document.getElementById('botonImprimir');
const cajaImprimir = document.querySelector('#imprimir');

const imprimirMensaje = () => {
    let mensaje = document.getElementById('mensaje').value;
   cajaImprimir.innerHTML = `<p>${mensaje}</p>`;
};

btnImprimir.addEventListener('click', imprimirMensaje);