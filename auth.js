// Inicializar el aplicativo con un usuario creado con anticipación
if (!localStorage.getItem('users')) {
    const userRoot = {
        id: 1,
        name: 'Root',
        email: 'juandavidalvarezzapata10@gmail.com',
        password: '123456',
        favorites: [],
        createdAt: 1
    };
    
    // Crear el array inicial con el usuario root
    localStorage.setItem('users', JSON.stringify([userRoot]));
}


// Estructura para manejar usuarios
let users = JSON.parse(localStorage.getItem('users')) || [];

// Función para validar el formato del email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar la contraseña
function isValidPassword(password) {
    return password.length >= 6;
}

// Función para registrar un nuevo usuario
function registerUser(name, email, password, verifyPassword) {
    // Validaciones
    if (!name || !email || !password || !verifyPassword) {
        alert('Por favor, complete todos los campos');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Por favor, ingrese un email válido');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    if (password !== verifyPassword) {
        alert('Las contraseñas no coinciden');
        return false;
    }

    // Verificar si el email ya está registrado
    if (users.some(user => user.email === email)) {
        alert('Este email ya está registrado');
        return false;
    }

    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // En una aplicación real, la contraseña debería estar hasheada
        favorites: [],
        createdAt: new Date()
    };

    // Agregar usuario al array
    users.push(newUser);
    
    // Guardar en localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registro exitoso');
    return true;
}

// Función para iniciar sesión
function loginUser(email, password) {
    // Validaciones
    if (!email || !password) {
        alert('Por favor, complete todos los campos');
        return false;
    }

    // Buscar usuario
    const user = users.find(user => user.email === email);

    if (!user) {
        alert('Email no encontrado');
        return false;
    }

    if (user.password !== password) {
        alert('Contraseña incorrecta');
        return false;
    }

    // Guardar sesión actual
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    alert('Inicio de sesión exitoso');
    window.location.href = 'index.html'; // Redirigir al inicio
    return true;
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Función para verificar si hay una sesión activa
function checkSession() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }
}

// Event Listeners para los formularios
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de registro
    const registerForm = document.querySelector('.details-register form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('login__register-name').value;
            const email = document.getElementById('login__register-mail').value;
            const password = document.getElementById('login__register-password').value;
            const verifyPassword = document.getElementById('login__register-vpassword').value;
            
            if (registerUser(name, email, password, verifyPassword)) {
                registerForm.reset();
            }
        });
    }

    // Formulario de login
    const loginForm = document.querySelector('.details-login form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login__login-mail').value;
            const password = document.getElementById('login__login-password').value;
            
            loginUser(email, password);
        });
    }
});