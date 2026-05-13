// ============================================================================
// MOCK DATA
// ============================================================================

const prodotti = [
    {
        immagine: 'https://placehold.co/120x160/f5d7c4/1f1f1f?text=Camicia',
        codice: 'AB-001',
        descrizione: 'Camicia Oxford a manica lunga in cotone.',
        categoria: 'camicie',
        prezzo: 39.9,
        quantita: 18,
        locazione: ['A', 1]
    },
    {
        immagine: 'https://placehold.co/120x160/d8e2dc/1f1f1f?text=T-shirt',
        codice: 'AB-002',
        descrizione: 'T-shirt basic regular fit in jersey.',
        categoria: 't-shirt',
        prezzo: 14.9,
        quantita: 34,
        locazione: ['A', 2]
    },
    {
        immagine: 'https://placehold.co/120x160/b7b7a4/1f1f1f?text=Jeans',
        codice: 'AB-003',
        descrizione: 'Jeans denim straight fit lavaggio medio.',
        categoria: 'pantaloni',
        prezzo: 59.9,
        quantita: 12,
        locazione: ['B', 1]
    },
    {
        immagine: 'https://placehold.co/120x160/c9ada7/1f1f1f?text=Felpa',
        codice: 'AB-004',
        descrizione: 'Felpa con cappuccio e tasca frontale.',
        categoria: 'felpe',
        prezzo: 44.5,
        quantita: 20,
        locazione: ['B', 2]
    },
    {
        immagine: 'https://placehold.co/120x160/ccd5ae/1f1f1f?text=Giacca',
        codice: 'AB-005',
        descrizione: 'Giacca leggera trapuntata per mezza stagione.',
        categoria: 'giacche',
        prezzo: 79.0,
        quantita: 8,
        locazione: ['C', 1]
    },
    {
        immagine: 'https://placehold.co/120x160/e9edc9/1f1f1f?text=Abito',
        codice: 'AB-006',
        descrizione: 'Abito midi con cintura e linea elegante.',
        categoria: 'abiti',
        prezzo: 89.9,
        quantita: 6,
        locazione: ['C', 2]
    },
    {
        immagine: 'https://placehold.co/120x160/f4acb7/1f1f1f?text=Gonna',
        codice: 'AB-007',
        descrizione: 'Gonna plissettata a vita alta in tessuto morbido.',
        categoria: 'gonne',
        prezzo: 34.9,
        quantita: 14,
        locazione: ['D', 1]
    },
    {
        immagine: 'https://placehold.co/120x160/bde0fe/1f1f1f?text=Accessorio',
        codice: 'AB-008',
        descrizione: 'Sciarpa leggera tinta unita in viscosa.',
        categoria: 'accessori',
        prezzo: 19.9,
        quantita: 25,
        locazione: ['D', 2]
    }
];

// ============================================================================
//   CONFIGURAZIONE CAMPI E STATO GLOBALE
// ============================================================================

const CAMPI_TABELLARI = {
    immagine: 'immagine',
    codice: 'codice',
    descrizione: 'descrizione',
    categoria: 'categoria',
    prezzo: 'prezzo',
    quantita: 'quantita',
    locazione: 'locazione'
};

let categoriaCorrente = 'tutte';
let ricercaCorrente = '';

// ============================================================================
//   UTILITY PER RENDERING
// ============================================================================

function etichettaLocazione(locazione) {
    if (Array.isArray(locazione) && locazione.length === 2) {
        return `${locazione[0]} / ${locazione[1]}`;
    }
    return locazione != null ? String(locazione) : '';
}

function renderRigaProdotto(prodotto) {
    return `
        <tr>
            <td>
                <img src="${prodotto[CAMPI_TABELLARI.immagine]}" alt="${prodotto[CAMPI_TABELLARI.descrizione]}" class="catalogo-img">
            </td>
            <td>${prodotto[CAMPI_TABELLARI.codice]}</td>
            <td>${prodotto[CAMPI_TABELLARI.descrizione]}</td>
            <td>${etichettaCategoria(prodotto[CAMPI_TABELLARI.categoria])}</td>
            <td>&euro; ${Number(prodotto[CAMPI_TABELLARI.prezzo]).toFixed(2)}</td>
            <td>${prodotto[CAMPI_TABELLARI.quantita]}</td>
            <td>${etichettaLocazione(prodotto[CAMPI_TABELLARI.locazione])}</td>
        </tr>
    `;
} // riguardare img

// ============================================================================
//   RENDERING PRINCIPALE DELLA TABELLA
// ============================================================================

function renderCatalogo() {
    const corpoTabella = document.querySelector('#catalogo-prodotti');
    if (!corpoTabella) return;

    const risultati = filtraSemplice(
        prodotti,
        categoriaCorrente,
        ricercaCorrente,
        ['descrizione'],
        'tutte'
    );

    corpoTabella.innerHTML = risultati.length > 0
        ? risultati.map(renderRigaProdotto).join('')
        : `
            <tr>
                <td colspan="7">Nessun prodotto corrisponde ai filtri selezionati.</td>
            </tr>
        `;

    if (typeof logFiltro === 'function') {
        logFiltro(categoriaCorrente, ricercaCorrente, risultati);
    }
}

// ============================================================================
//   INIZIALIZZAZIONE CATALOGO
// ============================================================================

function inizializzaCatalogo() {
    const valoriCategoria = estraiCategorie(prodotti, 'categoria')
        .sort((a, b) => a.localeCompare(b, 'it'));

    const opzioniDropdown = [
        { value: 'tutte', label: 'Tutte' },
        ...valoriCategoria.map(valore => ({
            value: valore,
            label: etichettaCategoria(valore)
        }))
    ];

    const dropdown = inizializzaDropdown(
        '[data-dropdown="categoria"]',
        opzioniDropdown,
        valore => {
            categoriaCorrente = valore;
            renderCatalogo();
        },
        { valoreIniziale: 'tutte' }
    );

    categoriaCorrente = dropdown && typeof dropdown.getValue === 'function'
        ? dropdown.getValue() || 'tutte'
        : 'tutte';

    const ricercaDebounced = debounce(valore => {
        ricercaCorrente = valore;
        renderCatalogo();
    }, 200);

    if (typeof ascolta === 'function') {
        ascolta('#input-ricerca', 'input', e => ricercaDebounced(e.target.value));
    } else {
        const inputRicerca = document.querySelector('#input-ricerca');
        if (inputRicerca) {
            inputRicerca.addEventListener('input', e => ricercaDebounced(e.target.value));
        }
    }

    if (typeof logInit === 'function') {
        logInit('prodotti', prodotti);
    }

    renderCatalogo();
}

// ============================================================================
//   AVVIO
// ============================================================================

document.addEventListener('DOMContentLoaded', inizializzaCatalogo);

