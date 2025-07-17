const firebaseConfig = {
    apiKey: "AIzaSyDjJmAEHobwv9aRch8hr0UetUTEMz16olc",
    authDomain: "ea-store-347e0.firebaseapp.com",
    projectId: "ea-store-347e0",
    storageBucket: "ea-store-347e0.appspot.com",
    messagingSenderId: "341253545948",
    appId: "1:341253545948:web:b5974c8add7a3aecbc7919"
};

if (!firebase.apps?.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const userForm = document.getElementById('userForm');
const userTableBody = document.querySelector('#userTable tbody');

const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputEmail = document.getElementById('email');
const inputTelefono = document.getElementById('telefono');
const inputUsername = document.getElementById('username');
const inputContrasena = document.getElementById('contrasena');
const inputIntereses = document.getElementById('intereses');
const botonEnviar = document.getElementById('botonEnviar');

const errorNombre = document.getElementById('errorNombre');
const errorApellido = document.getElementById('errorApellido');
const errorEmail = document.getElementById('errorEmail');
const errorTelefono = document.getElementById('errorTelefono');
const errorUsername = document.getElementById('errorUsername');
const errorContrasena = document.getElementById('errorContrasena');

const mensajeExitoso = document.getElementById('registroExitoso');

function agregarUsuarioATabla(usuario, docId) {
    const fila = userTableBody.insertRow();
    fila.insertCell().textContent = usuario.nombre;
    fila.insertCell().textContent = usuario.apellido;
    fila.insertCell().textContent = usuario.email;
    fila.insertCell().textContent = usuario.telefono;
    fila.insertCell().textContent = usuario.username;
    fila.insertCell().textContent = usuario.intereses?.join(', ') || '';

    const celdaAcciones = fila.insertCell();
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'eliminar-usuario-btn');
    btnEliminar.dataset.id = docId;
    celdaAcciones.appendChild(btnEliminar);
}

const aplicarEstiloValidacion = (inputElement, errorElement, isValid, errorMessage = '') => {
    if (isValid) {
        inputElement.classList.remove("invalido");
        inputElement.classList.add("valido");
        if (errorElement) errorElement.textContent = '';
    } else {
        inputElement.classList.remove("valido");
        inputElement.classList.add("invalido");
        if (errorElement) errorElement.textContent = errorMessage;
    }
};

const validarNombre = () => {
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    const isValid = inputNombre.value.trim() !== "" && regexNombre.test(inputNombre.value.trim());
    aplicarEstiloValidacion(inputNombre, errorNombre, isValid, 'El nombre es obligatorio y debe tener entre 2 y 50 letras.');
    return isValid;
};

const validarApellido = () => {
    const regexApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    const isValid = inputApellido.value.trim() !== "" && regexApellido.test(inputApellido.value.trim());
    aplicarEstiloValidacion(inputApellido, errorApellido, isValid, 'El apellido es obligatorio y debe tener entre 2 y 50 letras.');
    return isValid;
};

const validarEmail = () => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const isValid = inputEmail.value.trim() !== "" && regexEmail.test(inputEmail.value.trim());
    aplicarEstiloValidacion(inputEmail, errorEmail, isValid, 'Ingresa un email válido (ejemplo@dominio.com).');
    return isValid;
};

const validarTelefono = () => {
    const telefono = inputTelefono.value.trim();
    const regexTelefono = /^09[0-9]{8}$/;
    const isValid = telefono !== "" && regexTelefono.test(telefono);
    aplicarEstiloValidacion(inputTelefono, errorTelefono, isValid, 'El teléfono es obligatorio y debe empezar con 09 y tener 10 dígitos.');
    return isValid;
};

const validarUsername = () => {
    const regexUsername = /^[a-zA-Z0-9_]{4,20}$/;
    const isValid = inputUsername.value.trim() !== "" && regexUsername.test(inputUsername.value.trim());
    aplicarEstiloValidacion(inputUsername, errorUsername, isValid, 'El usuario es obligatorio y debe tener entre 4 y 20 caracteres alfanuméricos o guion bajo.');
    return isValid;
};

const validarContrasena = () => {
    const regexContrasena = /^.{6,}$/;
    const isValid = inputContrasena.value.trim() !== "" && regexContrasena.test(inputContrasena.value.trim());
    aplicarEstiloValidacion(inputContrasena, errorContrasena, isValid, 'La contraseña es obligatoria y debe tener al menos 6 caracteres.');
    return isValid;
};

const validarIntereses = () => {
    const selectedOptions = Array.from(inputIntereses.selectedOptions);
    return selectedOptions.length > 0;
};

const validarFormularioCompleto = () => {
    const nombreEsValido = validarNombre();
    const apellidoEsValido = validarApellido();
    const emailEsValido = validarEmail();
    const telefonoEsValido = validarTelefono();
    const usernameEsValido = validarUsername();
    const contrasenaEsValida = validarContrasena();
    const interesesSonValidos = validarIntereses();

    const formularioGeneralValido = nombreEsValido && apellidoEsValido && emailEsValido &&
                                   telefonoEsValido && usernameEsValido && contrasenaEsValida &&
                                   interesesSonValidos;

    botonEnviar.disabled = !formularioGeneralValido;
    return formularioGeneralValido;
};

inputNombre.addEventListener('input', validarFormularioCompleto);
inputApellido.addEventListener('input', validarFormularioCompleto);
inputEmail.addEventListener('input', validarFormularioCompleto);
inputTelefono.addEventListener('input', validarFormularioCompleto);
inputUsername.addEventListener('input', validarFormularioCompleto);
inputContrasena.addEventListener('input', validarFormularioCompleto);
inputIntereses.addEventListener('change', validarFormularioCompleto);

const enviarFormulario = async () => {
    mensajeExitoso.textContent = "Enviando...";
    await new Promise(resolve => setTimeout(resolve, 1500));

    const nuevoUsuario = {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        email: inputEmail.value,
        telefono: inputTelefono.value,
        username: inputUsername.value,
        contrasena: inputContrasena.value,
        intereses: Array.from(inputIntereses.selectedOptions).map(op => op.value)
    };

    try {
        const docRef = await db.collection("usuarios").add(nuevoUsuario);
        mensajeExitoso.textContent = "¡Registro exitoso!";
        agregarUsuarioATabla(nuevoUsuario, docRef.id);
    } catch (error) {
        mensajeExitoso.textContent = "Error al guardar";
        console.error("Error al guardar usuario:", error);
        return;
    }

    userForm.reset();

    [inputNombre, inputApellido, inputEmail, inputTelefono, inputUsername, inputContrasena].forEach(input => {
        input.classList.remove('valido', 'invalido');
    });
    [errorNombre, errorApellido, errorEmail, errorTelefono, errorUsername, errorContrasena].forEach(errorSpan => {
        if (errorSpan) errorSpan.textContent = '';
    });
    botonEnviar.disabled = true;

    setTimeout(() => {
        mensajeExitoso.textContent = '';
    }, 5000);
};

const cargarUsuariosIniciales = async () => {
    userTableBody.innerHTML = '';
    try {
        const usuarios = await db.collection("usuarios").get();
        if (usuarios.empty) {
            console.log('No hay usuarios registrados en Firestore.');
            return;
        }
        usuarios.forEach(doc => {
            agregarUsuarioATabla(doc.data(), doc.id);
        });
    } catch (error) {
        console.error("Error al cargar usuarios iniciales:", error);
    }
};

const eliminarUsuarioDeFirestore = async (docId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            await db.collection("usuarios").doc(docId).delete();
            alert('Usuario eliminado correctamente.');
            cargarUsuariosIniciales();
        } catch (error) {
            alert('Error al eliminar el usuario.');
            console.error("Error al eliminar usuario:", error);
        }
    }
};

userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (validarFormularioCompleto()) {
        await enviarFormulario();
    } else {
        alert('Por favor, corrige los errores en el formulario.');
    }
});

userTableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-usuario-btn')) {
        const userId = event.target.dataset.id;
        if (userId) {
            eliminarUsuarioDeFirestore(userId);
        }
    }
});

window.onload = () => {
    validarFormularioCompleto();
    cargarUsuariosIniciales();
};