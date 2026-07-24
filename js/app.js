// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi del DOM (Modale)
    const startScreen = document.getElementById('start-screen');
    const modal = document.getElementById('info-modal');
    const infoConnector = document.getElementById('info-connector');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDesc = document.getElementById('modal-description');

    // Riferimenti agli elementi Multimediali
    const bgAudio = document.getElementById('background-audio');

    // NUOVI Riferimenti Sottotitoli
    const subtitleContainer = document.getElementById('global-subtitle-container');
    const subtitleText = document.getElementById('global-subtitle-text');

    const toggleUiBtn = document.getElementById('toggle-ui');
    const hideableElements = document.querySelectorAll('.ui-hideable');
    const toggleAudioBtn = document.getElementById('toggle-audio');
    const toggleSubtitlesBtn = document.getElementById('toggle-subtitles');

    const langDropdownBtn = document.getElementById('lang-dropdown-btn');
    const langDropdownContent = document.getElementById('lang-dropdown-content');

    let isUiVisible = true;
    let isAudioOn = true;
    let areSubtitlesOn = true;
    let isDropdownOpen = false;

    // --- Sblocco Audio Tramite Clic Reale sulla schermata iniziale ---
    startScreen.addEventListener('click', () => {
        startScreen.style.display = 'none'; // Fa sparire la schermata

        bgAudio.volume = 1.0;
        bgAudio.muted = !isAudioOn;
        bgAudio.play().catch(error => {
            console.error("Errore nell'avvio dell'audio:", error);
        });
    });

    // --- MOTORE DEI SOTTOTITOLI SINCRONIZZATI ---
    bgAudio.addEventListener('timeupdate', () => {
        // Se i sottotitoli sono spenti o l'UI è nascosta, non fare nulla e nascondi
        if (!areSubtitlesOn || !isUiVisible) {
            subtitleContainer.classList.add('hidden');
            return;
        }

        const currentTime = bgAudio.currentTime;

        // Controllo di sicurezza per evitare errori se i dati non sono ancora caricati
        if (typeof globalSubtitlesData === 'undefined') return;

        const currentSubs = globalSubtitlesData[currentLanguage];

        // Cerca se esiste una frase in cui il tempo attuale è compreso tra 'start' ed 'end'
        const activeSubtitle = currentSubs.find(sub => currentTime >= sub.start && currentTime <= sub.end);

        if (activeSubtitle) {
            subtitleText.textContent = activeSubtitle.text;
            subtitleContainer.classList.remove('hidden');
        } else {
            // Se non c'è testo per questo specifico secondo, nascondi il box
            subtitleContainer.classList.add('hidden');
        }
    });

    // Ascoltatore principale per l'evento personalizzato 'gazeClick'
    document.addEventListener('gazeClick', (e) => {
        const target = e.target;

        // Sblocco Autoplay: alla prima interazione dell'utente avvia l'audio se era stato bloccato
        if (isAudioOn && bgAudio.paused) {
            bgAudio.play().catch(err => console.warn(err));
        }

        // 1. Apertura/Chiusura Scheda Opera: la "i" funge da interruttore, si chiude guardandola di nuovo
        if (target.closest('.artwork-target')) {
            const artworkId = target.closest('.artwork-target').getAttribute('data-id');
            const isSameArtworkOpen = modal.classList.contains('open') && modal.getAttribute('data-current-artwork') === artworkId;

            if (isSameArtworkOpen) {
                closeModal();
            } else {
                openModal(artworkId);
            }
        }

        // 2. Nascondi / Mostra Interfaccia (Header e altri elementi)
        if (target.closest('#toggle-ui')) {
            isUiVisible = !isUiVisible;
            toggleUiBtn.classList.toggle('state-off', !isUiVisible);

            hideableElements.forEach(el => {
                isUiVisible ? el.classList.remove('ui-hidden') : el.classList.add('ui-hidden');
            });

            if (!isUiVisible) {
                subtitleContainer.classList.add('hidden');
            }
        }

        // 3. Attiva / Disattiva Audio (Ora cambia solo il Muto, non interrompe la traccia)
        if (target.closest('#toggle-audio')) {
            isAudioOn = !isAudioOn;
            toggleAudioBtn.classList.toggle('state-off', !isAudioOn);
            bgAudio.muted = !isAudioOn;
        }

        // 4. Attiva / Disattiva Sottotitoli
        if (target.closest('#toggle-subtitles')) {
            areSubtitlesOn = !areSubtitlesOn;
            toggleSubtitlesBtn.classList.toggle('state-off', !areSubtitlesOn);

            if (!areSubtitlesOn) {
                // Nasconde forzatamente se vengono spenti
                subtitleContainer.classList.add('hidden');
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
            langDropdownBtn.classList.remove('flag-it', 'flag-en');
            langDropdownBtn.classList.add(selectedLang === 'it' ? 'flag-it' : 'flag-en');
            changeLanguage(selectedLang);

            // Chiude la tendina dopo aver selezionato la lingua
            isDropdownOpen = false;
            langDropdownContent.classList.add('hidden');
        }

    });

    // Funzione per popolare e aprire il modale
    function openModal(id) {
        // Recupera i dati da mock-data.js
        const artworkData = artworksDatabase[id];
        if (!artworkData) return;
        const localizedData = artworkData[currentLanguage];

        // Popola i testi e le immagini
        modalTitle.textContent = localizedData.title;
        modalImage.src = artworkData.imageSrc;
        modalDesc.textContent = localizedData.description;

        // Sposta il pannello (e la linea di collegamento) accanto all'opera selezionata:
        // Opera 1 si apre a sinistra, Opera 2 a destra
        const wrapper = document.querySelector(`.artwork-wrapper[data-id="${id}"]`);
        if (wrapper) {
            wrapper.appendChild(modal);
            wrapper.appendChild(infoConnector);
        }
        const side = id === '1' ? 'panel-left' : 'panel-right';
        modal.classList.remove('panel-left', 'panel-right');
        modal.classList.add(side);
        infoConnector.classList.remove('panel-left', 'panel-right');
        infoConnector.classList.add(side);

        // Mostra il pannello e salva l'id corrente
        modal.classList.add('open');
        infoConnector.classList.add('open');
        modal.setAttribute('data-current-artwork', id);
    }

    // Funzione per chiudere il pannello laterale
    function closeModal() {
        modal.classList.remove('open');
        infoConnector.classList.remove('open');
        modal.removeAttribute('data-current-artwork');
    }

    // Funzione per gestire il cambio lingua simultaneo
    function changeLanguage(lang) {
        currentLanguage = lang;

        // 1. Salva il minutaggio attuale e lo stato della riproduzione
        const savedTime = bgAudio.currentTime;
        const wasPlaying = !bgAudio.paused;

        if (typeof backgroundAudioData !== 'undefined') {
            // 2. Cambia la sorgente del file audio
            bgAudio.src = backgroundAudioData[lang];

            // 3. Aspetta che il nuovo file sia pronto, poi ripristina il tempo
            bgAudio.addEventListener('loadedmetadata', function restoreTime() {
                // Se il salvataggio supera la durata del nuovo file, fallo ripartire dall'inizio
                if (savedTime > bgAudio.duration) {
                    bgAudio.currentTime = 0;
                } else {
                    bgAudio.currentTime = savedTime;
                }

                // Se l'audio stava suonando, fallo ripartire
                if (wasPlaying) {
                    bgAudio.play().catch(e => console.warn("Autoplay bloccato:", e));
                }

                // Rimuove l'evento per evitare conflitti ai futuri cambi lingua
                bgAudio.removeEventListener('loadedmetadata', restoreTime);
            });
        }

        // Se c'è un'opera aperta, ricarica solo i testi nel modale in tempo reale
        const currentArtworkId = modal.getAttribute('data-current-artwork');
        if (currentArtworkId && modal.classList.contains('open')) {
            openModal(currentArtworkId);
        }
    }
});