// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi del DOM (Modale)
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDesc = document.getElementById('modal-description');

    // Riferimenti agli elementi Multimediali
    const audioGuide = document.getElementById('audio-guide');
    const subtitleContainer = document.getElementById('subtitle-container');
    const subtitleText = document.getElementById('subtitle-text');

    // Riferimenti per i controlli dell'interfaccia
    const toggleUiBtn = document.getElementById('toggle-ui');
    const hideableElements = document.querySelectorAll('.ui-hideable');
    const toggleAudioBtn = document.getElementById('toggle-audio');
    const toggleSubtitlesBtn = document.getElementById('toggle-subtitles');

    // Riferimenti per il menù a tendina della lingua
    const langDropdownBtn = document.getElementById('lang-dropdown-btn');
    const langDropdownContent = document.getElementById('lang-dropdown-content');

    // Variabili di stato dell'interfaccia
    let isUiVisible = true;
    let isAudioOn = true;
    let areSubtitlesOn = true;
    let isDropdownOpen = false;

    // Ascoltatore principale per l'evento personalizzato 'gazeClick'
    document.addEventListener('gazeClick', (e) => {
        const target = e.target;

        // 1. Apertura Modale Opera
        if (target.closest('.artwork-target')) {
            const artworkId = target.closest('.artwork-target').getAttribute('data-id');
            openModal(artworkId);
        }

        // 2. Nascondi / Mostra Interfaccia (Header e altri elementi)
        if (target.closest('#toggle-ui')) {
            isUiVisible = !isUiVisible;
            toggleUiBtn.textContent = isUiVisible ? "Nascondi UI" : "Mostra UI";
            hideableElements.forEach(el => {
                isUiVisible ? el.classList.remove('ui-hidden') : el.classList.add('ui-hidden');
            });
        }

        // 3. Attiva / Disattiva Audio
        if (target.closest('#toggle-audio')) {
            isAudioOn = !isAudioOn;
            toggleAudioBtn.textContent = `Audio: ${isAudioOn ? 'ON' : 'OFF'}`;
            audioGuide.muted = !isAudioOn;
        }

        // 4. Attiva / Disattiva Sottotitoli
        if (target.closest('#toggle-subtitles')) {
            areSubtitlesOn = !areSubtitlesOn;
            toggleSubtitlesBtn.textContent = `Sottotitoli: ${areSubtitlesOn ? 'ON' : 'OFF'}`;

            // Aggiorna la visibilità immediata se il modale è già aperto
            if (!modal.classList.contains('hidden')) {
                areSubtitlesOn ? subtitleContainer.classList.remove('hidden') : subtitleContainer.classList.add('hidden');
            }
        }

        // 5. Apertura/Chiusura Menù a Tendina Lingua
        if (target.closest('#lang-dropdown-btn')) {
            isDropdownOpen = !isDropdownOpen;
            isDropdownOpen ? langDropdownContent.classList.remove('hidden') : langDropdownContent.classList.add('hidden');
        }

        // 6. Selezione della Lingua dalle opzioni della tendina
        if (target.closest('.lang-option')) {
            const selectedLang = target.closest('.lang-option').getAttribute('data-lang');
            langDropdownBtn.textContent = `Lingua: ${selectedLang.toUpperCase()} ▼`;
            changeLanguage(selectedLang);

            // Chiude la tendina dopo aver selezionato la lingua
            isDropdownOpen = false;
            langDropdownContent.classList.add('hidden');
        }

        // 7. Chiusura del Modale
        if (target.closest('#close-modal')) {
            closeModal();
        }
    });

    // Funzione per popolare e aprire il modale
    function openModal(id) {
        // Recupera i dati da mock-data.js
        const artworkData = artworksDatabase[id];
        if (!artworkData) return;
        const localizedData = artworkData[currentLanguage]; // currentLanguage è una variabile globale di mock-data.js

        // Popola i testi e le immagini
        modalTitle.textContent = localizedData.title;
        modalImage.src = artworkData.imageSrc;
        modalDesc.textContent = localizedData.description;
        subtitleText.textContent = localizedData.subtitleText;

        // Imposta la traccia audio
        audioGuide.src = localizedData.audioSrc;

        // Gestisci la visibilità dei sottotitoli in base allo stato
        if (areSubtitlesOn) {
            subtitleContainer.classList.remove('hidden');
        } else {
            subtitleContainer.classList.add('hidden');
        }

        // Mostra il modale e salva l'id corrente
        modal.classList.remove('hidden');
        modal.setAttribute('data-current-artwork', id);

        // Avvia l'audio rispettando lo stato (muto o meno)
        audioGuide.muted = !isAudioOn;
        audioGuide.play().catch(err => {
            console.warn("Audio fittizio non trovato o autoplay bloccato dal browser:", err);
        });
    }

    // Funzione per chiudere il modale
    function closeModal() {
        modal.classList.add('hidden');
        modal.removeAttribute('data-current-artwork');

        // Ferma l'audio e resetta il tempo
        audioGuide.pause();
        audioGuide.currentTime = 0;
    }

    // Funzione per gestire il cambio lingua simultaneo
    function changeLanguage(lang) {
        currentLanguage = lang; // Aggiorna la variabile globale definita in mock-data.js

        // Se c'è un'opera aperta, ricarica i testi e gli audio in tempo reale
        const currentArtworkId = modal.getAttribute('data-current-artwork');
        if (currentArtworkId && !modal.classList.contains('hidden')) {
            // Ferma l'audio corrente prima di ricaricare i dati nel modale
            audioGuide.pause();
            openModal(currentArtworkId);
        }
    }
});