// js/gaze-engine.js

// Tempo necessario in millisecondi per confermare la selezione (2 secondi)
const DWELL_TIME = 2000;

let gazeTimer = null;
let currentTarget = null;
// Target che ha completato il riempimento dello sguardo e attende un click reale di conferma
let armedTarget = null;
const gazeCursor = document.getElementById('gaze-cursor');

document.addEventListener('mousemove', (e) => {
    // 1. Aggiorna la posizione del cursore personalizzato
    gazeCursor.style.left = `${e.clientX}px`;
    gazeCursor.style.top = `${e.clientY}px`;

    // 2. Trova l'elemento che si trova esattamente sotto le coordinate del mouse
    // L'uso di pointer-events: none sul cursore CSS permette a questa funzione di "vederci attraverso"
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

    // 3. Controlla se l'elemento (o un suo genitore) è interattivo
    // Le opere non sono più cliccabili nella loro interezza: solo l'iconcina "i" lo è
    const interactable = elementUnderCursor ? elementUnderCursor.closest('.gaze-clickable') : null;

    if (interactable) {
        // Se entriamo in un nuovo target interattivo
        if (currentTarget !== interactable) {
            // Se ci si allontana dal target prima di confermarlo con un click, annulla l'armamento
            disarmTarget();
            clearGazeTimer();
            currentTarget = interactable;
            startGazeTimer(currentTarget);
        }
    } else {
        // Se usciamo da un target interattivo o stiamo "guardando" lo sfondo vuoto
        if (currentTarget) {
            clearGazeTimer();
            currentTarget = null;
        }
        disarmTarget();
    }
});

// Il riempimento dello sguardo non conferma più l'azione da solo: serve un click reale successivo
document.addEventListener('click', (e) => {
    if (!armedTarget) return;

    const clickedTarget = e.target.closest('.gaze-clickable');
    if (clickedTarget === armedTarget) {
        const gazeEvent = new CustomEvent('gazeClick', { bubbles: true });
        armedTarget.dispatchEvent(gazeEvent);
    }

    // Sia in caso di conferma che di click "a vuoto", l'armamento va consumato
    disarmTarget();
});

function startGazeTimer(target) {
    // Aggiunge le classi per innescare l'animazione CSS del cerchio che si riempie
    document.body.classList.add('gazing');
    target.classList.add('gaze-hover');

    // Fa partire il conto alla rovescia di 2 secondi
    gazeTimer = setTimeout(() => {
        // Quando il tempo scade, il target viene solo "armato": resta in attesa di un click di conferma
        clearGazeTimer();
        armedTarget = target;
        target.classList.add('gaze-armed');
    }, DWELL_TIME);
}

function clearGazeTimer() {
    // Interrompe il timer e rimuove tutte le classi di animazione
    if (gazeTimer) {
        clearTimeout(gazeTimer);
        gazeTimer = null;
    }
    document.body.classList.remove('gazing');
    if (currentTarget) {
        currentTarget.classList.remove('gaze-hover');
    }
}

function disarmTarget() {
    if (armedTarget) {
        armedTarget.classList.remove('gaze-armed');
        armedTarget = null;
    }
}