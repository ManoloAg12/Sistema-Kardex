document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. SISTEMA DE PESTAÑAS (TABS)
    // ==========================================
    const btnInv = document.getElementById('btn-inventario');
    const btnSec = document.getElementById('btn-secuenciacion');
    const tabInv = document.getElementById('tab-inventario');
    const tabSec = document.getElementById('tab-secuenciacion');

    btnInv.addEventListener('click', () => {
        btnInv.className = "tab-active py-4 px-6 font-bold flex items-center transition-all bg-white rounded-t-lg";
        btnSec.className = "text-slate-400 py-4 px-6 font-bold flex items-center hover:text-blue-600 hover:bg-slate-100 transition-all rounded-t-lg";
        tabInv.classList.remove('hidden');
        tabSec.classList.add('hidden');
    });

    btnSec.addEventListener('click', () => {
        btnSec.className = "tab-active py-4 px-6 font-bold flex items-center transition-all bg-white rounded-t-lg";
        btnInv.className = "text-slate-400 py-4 px-6 font-bold flex items-center hover:text-blue-600 hover:bg-slate-100 transition-all rounded-t-lg";
        tabSec.classList.remove('hidden');
        tabInv.classList.add('hidden');
    });


    // ==========================================
    // 2. SISTEMA DE MODALES (LIGHTBOX)
    // ==========================================
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const thumbImg = document.getElementById('infographic-thumbnail');
    const btnOpen = document.getElementById('btn-open-modal');
    const btnClose = document.getElementById('btn-close-lightbox');
    
    let currentZoom = 1;

    // Abrir Modal
    btnOpen.addEventListener('click', () => {
        lightboxImg.src = thumbImg.src; // Copia la ruta de la miniatura
        lightbox.classList.remove('hidden');
        // Pequeño retraso para que la transición de opacidad funcione
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
        currentZoom = 1;
        applyZoom();
        document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
    });

    // Función para cerrar Modal
    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        setTimeout(() => lightbox.classList.add('hidden'), 300);
        document.body.style.overflow = 'auto'; // Restaura el scroll
    };

    btnClose.addEventListener('click', closeLightbox);
    
    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.parentElement === lightbox) {
            closeLightbox();
        }
    });

    // Controles de Zoom
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        if (currentZoom < 3) currentZoom += 0.5; // Límite 300%
        applyZoom();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        if (currentZoom > 0.5) currentZoom -= 0.5; // Límite 50%
        applyZoom();
    });

    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
        currentZoom = 1;
        applyZoom();
    });

    function applyZoom() {
        lightboxImg.style.transform = `scale(${currentZoom})`;
    }

    console.log("Interfaz visual e interacciones cargadas correctamente.");
});