import { getSettings, updateSettings } from "./jsonIO";

const isDev = require("electron-is-dev")

export default function initResourcePaths(): void {
    if (!(isDev)) {
        const settings = getSettings()
        const productionPath = "resources/app/"
        settings.trayIcon = productionPath + settings.trayIcon
        settings.soundCue = productionPath + settings.soundCue
        updateSettings(settings)
    }
}