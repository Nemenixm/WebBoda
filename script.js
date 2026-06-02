const envelope = document.getElementById("envelope");
const invitation = document.getElementById("invitation");

// ===============================
// INTRO CINEMATOGRÁFICA Y CONTROL DE CLICS
// ===============================
let introFinished = false;
envelope.style.pointerEvents = "none";

setTimeout(() => {
    introFinished = true;
    envelope.style.pointerEvents = "auto";
}, 3500);

// Animación Apertura del Sobre
envelope.addEventListener("click", () => {
    if (!introFinished) return;

    if (!envelope.classList.contains("open")) {
        envelope.classList.add("open");
        
        // Habilitar interacción con el interior tras finalizar la animación del sobre
        setTimeout(() => {
            envelope.style.pointerEvents = "none";
            invitation.style.pointerEvents = "auto";
        }, 1000);
    }
});

// ===============================
// CONFIGURACIÓN CUENTA ATRÁS
// ===============================
const weddingDate = new Date('October 2, 2027 19:00:00').getTime();

const timer = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? '0' + days : days;
    document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("clock").innerHTML = "<h3>¡Llegó el gran día!</h3>";
    }
}, 1000);

// ===================================================
// COPIAR CÓDIGO DE DESCUENTO AL PORTAPAPELES
// ===================================================
const codeBox = document.getElementById('promo-code');
const copyAlert = document.getElementById('copy-alert');

codeBox.addEventListener('click', () => {
    const codeText = document.querySelector('.code-text').innerText;
    
    navigator.clipboard.writeText(codeText).then(() => {
        copyAlert.style.display = 'block';
        setTimeout(() => {
            copyAlert.style.display = 'none';
        }, 2500);
    }).catch(err => {
        console.error('Error al copiar el código automáticamente: ', err);
    });
});

// ===================================================
// ENVÍO DEL FORMULARIO A GOOGLE SHEETS
// ===================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygXeScnwsiro6m3ySSwrUHM_VkZohrLmn6Q4Kqf383VEfqoxYHTBb7kdtS-RGNfFBT/exec'; 

const rsvpForm = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';
    formStatus.className = 'form-status';
    formStatus.innerText = '';

    const formData = new FormData(rsvpForm);
    const keyValuePairs = [];
    for (let pair of formData.entries()) {
        keyValuePairs.push(encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]));
    }
    const formDataString = keyValuePairs.join("&");

    fetch(SCRIPT_URL + '?' + formDataString, {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(() => {
        formStatus.classList.add('success');
        formStatus.innerText = '¡Confirmación guardada correctamente! Muchas gracias.';
        rsvpForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Confirmación';
    })
    .catch(error => {
        formStatus.classList.add('error');
        formStatus.innerText = 'Error de conexión. Por favor, avísanos por WhatsApp.';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Confirmación';
        console.error('Error en el envío:', error);
    });
});
// ===================================================
// ANIMACIÓN INTERACTIVA DE LA LÍNEA DEL TIEMPO
// ===================================================
const timelineItems = document.querySelectorAll('.timeline-item');
const progressLine = document.getElementById('timeline-progress');
const invitationContainer = document.getElementById('invitation'); // El contenedor con el scroll interno

if (invitationContainer && timelineItems.length > 0) {
    
    // Función que calcula la barra y añade las clases activas
    const handleTimelineScroll = () => {
        const containerRect = invitationContainer.getBoundingClientRect();
        // Fijamos la línea de activación a un 65% de la altura de la pantalla del móvil
        const triggerPoint = containerRect.top + (containerRect.height * 0.65);
        
        let maxActiveStep = 0;
        let progressPercentage = 0;

        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            
            // Si el evento ha rebasado el punto de activación, se enciende
            if (itemRect.top < triggerPoint) {
                item.classList.add('active');
                maxActiveStep = index + 1;
            } else {
                item.classList.remove('active');
            }
        });

        // Mapeo exacto para rellenar el alto de la línea en base al evento alcanzado
        if (maxActiveStep === 0) progressPercentage = 0;
        else if (maxActiveStep === 1) progressPercentage = 3;   // Llega al primer icono
        else if (maxActiveStep === 2) progressPercentage = 27;  // Tramo al segundo
        else if (maxActiveStep === 3) progressPercentage = 52;  // Tramo al tercero
        else if (maxActiveStep === 4) progressPercentage = 76;  // Tramo al cuarto
        else if (maxActiveStep === 5) progressPercentage = 100; // Completa hasta el final

        // Aplicamos la altura calculada con una transición CSS suave
        progressLine.style.height = `${progressPercentage}%`;
    };

    // Escuchamos el evento scroll dentro de la tarjeta de invitación abierta
    invitationContainer.addEventListener('scroll', handleTimelineScroll);
}
// ===================================================
// ENVÍO DE SUGERENCIAS DE MÚSICA A GOOGLE SHEETS
// ===================================================
const musicForm = document.getElementById('music-form');
const musicSubmitBtn = document.getElementById('music-submit-btn');
const musicFormStatus = document.getElementById('music-form-status');

if (musicForm) {
    musicForm.addEventListener('submit', e => {
        e.preventDefault();
        
        musicSubmitBtn.disabled = true;
        musicSubmitBtn.innerText = 'Enviando temazo...';
        musicFormStatus.className = 'form-status';
        musicFormStatus.innerText = '';

        const formData = new FormData(musicForm);
        const keyValuePairs = [];
        for (let pair of formData.entries()) {
            keyValuePairs.push(encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]));
        }
        const formDataString = keyValuePairs.join("&");

        // Reutilizamos el mismo URL de Google Apps Script que ya tienes configurado arriba
        fetch(SCRIPT_URL + '?' + formDataString, {
            method: 'GET',
            mode: 'no-cors'
        })
        .then(() => {
            musicFormStatus.classList.add('success');
            musicFormStatus.innerText = '¡Sugerencia guardada! La pista va a arder 🔥';
            musicForm.reset();
            musicSubmitBtn.disabled = false;
            musicSubmitBtn.innerText = '🎵 Añadir a la Playlist';
        })
        .catch(error => {
            musicFormStatus.classList.add('error');
            musicFormStatus.innerText = 'Error al enviar. Inténtalo de nuevo o avísanos.';
            musicSubmitBtn.disabled = false;
            musicSubmitBtn.innerText = 'Añadir a la Playlist';
            console.error('Error en el envío de música:', error);
        });
    });
}