import * as fs from "fs";

import * as unhandled from "electron-unhandled"
import * as electronIsDev from "electron-is-dev"

// show unhandled exceptions at runtime
unhandled()

// auto update
require('update-electron-app')({
    updateInterval: '1 hour'
})

import * as path from "path"
import playSound from "./playSound"
import { destroyWindowAfterSeconds, getNextSipLabel, getTimeLeft, getUpdatedContextMenu, MenuTemplate } from "./helpers"
import { app, BrowserWindow, Menu, Tray, ipcMain, dialog } from "electron"
import Settings from "./settings"
import { createNotificationWindow } from "./notification"
import setDefaultSettings from "./firstRun"
import { createOptionsWindow } from "./optionsWindow";

// initialize extensions
import "./extensions"

// initialize resource paths
if (Settings.get().isFirstRun) {
    setDefaultSettings()
}

let sipIntervalInMillis: number = new Date().getTime() + Settings.get().sipInterval
let tray: Tray
let countdownId: NodeJS.Timeout
let optionsWindow: BrowserWindow | undefined = undefined
let notificationWindow: BrowserWindow | undefined = undefined

const menuTemplate: MenuTemplate = [
    {
        label: "", type: 'normal', enabled: false, id: "nextSip"
    },
    {
        label: 'Options', type: 'normal', click: tryCreatingOptionsWindow
    },
    {
        label: 'Restart', type: 'normal', click: restartSipCountdown
    },
    {
        label: 'Quit', type: 'normal', click: quitApp
    }
]

function refreshSipIntervalInMillis(sipInterval: number): void {
    sipIntervalInMillis = new Date().getTime() + sipInterval
}

function tryCreatingOptionsWindow(): void {
    if (!optionsWindow) {
        optionsWindow = createOptionsWindow()
    } else {
        optionsWindow.focus()
    }
}

function openSipNotificationWindow() {
    notificationWindow = createNotificationWindow()
    destroyWindowAfterSeconds(notificationWindow, Settings.get().notification.duration)
}

function restartSipCountdown(): void {
    clearInterval(countdownId)
    refreshSipIntervalInMillis(Settings.get().sipInterval)
    startSipCountdown()
}

function quitApp(): void {
    tray.destroy()
    app.quit()
}

// play sound
function startSipCountdown(): void {
    const sipInterval = Settings.get().sipInterval
    countdownId = setInterval(() => {
        playSound()
        if (Settings.get().notification.enabled) {
            openSipNotificationWindow()
        }
        restartSipCountdown()
    }, sipInterval)
}

function updateTrayMenuInInterval(interval: number): void {
    setInterval(() => {
        tray.setContextMenu(getUpdatedContextMenu(menuTemplate, getTimeLeft(sipIntervalInMillis)))
    }, interval)
}

app.whenReady().then(() => {
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {

        }
    })

    if (electronIsDev) {
        menuTemplate.unshift({ label: 'Show notification', type: 'normal', click: () => {
                if (Settings.get().notification.enabled) {
                    openSipNotificationWindow()
                }
            }
        })
        tryCreatingOptionsWindow()
        optionsWindow!.webContents.openDevTools()
    }

    // tray
    tray = new Tray(Settings.get().trayIcon)
    tray.setToolTip("Stay Hydrated")
    const contextMenu = Menu.buildFromTemplate(menuTemplate)
    tray.setContextMenu(contextMenu)

    // start countdown
    startSipCountdown()

    // update tray menu every second
    updateTrayMenuInInterval(1000)

    // IPCMain
    ipcMain.on("open-sound-file-selection-dialog", (event) => {
        const options = {
            title: "Select sound file",
            buttonLabel: "Select",
            properties: ["openFile"],
            filters: [
                { name: "Sounds", extensions: ["mp3", "wav"] }
            ]
        }
        // @ts-ignore
        dialog.showOpenDialog(optionsWindow, options)
            .then(res => {
                if (!(res.canceled)) {
                    const selectedSoundPath = res.filePaths[0]
                    const soundBaseName = path.basename(selectedSoundPath)
                    const copiedSoundPath = Settings.get().soundsDirectory + soundBaseName

                    fs.copyFileSync(selectedSoundPath, copiedSoundPath)
                    console.log("File was copied to destination")

                    Settings.update({ soundCue: copiedSoundPath })

                    event.reply("update-selected-sound-label", soundBaseName, copiedSoundPath)
                }
            })
            .catch(err => console.log(err))
    })

    ipcMain.on("show-error-file-already-on-list", () => {
        dialog.showErrorBox("File name error", "Sound with that name is already on the list")
    })

    ipcMain.on("open-notification", () => {
       openSipNotificationWindow()
    })

    ipcMain.on("destroy-notification", () => {
        if (notificationWindow != undefined) {
            notificationWindow?.destroy()
            console.log("Notification is not instantiated")
        } else {
            console.log("Notification not destroyed")
        }
    })
})

app.on('window-all-closed', () => {
    optionsWindow = undefined
})
