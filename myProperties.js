// Función para mostrar propiedades publicadas por el usuario actual
function displayUserProperties() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Debes iniciar sesión para ver tus propiedades publicadas');
        window.location.href = 'login.html';
        return;
    }

    const grid = document.querySelector('.grid');
    if (!grid) return;

    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const userProperties = properties.filter(property => property.ownerId === currentUser.id);

    grid.innerHTML = '';

    if (userProperties.length === 0) {
        grid.innerHTML = `
            <div class="no-properties">
                <h3>No has publicado propiedades aún</h3>
                <p>Publica una nueva propiedad para que aparezca aquí.</p>
                <a href="addRentti.html" class="button__propiedad">Publicar propiedad</a>
            </div>
        `;
        return;
    }

    userProperties.forEach(property => {
        const propertyHTML = `
            <div class="grid__item-container">
                <span class="material-symbols-outlined delete-icon" 
                    data-property-id="${property.id}">
                    delete
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

    // Agregar event listeners para los íconos de eliminar
    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', handleDeleteClick);
    });
}
// Función para manejar el clic en el icono de eliminar
function handleDeleteClick(event) {
    event.preventDefault(); // Prevenir navegación si está dentro de un enlace

    const propertyId = parseInt(event.target.dataset.propertyId);
    const properties = JSON.parse(localStorage.getItem('properties')) || [];

    // Filtrar propiedades para eliminar la seleccionada
    const updatedProperties = properties.filter(property => property.id !== propertyId);

    // Actualizar localStorage
    localStorage.setItem('properties', JSON.stringify(updatedProperties));

    // Volver a mostrar las propiedades del usuario
    displayUserProperties();
}

// Inicializar al cargar la página
function initializeUserProperties() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Debes iniciar sesión para gestionar tus propiedades');
        window.location.href = 'login.html';
        return;
    }

    displayUserProperties();
}

document.addEventListener('DOMContentLoaded', initializeUserProperties);
