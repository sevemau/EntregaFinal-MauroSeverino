document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simular validación de credenciales
    if (username === 'pepito' && password === 'elunico') {
        sessionStorage.setItem('user', username); 
        mostrarMensajeExito(username);
    } else {
        mostrarMensajeError();
    }
});

function mostrarMensajeExito(username) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: '¡Inicio de sesión exitoso!',
        text: 'Bienvenido ' + username,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
            window.location.href = 'ecommerce.html';
        }
    });
}

function mostrarMensajeError() {
    Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Intente nuevamente.'
    });
}
