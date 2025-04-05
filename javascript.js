/**
 * @fileoverview Script principal para la funcionalidad interactiva de la aplicación web Aquare,
 * simulando el comportamiento de una aplicación móvil.
 * Contiene funciones para la gestión de la interfaz de usuario, simulación de datos
 * y la lógica de las funcionalidades clave.
 */

// ** Estado de la Aplicación (Simulado) **
const appState = {
    totalLitrosHoy: 125,
    cocinaLitros: 35,
    duchaLitrosHoy: 60,
    lavamanosLitros: 15,
    wcLitros: 15,
    puntosUsuario: 75,
    duchaActiva: false,
    duchaInicioTiempo: 0,
    duchaDuracionObjetivo: 0,
    duchaLitrosConsumidos: 0,
    modoAhorroAutomaticoActivo: false,
    tipsVisibles: {} // Para rastrear qué tips están abiertos
};

// ** Elementos del DOM **
const elementosDOM = {
    totalLitrosHoy: document.getElementById('total-litros'),
    cocinaLitros: document.getElementById('cocina-litros'),
    duchaLitrosHoy: document.getElementById('ducha-litros-hoy'),
    lavamanosLitros: document.getElementById('lavamanos-litros'),
    wcLitros: document.getElementById('wc-litros'),
    puntosUsuario: document.getElementById('puntos-usuario'),
    duchaAlertas: document.getElementById('ducha-alertas'),
    duchaOpciones: document.querySelectorAll('.ducha-btn'),
    modoAhorroBtn: document.querySelector('.control-btn')
};

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordSection = document.getElementById('password-section');
    const nextButton = document.getElementById('next-button');
    const signinButton = document.getElementById('signin-button');
    const loginForm = document.getElementById('login-form');

    emailInput.addEventListener('input', () => {
        // Basic email validation (you can add more robust validation)
        if (emailInput.value.includes('@')) {
            nextButton.style.display = 'inline-block';
        } else {
            nextButton.style.display = 'inline-block'; // Keep showing for now, more complex logic needed
        }
        passwordSection.style.display = 'none';
        signinButton.style.display = 'none';
    });

    window.handleNext = () => {
        if (emailInput.value.trim() !== '') {
            passwordSection.style.display = 'block';
            signinButton.style.display = 'inline-block';
            nextButton.style.display = 'none';
            document.getElementById('password').focus();
        } else {
            alert('Por favor, introduce tu correo electrónico.');
        }
    };

    window.handleBack = () => {
        passwordSection.style.display = 'none';
        signinButton.style.display = 'none';
        nextButton.style.display = 'inline-block';
        emailInput.focus();
    };

    window.simulateLogin = (event) => {
        event.preventDefault(); // Prevent actual form submission
        const email = emailInput.value;
        const password = document.getElementById('password').value;

        // In a real application, you would send this data to a server for authentication.
        console.log('Simulating login with:', email, password);
        alert(`Inicio de sesión simulado para: ${email}`);
        // In a real scenario, you would redirect the user to the main app page upon successful login.
        window.location.href = 'index.html'; // Redirect to the main app (you might want a more secure way)
    };
});

// ** Funciones de Actualización de la Interfaz **

/**
 * Actualiza los contadores de agua en la interfaz de usuario.
 */
function actualizarContadores() {
    if (elementosDOM.totalLitrosHoy) elementosDOM.totalLitrosHoy.textContent = appState.totalLitrosHoy.toFixed(3);
    if (elementosDOM.cocinaLitros) elementosDOM.cocinaLitros.textContent = appState.cocinaLitros.toFixed(3);
    if (elementosDOM.duchaLitrosHoy) elementosDOM.duchaLitrosHoy.textContent = appState.duchaLitrosHoy.toFixed(3);
    if (elementosDOM.lavamanosLitros) elementosDOM.lavamanosLitros.textContent = appState.lavamanosLitros.toFixed(3);
    if (elementosDOM.wcLitros) elementosDOM.wcLitros.textContent = appState.wcLitros.toFixed(3);
}

/**
 * Actualiza la visualización de los puntos del usuario.
 */
function actualizarPuntos() {
    if (elementosDOM.puntosUsuario) elementosDOM.puntosUsuario.textContent = appState.puntosUsuario;
}

/**
 * Muestra u oculta el contenido de un tip informativo.
 * @param {string} id El ID del elemento HTML que contiene el contenido del tip.
 */
function toggleTip(id) {
    const content = document.getElementById(id);
    if (content) {
        content.style.display = appState.tipsVisibles[id] ? 'none' : 'block';
        appState.tipsVisibles[id] = !appState.tipsVisibles[id];
    } else {
        console.error(`Elemento con ID "${id}" no encontrado.`);
    }
}

// ** Funcionalidad de la Ducha Inteligente **

/**
 * Inicia la simulación de una ducha inteligente.
 * @param {number} duracion La duración de la ducha en minutos (6, 15 o 25).
 */
function iniciarDucha(duracion) {
    if (appState.duchaActiva) {
        mostrarAlertaDucha('Ya hay una ducha en curso. Termínala primero.');
        return;
    }

    appState.duchaActiva = true;
    appState.duchaInicioTiempo = Date.now();
    appState.duchaDuracionObjetivo = duracion * 60 * 1000; // Duración en milisegundos
    appState.duchaLitrosConsumidos = 0;

    if (elementosDOM.duchaAlertas) elementosDOM.duchaAlertas.innerHTML = `<p>Ducha iniciada (${duracion} minutos).</p>`;

    // Desactivar otros botones de ducha
    elementosDOM.duchaOpciones.forEach(btn => {
        btn.classList.remove('active');
        btn.disabled = true;
    });
    const botonActivo = document.querySelector(`.ducha-btn[data-duration="${duracion}"]`);
    if (botonActivo) botonActivo.classList.add('active');

    const intervaloDucha = setInterval(() => {
        if (!appState.duchaActiva) {
            clearInterval(intervaloDucha);
            return;
        }

        const tiempoTranscurrido = Date.now() - appState.duchaInicioTiempo;
        const tiempoRestanteSegundos = Math.ceil((appState.duchaDuracionObjetivo - tiempoTranscurrido) / 1000);

        // Simulación de consumo de agua (ajustar según la duración)
        const consumoPorSegundo = duracion === 6 ? 40 / 360 : (duracion === 15 ? 80 / 900 : 120 / 1500); // Litros por segundo aproximado
        const litrosEnEsteIntervalo = consumoPorSegundo * (intervaloDucha / 1000);
        appState.duchaLitrosConsumidos += litrosEnEsteIntervalo;
        appState.totalLitrosHoy += litrosEnEsteIntervalo;
        appState.duchaLitrosHoy += litrosEnEsteIntervalo;
        actualizarContadores();

        // Alertas específicas para la ducha de 6 minutos
        if (duracion === 6) {
            if (tiempoTranscurrido >= 4 * 60 * 1000 && tiempoTranscurrido < (4 * 60 * 1000) + 1000) {
                mostrarAlertaDucha('🚿 Alarma: 4 minutos - ¡Es hora de enjabonarse!');
            }
            if (appState.duchaLitrosConsumidos > 40 && tiempoTranscurrido < 6 * 60 * 1000) {
                mostrarAlertaDucha('⚠️ ¡Alerta! Has superado los 40 litros antes de los 6 minutos.');
            }
        }

        // Fin de la ducha
        if (tiempoTranscurrido >= appState.duchaDuracionObjetivo) {
            clearInterval(intervaloDucha);
            appState.duchaActiva = false;
            mostrarAlertaDucha(`🚿 Ducha de ${duracion} minutos terminada.`);
            elementosDOM.duchaOpciones.forEach(btn => btn.disabled = false);
            const botonActivo = document.querySelector(`.ducha-btn[data-duration="${duracion}"]`);
            if (botonActivo) botonActivo.classList.remove('active');
            // Otorgar puntos por completar la ducha (ajustar lógica)
            appState.puntosUsuario += Math.round(duracion / 2);
            actualizarPuntos();
        }
    }, 1000); // Intervalo de 1 segundo
}

/**
 * Detiene la ducha activa si está en curso.
 */
function detenerDuchaActiva() {
    if (appState.duchaActiva) {
        appState.duchaActiva = false;
        mostrarAlertaDucha('Ducha detenida manualmente.');
        elementosDOM.duchaOpciones.forEach(btn => btn.disabled = false);
        const botonActivo = document.querySelector('.ducha-btn.active');
        if (botonActivo) botonActivo.classList.remove('active');
    } else {
        mostrarAlertaDucha('No hay ninguna ducha activa.');
    }
}

/**
 * Muestra un mensaje de alerta en la sección de la ducha.
 * @param {string} mensaje El mensaje a mostrar.
 */
function mostrarAlertaDucha(mensaje) {
    if (elementosDOM.duchaAlertas) {
        const alerta = document.createElement('p');
        alerta.textContent = mensaje;
        elementosDOM.duchaAlertas.appendChild(alerta);
        // Limpiar alertas después de un tiempo (opcional)
        setTimeout(() => {
            if (elementosDOM.duchaAlertas && elementosDOM.duchaAlertas.contains(alerta)) {
                elementosDOM.duchaAlertas.removeChild(alerta);
            }
        }, 5000);
    } else {
        console.warn('Contenedor de alertas de ducha no encontrado.');
    }
}

// ** Funcionalidad del Modo de Ahorro Automático **

/**
 * Simula la activación o desactivación del modo de ahorro automático de agua.
 */
function activarModoAhorroAutomatico() {
    appState.modoAhorroAutomaticoActivo = !appState.modoAhorroAutomaticoActivo;
    const mensaje = appState.modoAhorroAutomaticoActivo ?
        'Modo de ahorro automático activado. El flujo de agua se ajustará discretamente.' :
        'Modo de ahorro automático desactivado.';
    alert(mensaje);
    if (elementosDOM.modoAhorroBtn) {
        elementosDOM.modoAhorroBtn.textContent = appState.modoAhorroAutomaticoActivo ? 'Desactivar Modo Ahorro Automático' : 'Activar Modo Ahorro Automático';
    }
    // En una aplicación real, aquí se enviaría una instrucción al dispositivo.
}

// ** Inicialización **
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadores();
    actualizarPuntos();

    // Event listeners para los botones de ducha
    elementosDOM.duchaOpciones.forEach(btn => {
        btn.addEventListener('click', function() {
            const duracion = parseInt(this.dataset.duration);
            iniciarDucha(duracion);
        });
    });

    // Event listener para el botón de modo de ahorro automático
    if (elementosDOM.modoAhorroBtn) {
        elementosDOM.modoAhorroBtn.addEventListener('click', activarModoAhorroAutomatico);
    }

    // Simulación de aumento de puntos cada cierto tiempo (incentivo micro-recompensa)
    setInterval(() => {
        if (Math.random() < 0.3) { // Probabilidad de recibir puntos
            appState.puntosUsuario += Math.floor(Math.random() * 3) + 1;
            actualizarPuntos();
            const mensaje = document.createElement('p');
            mensaje.classList.add('micro-reward');
            mensaje.textContent = `¡+${appState.puntosUsuario - parseInt(elementosDOM.puntosUsuario.textContent)} puntos!`;
            if (elementosDOM.puntosUsuario && elementosDOM.puntosUsuario.parentNode) {
                elementosDOM.puntosUsuario.parentNode.insertBefore(mensaje, elementosDOM.puntosUsuario.nextSibling);
                setTimeout(() => {
                    if (mensaje.parentNode) {
                        mensaje.parentNode.removeChild(mensaje);
                    }
                }, 2000);
            }
        }
    }, 5000);

    // Simulación de un mensaje motivacional diario
    const mensajesMotivacionales = [
        "¡Cada gota que ahorras cuenta para un futuro más verde!",
        "Pequeños cambios hacen una gran diferencia. ¡Sigue así!",
        "Tu compromiso con el ahorro de agua inspira a otros.",
        "Hoy has utilizado el agua de forma más eficiente. ¡Felicidades!",
        "Recuerda cerrar bien los grifos. ¡Cada litro suma!",
    ];
    const mensajeDelDia = document.createElement('p');
    mensajeDelDia.classList.add('daily-motivation');
    mensajeDelDia.textContent = mensajesMotivacionales[Math.floor(Math.random() * mensajesMotivacionales.length)];
    const gamificacionSection = document.getElementById('gamificacion');
    if (gamificacionSection) {
        gamificacionSection.insertBefore(mensajeDelDia, gamificacionSection.firstChild);
    }
});