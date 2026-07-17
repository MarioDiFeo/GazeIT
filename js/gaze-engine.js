// js/gaze-engine.js

// Tempo necessario in millisecondi per confermare la selezione (2 secondi)
const DWELL_TIME = 2000;

let gazeTimer = null;
let currentTarget = null;
const gazeCursor = document.getElementById('gaze-cursor');

document.addEventListener('mousemove', (e) => {
    // 1. Aggiorna la posizione del cursore personalizzato
    gazeCursor.style.left = `${e.clientX}px`;
    gazeCursor.style.top = `${e.clientY}px`;

    // 2. Trova l'elemento che si trova esattamente sotto le coordinate del mouse
    // L'uso di pointer-events: none sul cursore CSS permette a questa funzione di "vederci attraverso"
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

    // 3. Controlla se l'elemento (o un suo genitore) è interattivo
    const interactable = elementUnderCursor ? elementUnderCursor.closest('.artwork-target, .gaze-clickable') : null;

    if (interactable) {
        // Se entriamo in un nuovo target interattivo
        if (currentTarget !== interactable) {
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
    }
});

function startGazeTimer(target) {
    // Aggiunge le classi per innescare l'animazione CSS del cerchio che si riempie
    document.body.classList.add('gazing');
    target.classList.add('gaze-hover');

    // Fa partire il conto alla rovescia di 2 secondi
    gazeTimer = setTimeout(() => {
        // Quando il tempo scade, genera e lancia un evento personalizzato 'gazeClick'
        const gazeEvent = new CustomEvent('gazeClick', { bubbles: true });
        target.dispatchEvent(gazeEvent);

        // Resetta l'animazione post-click per dare feedback che l'azione è avvenuta
        clearGazeTimer();
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