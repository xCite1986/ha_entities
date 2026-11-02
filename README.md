# Entity Explorer

Ein **durchsuchbarer Entitäten-Browser** für **Home Assistant** – inspiriert von
der Objekt-/Datenpunktansicht in ioBroker. Fügt links in der Seitenleiste den
Eintrag **„Entitäten"** hinzu: eine tabellarische Baumansicht mit **Suche,
Entitätsname, Typ, Raum und Wert** – und beim Klick **Verlauf (Historie) +
Detailinformationen**.

## Funktionen

- 🗂️ **Seitenleisten-Eintrag „Entitäten"** – keine versteckten Menüs mehr.
- 🔎 **Volltextsuche** über Name, Entity-ID, Raum, Integration und Wert.
- 🌳 **Gruppierung** nach **Integration** (wie ioBroker-Adapter), **Raum** oder
  **Domäne** – ein-/ausklappbar; dazu eine Option „keine Gruppierung".
- 📊 **Spalten**: Name (+ Entity-ID), Typ (Domäne/Geräteklasse), Raum, Wert (mit
  Einheit) – Werte aktualisieren sich live.
- 📈 **Detailansicht beim Klick**: großer aktueller Wert, Domäne, Geräteklasse,
  Raum, Gerät, Integration, Wert-Typ, „zuletzt geändert", **alle Attribute** und
  ein **Verlauf** für 1 h / 24 h / 7 Tage.
  - Numerische Entitäten → **Liniendiagramm** mit Min/Max/Ø/Jetzt.
  - Zustands-Entitäten → **Zeitleiste** mit Legende und letzten Änderungen.
- 🌗 Folgt automatisch deinem **Hell-/Dunkel-Theme** von Home Assistant.
- Rein **lesend** – es werden keine Zustände verändert.

## Installation über HACS

1. HACS → **Integrationen** → Menü oben rechts → **Benutzerdefinierte
   Repositories**.
2. URL eintragen: `https://github.com/xCite1986/ha_entities` – Kategorie
   **Integration**.
3. **Entity Explorer** installieren und Home Assistant neu starten.
4. **Einstellungen → Geräte & Dienste → Integration hinzufügen → „Entity
   Explorer"**.
5. In der Seitenleiste erscheint **Entitäten**.

### Manuelle Installation

Ordner `custom_components/entity_explorer` nach `config/custom_components/`
kopieren, Home Assistant neu starten und die Integration hinzufügen.

## Hinweise

- Der **Verlauf** nutzt den **Recorder** von Home Assistant. Für Entitäten, die
  vom Recorder ausgeschlossen sind, gibt es keine Historie.
- **Raum** wird aus der Bereichszuordnung der Entität bzw. ihres Geräts
  ermittelt.
- Der Panel-Eintrag ist standardmäßig **nur für Administratoren** sichtbar.

## Lizenz

MIT – siehe [LICENSE](LICENSE).
