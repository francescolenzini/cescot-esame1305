/*
    STATICO (HTML diretto): header, nav, footer, hero, form, struttura accordion,
                            contenitore vuoto per griglia, modal, bottoni-filtro.
    DINAMICO (JS):          card nella griglia, contenuto modal o dettaglio in-pagina,
                            bottoni filtro / voci dropdown generati dai dati.
    Regola: se il contenuto non dipende dai dati, scrivilo nell'HTML.

    Tutti i listener si registrano con addEventListener — niente onclick="..." inline.
*/


// ============================================================================
//   MODAL OVERLAY
// ============================================================================

// Mostra il modal. `contenuto` può essere una stringa HTML oppure un Node.
function apriModal(selOverlay, contenuto) {
    const m = document.querySelector(selOverlay);
    if (!m) return;
    if (typeof contenuto === 'string') m.innerHTML = contenuto;
    else { m.innerHTML = ''; m.appendChild(contenuto); }
    m.classList.remove('nascosto');
}

function chiudiModal(selOverlay) {
    const m = document.querySelector(selOverlay);
    if (!m) return;
    m.classList.add('nascosto');
    m.innerHTML = '';
}

// Da chiamare UNA volta nel DOMContentLoaded. Gestisce: click sul backdrop,
// click sul bottone .modal-chiudi (delegato — funziona anche su contenuto generato),
// tasto Escape.
function initModal(selOverlay) {
    const m = document.querySelector(selOverlay);
    if (!m) return;
    m.addEventListener('click', e => {
        if (e.target === m) chiudiModal(selOverlay);
        else if (e.target.closest('.modal-chiudi')) chiudiModal(selOverlay);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !m.classList.contains('nascosto')) chiudiModal(selOverlay);
    });
}

// Template modal schema-agnostico. `campi` è una mappa dei campi del tuo oggetto:
//   templateModal(prodotto, {
//       titolo:'nome', testo:'descrizione', extra:'cura',
//       immagine:'immagine', prezzo:'prezzo', categoria:'categoria'
//   });
// Tutti i campi sono opzionali tranne `titolo`. Se manca `immagine` non rende l'img.
function templateModal(item, campi) {
    const c = campi || {};
    const titolo    = c.titolo    ? item[c.titolo]    : '';
    const testo     = c.testo     ? item[c.testo]     : '';
    const extra     = c.extra     ? item[c.extra]     : '';
    const immagine  = c.immagine  ? item[c.immagine]  : '';
    const prezzo    = c.prezzo    ? item[c.prezzo]    : null;
    const categoria = c.categoria ? item[c.categoria] : '';

    return `
        <div class="modal-card">
            <button class="modal-chiudi" type="button" aria-label="Chiudi">&#10005;</button>
            <div class="modal-contenuto">
                ${immagine ? `<img src="${immagine}" alt="${titolo}" class="modal-immagine">` : ''}
                <div class="modal-info">
                    <h2>${titolo}</h2>
                    <div class="modal-meta">
                        ${categoria ? `<span class="badge badge-categoria">${categoria}</span>` : ''}
                        ${prezzo != null ? `<span class="prezzo">&euro; ${Number(prezzo).toFixed(2)}</span>` : ''}
                    </div>
                    ${testo  ? `<p>${testo}</p>` : ''}
                    ${extra  ? `<div class="box-evidenziato">${extra}</div>` : ''}
                    <button class="btn modal-chiudi" type="button">Chiudi</button>
                </div>
            </div>
        </div>`;
}


// ============================================================================
//   ACCORDION
// ============================================================================

function inizializzaAccordion(selettore) {
    const items = document.querySelectorAll(selettore || '.accordion-item');
    items.forEach(item => {
        const titolo = item.querySelector('.accordion-titolo');
        if (!titolo) return;
        titolo.addEventListener('click', () => {
            const aperto = item.classList.contains('aperto');
            items.forEach(i => i.classList.remove('aperto'));
            if (!aperto) item.classList.add('aperto');
        });
    });
}


// ============================================================================
//   RENDER CARD
// ============================================================================

// Costruisce <article class="card"> per un singolo oggetto.
// Usa addEventListener (niente onclick inline) e chiude su `item` via closure:
// dentro il callback hai già l'oggetto intero — niente find() per id.
//
// renderCard(prodotto, {
//     campi:        { titolo:'nome', testo:'descrizione',
//                     immagine:'immagine', prezzo:'prezzo', categoria:'categoria' },
//     esaurito:     p => p.stock === 0,           // opzionale
//     onClick:      (p, ev) => apriDettaglio(p),  // click sulla card o sul bottone
//     testoBtn:     'Vedi dettaglio',             // default
//     testoEsaurito:'Esaurito',                   // default
//     onBottone:    (p, ev) => { ... }            // opzionale — listener distinto sul bottone
// })
function renderCard(item, opts) {
    opts = opts || {};
    const c             = opts.campi || {};
    const esaurito      = typeof opts.esaurito === 'function' ? opts.esaurito(item) : false;
    const testoBtn      = opts.testoBtn || 'Vedi dettaglio';
    const testoEsaurito = opts.testoEsaurito || 'Esaurito';

    const titolo    = c.titolo    ? item[c.titolo]    : '';
    const testo     = c.testo     ? item[c.testo]     : '';
    const immagine  = c.immagine  ? item[c.immagine]  : '';
    const prezzo    = c.prezzo    ? item[c.prezzo]    : null;
    const categoria = c.categoria ? item[c.categoria] : '';

    const card = document.createElement('article');
    card.classList.add('card');
    if (esaurito) card.classList.add('card-esaurita');

    // Costruisci la struttura interna con innerHTML (sicuro: nessun listener qui dentro)
    card.innerHTML = `
        ${immagine ? `<img src="${immagine}" alt="${titolo}">` : ''}
        <div class="card-body">
            ${categoria ? `<span class="badge badge-categoria">${categoria}</span>` : ''}
            <h3>${titolo}</h3>
            ${testo ? `<p>${testo}</p>` : ''}
            ${prezzo != null ? `<p class="prezzo">&euro; ${Number(prezzo).toFixed(2)}</p>` : ''}
            <button class="btn" type="button" ${esaurito ? 'disabled' : ''}>
                ${esaurito ? testoEsaurito : testoBtn}
            </button>
        </div>`;

    const bottone = card.querySelector('button');

    // Listener (closure su `item`): niente stringhe, niente lookup successivi
    if (opts.onClick && !esaurito) {
        card.addEventListener('click', ev => opts.onClick(item, ev));
    }
    if (opts.onBottone && !esaurito && bottone) {
        bottone.addEventListener('click', ev => {
            ev.stopPropagation();  // evita di triggerare anche il click della card
            opts.onBottone(item, ev);
        });
    }

    return card;
}


// ============================================================================
//   DETTAGLIO IN-PAGINA (alternativa al modal, pattern verifica-2304/2101)
// ============================================================================

// Sostituisce il contenuto di un contenitore (es. .pane, .product-detail)
// con il dettaglio di un oggetto. Aggiunge un bottone "indietro" con listener.
//
// mostraDettaglio('.pane', prodotto, {
//     campi:   { titolo:'name', testo:'description', immagine:'img',
//                prezzo:'price', categoria:'category' },
//     campiExtra: [{ etichetta:'Giacenza', campo:'stock' },
//                  { etichetta:'Arrivo',   campo:'arrivedAt' }],
//     onIndietro: () => renderCatalogo(),    // se omesso non mostra il bottone
//     scrollInto: true                       // scroll smooth al contenitore
// })
function mostraDettaglio(selContenitore, item, opts) {
    const cont = document.querySelector(selContenitore);
    if (!cont) return;
    opts = opts || {};
    const c = opts.campi || {};

    const titolo    = c.titolo    ? item[c.titolo]    : '';
    const testo     = c.testo     ? item[c.testo]     : '';
    const immagine  = c.immagine  ? item[c.immagine]  : '';
    const prezzo    = c.prezzo    ? item[c.prezzo]    : null;
    const categoria = c.categoria ? item[c.categoria] : '';

    const extra = (opts.campiExtra || [])
        .map(e => `<p><strong>${e.etichetta}:</strong> ${item[e.campo]}</p>`)
        .join('');

    const dettaglio = document.createElement('div');
    dettaglio.classList.add('dettaglio');
    dettaglio.innerHTML = `
        ${immagine ? `<img src="${immagine}" alt="${titolo}" class="dettaglio-immagine">` : ''}
        <div class="dettaglio-info">
            <h2>${titolo}</h2>
            <div class="modal-meta">
                ${categoria ? `<span class="badge badge-categoria">${categoria}</span>` : ''}
                ${prezzo != null ? `<span class="prezzo">&euro; ${Number(prezzo).toFixed(2)}</span>` : ''}
            </div>
            ${testo ? `<p>${testo}</p>` : ''}
            ${extra}
            ${opts.onIndietro ? `<button type="button" class="btn dettaglio-indietro">← Torna indietro</button>` : ''}
        </div>`;

    cont.innerHTML = '';
    cont.appendChild(dettaglio);

    if (opts.onIndietro) {
        dettaglio.querySelector('.dettaglio-indietro')
            .addEventListener('click', ev => opts.onIndietro(item, ev));
    }
    if (opts.scrollInto) {
        cont.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


// ============================================================================
//   INIT GUARD
// ============================================================================

// Esegue il callback solo se il selettore esiste — utile su pagine multi-html
// che non hanno tutti i componenti.
function initSeEsiste(sel, callback) {
    if (document.querySelector(sel)) callback();
}
