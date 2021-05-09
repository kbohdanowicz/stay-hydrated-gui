import { ISettings } from "./types"
import { getThisDirPathWith, readJsonSync, writeJsonSync } from "./jsonIO"

function getSettings(): ISettings {
    return readJsonSync(getThisDirPathWith("../settings/settings.json"))
}

interface UpdateSettingsArgs {
    sipInterval?: number
    trayIcon?: string
    soundCue?: string
    soundsDirectory?: string
    volume?: number,
    isFirstRun?: boolean
}


function updateSettings(settings: UpdateSettingsArgs): void {
    if (Object.keys(settings).length == 0) {
        console.log(`[${this.name}]: no args`)
        return
    }
    const updatedSettings = getSettings()

    settings.sipInterval?.run((_) => updatedSettings.sipInterval = settings.sipInterval!)
    settings.trayIcon?.run((_) => updatedSettings.trayIcon = settings.trayIcon!)
    settings.soundCue?.run((_) => updatedSettings.soundCue = settings.soundCue!)
    settings.soundsDirectory?.run((_) => updatedSettings.soundsDirectory = settings.soundsDirectory!)
    settings.volume?.run((_) => updatedSettings.volume = settings.volume!)
    settings.isFirstRun?.run((_) => updatedSettings.isFirstRun = settings.isFirstRun!)

    writeJsonSync(getThisDirPathWith("../settings/settings.json"), updatedSettings)
    console.log("Settings updated")
}

const Settings = {
    get: getSettings,
    update: updateSettings
}

export default Settings