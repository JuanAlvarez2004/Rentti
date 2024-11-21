// properties.js

// Cargar propiedades iniciales sólo si no están en localStorage
if (!localStorage.getItem('properties')) {
    fetch("assets/objetos_extraidos.json")
        .then(response => response.json())
        .then(data => {
            // Guardar las propiedades iniciales en localStorage
            localStorage.setItem('properties', JSON.stringify(data));

            // Mostrar propiedades en el índice
            displayProperties(data);
        })
        .catch(error => console.error("Error cargando el archivo JSON:", error));
} 

// Estructura para manejar propiedades
let properties = JSON.parse(localStorage.getItem('properties')) || [];

// Función para crear una nueva propiedad
function createProperty(propertyData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Debes iniciar sesión para agregar una propiedad');
        window.location.href = 'login.html';
        return false;
    }

    // Crear nueva propiedad con campos adicionales
    const newProperty = {
        id: Date.now(),
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        image: propertyData.image,
        name: propertyData.name,
        propertyType: propertyData.propertyType,
        direction: propertyData.direction,
        city: propertyData.city,
        rooms: parseInt(propertyData.rooms) || 0,
        bathrooms: parseInt(propertyData.bathrooms) || 0,
        price: parseFloat(propertyData.price) || 0,
        features: {
            petsAllowed: propertyData.petsAllowed || false,
            servicesIncluded: propertyData.servicesIncluded || false,
            furnitureIncluded: propertyData.furnitureIncluded || false
        },
        description: propertyData.description || '',
        rating: 5.0,
        createdAt: new Date(),
        favorites: []
    };

    // Validar datos numéricos
    if (newProperty.rooms <= 0 || newProperty.bathrooms <= 0 || newProperty.price <= 0) {
        alert('Por favor, ingresa valores válidos para habitaciones, baños y precio');
        return false;
    }

    properties.push(newProperty);
    localStorage.setItem('properties', JSON.stringify(properties));
    return true;
}

// Función para manejar el formulario de nueva propiedad
function handlePropertyForm(event) {
    event.preventDefault();
    console.log("Formulario enviado"); // Debug

    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona una imagen');
        return;
    }

    // Leer la imagen como URL de datos
    const reader = new FileReader();
    reader.onload = function(e) {
        // Capturar todos los valores del formulario
        const propertyData = {
            image: e.target.result,
            name: document.getElementById('add__name').value.trim(),
            propertyType: document.getElementById('add__type').value.trim(),
            direction: document.getElementById('add__direction').value.trim(),
            city: document.getElementById('add__city').value.trim(),
            rooms: document.getElementById('add__room').value.trim(),
            bathrooms: document.getElementById('add__baths').value.trim(),
            price: document.getElementById('add__price').value.trim(),
            petsAllowed: document.getElementById('add__pets').checked,
            servicesIncluded: document.getElementById('add__services').checked,
            furnitureIncluded: document.getElementById('add__furniture').checked,
            description: document.getElementById('add__description').value.trim()
        };

        console.log("Datos capturados:", propertyData); // Debug

        // Validar campos obligatorios
        if (!propertyData.name || !propertyData.propertyType || !propertyData.direction || 
            !propertyData.city || !propertyData.rooms || !propertyData.bathrooms || !propertyData.price) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
        }

        // Crear la propiedad
        if (createProperty(propertyData)) {
            alert('Propiedad agregada exitosamente');
            window.location.href = 'index.html';
        }
    };

    reader.readAsDataURL(file);
}

// Función para mostrar propiedades en el index
function displayProperties(properties) {
    const grid = document.querySelector('.grid');
    if (!grid) {
        console.log("Grid no encontrado"); // Debug
        return;
    }

    grid.innerHTML = '';
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    console.log("Propiedades a mostrar:", properties); // Debug

    properties.forEach(property => {
        try {
            const propertyHTML = `
                <div class="grid__item-container">
                    <span class="material-symbols-outlined favorite-icon" 
                        data-property-id="${property.id}"
                        style="color: ${currentUser && property.favorites.includes(currentUser.id) ? 'red' : 'black'}">
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
        } catch (error) {
            console.error("Error al mostrar propiedad:", error, property);
        }
    });

    // Agregar event listeners para los favoritos
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.addEventListener('click', handleFavoriteClick);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de agregar propiedad
    if (window.location.pathname.includes('AddRentti.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Debes iniciar sesión para agregar una propiedad');
            window.location.href = 'login.html';
            return;
        }

        // Agregar el event listener al formulario
        const propertyForm = document.querySelector('form');
        if (propertyForm) {
            console.log("Formulario encontrado"); // Debug
            propertyForm.addEventListener('submit', handlePropertyForm);
        } else {
            console.log("Formulario no encontrado"); // Debug
        }
    }

    // Verificar si estamos en la página principal
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        displayProperties(properties);
    }
});