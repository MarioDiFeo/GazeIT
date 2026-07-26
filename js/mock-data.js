// js/mock-data.js

// Costante per l'audio globale
const backgroundAudioData = {
    it: "../assets/audio/audio-ita.mp3",
    en: "../assets/audio/audio-eng.mp3"
};

// Sottotitoli globali sincronizzati
const globalSubtitlesData = {
    it: [
        { start: 0, end: 6, text: "Benvenuti al Museo del Louvre, il cuore pulsante dell'arte della storia e della cultura qui a Parigi." },
        { start: 6.5, end: 15, text: "Vi trovate attualmente all'interno di uno dei complessi museali più grandi e visitati al mondo, ma le mura che vi circondano non sono nate con lo scopo di ospitare opere d'arte." },
        { start: 15.5, end: 29, text: "Le origini di questo imponente edificio risalgono alla fine del dodicesimo secolo. Fu il re Filippo Augusto a ordinarne la costruzione, concependolo come una robusta fortezza militare per difendere la città di Parigi dagli attacchi lungo il fiume Senna." },
        { start: 29.5, end: 36, text: "Se oggi scendete nei livelli sotterranei, potete ancora ammirare i resti massicci di quelle antiche mura difensive." },
        { start: 36.5, end: 48, text: "Nel corso dei secoli successivi, la fortezza perse gradualmente la sua funzione militare. Fu durante il Rinascimento che il Louvre subì la sua trasformazione più radicale, diventando un magnifico palazzo reale." },
        { start: 48.5, end: 60, text: "Sovrani come Francesco primo e, in seguito, il Re Sole, Luigi quattordicesimo, lo arricchirono con dettagli sfarzosi e iniziarono a radunare qui le loro immense collezioni d'arte private." },
        { start: 60.3, end: 66.8, text: "Il vero punto di svolta arrivò nel 1793, durante il turbolento periodo della Rivoluzione Francese." },
        { start: 67, end: 74.5, text: "In quell'anno storico, il Palazzo Reale aprì per la prima volta le sue porte al popolo, trasformandosi ufficialmente in un museo pubblico." },
        { start: 75.5, end: 83.8, text: "L'obiettivo era chiaro: condividere i più grandi capolavori della nazione e del mondo non più solo con la nobiltà, ma con l'umanità intera." },
        { start: 84, end: 95, text: "Oggi, passeggiando attraverso le sue vaste gallerie illuminate, avrete l'opportunità di viaggiare attraverso oltre 9000 anni di civiltà umana. Dalle antiche sculture egizie e greche, fino ai capolavori del Rinascimento italiano e della pittura europea." },
        { start: 96, end: 107, text: "Prendetevi il vostro tempo. Lasciate che lo sguardo si soffermi sui dettagli e preparatevi a scoprire le innumerevoli storie che ogni singola tela e ogni statua hanno da raccontare. Buona esplorazione." }
    ],
    en: [
        { start: 0, end: 5, text: "Welcome to the Louvre Museum, the beating heart of art history and culture here in Paris." },
        { start: 6, end: 14, text: "You are currently standing inside one of the largest and most visited museum complexes in the world, but the walls surrounding you were not originally built to house works of art." },
        { start: 15, end: 26.5, text: "The origins of this imposing building date back to the late 12th century. King Philip Augustus ordered its construction, designing it as a robust military fortress to defend the city of Paris from attacks along the Seine River." },
        { start: 27, end: 33, text: "If you go down to the underground levels today, you can still admire the massive remains of those ancient defensive walls." },
        { start: 34, end: 45, text: "Over the following centuries, the fortress gradually lost its military function. It was during the Renaissance that the Louvre underwent its most radical transformation, becoming a magnificent royal palace." },
        { start: 45.5, end: 55, text: "Sovereigns such as Francis the 1st and later the Sun King Louis the 14th enriched it with lavish details and began to gather their immense private art collections here." },
        { start: 55.2, end: 61, text: "The true turning point arrived in 1793 during the turbulent period of the French Revolution." },
        { start: 61.2, end: 69, text: "In that historic year, the royal palace opened its doors to the people for the very first time, officially transforming into a public museum." },
        { start: 69.5, end: 76, text: "The goal was clear to share the greatest masterpieces of the nation and the world no longer just with the nobility, but with all of humanity." },
        { start: 76.6, end: 90, text: "Today walking through its vast illuminated galleries, you will have the opportunity to travel through over 9000 years of human civilization. From ancient Egyptian and Greek sculptures to the masterpieces of the Italian Renaissance and European painting." },
        { start: 91, end: 100, text: "Take your time. Let your gaze linger on the details and prepare to discover the countless stories that every single canvas and every statue has to tell. Enjoy your exploration." }
    ]
};

const artworksDatabase = {
    "1": {

        it: {
            title: "La Gioconda",
            description: "La sua popolarità globale esplose letteralmente nell'agosto del 1911, quando l'italiano Vincenzo Peruggia la rubò nascondendola sotto il cappotto. Per due anni attirò migliaia di visitatori curiosi e i giornali di tutto il mondo ne parlarono ininterrottamente. Quando il dipinto fu ritrovato in Italia, Monna Lisa era ormai diventata la star più famosa della storia dell'arte."
        },
        en: {
            title: "Monalisa",
            description: "Her global fame truly skyrocketed in August 1911, when Italian-born Vincenzo Peruggia stole the painting by hiding it under his coat. For two years, the Louvre drew thousands of curious visitors just to see the empty space, while newspapers worldwide covered the story relentlessly. By the time the artwork was recovered in Italy, the Mona Lisa had become the most famous icon in art history."
        }
    },
    "2": {
        imageSrc: "../assets/images/nike-det.jpg",

        it: {
            title: "Nike di Samotracia",
            description: "Originariamente fu ritrovata senza l'ala destra, che è stata successivamente ricostruita in gesso speculare a quella sinistra"
        },
        en: {
            title: "Winged Victory of Samothrace",
            description: "Originally discovered without the right wing, it was subsequently reconstructed in plaster to mirror the left"
        }
    }
};

let currentLanguage = 'it';