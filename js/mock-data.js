// js/mock-data.js

/**
 * Database simulato per il prototipo GazeIT.
 * Contiene i testi localizzati e i riferimenti fittizi per i file multimediali.
 */
const artworksDatabase = {
    "1": {
        // L'immagine è indipendente dalla lingua
        imageSrc: "assets/images/placeholder1.jpg",

        it: {
            title: "Opera 1 - Test Layout",
            description: "Questa è una descrizione temporanea per la prima opera. Serve a testare l'ingombro del testo all'interno del modale durante l'interazione visiva.",
            audioSrc: "temp_audio_it_1.mp3",
            subtitleText: "temp_text_it_1: [Sottotitolo simulato - Inizio traccia audio 1]"
        },
        en: {
            title: "Artwork 1 - Layout Test",
            description: "This is a temporary description for the first artwork. It is used to test text fitting inside the modal during gaze interaction.",
            audioSrc: "temp_audio_en_1.mp3",
            subtitleText: "temp_text_en_1: [Simulated subtitle - Start of audio track 1]"
        }
    },
    "2": {
        imageSrc: "assets/images/placeholder2.jpg",

        it: {
            title: "Opera 2 - Stress Test",
            description: "Seconda descrizione di prova. Utile per verificare che il cambio di lingua aggiorni dinamicamente e correttamente l'interfaccia senza ricaricare la pagina.",
            audioSrc: "temp_audio_it_2.mp3",
            subtitleText: "temp_text_it_2: [Sottotitolo simulato - Inizio traccia audio 2]"
        },
        en: {
            title: "Artwork 2 - Stress Test",
            description: "Second test description. Useful to verify that language switching dynamically and correctly updates the interface without reloading the page.",
            audioSrc: "temp_audio_en_2.mp3",
            subtitleText: "temp_text_en_2: [Simulated subtitle - Start of audio track 2]"
        }
    }
};

// Variabile globale per tenere traccia della lingua attualmente selezionata dall'utente
let currentLanguage = 'it';