// ==================================== IMAGENES ====================================

// Agranda el tamaño de la imagen
function hacerZoomImagen(imagen)
{
    if (imagen.style.transform === 'scale(1.5)') imagen.style.transform = 'scale(1)'; // Si ya está agrandada, la restauramos
    else                                         imagen.style.transform = 'scale(1.5)';

}

// Muestra la imagen por encima de todo lo que haya en mi sitio web
function mostrarImagenEnOverlay(imagen)
{
    const overlay    = document.getElementById('overlay');
    const overlayImg = document.getElementById('overlay-img');

    // Mostrar overlay en modo flex y cargar la imagen
    overlay.style.display = 'flex';
    overlayImg.src        = imagen.src;

    // Agregar el event listener sólo la primera vez
    if (!overlay.dataset.listenerAdded) 
    {
        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            overlayImg.src        = '';
        });

        overlay.dataset.listenerAdded = 'true';
    }
        
}


// Abro la imagen en una ventana nueva (se usa cuando la imagen tiene cosas chicas que hay que hacerle zoom)
function mostrarImagenEnNuevaVentana(imagen)
{
    window.open(imagen.src, '_blank', 'noopener');
}