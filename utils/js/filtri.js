// ============================================================================
//   FILTRO COMBINATO CATEGORIA + RICERCA TESTUALE
// ============================================================================

// Logica AND: passano solo gli item che soddisfano sia categoria sia ricerca.
//
// filtraArray(prodotti, 'interno', 'categoria', 'monstera', ['nome', 'descrizione'])
// La "categoria speciale" che disattiva il filtro è quella passata come
// `categoriaTutte` (default 'tutte') — passa 'all' o 'tutti' se il tuo schema
// lo richiede.
function filtraArray(dati, categoria, campoCateg, ricerca, campiRicerca, categoriaTutte) {
    const tutte = categoriaTutte || 'tutte';
    const q = String(ricerca || '').toLowerCase().trim();
    return dati.filter(item => {
        const okCat = categoria === tutte || item[campoCateg] === categoria;
        const okQ   = q === '' || campiRicerca.some(c =>
            String(item[c] != null ? item[c] : '').toLowerCase().includes(q)
        );
        return okCat && okQ;
    });
}

// Versione corta se il campo si chiama 'categoria'.
function filtraSemplice(dati, categoria, ricerca, campiRicerca, categoriaTutte) {
    return filtraArray(dati, categoria, 'categoria', ricerca, campiRicerca, categoriaTutte);
}


// ============================================================================
//   ESTRAZIONE VALORI UNICI
// ============================================================================

// Estrae i valori distinti di un campo. Utile per generare i bottoni filtro
// o le voci del dropdown dinamicamente dai dati.
//   estraiCategorie(prodotti, 'categoria') → ['interno', 'esterno', ...]
function estraiCategorie(dati, campo) {
    return [...new Set(dati.map(item => item[campo]))];
}


// ============================================================================
//   ETICHETTE LEGGIBILI
// ============================================================================

// Converte un codice categoria in un'etichetta visibile, con mappa opzionale.
//   etichettaCategoria('interno', { interno: 'Da interno' }) → 'Da interno'
//   etichettaCategoria('esterno', {})                        → 'Esterno'
function etichettaCategoria(codice, mappa) {
    const m = mappa || {};
    if (m[codice]) return m[codice];
    return codice.charAt(0).toUpperCase() + codice.slice(1);
}


// ============================================================================
//   DEBOUNCE — per l'input di ricerca
// ============================================================================

// Ritarda l'esecuzione finché l'utente smette di digitare. Evita di rifare il
// rendering della griglia ad ogni tasto.
//
//   const cerca = debounce(valore => { ricercaCorrente = valore; renderCatalogo(); }, 200);
//   ascolta('#input-ricerca', 'input', e => cerca(e.target.value));
function debounce(fn, ms) {
    let id;
    const ritardo = ms != null ? ms : 200;
    return function (...args) {
        clearTimeout(id);
        id = setTimeout(() => fn.apply(this, args), ritardo);
    };
}
