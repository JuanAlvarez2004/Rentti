// Obtener la propiedad específica del localStorage basado en el ID de la URL
function getPropertyFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (!propertyId) {
        window.location.href = 'index.html';
        return null;
    }
    
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    return properties.find(prop => prop.id.toString() === propertyId);
}

// Actualizar la interfaz con los datos de la propiedad
function updatePropertyView(property) {
    if (!property) {
        window.location.href = 'index.html';
        return;
    }

    // Actualizar título y dirección
    document.querySelector('.header h2').textContent = property.name;
    document.querySelector('.header .address').textContent = `${property.direction} (${property.city})`;
    // document.querySelector('.header .city').textContent = property.city;

    // Actualizar imagen principal
    const mainImage = document.querySelector('.main-image img');
    if (property.image) {
        mainImage.src = property.image;
        mainImage.alt = `Imagen de ${property.name}`;
    }

    // Actualizar precio
    const priceTag = document.querySelector('.price-tag .price');
    if (priceTag) {
        priceTag.textContent = `$${property.price} / mes`;
    }

    // Actualizar tipo de propiedad
    document.querySelector('.price-tag .type').textContent = property.propertyType;

    // Actualizar descripción
    const description = document.querySelector('.description p');
    if (description) {
        description.textContent = `Propiedad ofrecida por ${property.ownerName}. ` + property.description
    }
    const countUl = document.createElement('ul');
    countUl.innerHTML = `
        <li>~ No. habitaciones: ${property.rooms}</li>
        <li>~ No. baños: ${property.bathrooms}</li>`
    description.appendChild(countUl)

    // Actualizar características especiales
    document.querySelector('.features li:first-child p').textContent = (
        (property.features.petsAllowed) ? 'Se permiten mascotas': 'No se permiten mascotas'
    );
    document.querySelector('.features li:nth-child(2) p').textContent = (
        (property.features.servicesIncluded) ? 'Servicios incluidos': 'Sin servicios inluidos'
    );
    document.querySelector('.features li:last-child p').textContent = (
        (property.features.furnitureIncluded) ? 'Muebles incluidos': 'Sin muebles incluidos'
    );

    setupContactForm(property);

    setupCalendar(property);
}

// Configuración de EmailJS
emailjs.init('Wl48kDicAww2o2wA5'); 

// Configurar el formulario de contacto
function setupContactForm(property) {
    const form = document.querySelector('.contact-form');
    const submitBtn = form.querySelector('.submit-btn');

    submitBtn.addEventListener('click', () => {
        const message = form.querySelector('textarea').value;
        if (!message.trim()) {
            alert('Por favor escribe un mensaje antes de enviar.');
            return;
        }

        // Verificar si el usuario está autenticado
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.email) {
            alert('Debes iniciar sesión para enviar mensajes.');
            return;
        }

        const propertyOwnerId = property.ownerId;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let owner = users.find(u => u.id === propertyOwnerId);

        console.log('Mesaje enviado al propietario: ' + owner.email) //Debug

        // Datos para enviar el correo
        const templateParams = {
            userEmail: currentUser.email, // Correo del usuario autenticado
            ownerPropMail: owner.email, // Correo del propietario
            ownerPropName: owner.name,
            propertyName: property.name,
            message: message,
        };

        // Enviar el correo usando EmailJS
        emailjs.send('service_it2hlrg', 'template_zdzumvl', templateParams)
            .then(() => {
                alert('Mensaje enviado con éxito.');
                form.querySelector('textarea').value = '';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Ocurrió un error al enviar el mensaje.');
            });
    });
}

// Configurar el botón de agenda
function setupCalendar(property) {
    const calendarBtn = document.querySelector('.calendar-btn');
    const dateInput = document.querySelector('.calendar input[type="date"]');

    calendarBtn.addEventListener('click', () => {
        const selectedDate = dateInput.value;
        if (!selectedDate) {
            alert('Por favor selecciona una fecha.');
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.email) {
            alert('Debes iniciar sesión para agendar una cita.');
            return;
        }

        const propertyOwnerId = property.ownerId;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let owner = users.find(u => u.id === propertyOwnerId);

        console.log('Mesaje enviado al propietario: ' + owner.email) //Debug

        // Datos para enviar el correo
        const templateParams = {
            userName: currentUser.name,
            userEmail: currentUser.email, // Correo del usuario autenticado
            ownerPropMail: owner.email, // Correo del propietario
            ownerPropName: owner.name,
            selectedDate: selectedDate,
            propertyName: property.name
        };

        // Enviar el correo usando EmailJS
        emailjs.send('service_it2hlrg', 'template_f3j9xfv', templateParams)
            .then(() => {
                alert('Cita agendada con éxito.');
                dateInput.value = ''; // Limpiar el campo de fecha
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Ocurrió un error al agendar la cita.');
            });
    });
}


// Inicializar la vista
function initializePropertyView() {
    const property = getPropertyFromUrl();
    if (property) {
        updatePropertyView(property);
        setupCalendar();
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializePropertyView);