// Función para manejar el clic en el icono de favorito
function handleFavoriteClick(event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Debes iniciar sesión para agregar favoritos');
        window.location.href = 'login.html';
        return;
    }

    const propertyId = parseInt(event.target.dataset.propertyId);
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const property = properties.find(p => p.id === propertyId);

    if (!property) return;

    // Inicializar array de favoritos si no existe
    if (!property.favorites) {
        property.favorites = [];
    }

    const favoriteIndex = property.favorites.indexOf(currentUser.id);
    
    if (favoriteIndex === -1) {
        // Agregar a favoritos
        property.favorites.push(currentUser.id);
        event.target.style.color = 'red';
    } else {
        // Quitar de favoritos
        property.favorites.splice(favoriteIndex, 1);
        event.target.style.color = 'black';
    }

    // Actualizar localStorage
    localStorage.setItem('properties', JSON.stringify(properties));
    
    // Si estamos en la página de favoritos, actualizar la vista
    if (window.location.pathname.includes('favs.html')) {
        displayFavorites();
    }
}

// Función para mostrar solo las propiedades favoritas
function displayFavorites() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const grid = document.querySelector('.grid');
    if (!grid) return;

    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const favoriteProperties = properties.filter(property => 
        property.favorites && property.favorites.includes(currentUser.id)
    );

    grid.innerHTML = '';

    if (favoriteProperties.length === 0) {
        grid.innerHTML = `
            <div class="no-favorites">
                <h3>No tienes propiedades favoritas aún</h3>
                <p>Explora nuestras propiedades y marca tus favoritas</p>
                <a href="index.html" class="button__propiedad">Explorar propiedades</a>
            </div>
        `;
        return;
    }

    favoriteProperties.forEach(property => {
        const propertyHTML = `
            <div class="grid__item-container">
                <span class="material-symbols-outlined favorite-icon" 
                    data-property-id="${property.id}"
                    style="color: red">
                    favorite
                </span>
                <a class="grid__item" href="viewHouse.html?id=${property.id}">
                    <div class="grid__item__img">
                        <img src="${property.image}" alt="${property.name}">
                    </div>
                    <div class="grid__item__info">
                        <div class="grid__item__info-description">
                            <ul class="description-ul">
                                <li class="description-li"><b>${property.name}</b></li>
                                <li class="description-li">${property.direction}</li>
                                <li class="description-li">${property.price} $ / mes</li>
                            </ul>
                        </div>
                        <div class="grid__item__info-rating">
                            <span class="material-symbols-outlined">star</span>
                            <p>${property.rating}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
        grid.innerHTML += propertyHTML;
    });

    // Agregar event listeners para los favoritos
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.addEventListener('click', handleFavoriteClick);
    });
}

// Inicializar según la página actual
function initializeFavorites() {
    const path = window.location.pathname;
    
    // Si estamos en la página de favoritos
    if (path.includes('favs.html')) {
        displayFavorites();
    }
    
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (path.includes('favs.html') && !currentUser) {
        alert('Debes iniciar sesión para gestionar tus favoritos');
        window.location.href = 'login.html';
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeFavorites);