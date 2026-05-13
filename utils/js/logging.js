// --- ALL'AVVIO: mostra i dati caricati ---
// Chiamala nel DOMContentLoaded del tuo script.js, dopo aver definito l'array.
//   logInit('piante', piante);
function logInit(nome, dati) {
    console.log('[init] Caricati', dati.length, 'elementi in', nome);
    console.table(dati);
}


// --- AL CAMBIO FILTRO: cosa è stato selezionato e quanti risultati ---
//   logFiltro(categoriaCorrente, ricercaCorrente, risultati);
function logFiltro(categoria, ricerca, risultati) {
    console.group('Filtro applicato');
    console.log('Categoria:', categoria);
    console.log('Ricerca:', ricerca || '(vuota)');
    console.log('Risultati trovati:', risultati.length);
    if (risultati.length > 0) console.table(risultati);
    else console.warn('Nessun risultato per i filtri correnti');
    console.groupEnd();
}


// --- AL CLICK DETTAGLIO: mostra l'oggetto selezionato ---
//   logDettaglio(pianta);
function logDettaglio(item) {
    console.group('Dettaglio aperto');
    console.log('Oggetto:', item);
    console.groupEnd();
}


// --- AL SUBMIT FORM: mostra i dati inviati ---
//   form.addEventListener('submit', e => { e.preventDefault(); logForm(e.target); });
function logForm(formElement) {
    const dati = Object.fromEntries(new FormData(formElement));
    console.group('Form inviato');
    console.log('Dati:', dati);
    console.groupEnd();
}


// --- ERRORE / CASO LIMITE ---
//   console.warn('Nessun risultato per:', ricerca);
//   console.error('Elemento non trovato:', id);
