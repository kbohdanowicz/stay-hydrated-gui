import {ISettings, UpdateSettingsArgs} from "./types"
import { getThisDirPathWith, readJsonSync, writeJsonSync } from "./jsonIO"

function getSettings(): ISettings {
    return readJsonSync(getThisDirPathWith("../settings/settings.json"))
}

function updateSettings(settings: UpdateSettingsArgs): void {
    if (Object.keys(settings).length == 0) {
        console.log(`[${this.name}]: no args`)
        return
    }
    const newSettings = getSettings()

    settings.sipInterval?.run((_) => newSettings.sipInterval = settings.sipInterval!)
    settings.trayIcon?.run((_) => newSettings.trayIcon = settings.trayIcon!)
    settings.soundCue?.run((_) => newSettings.soundCue = settings.soundCue!)
    settings.soundsDirectory?.run((_) => newSettings.soundsDirectory = settings.soundsDirectory!)
    settings.volume?.run((_) => newSettings.volume = settings.volume!)
    settings.isFirstRun?.run((_) => newSettings.isFirstRun = settings.isFirstRun!)

    // settings.notification?.run((it) => {
    //     // @ts-ignore
    //     it.enabled = settings.notification.enabled!
    //     newSettings.notification.positionX = settings.notification.positionX!
    //     newSettings.notification.positionY = settings.notification.positionY!
    //     newSettings.notification.duration = settings.notification.duration!
    // })

    settings.notification?.enabled?.run((_) =>
        newSettings.notification.enabled = settings.notification!.enabled!
    )
    settings.notification?.positionX?.run((_) =>
        newSettings.notification.positionX = settings.notification!.positionX!
    )
    settings.notification?.positionY?.run((_) =>
        newSettings.notification.positionY = settings.notification!.positionY!
    )
    settings.notification?.duration?.run((_) =>
        newSettings.notification.duration = settings.notification!.duration!
    )

    writeJsonSync(getThisDirPathWith("../settings/settings.json"), newSettings)
    console.log("Settings updated")
}

const Settings = {
    get: getSettings,
    update: updateSettings
}

export default Settings