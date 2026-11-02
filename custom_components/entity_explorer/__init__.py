"""Entity Explorer - a searchable, iobroker-style entity browser in the sidebar."""
from __future__ import annotations

import logging
import os

from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    PANEL_ICON,
    PANEL_NAME,
    PANEL_PATH,
    PANEL_TITLE,
    PANEL_URL,
)

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register the sidebar panel and serve its frontend assets."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_URL, FRONTEND_DIR, False)]
    )

    # Cache-bust the panel bundle by integration version.
    try:
        from homeassistant.loader import async_get_integration

        integration = await async_get_integration(hass, DOMAIN)
        version = str(integration.version)
    except Exception:  # noqa: BLE001
        version = str(entry.version)

    try:
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name=PANEL_NAME,
            frontend_url_path=PANEL_PATH,
            module_url=f"{PANEL_URL}/entity-explorer-panel.js?v={version}",
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=True,
            config={},
        )
    except ValueError:
        pass

    _LOGGER.info("Entity Explorer set up")
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    from homeassistant.components import frontend

    try:
        frontend.async_remove_panel(hass, PANEL_PATH)
    except Exception:  # noqa: BLE001
        pass
    return True
