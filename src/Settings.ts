import {ISettings, UpdateSettingsArgs} from "./types"
import { getScriptDirectory, readJsonSync, writeJsonSync } from "./jsonIO"

function getSettings(): ISettings {
    return readJsonSync(getScriptDirectory("../settings/settings.json"))
}

function updateSettings(settings: UpdateSettingsArgs): void {
    if (Object.keys(settings).length == 0) {
        console.log(`[${this.name}]: no args`)
        return
    }
    const newSettings = getSettings()

    settings.sipInterval?.run(() =>
        newSettings.sipInterval = settings.sipInterval!
    )
    settings.trayIcon?.run(() =>
        newSettings.trayIcon = settings.trayIcon!
    )
    settings.soundCue?.run(() =>
        newSettings.soundCue = settings.soundCue!
    )
    settings.soundsDirectory?.run(() =>
        newSettings.soundsDirectory = settings.soundsDirectory!
    )
    settings.imagesDirectory?.run(() =>
        newSettings.imagesDirectory = settings.imagesDirectory!
    )
    settings.volume?.run(() =>
        newSettings.volume = settings.volume!
    )
    settings.isFirstRun?.run(() =>
        newSettings.isFirstRun = settings.isFirstRun!
    )

    settings.notification?.image?.run(() =>
        newSettings.notification.image = settings.notification!.image!
    )
    settings.notification?.enabled?.run(() =>
        newSettings.notification.enabled = settings.notification!.enabled!
    )
    settings.notification?.positionX?.run(() =>
        newSettings.notification.positionX = settings.notification!.positionX!
    )
    settings.notification?.positionY?.run(() =>
        newSettings.notification.positionY = settings.notification!.positionY!
    )
    settings.notification?.duration?.run(() =>
        newSettings.notification.duration = settings.notification!.duration!
    )

    // settings.run((it) => {
    //     newSettings.sipInterval = it.sipInterval
    //     newSettings.trayIcon = it.trayIcon!
    //     newSettings.soundCue = it.soundCue!
    //     newSettings.soundsDirectory = it.soundsDirectory!
    //     newSettings.imageDirectory = it.imageDirectory!
    //     newSettings.notification.enabled = it.notification.enabled!
    //     newSettings.notification.positionX = it.notification.positionX!
    //     newSettings.notification.positionY = it.notification.positionY!
    //     newSettings.notification.duration = it.notification.duration!
    // })
    writeJsonSync(getScriptDirectory("../settings/settings.json"), newSettings)
    console.log("Settings updated")
}

const Settings = {
    get: getSettings,
    update: updateSettings
}

export default Settings