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
.chart{width:100%;height:140px;display:block;}
.chart-wrap{position:relative;}
.ctip{position:absolute;background:#323232;color:#fff;font-size:11px;padding:4px 8px;border-radius:5px;
  white-space:nowrap;pointer-events:none;z-index:3;box-shadow:0 2px 6px rgba(0,0,0,.3);}
.modal-body .chart{height:260px;}
.stat{display:flex;gap:16px;font-size:12px;color:var(--secondary-text-color,#777);margin-top:6px;flex-wrap:wrap;}
.tl{display:flex;height:22px;border-radius:5px;overflow:hidden;margin-top:4px;}
.tl span{height:100%;}
.tl-leg{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;font-size:12px;}
.tl-leg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:middle;}
.hist-list{margin-top:10px;font-size:12px;max-height:50vh;overflow:auto;}
.hist-list .hl{display:flex;justify-content:space-between;gap:10px;padding:3px 0;border-top:1px solid var(--divider-color,#f0f0f0);}
.hist-list .hl .t{color:var(--secondary-text-color,#999);font-variant-numeric:tabular-nums;}
.muted{color:var(--secondary-text-color,#999);font-size:13px;}
/* inline toggle for switchable entities */
.val-wrap{display:flex;align-items:center;gap:8px;justify-content:space-between;}
.sw{position:relative;width:38px;height:20px;flex:none;border-radius:11px;cursor:pointer;
  background:var(--switch-unchecked-track-color,#9e9e9e);transition:background .15s;}
.sw.on{background:var(--primary-color,#03a9f4);}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;
  background:#fff;transition:left .15s;box-shadow:0 1px 2px rgba(0,0,0,.3);}
.sw.on::after{left:20px;}
.sw.busy{opacity:.5;}
.press-btn{flex:none;cursor:pointer;border:none;border-radius:12px;padding:4px 12px;font-size:12px;
  background:var(--primary-color,#03a9f4);color:#fff;white-space:nowrap;}
.press-btn:hover{filter:brightness(1.08);}
.press-btn:active{transform:scale(.96);}
.press-btn.busy{opacity:.5;}
.row.sel .press-btn{background:rgba(255,255,255,.3);}
.row.sel .sw{box-shadow:0 0 0 2px rgba(255,255,255,.4);}
.detail-toggle{display:inline-block;vertical-align:middle;margin-left:10px;}
/* toast */
.toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(10px);
  background:#323232;color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;z-index:50;
  box-shadow:0 3px 12px rgba(0,0,0,.35);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
/* clickable chart hint */
.hist-click{cursor:pointer;border-radius:6px;}
.hist-click:hover{background:var(--secondary-background-color,#f3f3f3);}
/* modal */
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:40;display:flex;
  align-items:center;justify-content:center;padding:24px;}
.modal{background:var(--card-background-color,#fff);color:var(--primary-text-color,#212121);
  border-radius:12px;width:min(900px,96vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;
  box-shadow:0 10px 40px rgba(0,0,0,.4);}
.modal-head{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--divider-color,#eee);}
.modal-head .mt{font-size:16px;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.modal-head .mclose{cursor:pointer;border:none;background:var(--secondary-background-color,#eee);color:inherit;
  border-radius:6px;padding:4px 10px;font-size:14px;}
.modal-body{padding:16px 18px;overflow:auto;}
.modal-body .chart{height:260px;}
.modal-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:10px;}
.modal-table th,.modal-table td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--divider-color,#f0f0f0);}
.modal-table th{position:sticky;top:0;background:var(--card-background-color,#fff);color:var(--secondary-text-color,#888);}
.modal-table td.t{color:var(--secondary-text-color,#999);white-space:nowrap;font-variant-numeric:tabular-nums;}
@media (max-width:760px){.detail{position:fixed;inset:0;width:100%;max-width:100%;z-index:10;}
  .cols,.row{grid-template-columns:1fr 84px;}
  .cols .c-room,.cols .c-type,.row .c-room,.row .c-type{display:none;}}
`;

const PALETTE = ["#039be5", "#43a047", "#fb8c00", "#8e24aa", "#e53935", "#00897b", "#6d4c41", "#3949ab", "#c0ca33", "#d81b60"];
const TOGGLE_DOMAINS = new Set([
  "switch", "light", "input_boolean", "fan", "siren", "humidifier",
  "automation", "script", "remote", "switch_as_x",
]);
// Entities that are "pressed"/activated rather than toggled.
const PRESS_DOMAINS = new Set(["button", "input_button", "scene"]);

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
    this._valueNodes = new Map();
    this._histRange = 24;
    this._updTimer = null;
    this._histPoints = [];
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
    this._valueNodes.clear();

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
    const vwrap = document.createElement("div");
    vwrap.className = "val-wrap";
    const vtext = document.createElement("span");
    vtext.className = "vtext";
    vtext.innerHTML = this._valHtml(m);
    vwrap.appendChild(vtext);
    let sw = null;
    if (TOGGLE_DOMAINS.has(m.domain)) {
      sw = this._makeToggle(m.id, m.state);
      vwrap.appendChild(sw);
    } else if (PRESS_DOMAINS.has(m.domain)) {
      vwrap.appendChild(this._makePressButton(m.id, m.domain));
    }
    valCell.appendChild(vwrap);
    this._valueNodes.set(m.id, { text: vtext, sw });
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
    for (const [id, nodes] of this._valueNodes) {
      const m = this._model(id);
      const html = this._valHtml(m);
      if (nodes.text.innerHTML !== html) nodes.text.innerHTML = html;
      if (nodes.sw && !nodes.sw.classList.contains("busy")) {
        nodes.sw.classList.toggle("on", this._isOn(m.state));
      }
    }
    if (this._selected) this._refreshDetailState();
  }

  _isOn(state) {
    return String(state).toLowerCase() === "on";
  }

  _makeToggle(id, state) {
    const sw = document.createElement("div");
    sw.className = "sw" + (this._isOn(state) ? " on" : "");
    sw.title = "Direkt umschalten";
    sw.addEventListener("click", (e) => {
      e.stopPropagation();
      this._toggle(id, sw);
    });
    return sw;
  }

  async _toggle(id, sw) {
    sw.classList.add("busy");
    sw.classList.toggle("on");
    try {
      await this._hass.callService("homeassistant", "toggle", { entity_id: id });
    } catch (e) {
      this._toast("Schalten fehlgeschlagen");
    }
    setTimeout(() => sw.classList.remove("busy"), 500);
  }

  _makePressButton(id, domain) {
    const btn = document.createElement("button");
    btn.className = "press-btn";
    btn.textContent = domain === "scene" ? "Aktivieren" : "Drücken";
    btn.title = "Direkt auslösen";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._press(id, domain, btn);
    });
    return btn;
  }

  async _press(id, domain, btn) {
    btn.classList.add("busy");
    try {
      if (domain === "scene") {
        await this._hass.callService("scene", "turn_on", { entity_id: id });
        this._toast("Szene aktiviert");
      } else {
        await this._hass.callService(domain, "press", { entity_id: id });
        this._toast("Button gedrückt");
      }
    } catch (e) {
      this._toast("Aktion fehlgeschlagen");
    }
    setTimeout(() => btn.classList.remove("busy"), 500);
  }

  _toast(msg) {
    let t = this.shadowRoot.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      this.shadowRoot.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
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
        <div class="bigval"><span id="dstate">${this._esc(String(m.state))}${u}</span><span class="detail-toggle" id="dtoggle"></span></div>
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
      try {
        navigator.clipboard.writeText(id);
        this._toast("Entitäts-ID kopiert");
      } catch (e) {
        this._toast("Kopieren nicht möglich");
      }
    });
    this._detailToggle = null;
    if (TOGGLE_DOMAINS.has(m.domain)) {
      const sw = this._makeToggle(id, m.state);
      detail.querySelector("#dtoggle").appendChild(sw);
      this._detailToggle = sw;
    } else if (PRESS_DOMAINS.has(m.domain)) {
      detail.querySelector("#dtoggle").appendChild(this._makePressButton(id, m.domain));
    }
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
    if (this._detailToggle && !this._detailToggle.classList.contains("busy")) {
      this._detailToggle.classList.toggle("on", this._isOn(m.state));
    }
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
    this._histPoints = points;
    this._histId = id;
    host.innerHTML = "";
    host.classList.add("hist-click");
    host.title = "Zum Vergrößern klicken";
    this._renderHistory(host, points, 140);
    host.onclick = (e) => {
      if (e.target.closest("a,button,input")) return;
      this._openHistModal(id);
    };
  }

  _renderHistory(hostEl, points, height) {
    const numeric = points.filter((p) => p.num != null);
    const isNum = numeric.length >= 2 && numeric.length >= points.length * 0.6;
    if (isNum) this._renderChartInto(hostEl, numeric, height);
    else this._renderTimelineInto(hostEl, points);
  }

  _openHistModal(id) {
    const pts = this._histPoints || [];
    if (!pts.length) return;
    const m = this._model(id);
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <span class="mt">${this._esc(m.name)} — Verlauf (${this._histRange} h)</span>
          <button class="mclose">✕</button>
        </div>
        <div class="modal-body">
          <div class="mchart"></div>
          <table class="modal-table"><thead><tr><th>Wert</th><th>Zeit</th></tr></thead><tbody></tbody></table>
        </div>
      </div>`;
    this._renderHistory(backdrop.querySelector(".mchart"), pts, 260);
    backdrop.querySelector(".modal-table tbody").innerHTML = [...pts].reverse().map((p) =>
      `<tr><td>${this._esc(p.state)}${m.unit ? " " + this._esc(m.unit) : ""}</td><td class="t">${this._esc(this._fmtTime(new Date(p.ts).toISOString()))}</td></tr>`
    ).join("");
    const close = () => {
      backdrop.remove();
      document.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
    backdrop.querySelector(".mclose").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    this.shadowRoot.appendChild(backdrop);
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

  _renderChartInto(hostEl, pts, height) {
    const W = 400, H = height || 140, pad = 24;
    const xs = pts.map((p) => p.ts);
    const ys = pts.map((p) => p.num);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    let minY = Math.min(...ys), maxY = Math.max(...ys);
    if (minY === maxY) { minY -= 1; maxY += 1; }
    const sx = (x) => pad + ((x - minX) / (maxX - minX || 1)) * (W - pad - 8);
    const sy = (y) => H - pad - ((y - minY) / (maxY - minY || 1)) * (H - pad - 8);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p.ts).toFixed(1)},${sy(p.num).toFixed(1)}`).join(" ");
    const last = ys[ys.length - 1];
    const avg = ys.reduce((a, b) => a + b, 0) / ys.length;

    const wrap = document.createElement("div");
    wrap.className = "chart-wrap";
    wrap.innerHTML = `
      <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">
        <line x1="${pad}" y1="${H - pad}" x2="${W}" y2="${H - pad}" stroke="var(--divider-color,#ddd)"/>
        <line x1="${pad}" y1="6" x2="${pad}" y2="${H - pad}" stroke="var(--divider-color,#ddd)"/>
        <text x="2" y="12" font-size="9" fill="var(--secondary-text-color,#999)">${this._num(maxY)}</text>
        <text x="2" y="${H - pad}" font-size="9" fill="var(--secondary-text-color,#999)">${this._num(minY)}</text>
        <path d="${d}" fill="none" stroke="var(--primary-color,#039be5)" stroke-width="2"/>
        <line class="ccursor" x1="0" y1="6" x2="0" y2="${H - pad}" stroke="var(--secondary-text-color,#999)" stroke-dasharray="3 3" style="display:none"/>
        <circle class="cmarker" r="3.5" fill="var(--primary-color,#039be5)" stroke="#fff" stroke-width="1" style="display:none"/>
      </svg>
      <div class="ctip" style="display:none"></div>`;
    const stat = document.createElement("div");
    stat.className = "stat";
    stat.innerHTML = `<span>Min ${this._num(minY)}</span><span>Max ${this._num(maxY)}</span><span>Ø ${this._num(avg)}</span><span>Jetzt ${this._num(last)}</span>`;
    hostEl.appendChild(wrap);
    hostEl.appendChild(stat);

    const unit = this._histId && this._model(this._histId).unit
      ? " " + this._esc(this._model(this._histId).unit) : "";
    const svg = wrap.querySelector("svg");
    const cursor = wrap.querySelector(".ccursor");
    const marker = wrap.querySelector(".cmarker");
    const tip = wrap.querySelector(".ctip");
    const move = (e) => {
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      const px = ((e.clientX - r.left) / r.width) * W;
      let best = 0, bd = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const dd = Math.abs(sx(pts[i].ts) - px);
        if (dd < bd) { bd = dd; best = i; }
      }
      const p = pts[best], cx = sx(p.ts), cy = sy(p.num);
      cursor.setAttribute("x1", cx); cursor.setAttribute("x2", cx); cursor.style.display = "";
      marker.setAttribute("cx", cx); marker.setAttribute("cy", cy); marker.style.display = "";
      tip.style.display = "";
      tip.innerHTML = `<b>${this._num(p.num)}${unit}</b> · ${this._esc(this._fmtTime(new Date(p.ts).toISOString()))}`;
      const leftPx = (cx / W) * r.width;
      const tw = tip.offsetWidth || 120;
      tip.style.left = Math.max(2, Math.min(leftPx - tw / 2, r.width - tw - 2)) + "px";
      tip.style.top = Math.max(0, (cy / H) * r.height - 30) + "px";
    };
    svg.addEventListener("mousemove", move);
    svg.addEventListener("mouseleave", () => {
      cursor.style.display = "none";
      marker.style.display = "none";
      tip.style.display = "none";
    });
  }

  _renderTimelineInto(hostEl, pts) {
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
      seg += `<span style="width:${w}%;background:${col(pts[i].state)}" title="${this._esc(pts[i].state)} — ${this._esc(this._fmtTime(new Date(a).toISOString()))}"></span>`;
    }
    const legend = Object.keys(colorOf).map((s) => `<span><i style="background:${colorOf[s]}"></i>${this._esc(s)}</span>`).join("");
    const recent = [...pts].reverse().map((p) =>
      `<div class="hl"><span>${this._esc(p.state)}</span><span class="t">${this._esc(this._fmtTime(new Date(p.ts).toISOString()))}</span></div>`
    ).join("");
    const div = document.createElement("div");
    div.innerHTML = `<div class="tl">${seg}</div><div class="tl-leg">${legend}</div><div class="hist-list">${recent}</div>`;
    hostEl.appendChild(div);
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
