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

    // Riferimenti Sottotitoli
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

    // --- Generazione di pannelli indipendenti per ogni opera ---
    // Clona il modello di modale e connettore all'interno di ogni opera, rendendo i pop-up non mutualmente esclusivi
    if (modal && infoConnector) {
        document.querySelectorAll('.artwork-wrapper').forEach(wrapper => {
            const id = wrapper.getAttribute('data-id');
            const side = id === '1' ? 'panel-left' : 'panel-right';

            const modalClone = modal.cloneNode(true);
            const connectorClone = infoConnector.cloneNode(true);

            modalClone.classList.add(side);
            connectorClone.classList.add(side);

            wrapper.appendChild(modalClone);
            wrapper.appendChild(connectorClone);
        });

        // Rimuove i template originali vuoti dal fondo della pagina dopo averli clonati all'interno delle singole opere
        modal.remove();
        infoConnector.remove();
    }

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

       // 1. Apertura/Chiusura Scheda Opera
       // Controlla e apre/chiude il modale specifico dell'opera, senza chiudere gli altri
       if (target.closest('.artwork-target')) {
           // Se l'interfaccia è nascosta, impedisci qualsiasi interazione con le opere e la riapertura dei pop-up
           if (!isUiVisible) return;

           const artworkId = target.closest('.artwork-target').getAttribute('data-id');
           const wrapper = document.querySelector(`.artwork-wrapper[data-id="${artworkId}"]`);
           const artworkModal = wrapper ? wrapper.querySelector('.side-panel') : null;

           const isSameArtworkOpen = artworkModal && artworkModal.classList.contains('open');

           if (isSameArtworkOpen) {
               closeModal(artworkId); // Chiude solo il pannello di questa specifica opera
           } else {
               openModal(artworkId);  // Apre il pannello senza chiudere quelli già aperti sulle altre opere
           }
       }
       // 2. Nascondi / Mostra Interfaccia (Header e altri elementi)
       if (target.closest('#toggle-ui')) {
           isUiVisible = !isUiVisible;
           toggleUiBtn.classList.toggle('state-off', !isUiVisible);

           // Se stiamo nascondendo l'interfaccia, chiudi TUTTI i modali aperti e nascondi i sottotitoli
           if (!isUiVisible) {
               closeModal(); // Richiamata senza parametri, la funzione chiude tutti i pannelli contemporaneamente
               subtitleContainer.classList.add('hidden');
           }

           // Nascondi gli elementi tradizionali ui-hideable
           hideableElements.forEach(el => {
               isUiVisible ? el.classList.remove('ui-hidden') : el.classList.add('ui-hidden');
           });

           // Nascondi o mostra completamente anche tutte le icone degli info point
           document.querySelectorAll('.artwork-info-btn').forEach(btn => {
               isUiVisible ? btn.classList.remove('ui-hidden') : btn.classList.add('ui-hidden');
           });
        }

        // 3. Attiva / Disattiva Audio (cambia solo il Muto, non interrompe la traccia)
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
    // MODIFICA: Ora cerca e compila esclusivamente il pannello clonato e il connettore associati a questa specifica opera
    function openModal(id) {
        // Recupera i dati da mock-data.js
        const artworkData = artworksDatabase[id];
        if (!artworkData) return;
        const localizedData = artworkData[currentLanguage];

        // Cerca il wrapper e il modale specifico di questa opera
        const wrapper = document.querySelector(`.artwork-wrapper[data-id="${id}"]`);
        if (!wrapper) return;

        const artworkModal = wrapper.querySelector('.side-panel');
        const artworkConnector = wrapper.querySelector('#info-connector');
        if (!artworkModal || !artworkConnector) return;

        // Popola i testi e le immagini all'interno di questo specifico pannello
        const titleEl = artworkModal.querySelector('h2');
        const imageEl = artworkModal.querySelector('img');
        const descEl = artworkModal.querySelector('p');

        if (titleEl) titleEl.textContent = localizedData.title;
        if (imageEl) {
            // Se il file non esiste o non si carica, nasconde l'immagine invece di mostrare il segnaposto rotto
            imageEl.onerror = () => imageEl.classList.add('hidden');
            if (artworkData.imageSrc) {
                imageEl.classList.remove('hidden');
                imageEl.src = artworkData.imageSrc;
            } else {
                imageEl.removeAttribute('src');
                imageEl.classList.add('hidden');
            }
        }
        if (descEl) descEl.textContent = localizedData.description;

        // Sposta il pannello (e la linea di collegamento) accanto all'opera selezionata:
        // (La gestione delle classi panel-left e panel-right è già stata impostata nella fase di clonazione iniziale)

        // Mostra il pannello e salva l'id corrente
        artworkModal.classList.add('open');
        artworkConnector.classList.add('open');
        artworkModal.setAttribute('data-current-artwork', id);

        // MODIFICA: Non rimuove più lo sfondo rosso dagli altri bottoni, ma applica l'attivazione SOLO al pulsante 'i' di questa opera
        const activeBtn = wrapper.querySelector('.artwork-info-btn');
        if (activeBtn) {
            activeBtn.classList.add('info-btn-active');
        }
    }

    // Funzione per chiudere il pannello laterale
    // MODIFICA: Accetta un ID opzionale per chiudere una singola opera, oppure tutte contemporaneamente se richiamata senza parametri
    function closeModal(id = null) {
          if (id) {
              // Chiude esclusivamente il pannello e il connettore dell'opera specificata
              const wrapper = document.querySelector(`.artwork-wrapper[data-id="${id}"]`);
              if (wrapper) {
                  const artworkModal = wrapper.querySelector('.side-panel');
                  const artworkConnector = wrapper.querySelector('#info-connector');
                  if (artworkModal) {
                      artworkModal.classList.remove('open');
                      artworkModal.removeAttribute('data-current-artwork');
                  }
                  if (artworkConnector) artworkConnector.classList.remove('open');

                  // Rimuove lo sfondo rosso dal bottone 'i' di questa specifica opera al momento della chiusura
                  const btn = wrapper.querySelector('.artwork-info-btn');
                  if (btn) btn.classList.remove('info-btn-active');
              }
          } else {
              // Se non viene specificato un ID (es. chiusura forzata dal pulsante nascondi interfaccia), chiude TUTTI i pannelli aperti
              document.querySelectorAll('.side-panel').forEach(m => {
                  m.classList.remove('open');
                  m.removeAttribute('data-current-artwork');
              });
              document.querySelectorAll('#info-connector').forEach(c => {
                  c.classList.remove('open');
              });
              // Rimuove lo sfondo rosso da tutte le icone quando il pannello si chiude
              document.querySelectorAll('.artwork-info-btn').forEach(btn => {
                  btn.classList.remove('info-btn-active');
              });
          }
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
        // Aggiorna simultaneamente i testi in tempo reale per TUTTI i pannelli che si trovano in quel momento in stato 'open'
        document.querySelectorAll('.side-panel.open').forEach(openModalEl => {
            const currentArtworkId = openModalEl.getAttribute('data-current-artwork');
            if (currentArtworkId) {
                openModal(currentArtworkId);
            }
        });
    }

    // --- Simulazione di comando vocale: tasto destro del mouse, da qualsiasi punto dello schermo ---
    const voiceCommandPanel = document.getElementById('voice-command-panel');
    const voiceCommandLabel = document.getElementById('voice-command-label');
    const voiceCommandMenu = document.getElementById('voice-command-menu');

    // Testi del menu vocale nella lingua corrente dell'app (la stessa usata per audio/sottotitoli/schede)
    const voiceCommandStrings = {
        it: {
            listening: 'GazeIT in ascolto...',
            openPanel: name => `Apri scheda "${name}"`,
            closePanel: name => `Chiudi scheda "${name}"`,
            subtitlesOn: 'Disattiva sottotitoli',
            subtitlesOff: 'Attiva sottotitoli',
            audioOn: 'Disattiva audio',
            audioOff: 'Attiva audio',
            switchLang: langName => `Cambia lingua in ${langName}`,
            hideUi: 'Nascondi interfaccia',
            showUi: 'Mostra interfaccia',
            langNames: { it: 'Italiano', en: 'English' }
        },
        en: {
            listening: 'GazeIT is listening...',
            openPanel: name => `Open "${name}" panel`,
            closePanel: name => `Close "${name}" panel`,
            subtitlesOn: 'Turn off subtitles',
            subtitlesOff: 'Turn on subtitles',
            audioOn: 'Turn off audio',
            audioOff: 'Turn on audio',
            switchLang: langName => `Switch language to ${langName}`,
            hideUi: 'Hide interface',
            showUi: 'Show interface',
            langNames: { it: 'Italian', en: 'English' }
        }
    };

    // Simula esattamente ciò che farebbe lo sguardo: riusa l'unico gestore 'gazeClick' già esistente,
    // così ogni voce del menu resta sempre coerente con l'azione corrispondente dell'interfaccia
    function simulateGazeClick(el) {
        if (!el) return;
        el.dispatchEvent(new CustomEvent('gazeClick', { bubbles: true }));
    }

    function addVoiceCommandItem(label, onSelect) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'voice-command-item';
        item.textContent = label;
        item.addEventListener('click', () => {
            onSelect();
            closeVoiceCommandPanel();
        });
        voiceCommandMenu.appendChild(item);
    }

    // Ricostruita ad ogni apertura, così le etichette (Apri/Chiudi, ON/OFF) riflettono sempre lo stato
    // e la lingua attuali
    function renderVoiceCommandMenu() {
        const t = voiceCommandStrings[currentLanguage] || voiceCommandStrings.it;
        voiceCommandLabel.textContent = t.listening;
        voiceCommandMenu.innerHTML = '';

        document.querySelectorAll('.artwork-wrapper').forEach(wrapper => {
            const id = wrapper.getAttribute('data-id');
            const artworkData = artworksDatabase[id];
            // Usa il titolo localizzato dell'opera, non l'etichetta statica sotto la miniatura
            const artworkName = artworkData ? artworkData[currentLanguage].title : `Opera ${id}`;
            const panel = wrapper.querySelector('.side-panel');
            const isOpen = panel && panel.classList.contains('open');
            const infoBtn = wrapper.querySelector('.artwork-info-btn');

            addVoiceCommandItem(
                isOpen ? t.closePanel(artworkName) : t.openPanel(artworkName),
                () => simulateGazeClick(infoBtn)
            );
        });

        addVoiceCommandItem(
            areSubtitlesOn ? t.subtitlesOn : t.subtitlesOff,
            () => simulateGazeClick(toggleSubtitlesBtn)
        );

        addVoiceCommandItem(
            isAudioOn ? t.audioOn : t.audioOff,
            () => simulateGazeClick(toggleAudioBtn)
        );

        const otherLang = currentLanguage === 'it' ? 'en' : 'it';
        addVoiceCommandItem(
            t.switchLang(t.langNames[otherLang]),
            () => simulateGazeClick(document.querySelector(`.lang-option[data-lang="${otherLang}"]`))
        );

        addVoiceCommandItem(
            isUiVisible ? t.hideUi : t.showUi,
            () => simulateGazeClick(toggleUiBtn)
        );
    }

    // Chiusura automatica del menu 5 secondi dopo l'apertura, se nel frattempo non viene già chiuso
    let voiceCommandAutoCloseTimer = null;

    function openVoiceCommandPanel() {
        renderVoiceCommandMenu();
        voiceCommandPanel.classList.remove('hidden');

        clearTimeout(voiceCommandAutoCloseTimer);
        voiceCommandAutoCloseTimer = setTimeout(closeVoiceCommandPanel, 5000);
    }

    function closeVoiceCommandPanel() {
        voiceCommandPanel.classList.add('hidden');
        clearTimeout(voiceCommandAutoCloseTimer);
        voiceCommandAutoCloseTimer = null;
    }

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        voiceCommandPanel.classList.contains('hidden') ? openVoiceCommandPanel() : closeVoiceCommandPanel();
    });

    document.addEventListener('click', (e) => {
        if (!voiceCommandPanel.classList.contains('hidden') && !voiceCommandPanel.contains(e.target)) {
            closeVoiceCommandPanel();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeVoiceCommandPanel();
    });
});