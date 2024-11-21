let features = [];
// Variables para almacenar los filtros seleccionados
let selectedFilters = {
    filterType: '',
    price: 300000,
    rooms: 1,
    bathrooms: 1,
    petsAllowed: false,
    servicesIncluded: false,
    furnitureIncluded: false
};

// Función para ajustar el precio
function adjustPrice(amount) {
    selectedFilters.price = Math.max(0, selectedFilters.price + amount); // Evita que el precio sea negativo
    document.getElementById('priceValue').textContent = selectedFilters.price;
}

// Función para ajustar la cantidad de habitaciones
function adjustRooms(amount) {
    selectedFilters.rooms = Math.max(1, selectedFilters.rooms + amount); // Mínimo 1 habitación
    document.getElementById('roomCount').textContent = selectedFilters.rooms;
}

// Función para ajustar la cantidad de baños
function adjustBathrooms(amount) {
    selectedFilters.bathrooms = Math.max(1, selectedFilters.bathrooms + amount); // Mínimo 1 baño
    document.getElementById('bathroomCount').textContent = selectedFilters.bathrooms;
}

// Función para seleccionar un botón de tipo de propiedad
function selectButton(button, value) {
    // Desmarca todos los botones del mismo filtro
    document.querySelectorAll(`.filter-options button`).forEach(btn => btn.classList.remove('selected'));
    // Marca el botón seleccionado
    button.classList.add('selected');
    selectedFilters.filterType = value; // Almacena el valor del filtro
}

function toggleFeature(button, feature) {
    button.classList.toggle('selected'); // Cambia la clase del botón

    if (button.classList.contains('selected')) {
        // Si el botón está seleccionado, agrega la característica al arreglo
        if (!features.includes(feature)) {
            features.push(feature);
        }
    } else {
        // Si el botón ya no está seleccionado, elimina la característica del arreglo
        features = features.filter(f => f !== feature);
    }
}

// Pasar features a los atributos de los filtros de la propiedad
const applyFeatures = (features, selectedFilters) => {
    features.forEach(f => {
        (f === 'petsAllowed') ? selectedFilters.petsAllowed = true : 
        (f === 'servicesIncluded') ? selectedFilters.servicesIncluded = true :
        selectedFilters.furnitureIncluded = true 
    });
}

// Función para aplicar los filtros y mostrar resultados
function applyFilters() {
    // Actualiza las propiedades de características en selectedFilters
    applyFeatures(features, selectedFilters);

    // Filtra las propiedades basándose en los valores actualizados en selectedFilters
    const filteredProperties = properties.filter(property => {
        // Filtrado por tipo de propiedad
        const matchesType = !selectedFilters.filterType || property.propertyType === selectedFilters.filterType;

        // Filtrado por precio
        const matchesPrice = property.price <= selectedFilters.price;

        // Filtrado por habitaciones y baños
        const matchesRooms = property.rooms >= selectedFilters.rooms;
        const matchesBathrooms = property.bathrooms >= selectedFilters.bathrooms;

        // Filtrado por condiciones (mascotas, servicios, muebles)
        const matchesPets = selectedFilters.petsAllowed === false || property.features.petsAllowed === selectedFilters.petsAllowed;
        const matchesServices = selectedFilters.servicesIncluded === false || property.features.servicesIncluded === selectedFilters.servicesIncluded;
        const matchesFurniture = selectedFilters.furnitureIncluded === false || property.features.furnitureIncluded === selectedFilters.furnitureIncluded;

        // Retorna true si cumple todas las condiciones
        return matchesType && matchesPrice && matchesRooms && matchesBathrooms && matchesPets && matchesServices && matchesFurniture;
    });

    // Si no hay propiedades, mostrar mensaje de error
    if (filteredProperties.length === 0) {
        const grid = document.querySelector('.grid');
        if (grid) {
            grid.innerHTML = `
                <div class="no-results">
                    <p>No se han encontrado propiedades que coincidan con los filtros aplicados.</p>
                    <span class="material-symbols-outlined">sentiment_very_dissatisfied</span>
                </div>
            `;
        }
    } else {
        console.log("Propiedades después del filtrado:", filteredProperties); // Debug
        displayProperties(filteredProperties);
    }

    // Cerrar el diálogo desmarcando el checkbox
    const filterCheckbox = document.getElementById('filter__modal');
    if (filterCheckbox) {
        filterCheckbox.checked = false;
    }
}

function filterLocation() {
    let cityProp = document.getElementById('inputLocation').value.trim();
    const filteredCity = properties.filter(property => property.city.toLowerCase() === cityProp.toLowerCase());

    // Si no hay propiedades, mostrar mensaje de error
    if (filteredCity.length === 0) {
        const grid = document.querySelector('.grid');
        if (grid) {
            grid.innerHTML = `
                <div class="no-results">
                    <p>No se han encontrado propiedades ubicadas en está ciudad.</p>
                    <span class="material-symbols-outlined">sentiment_very_dissatisfied</span>
                </div>
            `;
        }
    } else {
        console.log("Propiedades después del filtrado:", filteredProperties); // Debug
        displayProperties(filteredCity);
    }   
}
