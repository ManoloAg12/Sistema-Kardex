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
    // 2. SISTEMA DE MODALES (LIGHTBOX Z0OM)
    // ==========================================
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const thumbImg = document.getElementById('infographic-thumbnail');
    const btnOpen = document.getElementById('btn-open-modal');
    const btnClose = document.getElementById('btn-close-lightbox');
    
    let currentZoom = 1;

    // Abrir Modal
    btnOpen.addEventListener('click', () => {
        lightboxImg.src = thumbImg.src; 
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
        currentZoom = 1;
        applyZoom();
        document.body.style.overflow = 'hidden'; 
    });

    // Función para cerrar Modal
    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        setTimeout(() => lightbox.classList.add('hidden'), 300);
        document.body.style.overflow = 'auto'; 
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
        if (currentZoom < 3) currentZoom += 0.5; 
        applyZoom();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        if (currentZoom > 0.5) currentZoom -= 0.5; 
        applyZoom();
    });

    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
        currentZoom = 1;
        applyZoom();
    });

    function applyZoom() {
        lightboxImg.style.transform = `scale(${currentZoom})`;
    }


    // ==========================================
    // 3. ESCUDO ANTI-CURIOSOS (Bloqueo de código)
    // ==========================================
    
    // 3.1 Bloquear Clic Derecho (Menú contextual)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // 3.2 Bloquear teclas de herramientas de desarrollador
    document.addEventListener('keydown', function(e) {
        // Bloquear F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Bloquear Ctrl + U (Ver código fuente)
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }

        // Bloquear Ctrl + Shift + I / C / J (Herramientas de desarrollador)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) {
            e.preventDefault();
            return false;
        }
    });

    console.log("Interfaz visual y escudo de seguridad cargados correctamente.");
});