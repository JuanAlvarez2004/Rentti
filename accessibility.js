document.addEventListener('DOMContentLoaded', () => {
    const accessibilityButton = document.querySelector('.accessibility');
    let fontSize = 16; // Valor inicial en px
    let contrastMode = false; // Estado del modo contraste

    if (!accessibilityButton) return;

    // Función para cambiar el tamaño de la letra
    function adjustFontSize(change) {
        fontSize = Math.max(12, Math.min(24, fontSize + change)); // Limitar entre 12px y 24px
        document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    }

    // Función para alternar el modo contraste
    function toggleContrastMode() {
        contrastMode = !contrastMode;

        if (contrastMode) {
            // Colores para alto contraste
            document.documentElement.style.setProperty('--green', '#fff');
            document.documentElement.style.setProperty('--light-green', '#000');     // fondo
            document.documentElement.style.setProperty('--white', '#000');           // fondo
            document.documentElement.style.setProperty('--black', '#ffdd00');        // letras 
            document.documentElement.style.setProperty('--light-grey', '#3a3a3a');   //Border y letras
            document.documentElement.style.setProperty('--grey', '#ffdd00');         // bordes y letras 
        } else {
            // Restaurar colores originales
            document.documentElement.style.setProperty('--green', '#162623');
            document.documentElement.style.setProperty('--light-green', '#f0f5f7');
            document.documentElement.style.setProperty('--white', '#ffffff');
            document.documentElement.style.setProperty('--black', '#000000');
            document.documentElement.style.setProperty('--light-grey', '#ebebeb');
            document.documentElement.style.setProperty('--grey', '#6e6e6e');
        }
    }

    // Mostrar opciones de accesibilidad
    function showAccessibilityOptions() {
        const overlay = document.createElement('div');
        overlay.className = 'accessibility-overlay';

        overlay.innerHTML = `
            <div class="accessibility-menu">
                <h3>Ajustes de Accesibilidad</h3>
                <button class="increase-font">Aumentar tamaño de letra</button>
                <button class="decrease-font">Disminuir tamaño de letra</button>
                <button class="toggle-contrast">Alternar contraste</button>
                <button class="close-accessibility">Cerrar</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Agregar eventos
        overlay.querySelector('.increase-font').addEventListener('click', () => adjustFontSize(2));
        overlay.querySelector('.decrease-font').addEventListener('click', () => adjustFontSize(-2));
        overlay.querySelector('.toggle-contrast').addEventListener('click', toggleContrastMode);
        overlay.querySelector('.close-accessibility').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }

    // Evento para abrir el menú de accesibilidad
    accessibilityButton.addEventListener('click', showAccessibilityOptions);
});
