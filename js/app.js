/* ==========================================================================
   TuMuni La Matanza · Lógica de la app (SPA con rutas por hash)
   Rutas:
     #/                      Inicio (M1 / D1)
     #/categorias            Categorías + gráfico comparativo
     #/categoria/:id?mod=    Trámites de una categoría
     #/buscar?q=&mod=&cat=   Resultados con filtros (M2 / D2) y error (M9)
     #/tramite/:id           Ficha del trámite (M3, M4, M6, M7 / D3)
     #/mis-tramites          Checklists guardados y recordatorios (M8)
     #/recordatorio?t=:id    Formulario de recordatorio
     #/ayuda                 FAQ, accesibilidad (A+), teléfonos
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- Almacenamiento local (opcional, RN-13) ---------------- */
  const store = {
    get(k, def) { try { const v = localStorage.getItem("tm_" + k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem("tm_" + k, JSON.stringify(v)); } catch (e) { /* modo privado */ } },
    del(k) { try { localStorage.removeItem("tm_" + k); } catch (e) {} }
  };

  const state = {
    loc: store.get("loc", ""),
    big: store.get("big", false),
    saved: store.get("saved", {}),
    recs: store.get("recs", []),
    recent: store.get("recent", []),
    session: {}
  };

  /* ---------------- Íconos (SVG de trazo, iguales en todos los sistemas) ---------------- */
  const P = {
    casa: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    licencia: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4M14 13.5h3"/>',
    auto: '<path d="M5 16v-5l2-5h10l2 5v5"/><path d="M3 16h18v3h-3M6 19H3v-3"/><path d="M5 11h14"/><circle cx="7.5" cy="13.5" r=".9" fill="currentColor"/><circle cx="16.5" cy="13.5" r=".9" fill="currentColor"/>',
    comercio: '<path d="M4 9h16l-1.5-4h-13z"/><path d="M4 9c0 1.7 1.3 3 3 3s2.7-1.3 2.7-3c0 1.7 1.3 3 2.6 3s2.7-1.3 2.7-3c0 1.7 1.3 3 3 3s2-1.3 2-3"/><path d="M5 12v8h14v-8M10 20v-5h4v5"/>',
    salud: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M12 9v5M9.5 11.5h5"/>',
    reclamos: '<path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
    cementerio: '<path d="M7 21V10a5 5 0 0 1 10 0v11"/><path d="M4 21h16M12 9v6M9.5 11.5h5"/>',
    otros: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    online: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>',
    turno: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    distancia: '<path d="M5 18l-1 3 3.5-1.5A8 8 0 1 0 5 18z"/>',
    presencial: '<path d="M12 21s-6-5.4-6-11a6 6 0 0 1 12 0c0 5.6-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
    susp: '<circle cx="12" cy="12" r="8"/><path d="M6.5 6.5l11 11"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    arrow: '<path d="M9 6l6 6-6 6"/>',
    hist: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5M12 8v4l3 2"/>',
    trend: '<path d="M4 17l5-5 4 4 7-7"/><path d="M15 9h5v5"/>'
  };
  const ico = (n, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

  /* ---------------- Utilidades ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const view = $("#view");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ\s]/g, " ").replace(/\s+/g, " ").trim();
  const byId = (id) => TRAMITES.find((t) => t.id === id);
  const cat = (id) => CATEGORIAS.find((c) => c.id === id);
  const catCount = (id) => TRAMITES.filter((t) => t.cat === id).length;
  const locName = () => (LOCALIDADES.find((l) => l.id === state.loc) || {}).nombre || "";
  const fmtDate = (iso) => { if (!iso) return ""; const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
  const telHref = (t) => "tel:" + String(t).replace(/int\..*$/i, "").replace(/\D/g, "");

  function modChip(t, lg) {
    if (t.estado === "suspendido") return `<span class="mod mod--susp${lg ? " mod--lg" : ""}">${ico("susp")}Suspendido</span>`;
    return `<span class="mod mod--${t.mod}${lg ? " mod--lg" : ""}">${ico(t.mod)}${MODALIDADES[t.mod].label}</span>`;
  }
  function notice(tipo, html) {
    const i = { aviso: "!", info: "i", error: "!", ok: "✓" }[tipo] || "i";
    return `<div class="notice notice--${tipo}" role="${tipo === "error" ? "alert" : "note"}"><span class="notice__ico" aria-hidden="true">${i}</span><div>${html}</div></div>`;
  }
  function toast(msg, ms = 3200) {
    const el = document.createElement("div");
    el.className = "toast"; el.textContent = msg;
    $("#toasts").appendChild(el);
    setTimeout(() => el.remove(), ms);
  }
  function persist() { store.set("saved", state.saved); store.set("recs", state.recs); }

  /* ---------------- Buscador tolerante ---------------- */
  const STOP = new Set("de la el los las mi mis un una unos para por que quiero necesito como hacer tramite tramites en del al y o a me se tu su con sin donde cuando sacar pedir tengo".split(" "));
  const FUERA = {
    pasaporte: "El pasaporte es un trámite nacional (RENAPER).",
    dni: "El DNI es un trámite nacional (RENAPER).",
    anses: "ANSES es un organismo nacional.",
    afip: "ARCA (ex AFIP) es un organismo nacional.",
    arca: "ARCA es un organismo nacional.",
    arba: "ARBA es un organismo provincial.",
    partida: "Las partidas de nacimiento se piden en el Registro de las Personas de la Provincia.",
    vtv: "La VTV es un trámite provincial.",
    sube: "La SUBE es un servicio nacional."
  };

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  const INDEX = TRAMITES.map((t) => {
    const name = norm(t.nombre);
    const main = norm([t.nombre, t.oficial, t.claves, t.resumen, cat(t.cat).nombre].join(" "));
    const extra = norm((t.checklist || []).map((c) => c.t).concat(t.tenerAMano || []).join(" "));
    return { t, nameWords: name.split(" "), mainWords: Array.from(new Set(main.split(" "))), extraWords: Array.from(new Set(extra.split(" "))) };
  });

  function tokens(q) {
    const raw = norm(q).split(" ").filter((w) => w && !STOP.has(w));
    return { raw, toks: raw.map((w) => SINONIMOS[w] || w) };
  }

  function search(q) {
    const { raw, toks } = tokens(q);
    if (!toks.length) return { results: [], toks, raw };
    const results = [];
    INDEX.forEach((ix) => {
      let score = 0, hits = 0;
      toks.forEach((tk) => {
        const pref = (w) => w.startsWith(tk) || (tk.length > 4 && w.includes(tk));
        const fuzzy = (w) => tk.length >= 4 && w.length >= 4 && lev(tk, w) <= (tk.length >= 7 ? 2 : 1);
        if (ix.mainWords.some(pref)) { hits++; score += ix.nameWords.some(pref) ? 4 : 2; }
        else if (ix.mainWords.some(fuzzy)) { hits++; score += 1.5; }
        else if (tk.length >= 4 && ix.extraWords.some(pref)) { hits++; score += 0.8; }
      });
      if (hits && hits >= Math.ceil(toks.length * 0.6)) {
        if (ix.t.masBuscado) score += 0.6;
        if (ix.t.estado === "suspendido") score -= 0.8;
        results.push({ t: ix.t, score });
      }
    });
    results.sort((a, b) => b.score - a.score);
    return { results: results.map((r) => r.t), toks, raw };
  }

  function didYouMean(q) {
    const tri = (s) => { s = "  " + norm(s) + " "; const out = new Set(); for (let i = 0; i < s.length - 2; i++) out.add(s.slice(i, i + 3)); return out; };
    const qt = tri(q); let best = null, bestS = 0;
    INDEX.forEach((ix) => {
      const tt = tri(ix.t.nombre + " " + ix.t.claves);
      let inter = 0; qt.forEach((g) => { if (tt.has(g)) inter++; });
      const s = inter / qt.size;
      if (s > bestS) { bestS = s; best = ix.t; }
    });
    return bestS >= 0.3 ? best : null;
  }

  // Resalta en el texto las palabras buscadas (respeta tildes del original)
  function highlight(text, q) {
    const { raw, toks } = tokens(q);
    const terms = Array.from(new Set(raw.concat(toks))).filter((w) => w.length >= 2);
    if (!terms.length) return esc(text);
    const flat = Array.from(text).map((ch) => ch.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")[0] || ch).join("");
    const marks = new Array(text.length).fill(false);
    terms.forEach((t) => {
      const re = new RegExp("(^|[^a-z0-9ñ])(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "g");
      let m; while ((m = re.exec(flat))) { const s = m.index + m[1].length; for (let i = s; i < s + m[2].length; i++) marks[i] = true; re.lastIndex = s + 1; }
    });
    let out = "", open = false;
    Array.from(text).forEach((ch, i) => {
      if (marks[i] && !open) { out += "<mark>"; open = true; }
      if (!marks[i] && open) { out += "</mark>"; open = false; }
      out += esc(ch);
    });
    return out + (open ? "</mark>" : "");
  }

  function addRecent(q) {
    q = (q || "").trim(); if (!q) return;
    state.recent = [q].concat(state.recent.filter((x) => norm(x) !== norm(q))).slice(0, 5);
    store.set("recent", state.recent);
  }

  /* ---------------- Sedes ordenadas por localidad (RN-12) ---------------- */
  function sedeIds(t, w) {
    if (t.sedesPorRespuesta) {
      const k = Object.keys(t.sedesPorRespuesta)[0];
      const v = w.answers[k];
      if (v && t.sedesPorRespuesta[k][v]) return t.sedesPorRespuesta[k][v];
      if (!t.sedes) return Array.from(new Set(Object.values(t.sedesPorRespuesta[k]).flat()));
    }
    return t.sedes || [];
  }
  function sortedSedes(ids) {
    const sedes = (ids || []).map((id) => ({ id, ...SEDES[id] }));
    const loc = LOCALIDADES.find((l) => l.id === state.loc);
    if (!loc || sedes.length < 2) return { sedes, cerca: null };
    const dist = (s) => Math.hypot(s.lat - loc.lat, (s.lng - loc.lng) * 0.82);
    sedes.sort((a, b) => dist(a) - dist(b));
    return { sedes, cerca: sedes[0].id };
  }
  function mapHTML(sedes) {
    const inside = sedes.filter((s) => !s.externo);
    if (!inside.length) return "";
    const box = { n: -34.62, s: -34.86, w: -58.72, e: -58.46 };
    const pos = (lat, lng) => `left:${Math.min(92, Math.max(8, (lng - box.w) / (box.e - box.w) * 100)).toFixed(1)}%;top:${Math.min(90, Math.max(24, (lat - box.n) / (box.s - box.n) * 100 + 16)).toFixed(1)}%`;
    const loc = LOCALIDADES.find((l) => l.id === state.loc);
    const pins = inside.slice(0, 6).map((s, i) => `<div class="map__pin" style="${pos(s.lat, s.lng)}"><b>${inside.length > 1 ? i + 1 : esc(s.nombre.split(" · ").pop())}</b><i></i></div>`).join("");
    const me = loc ? `<div class="map__pin me" style="${pos(loc.lat, loc.lng)}"><b>Vos</b><i></i></div>` : "";
    return `<div class="map" role="img" aria-label="Mapa ilustrativo de las sedes en La Matanza">${pins}${me}<span class="map__label">La Matanza</span></div>`;
  }
  const gmaps = (s) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((s.direccion || s.nombre) + ", La Matanza, Buenos Aires");

  /* ---------------- Modal ---------------- */
  let lastFocus = null;
  function openModal(html, onReady) {
    lastFocus = document.activeElement;
    const bg = $("#modal-bg"), m = $("#modal");
    m.innerHTML = html; bg.hidden = false;
    document.body.style.overflow = "hidden";
    const f = m.querySelector("[data-autofocus]") || m.querySelector("button, a, input");
    if (f) f.focus();
    if (onReady) onReady(m);
  }
  function closeModal() {
    $("#modal-bg").hidden = true; $("#modal").innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $("#modal-bg").addEventListener("click", (e) => { if (e.target.id === "modal-bg") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#modal-bg").hidden) closeModal(); });

  /* URL de una acción: WhatsApp o email oficial con el mensaje modelo (RN-06) */
  function actionUrl(a, t) {
    const body = t && t.plantilla ? t.plantilla.filter((l) => !/^Asunto:/.test(l)).join("\n") : "";
    if (a.wa) return "https://wa.me/" + a.wa + "?text=" + encodeURIComponent(body);
    if (a.mail) return "mailto:" + a.mail + "?subject=" + encodeURIComponent(a.asunto || "") + "&body=" + encodeURIComponent(body);
    return a.url;
  }

  /* Alerta de salida (RN-07): explica a dónde va y qué va a necesitar */
  function exitAlert(cfg, after) {
    const titulos = {
      web: "Vas a ir a la web del Municipio", turnero: "Vas al turnero oficial",
      whatsapp: "Vas a abrir WhatsApp", email: "Vas a abrir tu email",
      tel: "Vas a llamar al 147", externo: "Vas a un sitio oficial externo", fuente: "Vas a la fuente oficial"
    };
    const icons = { whatsapp: "distancia", email: "distancia", tel: "reclamos", turnero: "turno", web: "online" };
    const pedira = (cfg.pedira || []).length ? `<div class="modal__list"><b>Vas a necesitar:</b><ul>${cfg.pedira.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>` : "";
    const url = cfg._url || cfg.url;
    const newTab = !/^(tel|mailto):/.test(url);
    openModal(`
      <div class="modal__ico" aria-hidden="true">${ico(icons[cfg.tipo] || "arrow")}</div>
      <h2 id="modal-title">${titulos[cfg.tipo] || titulos.web}</h2>
      <p class="modal__txt">${esc(cfg.queHace || "")}</p>
      <p class="modal__dest">${esc(cfg.destino || url)}</p>
      ${pedira}
      <p class="small muted modal__foot">TuMuni no cobra, no da turnos, no envía nada ni ve tus datos.</p>
      <div class="btns">
        <a class="btn" data-autofocus href="${esc(url)}" ${newTab ? 'target="_blank" rel="noopener"' : ""} id="exit-go">Continuar</a>
        <button class="btn btn--outline" type="button" id="exit-cancel">Cancelar</button>
      </div>`, (m) => {
      $("#exit-cancel", m).onclick = closeModal;
      $("#exit-go", m).onclick = () => { setTimeout(() => { closeModal(); if (after) after(); }, 50); };
    });
  }

  /* Selector de localidad (opcional, primera vez) */
  function locModal(first) {
    openModal(`
      <div class="modal__ico" aria-hidden="true">${ico("presencial")}</div>
      <h2 id="modal-title">${first ? "¡Hola! ¿En qué localidad vivís?" : "Elegí tu localidad"}</h2>
      <p class="modal__txt">Es opcional. Solo la usamos para mostrarte primero la sede más cercana. No sale de tu dispositivo.</p>
      <div class="loc-list" role="group" aria-label="Localidades de La Matanza">
        ${LOCALIDADES.map((l) => `<button type="button" data-loc="${l.id}" aria-pressed="${state.loc === l.id}">${esc(l.nombre)}</button>`).join("")}
      </div>
      <button class="btn btn--outline" type="button" id="loc-skip">${state.loc ? "Quitar localidad y ver todas las sedes" : "Ahora no"}</button>`, (m) => {
      $$("[data-loc]", m).forEach((b) => b.onclick = () => { setLoc(b.dataset.loc); closeModal(); toast("Listo: te mostramos primero las sedes cerca de " + locName()); });
      $("#loc-skip", m).onclick = () => { if (state.loc) setLoc(""); closeModal(); };
    });
    store.set("visto", true);
  }
  function setLoc(id) { state.loc = id; store.set("loc", id); paintLoc(); render(); }
  function paintLoc() { $("#loc-chip-txt").textContent = locName() || "Mi localidad"; $("#loc-chip").title = locName() ? "Tu localidad: " + locName() : "Elegí tu localidad"; }
  $("#loc-chip").addEventListener("click", () => locModal(false));

  /* A+ */
  function paintBig() { document.documentElement.classList.toggle("big", state.big); $("#aplus").setAttribute("aria-pressed", state.big); }
  function toggleBig() { state.big = !state.big; store.set("big", state.big); paintBig(); toast(state.big ? "Texto grande activado" : "Texto normal"); const s = $("#sw-big"); if (s) s.setAttribute("aria-pressed", state.big); }
  $("#aplus").addEventListener("click", toggleBig);

  /* Búsqueda de la barra superior (escritorio) */
  $("#topsearch").addEventListener("submit", (e) => { e.preventDefault(); const q = $("#topsearch-input").value.trim(); addRecent(q); location.hash = "#/buscar?q=" + encodeURIComponent(q); });

  /* ---------------- Componentes ---------------- */
  let closeSuggest = null;
  document.addEventListener("pointerdown", (e) => { if (closeSuggest) closeSuggest(e); });
  function searchBox(value, opts = {}) {
    return `
      <form class="search${opts.big ? " search--big" : ""}" id="searchform" role="search" autocomplete="off">
        ${ico("search", "search__ico")}
        <label class="sr" for="q">¿Qué trámite necesitás?</label>
        <input id="q" name="q" type="search" value="${esc(value || "")}" placeholder="Ej: pagar tasa, renovar registro, habilitar mi local…" ${opts.autofocus ? "autofocus" : ""} role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="suggest">
        ${value ? '<button type="button" class="search__clear" id="qclear" aria-label="Borrar búsqueda">×</button>' : ""}
        <button type="submit" class="search__go">Buscar</button>
        <div class="suggest" id="suggest" role="listbox" hidden></div>
      </form>`;
  }
  function bindSearch() {
    const f = $("#searchform"); if (!f) return;
    const input = $("#q", f), sug = $("#suggest", f);
    let hl = -1;
    const open = (html) => { sug.innerHTML = html; sug.hidden = !html; input.setAttribute("aria-expanded", !!html); hl = -1; };

    function panelEmpty() {
      const rec = state.recent.length ? `<div class="suggest__h">${ico("hist")}Búsquedas recientes</div>${state.recent.map((r) => `<a class="suggest__q" role="option" href="#/buscar?q=${encodeURIComponent(r)}" data-q="${esc(r)}">${ico("hist")}<span>${esc(r)}</span></a>`).join("")}` : "";
      const pop = `<div class="suggest__h">${ico("trend")}Lo más buscado</div><div class="suggest__chips">${POPULARES.map((p) => `<a class="chip chip--sm" role="option" href="#/buscar?q=${encodeURIComponent(p)}" data-q="${esc(p)}">${esc(p)}</a>`).join("")}</div>`;
      return rec + pop;
    }
    function panelResults(q) {
      const { results } = search(q);
      if (!results.length) return `<div class="suggest__empty">Sin coincidencias para “${esc(q)}”. Probá con otras palabras o tocá <b>Buscar</b>.</div>`;
      const top = results.slice(0, 6).map((t) => `
        <a class="suggest__item cat--${t.cat}" role="option" href="#/tramite/${t.id}">
          <span class="suggest__ico">${ico(cat(t.cat).icon)}</span>
          <span class="suggest__txt"><span class="suggest__name">${highlight(t.nombre, q)}</span><span class="suggest__meta">${esc(cat(t.cat).nombre)} · ${MODALIDADES[t.mod].corto}${t.estado === "suspendido" ? " · suspendido" : ""}</span></span>
        </a>`).join("");
      return top + `<a class="suggest__all" role="option" href="#/buscar?q=${encodeURIComponent(q)}" data-q="${esc(q)}">Ver ${results.length === 1 ? "el resultado" : "los " + results.length + " resultados"} para “${esc(q)}” →</a>`;
    }
    function refresh() { const q = input.value.trim(); open(q.length >= 2 ? panelResults(q) : panelEmpty()); }

    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = $$("a", sug)[hl];
      if (a && !sug.hidden) { if (a.dataset.q) addRecent(a.dataset.q); location.hash = a.getAttribute("href"); return; }
      const q = input.value.trim(); addRecent(q);
      location.hash = "#/buscar" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
    sug.addEventListener("click", (e) => { const a = e.target.closest("a[data-q]"); if (a) addRecent(a.dataset.q); });
    const clear = $("#qclear", f);
    if (clear) clear.onclick = () => { input.value = ""; input.focus(); refresh(); };
    input.addEventListener("focus", refresh);
    input.addEventListener("input", refresh);
    input.addEventListener("keydown", (e) => {
      const items = $$("a", sug);
      if (e.key === "Escape") { open(""); return; }
      if (sug.hidden || !items.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); hl = (hl + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((a, i) => a.classList.toggle("hl", i === hl));
        items[hl].scrollIntoView({ block: "nearest" });
      }
    });
    closeSuggest = (e) => { if (!f.contains(e.target)) open(""); };
  }

  function resultCard(t, opts = {}) {
    const off = t.estado === "suspendido";
    const c = cat(t.cat);
    return `<a class="card result cat--${c.id}${off ? " is-off" : ""}" href="#/tramite/${t.id}">
      <span class="result__ico">${ico(c.icon)}</span>
      <div class="result__body">
        ${opts.showCat ? `<div class="result__cat">${esc(c.nombre)}</div>` : ""}
        <div class="result__name">${opts.q ? highlight(t.nombre, opts.q) : esc(t.nombre)}</div>
        <div class="result__sub">${esc(t.resumen)}</div>
        ${modChip(t)}
      </div>${ico("arrow", "result__arrow")}</a>`;
  }

  function catsGrid(big) {
    return `<div class="cats${big ? " cats--big" : ""}">${CATEGORIAS.map((c) => `
      <a class="cat cat--${c.id}" href="#/categoria/${c.id}">
        <span class="cat__ico">${ico(c.icon)}</span>
        <span class="cat__body"><span class="cat__name">${esc(c.nombre)}</span>
        <span class="cat__desc">${esc(c.desc)}</span>
        <span class="cat__count">${catCount(c.id)} trámites</span></span>
      </a>`).join("")}</div>`;
  }

  function chart() {
    const colors = { online: "var(--ok)", turno: "var(--action)", distancia: "var(--dist)", presencial: "var(--aviso)" };
    const counts = Object.keys(MODALIDADES).map((k) => ({ k, n: TRAMITES.filter((t) => t.mod === k && t.estado !== "suspendido").length }));
    const max = Math.max(...counts.map((c) => c.n));
    return `<div class="chart" role="list">${counts.map((c) => `
      <a class="bar" role="listitem" href="#/buscar?mod=${c.k}" aria-label="${MODALIDADES[c.k].label}: ${c.n} trámites">
        <span class="bar__l">${ico(c.k)}${MODALIDADES[c.k].label}</span>
        <span class="bar__track"><span class="bar__fill" style="width:${(c.n / max * 100).toFixed(0)}%;background:${colors[c.k]}"></span></span>
        <span class="bar__n">${c.n}</span>
      </a>`).join("")}</div>`;
  }

  /* ---------------- Vistas ---------------- */

  // M1 / D1 · Inicio
  function vInicio() {
    const top = TRAMITES.filter((t) => t.masBuscado).slice(0, 8);
    const sinVentanilla = TRAMITES.filter((t) => t.mod === "online" || t.mod === "distancia").length;
    const proxRec = state.recs.filter((r) => r.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
    const venc = proxRec
      ? `<div class="venc"><div class="venc__k">${esc(proxRec.label)}</div><div class="small">${fmtDate(proxRec.fecha)} · te avisamos 3 días antes</div><a href="#/mis-tramites">Ver mis recordatorios →</a></div>`
      : `<div class="venc"><div class="venc__k">Tasa por Servicios Generales</div><div class="small">Cuota 11 · fecha según el <a href="#" data-ext="vencimientos" class="inline">calendario oficial</a></div><a href="#/tramite/pagar-tasa">Ver cómo pagar →</a></div>`;
    return `
      <section class="hero">
        <div class="hero__in">
          <p class="hero__kicker">${ico("presencial")} Municipio de La Matanza · ${TRAMITES.length} trámites</p>
          <h1>¿Qué trámite necesitás?</h1>
          ${searchBox("", { big: true })}
          <div class="hero__chips" aria-label="Búsquedas frecuentes">
            ${POPULARES.slice(0, 6).map((p) => `<a class="chip chip--hero" href="#/buscar?q=${encodeURIComponent(p)}" data-recent="${esc(p)}">${esc(p)}</a>`).join("")}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section__head"><h2>Buscá por lo que necesitás</h2><a href="#/categorias">Ver todo →</a></div>
        ${catsGrid(false)}
      </section>
      <div class="home-cols">
        <section class="section">
          <div class="section__head"><h2>Los más buscados</h2><a href="#/buscar">Ver los ${TRAMITES.length} →</a></div>
          <div class="results-grid">${top.map((t) => resultCard(t)).join("")}</div>
        </section>
        <aside class="section home-aside">
          <div class="section__head"><h2>Próximo vencimiento</h2></div>
          ${venc}
          <a class="btn btn--outline mt-s" href="#/recordatorio">${ico("clock")} Activar recordatorio</a>
          <div class="stat card mt">
            <div class="stat__n">${sinVentanilla}<span> de ${TRAMITES.length}</span></div>
            <p class="small">trámites se resuelven <b>sin ir a una ventanilla</b>.</p>
            <a href="#/categorias" class="small stat__link">Ver cómo se hace cada uno →</a>
          </div>
        </aside>
      </div>`;
  }

  // Categorías + gráfico comparativo
  function vCategorias() {
    const total = TRAMITES.length;
    const sinV = TRAMITES.filter((t) => t.mod === "online" || t.mod === "distancia").length;
    return `
      <header class="page-head">
        <h1>Categorías</h1>
        <p class="muted">Los ${total} trámites del Municipio de La Matanza, ordenados por lo que necesitás y no por oficina.</p>
      </header>
      <section class="section">${catsGrid(true)}</section>
      <section class="section card chart-card">
        <div class="chart-card__head">
          <div><h2>¿Cómo se hacen los trámites de La Matanza?</h2>
          <p class="small muted mt-s">Cantidad de trámites según cómo los resuelve hoy el municipio. Tocá una barra para verlos.</p></div>
          <div class="chart-card__big"><b>${sinV}</b> de ${total}<span>sin ir a una ventanilla</span></div>
        </div>
        ${chart()}
      </section>`;
  }

  // Lista por categoría
  function vCategoria(id, params) {
    const c = cat(id); if (!c) return vNotFound();
    const mod = params.get("mod") || "";
    const all = TRAMITES.filter((t) => t.cat === id);
    const list = mod ? all.filter((t) => t.mod === mod) : all;
    const chips = [["", "Todos"], ["online", "Online"], ["turno", "Con turno"], ["distancia", "A distancia"], ["presencial", "Presencial"]]
      .map(([k, l]) => { const n = k ? all.filter((t) => t.mod === k).length : all.length; if (k && !n) return ""; return `<a class="chip${mod === k ? " on" : ""}" href="#/categoria/${id}${k ? "?mod=" + k : ""}">${k ? ico(k) : ""}${l} <span class="count">${n}</span></a>`; }).join("");
    return `
      <button class="back" type="button" data-back>‹ Volver</button>
      <header class="cat-head cat--${c.id}">
        <span class="cat-head__ico">${ico(c.icon)}</span>
        <div><h1>${esc(c.nombre)}</h1><p class="muted">${all.length} trámites · ${esc(c.desc)}</p></div>
      </header>
      <div class="chips mt">${chips}</div>
      <div class="results-grid mt">${list.map((t) => resultCard(t)).join("")}</div>
      <div class="help-strip mt-l"><span>¿No encontrás tu trámite?</span><a href="tel:147"><b>Llamá al 147 · Atención Ciudadana</b></a></div>`;
  }

  // M2 / D2 · Resultados, M9 · Error sin resultados
  function vBuscar(params) {
    const q = params.get("q") || "", mod = params.get("mod") || "", c = params.get("cat") || "";
    let base, fuera = null, info = null;
    if (q) {
      info = search(q); base = info.results;
      const first = norm(q).split(" ")[0];
      if (!base.length && FUERA[first]) fuera = FUERA[first];
    } else base = TRAMITES.slice();
    const byCat = c ? base.filter((t) => t.cat === c) : base;
    const list = mod ? byCat.filter((t) => t.mod === mod) : byCat;

    const link = (m, cc) => { const p = new URLSearchParams(); if (q) p.set("q", q); if (m) p.set("mod", m); if (cc) p.set("cat", cc); const s = p.toString(); return "#/buscar" + (s ? "?" + s : ""); };
    const modChips = [["", "Todos"], ["online", "Online"], ["turno", "Con turno"], ["distancia", "A distancia"], ["presencial", "Presencial"]]
      .map(([k, l]) => { const n = k ? byCat.filter((t) => t.mod === k).length : byCat.length; return `<a class="chip${mod === k ? " on" : ""}" href="${link(k, c)}" aria-current="${mod === k}">${k ? ico(k) : ""}${l} <span class="count">${n}</span></a>`; }).join("");
    const catsPresent = CATEGORIAS.filter((cc) => base.some((t) => t.cat === cc.id));
    const catChips = [`<a class="chip${!c ? " on" : ""}" href="${link(mod, "")}">Todas <span class="count">${base.length}</span></a>`]
      .concat(catsPresent.map((cc) => `<a class="chip${c === cc.id ? " on" : ""}" href="${link(mod, cc.id)}">${ico(cc.icon)}${esc(cc.nombre)} <span class="count">${base.filter((t) => t.cat === cc.id).length}</span></a>`)).join("");

    // Sin resultados (M9)
    if (q && !base.length) {
      const dym = didYouMean(q);
      return `<div class="narrow">
        ${searchBox(q)}
        <div class="noresult">
          <div class="noresult__ico" aria-hidden="true">?</div>
          <h1>No encontramos ese trámite</h1>
          ${fuera ? `<p class="muted mt-s">${esc(fuera)} TuMuni solo incluye trámites del Municipio de La Matanza.</p>` : dym ? `<p class="muted mt-s">¿Quisiste decir…?</p>` : `<p class="muted mt-s">Revisá cómo lo escribiste o probá con otras palabras.</p>`}
        </div>
        ${dym && !fuera ? resultCard(dym) : ""}
        <section class="section">
          <h2 class="h-sm">O probá con una categoría:</h2>
          <div class="chips chips--wrap">${CATEGORIAS.map((cc) => `<a class="chip" href="#/categoria/${cc.id}">${ico(cc.icon)}${esc(cc.nombre)}</a>`).join("")}</div>
        </section>
        <div class="help-strip mt-l"><span>¿Seguís con dudas?</span><a href="tel:147"><b>Llamá al 147 · Atención Ciudadana</b></a></div>
      </div>`;
    }

    const titulo = q
      ? `<b>${list.length}</b> ${list.length === 1 ? "trámite" : "trámites"} para “${esc(q)}”`
      : `<b>${list.length}</b> ${list.length === 1 ? "trámite" : "trámites"}${mod ? " · " + MODALIDADES[mod].label.toLowerCase() : " del Municipio de La Matanza"}`;
    const extra = info ? Array.from(new Set(info.toks.filter((t, i) => t !== info.raw[i]))) : [];
    const expand = extra.length ? `<p class="small muted">También buscamos: <b>${esc(extra.join(", "))}</b></p>` : "";
    const topCat = list.length ? cat(list[0].cat) : null;
    return `
      <div class="search-top">${searchBox(q, { autofocus: !q && !mod && !c })}</div>
      <div class="search-layout">
        <aside class="filters-side only-desk" aria-label="Filtros">
          <h3>Modalidad</h3>
          <div class="chips chips--col">${modChips}</div>
          <h3 class="mt">Categoría</h3>
          <div class="chips chips--col">${catChips}</div>
        </aside>
        <div class="search-main">
          <div class="chips only-mob" aria-label="Filtrar por modalidad">${modChips}</div>
          <div class="result-head"><p role="status">${titulo}</p>${expand}</div>
          <div class="results-grid">${list.length ? list.map((t) => resultCard(t, { showCat: true, q })).join("") : notice("info", "No hay trámites con ese filtro. <a href='" + link("", c) + "'>Ver todos</a>")}</div>
          ${topCat && q ? `<div class="help-strip mt"><span>¿No es lo que buscabas?</span><a href="#/categoria/${topCat.id}"><b>Ver todo “${esc(topCat.nombre)}” →</b></a></div>` : ""}
        </div>
      </div>`;
  }

  /* ---- Ficha del trámite (plantilla única) ---- */
  function getWork(t) {
    if (!state.session[t.id]) {
      const sv = state.saved[t.id];
      state.session[t.id] = sv ? { checked: sv.checked.slice(), answers: { ...sv.answers }, full: false } : { checked: [], answers: {}, full: false };
    }
    return state.session[t.id];
  }
  const condOk = (item, ans) => !item.si || item.si.some((c) => Object.keys(c).every((k) => ans[k] && c[k].includes(ans[k])));
  function condLabel(t, item) {
    if (!item.si) return "";
    return item.si.map((c) => Object.keys(c).map((k) => {
      const p = (t.preguntas || []).find((x) => x.id === k); if (!p) return "";
      if (k === "venc") return c[k][0] === "si" ? "venció hace +90 días" : "venció hace menos de 90 días";
      return p.ops.filter((o) => c[k].includes(o[0])).map((o) => o[1]).join(" / ");
    }).join(" y ")).join(" o ");
  }
  function visibleItems(t, w) { return (t.checklist || []).filter((it) => w.full || condOk(it, w.answers)); }
  const allAnswered = (t, w) => (t.preguntas || []).every((p) => w.answers[p.id]);
  const getActions = (t) => t.acciones || [];

  function vTramite(id) {
    const t = byId(id); if (!t) return vNotFound();
    const w = getWork(t);
    const c = cat(t.cat);
    const susp = t.estado === "suspendido";

    const head = `
      <div class="ficha__head">
        <nav class="crumbs" aria-label="Ubicación"><button class="back" type="button" data-back>‹ Volver</button><span class="crumbs__sep">/</span><a href="#/categoria/${c.id}">${esc(c.nombre)}</a></nav>
        <h1>${esc(t.nombre)}</h1>
        <p class="ficha__oficial">(${esc(t.oficial)})</p>
        ${modChip(t, true)}
        ${t.etapas && !susp ? `<div class="stepper" aria-label="Etapas">${t.etapas.map((e, i) => `<div class="${i === 0 ? "on" : ""}">${i + 1}. ${esc(e)}</div>`).join("")}</div>` : ""}
      </div>`;

    if (susp) {
      return `<div class="narrow">${head}
        <div class="block">${notice("error", "<b>Suspendido según la web oficial.</b> El municipio informa que este trámite está suspendido momentáneamente y no dice cuándo vuelve. No lo ocultamos para que no pierdas un viaje.")}</div>
        <div class="block card"><h2>¿Tenés dudas?</h2><p class="muted small mt-s">Consultá si hay novedades en Atención Ciudadana o en el conmutador del municipio.</p><div class="btns btns--row mt"><a class="btn" href="tel:147">Llamar al 147</a><a class="btn btn--outline" href="tel:01146510101">Llamar al 4651-0101</a></div></div>
        ${fuenteHTML(t)}</div>`;
    }

    const previo = t.pasoPrevio ? `<div class="block"><div class="paso-previo"><b>Paso previo (no municipal)</b>${esc(t.pasoPrevio.txt)}<br><a href="#" data-prev="${t.id}" class="ext">${esc(t.pasoPrevio.label)} </a></div></div>` : "";
    const incompleto = t.incompleto ? `<div class="block">${notice("aviso", "<b>Información incompleta en la web oficial.</b> El municipio no publica todos los requisitos, la sede o el horario de este trámite. Llamá al <a href='tel:01146510101'>4651-0101</a> o al <a href='tel:147'>147</a> antes de ir.")}</div>` : "";

    let preguntas = "";
    if (t.preguntas) {
      preguntas = `<div class="block qbox">
        <div class="qbox__t">Contanos un poco para mostrarte solo lo tuyo</div>
        <div class="qrow qrow--${Math.min(t.preguntas.length, 3)}">${t.preguntas.slice(0, 3).map((p) => `
          <div class="q"><span class="q__l" id="ql-${p.id}">${esc(p.txt)}</span>
            <div class="seg${p.ops.length > 3 ? " seg--wrap" : ""}" role="group" aria-labelledby="ql-${p.id}">
              ${p.ops.map((o) => `<button type="button" data-q="${p.id}" data-v="${o[0]}" aria-pressed="${w.answers[p.id] === o[0]}">${esc(o[1])}</button>`).join("")}
            </div></div>`).join("")}
        </div></div>`;
      (t.avisosPorRespuesta || []).forEach((a) => { if (condOk({ si: [a.si] }, w.answers)) preguntas += `<div class="block block--tight">${notice(a.tipo, esc(a.txt))}</div>`; });
    }

    let lista = "";
    if (t.checklist) {
      const items = visibleItems(t, w);
      const done = items.filter((it) => w.checked.includes(it.t)).length;
      const falta = t.preguntas && !allAnswered(t, w) && !w.full;
      lista = `<div class="block" id="blk-check">
        <h2>${esc(t.checklistTitulo || "Qué llevar")} <span class="count" id="ck-count">${done} de ${items.length}</span></h2>
        ${falta ? `<p class="small muted hint">Respondé las preguntas para ver todo lo que te corresponde.</p>` : ""}
        <ul class="collection${items.length > 5 ? " cols" : ""}">
          ${items.map((it) => `<li><label class="check"><input type="checkbox" data-ck="${esc(it.t)}" ${w.checked.includes(it.t) ? "checked" : ""}><span class="check__box" aria-hidden="true"></span>
            <span class="check__t"><span class="check__main">${esc(it.t)}</span>${w.full && it.si ? `<span class="check__cond">si: ${esc(condLabel(t, it))}</span>` : ""}${it.n ? `<span class="check__n">${esc(it.n)}</span>` : ""}</span></label></li>`).join("")}
        </ul>
        <div class="link-row">
          ${t.preguntas ? `<button type="button" class="btn btn--ghost btn--sm btn--auto" id="toggle-full">${w.full ? "Ver solo lo mío" : "Ver la lista completa"}</button>` : ""}
          ${t.verCompleto ? `<a href="#" class="btn btn--ghost btn--sm btn--auto" data-fuente="${t.id}">Requisitos completos en la fuente oficial ↗</a>` : ""}
        </div>
      </div>`;
    } else if (t.tenerAMano) {
      lista = `<div class="block"><h2>Tené a mano</h2><ul class="collection tener">${t.tenerAMano.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    }

    const boleta = t.ayudaBoleta ? `<div class="block"><h2>¿Dónde está mi padrón?</h2>
      <div class="boleta" role="img" aria-label="Boleta de la tasa con el número de padrón y la fecha de vencimiento señalados">
        <div class="boleta__head"><span>MUNICIPIO DE LA MATANZA</span><span>TASA POR SERVICIOS GENERALES</span></div>
        <div class="boleta__line" style="width:70%"></div><div class="boleta__line" style="width:45%"></div>
        <span class="boleta__mark">Padrón: 0000000</span>
        <div class="boleta__line" style="width:85%"></div><div class="boleta__line" style="width:60%"></div>
        <span class="boleta__mark">Vence: dd/mm/aaaa</span>
        <div class="boleta__line" style="width:50%"></div>
      </div>
      <p class="small muted mt-s">Los dos datos están arriba, en la boleta que te llega a tu casa o por email.</p></div>` : "";

    const plantilla = t.plantilla ? `<div class="block"><h2>Mensaje modelo</h2>
      <div class="plantilla" id="plantilla">${esc(t.plantilla.join("\n"))}</div>
      <div class="link-row"><button type="button" class="btn btn--outline btn--sm btn--auto" id="copy-tpl">Copiar mensaje</button></div>
      <p class="small muted">TuMuni no envía nada: vos completás el mensaje y lo mandás desde tu WhatsApp o tu email.</p></div>` : "";

    const pasos = (t.pasos && t.pasos.length) ? `<div class="block"><h2>Cómo se hace</h2><ol class="steps">${t.pasos.map((p) => `<li>${esc(p)}</li>`).join("")}</ol></div>` : "";
    const avisos = (t.avisos && t.avisos.length) ? `<div class="block">${t.avisos.map((a) => notice(a.tipo, a.txt)).join("")}</div>` : "";

    let costo;
    if (t.costo.porRespuesta) {
      const v = w.answers[t.costo.porRespuesta];
      costo = v
        ? `<div class="costo"><span class="muted small">Cuánto cuesta<br>(${esc(t.costo.etiquetas[v])})</span><span class="costo__v">${esc(t.costo.valores[v])}</span></div>`
        : `<div class="costo"><span class="muted small">Cuánto cuesta</span><span class="costo__v">${esc(t.costo.desde)}</span></div><p class="small muted">Respondé las preguntas para ver tu monto.</p>`;
      if (t.costo.nota) costo += `<p class="small muted mt-s">${esc(t.costo.nota)}</p>`;
    } else if (t.costo.texto) {
      const isMoney = /^\$[\d.]+( \+ \$[\d.]+)?$/.test(t.costo.texto);
      costo = isMoney
        ? `<div class="costo"><span class="muted small">Cuánto cuesta</span><span class="costo__v">${esc(t.costo.texto)}</span></div>`
        : `<div class="muted small">Cuánto cuesta</div><p class="costo__txt">${esc(t.costo.texto)}</p>`;
      if (t.costo.nota) costo += `<p class="small muted mt-s">${esc(t.costo.nota)}</p>`;
    } else {
      costo = `<div class="muted small">Cuánto cuesta</div><p class="faltante mt-s">${esc(t.costo.faltante || "El municipio no informa el monto.")}</p>`;
    }

    const isPres = t.mod === "presencial" || t.mod === "turno";
    const saved = !!state.saved[t.id];
    const acts = getActions(t);
    let acciones = acts.map((a, i) => `<button type="button" class="btn${i ? " btn--outline" : ""}${a.tipo !== "tel" ? " ext" : ""}" data-act="${i}">${esc(a.label)} </button>`).join("");
    if (t.secundaria) acciones += `<a class="btn btn--outline" href="#/tramite/${t.secundaria.tramite}">${esc(t.secundaria.label)}</a>`;
    if (t.checklist) {
      acciones += `<button type="button" class="btn ${acts.length ? "btn--outline" : ""}" id="save">${saved ? "✓ Guardado en Mis trámites" : (isPres ? "Guardar en Mis trámites" : "Guardar checklist")}</button>`;
      acciones += `<button type="button" class="btn btn--outline" id="share">Compartir por WhatsApp</button>`;
    }
    if (t.recordatorio) acciones += `<a class="btn btn--ghost" href="#/recordatorio?t=${t.id}">${ico("clock")} Activar recordatorio</a>`;

    let sedes = "";
    const ids = sedeIds(t, w);
    if (ids.length) {
      const { sedes: list, cerca } = sortedSedes(ids);
      const m = mapHTML(list);
      sedes = `<div class="card"><h2>${list.length > 1 ? "Dónde se hace" : "Dónde y cuándo"}</h2>
        ${m ? `<div class="mt-s">${m}</div>` : ""}
        <div class="mt-s">${list.map((s, i) => `
          <div class="sede"><div class="sede__n">${!s.externo && list.length > 1 ? `<span class="sede__num">${i + 1}</span>` : ""}${esc(s.nombre)} ${cerca === s.id ? '<span class="tag-cerca">Más cerca</span>' : ""}</div>
            <div>${s.direccion ? esc(s.direccion) : '<span class="faltante">Dirección: la ficha oficial no la publica.</span>'}</div>
            <div class="muted">${s.horario ? esc(s.horario) : "Horario: la ficha oficial no lo informa"} · Tel. <a href="${telHref(s.tel)}">${esc(s.tel)}</a></div>
            ${s.direccion && !s.externo ? `<a href="${gmaps(s)}" target="_blank" rel="noopener">Cómo llegar ↗</a>` : ""}</div>`).join("")}</div>
        ${!state.loc && list.length > 1 ? `<button type="button" class="btn btn--ghost btn--sm mt-s" data-locpick>${ico("presencial")} Elegí tu localidad para ver la más cercana</button>` : ""}
      </div>`;
    } else if (t.sinSede || t.mod === "presencial") {
      sedes = `<div class="card"><h2>Dónde y cuándo</h2><p class="faltante mt-s">${esc(t.sinSede || "La ficha oficial no informa la sede ni el horario.")}</p><a class="btn btn--outline mt" href="tel:01146510101">Consultar al 4651-0101</a></div>`;
    }
    const contacto = t.contacto ? `<p class="small muted mt">${esc(t.contacto)}</p>` : "";

    const mainTop = `${head}${incompleto}${previo}${preguntas}${lista}${boleta}${plantilla}`;
    const mainBottom = `${avisos}${pasos}${fuenteHTML(t)}`;
    const aside = `<div class="card card--sum"><div>${costo}</div><div class="btns mt">${acciones}</div>${contacto}</div>${sedes}`;

    return `<div class="ficha__grid ficha">
      <div class="ficha__main">${mainTop}</div>
      <aside class="aside">${aside}</aside>
      <div class="ficha__bottom">${mainBottom}</div>
    </div>`;
  }
  function fuenteHTML(t) {
    return `<p class="fuente">Fuente: <a href="#" data-fuente="${t.id}">${esc(t.fuente.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a> · verificado ${VERIFICADO}. Los montos y horarios pueden cambiar: ante la duda, manda la web oficial.</p>`;
  }

  function bindTramite(id) {
    const t = byId(id); if (!t) return;
    const w = getWork(t);
    const syncSaved = () => { if (state.saved[t.id]) { state.saved[t.id].checked = w.checked.slice(); state.saved[t.id].answers = { ...w.answers }; persist(); } };
    const rerender = () => { const y = window.scrollY; render(); window.scrollTo(0, y); };

    $$("[data-q]").forEach((b) => b.onclick = () => { w.answers[b.dataset.q] = b.dataset.v; w.full = false; syncSaved(); rerender(); });
    $$("[data-ck]").forEach((cb) => cb.onchange = () => {
      const k = cb.dataset.ck;
      w.checked = cb.checked ? Array.from(new Set(w.checked.concat(k))) : w.checked.filter((x) => x !== k);
      const items = visibleItems(t, w);
      $("#ck-count").textContent = `${items.filter((it) => w.checked.includes(it.t)).length} de ${items.length}`;
      syncSaved();
    });
    const tf = $("#toggle-full"); if (tf) tf.onclick = () => { w.full = !w.full; rerender(); };

    $$("[data-act]").forEach((b) => b.onclick = () => {
      const a = getActions(t)[+b.dataset.act];
      exitAlert({ ...a, _url: actionUrl(a, t) }, () => {
        if (t.mod === "turno") toast("Recordá: si no podés ir, cancelá el turno o el municipio te bloquea 30 días.", 5000);
        else if (a.tipo === "whatsapp" || a.tipo === "email") toast("Completá el mensaje y envialo vos. TuMuni no manda nada.", 4500);
        else toast("Cuando termines, volvé a TuMuni.");
      });
    });
    const prev = $("[data-prev]");
    if (prev) prev.onclick = (e) => { e.preventDefault(); exitAlert({ tipo: "externo", url: t.pasoPrevio.url, destino: t.pasoPrevio.url.replace(/^https?:\/\//, ""), queHace: "Es un paso nacional o provincial: TuMuni no lo gestiona." }); };

    const sv = $("#save");
    if (sv) sv.onclick = () => {
      if (state.saved[t.id]) { location.hash = "#/mis-tramites"; return; }
      state.saved[t.id] = { checked: w.checked.slice(), answers: { ...w.answers }, ts: Date.now() };
      persist(); sv.textContent = "✓ Guardado en Mis trámites";
      toast("Checklist guardado en Mis trámites. Se guarda en este dispositivo, sin registrarte.");
    };
    const sh = $("#share");
    if (sh) sh.onclick = () => {
      const items = visibleItems(t, w);
      const { sedes } = sortedSedes(sedeIds(t, w));
      let txt = `*${t.nombre}* (${t.oficial})\n${MODALIDADES[t.mod].label}\n\n*Qué llevar:*\n` +
        items.map((it) => `${w.checked.includes(it.t) ? "✅" : "⬜"} ${it.t}${it.n ? " (" + it.n + ")" : ""}`).join("\n");
      if (sedes.length) txt += `\n\n*Dónde:* ${sedes[0].nombre}${sedes[0].direccion ? " · " + sedes[0].direccion : ""}${sedes[0].horario ? " · " + sedes[0].horario : ""}`;
      txt += `\n\nFuente oficial: ${t.fuente}\nArmado con TuMuni La Matanza`;
      window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank", "noopener");
    };
    const cp = $("#copy-tpl");
    if (cp) cp.onclick = async () => {
      const txt = t.plantilla.join("\n");
      try { await navigator.clipboard.writeText(txt); toast("Mensaje copiado. Completalo y envialo por el canal oficial."); }
      catch (e) { const r = document.createRange(); r.selectNodeContents($("#plantilla")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Seleccioná y copiá el mensaje."); }
    };
    $$("[data-locpick]").forEach((lp) => lp.onclick = () => locModal(false));
  }

  // M8 · Mis trámites
  function vMis() {
    const ids = Object.keys(state.saved).filter(byId);
    const items = ids.map((id) => {
      const t = byId(id), sv = state.saved[id];
      const its = (t.checklist || []).filter((it) => condOk(it, sv.answers));
      const done = its.filter((it) => sv.checked.includes(it.t)).length;
      const pct = its.length ? Math.round(done / its.length * 100) : 0;
      const rec = state.recs.find((r) => r.tramite === id && r.fecha);
      return `<div class="card mt-item cat--${t.cat}">
        <span class="result__ico">${ico(cat(t.cat).icon)}</span>
        <div class="mt-item__body">
          <div class="mt-item__top"><a href="#/tramite/${id}"><h3>${esc(t.nombre)}</h3></a>
            <button class="icon-btn" type="button" data-del="${id}" aria-label="Quitar ${esc(t.nombre)} de Mis trámites">✕</button></div>
          <div class="mt-item__meta">${done} de ${its.length} listos${rec ? " · " + (rec.tipo === "turno" ? "turno " : "vence ") + fmtDate(rec.fecha) : ""}</div>
          <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso"><span style="width:${pct}%"></span></div>
        </div>
      </div>`;
    }).join("");
    const recs = state.recs.map((r) => `<div class="card rec">
        <span class="rec__ico" aria-hidden="true">${ico("clock")}</span>
        <div style="flex:1"><b>${esc(r.label)}</b><div class="small muted">${r.oficial ? "Según el calendario oficial de vencimientos" : (r.tipo === "turno" ? "Turno el " : r.tipo === "licencia" ? "Vence el " : "Fecha: ") + fmtDate(r.fecha)} · te avisamos 3 días antes por ${r.canal === "whatsapp" ? "WhatsApp" : "email"}</div></div>
        <button class="icon-btn" type="button" data-delrec="${r.id}" aria-label="Borrar recordatorio">✕</button></div>`).join("");
    return `<div class="narrow">
      <header class="page-head"><h1>Mis trámites</h1><p class="muted">Se guarda en este dispositivo. No necesitás registrarte.</p></header>
      <section class="section">
        <div class="section__head"><h2>Checklists guardados</h2></div>
        ${items || `<div class="card empty"><div class="empty__ico" aria-hidden="true">${ico("otros")}</div><b>Todavía no guardaste checklists</b><p class="small muted mt-s">En cualquier trámite presencial o con turno tocá “Guardar en Mis trámites”.</p><a class="btn btn--outline btn--auto mt" href="#/buscar">Buscar un trámite</a></div>`}
      </section>
      <section class="section">
        <div class="section__head"><h2>Recordatorios</h2></div>
        ${recs || `<p class="small muted">No tenés recordatorios activos.</p>`}
        <a class="btn mt" href="#/recordatorio">+ Nuevo recordatorio</a>
      </section></div>`;
  }
  function bindMis() {
    $$("[data-del]").forEach((b) => b.onclick = () => { delete state.saved[b.dataset.del]; delete state.session[b.dataset.del]; persist(); render(); toast("Quitado de Mis trámites"); });
    $$("[data-delrec]").forEach((b) => b.onclick = () => { state.recs = state.recs.filter((r) => r.id !== b.dataset.delrec); persist(); render(); toast("Recordatorio borrado"); });
  }

  // Formulario de recordatorio (máx. 4 campos · RN-14 / RN-15)
  const REC_TIPOS = [
    { v: "tasa", l: "Tasa municipal (cuotas)", oficial: true, tramite: "pagar-tasa", label: "Tasa municipal" },
    { v: "licencia", l: "Vencimiento de mi licencia", tramite: "renovar-licencia", label: "Vence mi licencia de conducir" },
    { v: "turno", l: "Un turno que ya saqué", label: "Turno" },
    { v: "otro", l: "Otra fecha de un trámite", label: "Trámite" }
  ];
  function vRecordatorio(params) {
    const t = params.get("t");
    const pre = t === "pagar-tasa" ? "tasa" : t === "renovar-licencia" ? "licencia" : (t ? "turno" : "tasa");
    return `<div class="narrow narrow--sm">
      <button class="back" type="button" data-back>‹ Volver</button>
      <header class="page-head"><h1>Nuevo recordatorio</h1>
      <p class="muted">Te avisamos 3 días antes. Solo te pedimos un email o un WhatsApp: <b>nunca DNI, padrón ni patente</b>.</p></header>
      <form class="card form-card" id="recform" novalidate>
        <div class="field"><label for="r-tipo">¿Qué querés recordar?</label>
          <select id="r-tipo">${REC_TIPOS.map((r) => `<option value="${r.v}" ${r.v === pre ? "selected" : ""}>${r.l}</option>`).join("")}</select></div>
        <div class="field" id="f-fecha"><label for="r-fecha">Fecha</label><input id="r-fecha" type="date">
          <div class="field__help" id="fecha-help"></div></div>
        <div class="field" id="oficial-note">${notice("info", "Usamos las fechas del <b>calendario oficial de vencimientos</b> del municipio. No tenés que cargar nada.")}</div>
        <div class="field"><span class="field__label" id="canal-l">Avisarme por</span>
          <div class="seg" role="group" aria-labelledby="canal-l">
            <button type="button" data-canal="whatsapp" aria-pressed="true">WhatsApp</button>
            <button type="button" data-canal="email" aria-pressed="false">Email</button>
          </div></div>
        <div class="field" id="f-contacto"><label for="r-contacto" id="contacto-l">Tu número de WhatsApp</label>
          <input id="r-contacto" type="tel" inputmode="tel" placeholder="Ej: 11 2345 6789" autocomplete="tel"></div>
        <button class="btn mt" type="submit">Guardar recordatorio</button>
        <p class="small muted mt-s" style="text-align:center">Prototipo: el recordatorio se guarda en tu dispositivo.</p>
      </form></div>`;
  }
  function bindRecordatorio(params) {
    const f = $("#recform"); if (!f) return;
    let canal = "whatsapp";
    const tipo = $("#r-tipo"), fecha = $("#r-fecha"), help = $("#fecha-help"), cont = $("#r-contacto");
    const sync = () => {
      const r = REC_TIPOS.find((x) => x.v === tipo.value);
      $("#f-fecha").style.display = r.oficial ? "none" : "";
      $("#oficial-note").style.display = r.oficial ? "" : "none";
      help.textContent = r.v === "licencia" ? "La fecha de vencimiento que figura en tu licencia." : "";
    };
    tipo.onchange = sync; sync();
    $$("[data-canal]", f).forEach((b) => b.onclick = () => {
      canal = b.dataset.canal;
      $$("[data-canal]", f).forEach((x) => x.setAttribute("aria-pressed", x === b));
      $("#contacto-l").textContent = canal === "email" ? "Tu email" : "Tu número de WhatsApp";
      cont.type = canal === "email" ? "email" : "tel";
      cont.placeholder = canal === "email" ? "nombre@correo.com" : "Ej: 11 2345 6789";
      cont.value = ""; clearErr($("#f-contacto"));
    });
    function setErr(field, msg) { clearErr(field); field.classList.add("has-err"); field.insertAdjacentHTML("beforeend", `<div class="field__err" role="alert">${esc(msg)}</div>`); }
    function clearErr(field) { field.classList.remove("has-err"); const e = field.querySelector(".field__err"); if (e) e.remove(); }
    f.onsubmit = (e) => {
      e.preventDefault();
      const r = REC_TIPOS.find((x) => x.v === tipo.value);
      let ok = true;
      clearErr($("#f-fecha")); clearErr($("#f-contacto"));
      const today = new Date().toISOString().slice(0, 10);
      if (!r.oficial) {
        if (!fecha.value) { setErr($("#f-fecha"), "Elegí una fecha."); ok = false; }
        else if (fecha.value < today) { setErr($("#f-fecha"), "La fecha ya pasó. Elegí una fecha futura."); ok = false; }
      }
      const v = cont.value.trim();
      if (canal === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setErr($("#f-contacto"), "Revisá el email: falta la @ o el dominio."); ok = false; }
      if (canal === "whatsapp" && !/^\d{8,13}$/.test(v.replace(/[\s\-+()]/g, ""))) { setErr($("#f-contacto"), "Escribí un número de 8 a 13 dígitos, con código de área."); ok = false; }
      if (!ok) { const first = f.querySelector(".has-err input"); if (first) first.focus(); return; }
      state.recs.push({ id: "r" + Date.now(), tipo: r.v, label: r.label, tramite: r.tramite || params.get("t") || null, fecha: r.oficial ? null : fecha.value, oficial: !!r.oficial, canal, contacto: v });
      persist();
      toast("Recordatorio guardado. Te avisamos 3 días antes.");
      location.hash = "#/mis-tramites";
    };
  }

  // Ayuda
  function vAyuda() {
    return `<div class="narrow">
      <header class="page-head"><h1>Ayuda</h1><p class="muted">Teléfonos, accesibilidad y preguntas frecuentes.</p></header>
      <section class="section"><div class="section__head"><h2>Teléfonos útiles</h2></div>
        <div class="grid-2">${TELEFONOS.map((x) => `<a class="card tel" href="tel:${x.tel || x.num}"><span class="tel__n">${x.num}</span><span><b>${esc(x.nombre)}</b><br><span class="small muted">${esc(x.desc)}</span></span></a>`).join("")}</div>
      </section>
      <section class="section"><div class="section__head"><h2>Accesibilidad</h2></div>
        <div class="grid-2">
        <div class="card switch-row"><div><b>Texto más grande (A+)</b><div class="small muted">Agranda toda la app.</div></div>
          <button type="button" class="btn btn--outline btn--auto btn--sm" id="sw-big" aria-pressed="${state.big}">A+</button></div>
        <div class="card switch-row"><div><b>Mi localidad</b><div class="small muted">${locName() ? esc(locName()) : "Sin elegir · ves todas las sedes"}</div></div>
          <button type="button" class="btn btn--outline btn--auto btn--sm" data-locpick>Cambiar</button></div>
        </div>
      </section>
      <section class="section"><div class="section__head"><h2>Preguntas frecuentes</h2></div>
        <div class="collapsible">${FAQ.map((f, i) => `<details ${i === 0 ? "open" : ""}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
      </section>
      <section class="section">
        ${notice("info", `TuMuni es un prototipo académico (UNLaM · Visualización e Interfaces). Incluye los ${TRAMITES.length} trámites de la Guía de Trámites de lamatanza.gov.ar, relevados en noviembre de 2026.`)}
        <button type="button" class="btn btn--ghost mt" id="wipe">Borrar mis datos guardados</button>
      </section></div>`;
  }
  function bindAyuda() {
    const sb = $("#sw-big"); if (sb) sb.onclick = toggleBig;
    $$("[data-locpick]").forEach((b) => b.onclick = () => locModal(false));
    const wp = $("#wipe"); if (wp) wp.onclick = () => {
      ["saved", "recs", "loc", "big", "visto", "recent"].forEach(store.del);
      state.saved = {}; state.recs = []; state.loc = ""; state.big = false; state.session = {}; state.recent = [];
      paintLoc(); paintBig(); render(); toast("Borramos tus datos de este dispositivo.");
    };
  }

  function vNotFound() {
    return `<div class="noresult"><div class="noresult__ico">?</div><h1>Esta página no existe</h1><a class="btn mt btn--auto" href="#/">Ir al inicio</a></div>`;
  }

  /* ---------------- Router ---------------- */
  function parse() {
    const h = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = h.split("?");
    return { parts: path.split("/").filter(Boolean), params: new URLSearchParams(qs || "") };
  }
  function render() {
    const { parts, params } = parse();
    const r = parts[0] || "";
    let html, nav = "", bind = null, title = "TuMuni La Matanza";
    switch (r) {
      case "": html = vInicio(); nav = "inicio"; bind = bindSearch; break;
      case "categorias": html = vCategorias(); nav = "categorias"; title = "Categorías · TuMuni"; break;
      case "categoria": html = vCategoria(parts[1], params); nav = "categorias"; title = ((cat(parts[1]) || {}).nombre || "Categoría") + " · TuMuni"; break;
      case "buscar": html = vBuscar(params); nav = "buscar"; bind = bindSearch; title = "Buscar · TuMuni"; break;
      case "tramite": html = vTramite(parts[1]); bind = () => bindTramite(parts[1]); title = ((byId(parts[1]) || {}).nombre || "Trámite") + " · TuMuni"; break;
      case "mis-tramites": html = vMis(); nav = "mis"; bind = bindMis; title = "Mis trámites · TuMuni"; break;
      case "recordatorio": html = vRecordatorio(params); nav = "mis"; bind = () => bindRecordatorio(params); title = "Nuevo recordatorio · TuMuni"; break;
      case "ayuda": html = vAyuda(); nav = "ayuda"; bind = bindAyuda; title = "Ayuda · TuMuni"; break;
      default: html = vNotFound();
    }
    closeSuggest = null;
    view.innerHTML = html;
    document.title = title;
    document.body.classList.toggle("has-topsearch", r !== "" && r !== "buscar");
    document.body.dataset.route = r || "inicio";
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === nav));
    $$("[data-back]").forEach((b) => b.onclick = () => { if (history.length > 1) history.back(); else location.hash = "#/"; });
    $$("[data-recent]").forEach((a) => a.addEventListener("click", () => addRecent(a.dataset.recent)));
    $$("[data-fuente]").forEach((a) => a.onclick = (e) => {
      e.preventDefault(); const t = byId(a.dataset.fuente);
      exitAlert({ tipo: "fuente", url: t.fuente, destino: t.fuente.replace(/^https?:\/\//, ""), queHace: "Vas a ver la ficha oficial del Municipio con la información completa." });
    });
    $$("[data-ext='vencimientos']").forEach((a) => a.onclick = (e) => {
      e.preventDefault();
      exitAlert({ tipo: "fuente", url: "https://www.lamatanza.gov.ar/vencimientos", destino: "lamatanza.gov.ar/vencimientos", queHace: "Vas a ver el calendario oficial de vencimientos del Municipio." });
    });
    if (bind) bind();
  }

  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); view.focus({ preventScroll: true }); });

  paintLoc(); paintBig(); render();
  if (!store.get("visto", false) && !/[?&]nointro/.test(location.search)) setTimeout(() => locModal(true), 400);
})();
