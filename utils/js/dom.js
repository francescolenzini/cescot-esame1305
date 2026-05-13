// ============================================================================
//   SELETTORI
// ============================================================================

function $(sel, ctx = document)  { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }


// ============================================================================
//   CREAZIONE ELEMENTI
// ============================================================================

function crea(tag, classe, testo) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (testo)  el.textContent = testo;
    return el;
}

function creaHTML(tag, classe, html) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (html)   el.innerHTML = html;
    return el;
}


// ============================================================================
//   CLASSI / STATO ATTIVO
// ============================================================================

// Toglie `classe` da tutti gli elementi che matchano `selettore` e la mette sul
// solo `elementoAttivo`. Tipico per bottoni filtro con stato "attivo".
function attivaUno(selettore, classe, elementoAttivo) {
    $$(selettore).forEach(el => el.classList.remove(classe));
    if (elementoAttivo) elementoAttivo.classList.add(classe);
}


// ============================================================================
//   CONTENUTO
// ============================================================================

function svuota(sel) {
    const el = typeof sel === 'string' ? $(sel) : sel;
    if (el) el.innerHTML = '';
}

function appendMulti(sel, elementi) {
    const el = typeof sel === 'string' ? $(sel) : sel;
    if (!el) return;
    elementi.forEach(child => el.appendChild(child));
}


// ============================================================================
//   EVENTI
// ============================================================================

// Un solo elemento: registra il listener se esiste (guard incluso).
function ascolta(sel, evento, callback) {
    const el = typeof sel === 'string' ? $(sel) : sel;
    if (el) el.addEventListener(evento, callback);
}

// Tutti gli elementi che matchano il selettore.
function ascoltaTutti(sel, evento, callback) {
    $$(sel).forEach(el => el.addEventListener(evento, callback));
}

// Event delegation: ascolta `click` (o altro evento) sul contenitore e filtra
// per i figli che matchano `selFiglio`. Sopravvive al re-render dei figli.
function delega(contenitore, evento, selFiglio, callback) {
    const el = typeof contenitore === 'string' ? $(contenitore) : contenitore;
    if (!el) return;
    el.addEventListener(evento, e => {
        const target = e.target.closest(selFiglio);
        if (target && el.contains(target)) callback(target, e);
    });
}

// Alias retrocompatibile (la versione vecchia accettava solo click)
function delegaClick(contenitore, selFiglio, callback) {
    delega(contenitore, 'click', selFiglio, callback);
}

// Chiama `callback` quando si clicca FUORI dall'elemento. Utile per chiudere
// dropdown/menù aperti.
function chiudeFuori(elemento, callback) {
    const el = typeof elemento === 'string' ? $(elemento) : elemento;
    if (!el) return;
    document.addEventListener('click', e => {
        if (!el.contains(e.target)) callback(e);
    });
}

// Listener globale su un tasto specifico (es. 'Escape', 'Enter').
function tasto(nomeTasto, callback) {
    document.addEventListener('keydown', e => {
        if (e.key === nomeTasto) callback(e);
    });
}
