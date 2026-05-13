/*
    Due varianti di "dropdown" per filtri categoria.
    Scelta consigliata: inizializzaFiltriBottoni (più semplice, zero edge case).
    Usa inizializzaDropdown se servono molte categorie / spazio compatto.

    Pattern visti negli esami:
      - verifica-2101: bottoni filtro con stato .attivo
      - verifica-2304: tendina UL/LI con label che mostra il valore corrente
    <select> nativo resta un fallback valido se il tempo scarseggia.

    Entrambe le funzioni:
      - registrano listener con addEventListener (niente onclick inline)
      - prendono `opzioni`/`valori` da dati e callback `onCambio` (closure)
      - ritornano un oggetto { setValue, getValue } per impostare/leggere lo stato
*/


// ============================================================================
//   A) DROPDOWN A TENDINA (UL/LI)   — pattern verifica-2304
// ============================================================================
//
// HTML richiesto:
//   <div class="dropdown-custom" data-dropdown="categoria" tabindex="0">
//       <div class="dropdown-label">Categoria: <span class="dropdown-valore">Tutte</span></div>
//       <ul class="dropdown-opzioni"></ul>
//   </div>
//
// JS:
//   inizializzaDropdown('[data-dropdown="categoria"]',
//       [{ value:'all', label:'Tutte' },
//        { value:'Arredo', label:'Arredo' }],
//       (val, opt) => { categoriaCorrente = val; renderCatalogo(); },
//       { valoreIniziale:'all' });

function inizializzaDropdown(selDropdown, opzioni, onCambio, opts) {
    const dd = document.querySelector(selDropdown);
    if (!dd) return null;
    opts = opts || {};

    const ul     = dd.querySelector('.dropdown-opzioni');
    const valore = dd.querySelector('.dropdown-valore');
    if (!ul || !valore) return null;

    // Costruisci le voci
    ul.innerHTML = '';
    opzioni.forEach(o => {
        const li = document.createElement('li');
        li.className = 'dropdown-opzione';
        li.dataset.value = o.value;
        li.textContent = o.label;
        ul.appendChild(li);
    });

    // Toggle apri/chiudi cliccando sull'etichetta (NON sulle opzioni)
    dd.addEventListener('click', e => {
        if (e.target.closest('.dropdown-opzione')) return;
        dd.classList.toggle('is-open');
    });

    // Selezione: delegata, sopravvive al re-render
    ul.addEventListener('click', e => {
        const li = e.target.closest('.dropdown-opzione');
        if (!li) return;
        const v = li.dataset.value;
        impostaValore(v);
        dd.classList.remove('is-open');
        if (onCambio) onCambio(v, opzioni.find(o => o.value === v));
    });

    // Chiusura: click fuori, Escape
    document.addEventListener('click', e => {
        if (!dd.contains(e.target)) dd.classList.remove('is-open');
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') dd.classList.remove('is-open');
    });

    function impostaValore(v) {
        const opt = opzioni.find(o => o.value === v);
        valore.textContent = opt ? opt.label : v;
        dd.dataset.value = v;
    }

    // Valore iniziale (se passato)
    if (opts.valoreIniziale != null) impostaValore(opts.valoreIniziale);

    return {
        setValue: v => impostaValore(v),
        getValue: () => dd.dataset.value
    };
}


// ============================================================================
//   B) FILTRI A BOTTONI   — pattern verifica-2101
// ============================================================================
//
// HTML richiesto:
//   <div class="filtri-bottoni" data-filtri="categoria"></div>
//
// JS:
//   inizializzaFiltriBottoni('[data-filtri="categoria"]',
//       estraiCategorie(prodotti, 'categoria'),
//       cat => { categoriaCorrente = cat; renderCatalogo(); },
//       { conTutti:true, etichettaTutti:'Tutte', valoreTutti:'tutte',
//         etichetteMappa:{ aromatiche:'Erbe' }, valoreIniziale:'tutte' });

function inizializzaFiltriBottoni(selContenitore, valori, onCambio, opts) {
    const cont = document.querySelector(selContenitore);
    if (!cont) return null;
    opts = opts || {};

    const conTutti      = opts.conTutti !== false;       // default true
    const etichettaT    = opts.etichettaTutti || 'Tutte';
    const valoreT       = opts.valoreTutti    || 'tutte';
    const mappa         = opts.etichetteMappa || {};
    const classeAttivo  = opts.classeAttivo   || 'attivo';

    // Costruisci la lista finale (con/senza "Tutte" in testa)
    const elenco = conTutti ? [valoreT, ...valori] : [...valori];

    cont.innerHTML = '';
    elenco.forEach(v => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'filtro-btn';
        b.dataset.value = v;
        b.textContent = (v === valoreT) ? etichettaT
                      : (mappa[v] || (v.charAt(0).toUpperCase() + v.slice(1)));
        cont.appendChild(b);
    });

    function impostaAttivo(v) {
        cont.querySelectorAll('.filtro-btn').forEach(b => {
            b.classList.toggle(classeAttivo, b.dataset.value === v);
        });
        cont.dataset.value = v;
    }

    // Delegation: un solo listener sul contenitore
    cont.addEventListener('click', e => {
        const b = e.target.closest('.filtro-btn');
        if (!b) return;
        const v = b.dataset.value;
        impostaAttivo(v);
        if (onCambio) onCambio(v);
    });

    impostaAttivo(opts.valoreIniziale != null ? opts.valoreIniziale : elenco[0]);

    return {
        setValue: v => impostaAttivo(v),
        getValue: () => cont.dataset.value
    };
}
