// ui.js
document.addEventListener('DOMContentLoaded', function() {
    updateUIForLoggedUser();
});

function updateUIForLoggedUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Obtener elementos del menú
    const menuItems = document.querySelector('.menu');
    const propiedadButton = document.querySelector('.button__propiedad');
    
    if (currentUser) {
        // Usuario logueado
        menuItems.innerHTML = `
            <li class="menu__item"><b>Hola, ${currentUser.name}</b></li>
            <li class="menu__item"><a href="myProps.html">Mis propiedades</a></li>
            <li class="menu__item"><a href="favs.html">Favoritos</a></li>
            <li class="menu__item"><a href="#" onclick="logout()">Cerrar sesión</a></li>
        `;
    } else {
        // Usuario no logueado
        menuItems.innerHTML = `
            <li class="menu__item"><a href="login.html">Sesión</a></li>
            <li class="menu__item"><a href="myProps.html">Mis propiedades</a></li>
            <li class="menu__item"><a href="favs.html">Favoritos</a></li>
        `;
    }
}