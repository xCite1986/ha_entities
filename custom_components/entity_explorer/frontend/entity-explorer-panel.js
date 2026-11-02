// Entity Explorer - iobroker-style, searchable entity browser for Home Assistant.
// Read-only: uses the hass object (states + entity/device/area registries) and
// the recorder history WebSocket API. Rendered in a shadow root; themed via HA
// CSS variables so it follows light/dark automatically.

const STYLES = `
:host{display:block;height:100%;}
*{box-sizing:border-box;}
.root{display:flex;flex-direction:column;height:100vh;overflow:hidden;
  background:var(--primary-background-color,#fafafa);color:var(--primary-text-color,#212121);
  font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif);}
.toolbar{display:flex;align-items:center;gap:10px;padding:10px 14px;flex-wrap:wrap;
  background:var(--app-header-background-color,var(--primary-color,#03a9f4));color:var(--app-header-text-color,#fff);}
.toolbar .title{font-size:18px;font-weight:500;margin-right:8px;}
.toolbar input,.toolbar select{padding:7px 10px;border:none;border-radius:8px;font-size:14px;
  background:#fff;color:#212121;}
.toolbar input.search{min-width:260px;flex:1;max-width:460px;}
.toolbar .count{margin-left:auto;font-size:13px;opacity:.9;}
.body{flex:1;display:flex;min-height:0;}
.list{flex:1;min-width:0;overflow:auto;}
/* header row */
.cols{display:grid;grid-template-columns:minmax(220px,2fr) 120px 150px minmax(120px,1fr);
  gap:8px;padding:8px 14px;position:sticky;top:0;z-index:2;font-size:12px;font-weight:600;
  text-transform:uppercase;letter-spacing:.03em;color:var(--secondary-text-color,#777);
  background:var(--primary-background-color,#fafafa);border-bottom:1px solid var(--divider-color,#e0e0e0);}
.group{border-bottom:1px solid var(--divider-color,#eee);}
.group-head{display:flex;align-items:center;gap:8px;padding:9px 14px;cursor:pointer;user-select:none;
  background:var(--secondary-background-color,#f2f2f2);font-weight:600;font-size:14px;position:sticky;top:33px;z-index:1;}
.group-head .car{width:14px;display:inline-block;opacity:.6;font-size:11px;}
.group-head .gcount{margin-left:auto;font-size:12px;color:var(--secondary-text-color,#888);font-weight:400;}
.row{display:grid;grid-template-columns:minmax(220px,2fr) 120px 150px minmax(120px,1fr);
  gap:8px;padding:7px 14px;cursor:pointer;align-items:center;border-top:1px solid var(--divider-color,#f0f0f0);}
.row:hover{background:var(--secondary-background-color,#f5f5f5);}
.row.sel{background:var(--primary-color,#03a9f4);color:#fff;}
.row .nm{overflow:hidden;}
.row .nm .fn{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.row .nm .id{font-size:11px;color:var(--secondary-text-color,#999);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.row.sel .nm .id{color:rgba(255,255,255,.8);}
.badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;
  background:var(--secondary-background-color,#e8e8e8);color:var(--primary-text-color,#333);white-space:nowrap;}
.row.sel .badge{background:rgba(255,255,255,.25);color:#fff;}
.cell{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.val{font-variant-numeric:tabular-nums;font-weight:500;}
.val .u{color:var(--secondary-text-color,#999);font-weight:400;margin-left:2px;}
.row.sel .val .u{color:rgba(255,255,255,.8);}
.empty{padding:28px;color:var(--secondary-text-color,#888);font-size:14px;text-align:center;}
/* detail drawer */
.detail{width:420px;max-width:46%;flex:none;border-left:1px solid var(--divider-color,#e0e0e0);
  background:var(--card-background-color,#fff);display:flex;flex-direction:column;overflow:hidden;}
.detail.hidden{display:none;}
.detail-head{padding:14px;border-bottom:1px solid var(--divider-color,#eee);}
.detail-head .dn{font-size:17px;font-weight:600;}
.detail-head .di{font-size:12px;color:var(--secondary-text-color,#999);display:flex;gap:8px;align-items:center;margin-top:3px;}
.detail-head .di code{font-family:ui-monospace,Consolas,monospace;}
.detail-head .copy,.detail-head .close{cursor:pointer;border:none;background:var(--secondary-background-color,#eee);
  color:inherit;border-radius:6px;padding:3px 8px;font-size:12px;}
.detail-head .close{float:right;}
.detail-body{flex:1;overflow:auto;padding:14px;}
.bigval{font-size:30px;font-weight:600;margin:2px 0 14px;}
.bigval .u{font-size:16px;color:var(--secondary-text-color,#999);font-weight:400;}
.sec{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;
  color:var(--secondary-text-color,#888);margin:16px 0 6px;}
.kv{display:grid;grid-template-columns:130px 1fr;gap:4px 10px;font-size:13px;}
.kv .k{color:var(--secondary-text-color,#888);}
.kv .v{word-break:break-word;}
.hist-range{display:flex;gap:6px;margin:4px 0 10px;}
.hist-range button{cursor:pointer;border:1px solid var(--divider-color,#ccc);background:transparent;color:inherit;
  border-radius:14px;padding:4px 12px;font-size:12px;}
.hist-range button.on{background:var(--primary-color,#03a9f4);color:#fff;border-color:transparent;}
.chart{width:100%;}
.stat{display:flex;gap:16px;font-size:12px;color:var(--secondary-text-color,#777);margin-top:6px;flex-wrap:wrap;}
.tl{display:flex;height:22px;border-radius:5px;overflow:hidden;margin-top:4px;}
.tl span{height:100%;}
.tl-leg{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;font-size:12px;}
.tl-leg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:middle;}
.hist-list{margin-top:10px;font-size:12px;max-height:220px;overflow:auto;}
.hist-list .hl{display:flex;justify-content:space-between;gap:10px;padding:3px 0;border-top:1px solid var(--divider-color,#f0f0f0);}
.hist-list .hl .t{color:var(--secondary-text-color,#999);font-variant-numeric:tabular-nums;}
.muted{color:var(--secondary-text-color,#999);font-size:13px;}
@media (max-width:760px){.detail{position:fixed;inset:0;width:100%;max-width:100%;z-index:10;}
  .cols,.row{grid-template-columns:1fr 84px;}
  .cols .c-room,.cols .c-type,.row .c-room,.row .c-type{display:none;}}
`;

const PALETTE = ["#039be5", "#43a047", "#fb8c00", "#8e24aa", "#e53935", "#00897b", "#6d4c41", "#3949ab", "#c0ca33", "#d81b60"];

class EntityExplorerPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._built = false;
    this._search = "";
    this._groupBy = "platform";
    this._open = new Set();
    this._selected = null;
    this._valueCells = new Map();
    this._histRange = 24;
    this._updTimer = null;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) {
      this._built = true;
      this._build();
      this._render();
    } else {
      this._scheduleValueUpdate();
    }
  }
  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this.style.height = "100%";
  }

  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `
      <style>${STYLES}</style>
      <div class="root">
        <div class="toolbar">
          <span class="title">🗂️ Entitäten</span>
          <input class="search" id="search" type="text" placeholder="Suchen (Name, ID, Raum, Wert) …" />
          <select id="groupby">
            <option value="platform">Gruppieren: Integration</option>
            <option value="area">Gruppieren: Raum</option>
            <option value="domain">Gruppieren: Domäne</option>
            <option value="none">Keine Gruppierung</option>
          </select>
          <span class="count" id="count"></span>
        </div>
        <div class="body">
          <div class="list" id="list"></div>
          <div class="detail hidden" id="detail"></div>
        </div>
      </div>`;

    const q = (s) => r.getElementById(s);
    const search = q("search");
    search.addEventListener("input", () => {
      this._search = search.value.trim().toLowerCase();
      this._render();
    });
    q("groupby").addEventListener("change", (e) => {
      this._groupBy = e.target.value;
      this._open.clear();
      this._render();
    });
  }

  // --- Data -------------------------------------------------------------

  _model(id) {
    const h = this._hass;
    const st = h.states[id];
    const reg = (h.entities || {})[id] || {};
    const dev = reg.device_id ? (h.devices || {})[reg.device_id] : null;
    const areaId = reg.area_id || (dev && dev.area_id) || null;
    const area = areaId && h.areas && h.areas[areaId] ? h.areas[areaId].name : "";
    const attrs = st ? st.attributes || {} : {};
    const domain = id.split(".")[0];
    return {
      id,
      name: attrs.friendly_name || id,
      domain,
      deviceClass: attrs.device_class || "",
      platform: reg.platform || "—",
      area: area || "",
      state: st ? st.state : "—",
      unit: attrs.unit_of_measurement || "",
    };
  }

  _allModels() {
    const h = this._hass;
    const ids = Object.keys(h.states || {});
    return ids.map((id) => this._model(id)).sort((a, b) => a.id.localeCompare(b.id));
  }

  _groupKey(m) {
    if (this._groupBy === "platform") return m.platform || "—";
    if (this._groupBy === "area") return m.area || "(ohne Raum)";
    if (this._groupBy === "domain") return m.domain;
    return "Alle Entitäten";
  }

  _match(m) {
    const s = this._search;
    if (!s) return true;
    return (
      m.id.toLowerCase().includes(s) ||
      (m.name && m.name.toLowerCase().includes(s)) ||
      (m.area && m.area.toLowerCase().includes(s)) ||
      (m.platform && m.platform.toLowerCase().includes(s)) ||
      String(m.state).toLowerCase().includes(s)
    );
  }

  // --- Render -----------------------------------------------------------

  _render() {
    const list = this.shadowRoot.getElementById("list");
    const models = this._allModels().filter((m) => this._match(m));
    this._valueCells.clear();

    this.shadowRoot.getElementById("count").textContent =
      `${models.length} Entitäten`;

    if (!models.length) {
      list.innerHTML = '<div class="empty">Keine Entitäten gefunden.</div>';
      return;
    }

    const groups = new Map();
    for (const m of models) {
      const k = this._groupBy === "none" ? "Alle Entitäten" : this._groupKey(m);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(m);
    }
    const searching = !!this._search;

    const frag = document.createElement("div");
    frag.innerHTML = `
      <div class="cols">
        <div>Name</div><div class="c-type">Typ</div><div class="c-room">Raum</div><div>Wert</div>
      </div>`;

    for (const k of [...groups.keys()].sort((a, b) => a.localeCompare(b))) {
      const rows = groups.get(k);
      const open = this._groupBy === "none" || searching || this._open.has(k);
      const g = document.createElement("div");
      g.className = "group";
      const head = document.createElement("div");
      head.className = "group-head";
      head.innerHTML = `<span class="car">${open ? "▾" : "▸"}</span><span>${this._esc(k)}</span><span class="gcount">${rows.length}</span>`;
      if (this._groupBy !== "none") {
        head.addEventListener("click", () => {
          if (this._open.has(k)) this._open.delete(k);
          else this._open.add(k);
          this._render();
        });
        g.appendChild(head);
      }
      if (open) {
        for (const m of rows) g.appendChild(this._rowEl(m));
      }
      frag.appendChild(g);
    }
    list.innerHTML = "";
    list.appendChild(frag);
  }

  _rowEl(m) {
    const row = document.createElement("div");
    row.className = "row" + (m.id === this._selected ? " sel" : "");
    const typ = m.deviceClass ? `${m.domain} · ${m.deviceClass}` : m.domain;
    const valCell = document.createElement("div");
    valCell.className = "cell val";
    valCell.innerHTML = this._valHtml(m);
    this._valueCells.set(m.id, valCell);
    const nm = document.createElement("div");
    nm.className = "nm";
    nm.innerHTML = `<div class="fn">${this._esc(m.name)}</div><div class="id">${this._esc(m.id)}</div>`;
    const type = document.createElement("div");
    type.className = "cell c-type";
    type.innerHTML = `<span class="badge">${this._esc(typ)}</span>`;
    const room = document.createElement("div");
    room.className = "cell c-room";
    room.textContent = m.area || "—";
    row.appendChild(nm);
    row.appendChild(type);
    row.appendChild(room);
    row.appendChild(valCell);
    row.addEventListener("click", () => this._openDetail(m.id));
    return row;
  }

  _valHtml(m) {
    const u = m.unit ? ` <span class="u">${this._esc(m.unit)}</span>` : "";
    return `${this._esc(String(m.state))}${u}`;
  }

  _scheduleValueUpdate() {
    if (this._updTimer) return;
    this._updTimer = setTimeout(() => {
      this._updTimer = null;
      this._updateValues();
    }, 500);
  }

  _updateValues() {
    if (!this._hass) return;
    for (const [id, cell] of this._valueCells) {
      const m = this._model(id);
      const html = this._valHtml(m);
      if (cell.innerHTML !== html) cell.innerHTML = html;
    }
    if (this._selected) this._refreshDetailState();
  }

  // --- Detail -----------------------------------------------------------

  _openDetail(id) {
    this._selected = id;
    // reflect selection without full re-render
    this.shadowRoot.querySelectorAll(".row.sel").forEach((r) => r.classList.remove("sel"));
    this._render(); // cheap enough; keeps selection highlight correct
    const detail = this.shadowRoot.getElementById("detail");
    detail.classList.remove("hidden");
    this._renderDetail(id);
  }

  _closeDetail() {
    this._selected = null;
    this.shadowRoot.getElementById("detail").classList.add("hidden");
    this._render();
  }

  _renderDetail(id) {
    const h = this._hass;
    const st = h.states[id];
    const m = this._model(id);
    const reg = (h.entities || {})[id] || {};
    const dev = reg.device_id ? (h.devices || {})[reg.device_id] : null;
    const detail = this.shadowRoot.getElementById("detail");
    const attrs = (st && st.attributes) || {};
    const u = m.unit ? ` <span class="u">${this._esc(m.unit)}</span>` : "";

    const attrRows = Object.keys(attrs)
      .filter((k) => k !== "friendly_name")
      .sort()
      .map((k) => `<div class="k">${this._esc(k)}</div><div class="v">${this._esc(this._fmtAttr(attrs[k]))}</div>`)
      .join("");

    detail.innerHTML = `
      <div class="detail-head">
        <button class="close" id="dclose">✕</button>
        <div class="dn">${this._esc(m.name)}</div>
        <div class="di"><code>${this._esc(id)}</code><button class="copy" id="dcopy">kopieren</button></div>
      </div>
      <div class="detail-body">
        <div class="bigval" id="dstate">${this._esc(String(m.state))}${u}</div>
        <div class="kv">
          <div class="k">Domäne</div><div class="v">${this._esc(m.domain)}</div>
          <div class="k">Geräteklasse</div><div class="v">${this._esc(m.deviceClass || "—")}</div>
          <div class="k">Raum</div><div class="v">${this._esc(m.area || "—")}</div>
          <div class="k">Gerät</div><div class="v">${this._esc((dev && (dev.name_by_user || dev.name)) || "—")}</div>
          <div class="k">Integration</div><div class="v">${this._esc(m.platform)}</div>
          <div class="k">Typ (Wert)</div><div class="v">${this._esc(this._valueType(m.state))}</div>
          <div class="k">Zuletzt geändert</div><div class="v" id="dlc">${this._esc(this._fmtTime(st && st.last_changed))}</div>
        </div>
        <div class="sec">Verlauf</div>
        <div class="hist-range" id="drange">
          <button data-h="1">1 h</button><button data-h="24">24 h</button><button data-h="168">7 Tage</button>
        </div>
        <div id="dhist"><div class="muted">Lade Verlauf …</div></div>
        <div class="sec">Attribute</div>
        <div class="kv">${attrRows || '<div class="muted">Keine Attribute.</div>'}</div>
      </div>`;

    detail.querySelector("#dclose").addEventListener("click", () => this._closeDetail());
    detail.querySelector("#dcopy").addEventListener("click", () => {
      try { navigator.clipboard.writeText(id); } catch (e) { /* ignore */ }
    });
    const range = detail.querySelector("#drange");
    range.querySelectorAll("button").forEach((b) => {
      if (Number(b.dataset.h) === this._histRange) b.classList.add("on");
      b.addEventListener("click", () => {
        this._histRange = Number(b.dataset.h);
        range.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
        this._loadAndRenderHistory(id);
      });
    });
    this._loadAndRenderHistory(id);
  }

  _refreshDetailState() {
    const id = this._selected;
    const st = this._hass.states[id];
    if (!st) return;
    const m = this._model(id);
    const el = this.shadowRoot.getElementById("dstate");
    if (el) el.innerHTML = `${this._esc(String(m.state))}${m.unit ? ` <span class="u">${this._esc(m.unit)}</span>` : ""}`;
    const lc = this.shadowRoot.getElementById("dlc");
    if (lc) lc.textContent = this._fmtTime(st.last_changed);
  }

  async _loadAndRenderHistory(id) {
    const host = this.shadowRoot.getElementById("dhist");
    if (!host) return;
    host.innerHTML = '<div class="muted">Lade Verlauf …</div>';
    const points = await this._loadHistory(id, this._histRange);
    if (this._selected !== id) return; // user switched
    if (!points) {
      host.innerHTML = '<div class="muted">Verlauf nicht verfügbar (Recorder?).</div>';
      return;
    }
    if (!points.length) {
      host.innerHTML = '<div class="muted">Keine Daten im Zeitraum.</div>';
      return;
    }
    const numeric = points.filter((p) => p.num != null);
    if (numeric.length >= 2 && numeric.length >= points.length * 0.6) {
      host.innerHTML = this._numericChart(numeric);
    } else {
      host.innerHTML = this._stateTimeline(points);
    }
  }

  async _loadHistory(id, hours) {
    const end = new Date();
    const start = new Date(end.getTime() - hours * 3600 * 1000);
    try {
      const res = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [id],
        minimal_response: true,
        no_attributes: true,
      });
      const arr = (res && res[id]) || [];
      return arr.map((it) => {
        const state = it.s != null ? it.s : it.state;
        const ts = it.lu != null ? it.lu * 1000 : Date.parse(it.last_changed || it.last_updated);
        const num = state != null && state !== "" && !isNaN(Number(state)) ? Number(state) : null;
        return { state, ts, num };
      }).filter((p) => !isNaN(p.ts));
    } catch (e) {
      return null;
    }
  }

  _numericChart(pts) {
    const W = 380, H = 130, pad = 22;
    const xs = pts.map((p) => p.ts);
    const ys = pts.map((p) => p.num);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    let minY = Math.min(...ys), maxY = Math.max(...ys);
    if (minY === maxY) { minY -= 1; maxY += 1; }
    const sx = (x) => pad + ((x - minX) / (maxX - minX || 1)) * (W - pad - 6);
    const sy = (y) => H - pad - ((y - minY) / (maxY - minY || 1)) * (H - pad - 6);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p.ts).toFixed(1)},${sy(p.num).toFixed(1)}`).join(" ");
    const last = ys[ys.length - 1];
    const avg = ys.reduce((a, b) => a + b, 0) / ys.length;
    const grid = `<line x1="${pad}" y1="${H - pad}" x2="${W}" y2="${H - pad}" stroke="var(--divider-color,#ddd)"/>
      <line x1="${pad}" y1="6" x2="${pad}" y2="${H - pad}" stroke="var(--divider-color,#ddd)"/>`;
    return `
      <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:140px">
        ${grid}
        <text x="2" y="12" font-size="9" fill="var(--secondary-text-color,#999)">${this._num(maxY)}</text>
        <text x="2" y="${H - pad}" font-size="9" fill="var(--secondary-text-color,#999)">${this._num(minY)}</text>
        <path d="${d}" fill="none" stroke="var(--primary-color,#039be5)" stroke-width="2"/>
      </svg>
      <div class="stat">
        <span>Min ${this._num(minY)}</span><span>Max ${this._num(maxY)}</span>
        <span>Ø ${this._num(avg)}</span><span>Jetzt ${this._num(last)}</span>
      </div>`;
  }

  _stateTimeline(pts) {
    const end = Date.now();
    const start = pts[0].ts;
    const span = Math.max(1, end - start);
    const colorOf = {};
    let ci = 0;
    const col = (s) => (colorOf[s] = colorOf[s] || PALETTE[ci++ % PALETTE.length]);
    let seg = "";
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i].ts;
      const b = i + 1 < pts.length ? pts[i + 1].ts : end;
      const w = ((b - a) / span) * 100;
      if (w <= 0) continue;
      seg += `<span style="width:${w}%;background:${col(pts[i].state)}" title="${this._esc(pts[i].state)}"></span>`;
    }
    const states = Object.keys(colorOf);
    const legend = states.map((s) => `<span><i style="background:${colorOf[s]}"></i>${this._esc(s)}</span>`).join("");
    const recent = pts.slice(-12).reverse().map((p) =>
      `<div class="hl"><span>${this._esc(p.state)}</span><span class="t">${this._fmtTime(new Date(p.ts).toISOString())}</span></div>`
    ).join("");
    return `<div class="tl">${seg}</div><div class="tl-leg">${legend}</div><div class="hist-list">${recent}</div>`;
  }

  // --- helpers ----------------------------------------------------------

  _valueType(state) {
    if (state == null) return "—";
    const s = String(state).toLowerCase();
    if (s === "on" || s === "off") return "Schalter (an/aus)";
    if (!isNaN(Number(state)) && state !== "") return "Zahl";
    if (/^\d{4}-\d{2}-\d{2}/.test(s) || /^\d{1,2}:\d{2}/.test(s)) return "Datum/Zeit";
    if (s === "unavailable" || s === "unknown") return "nicht verfügbar";
    return "Text";
  }

  _num(n) {
    if (n == null || isNaN(n)) return "—";
    const r = Math.round(n * 100) / 100;
    return String(r);
  }

  _fmtAttr(v) {
    if (v == null) return "—";
    if (typeof v === "object") {
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v);
  }

  _fmtTime(iso) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleString(); } catch (e) { return String(iso); }
  }

  _esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
}

if (!customElements.get("entity-explorer-panel")) {
  customElements.define("entity-explorer-panel", EntityExplorerPanel);
}
