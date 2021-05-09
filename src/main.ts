import * as fs from "fs";

const unhandled = require("electron-unhandled")
const isDev = require("electron-is-dev")

unhandled()

import playSound from "./playSound"
import { createOptionsWindow, getNextSipLabel, getTimeLeft, getUpdatedContextMenu, MenuTemplate } from "./helpers"
import { app, BrowserWindow, Menu, Tray, ipcMain, dialog, screen } from "electron"
import * as path from "path"
import Settings from "./settings"

// initialize extensions
import "./extensions"

// initialize resource paths
import initResourcePaths from "./resourcePath"
import {getThisDirPathWith} from "./jsonIO";
import {showSipNotification} from "./notification";
initResourcePaths()

let sipIntervalInMillis: number = new Date().getTime() + Settings.get().sipInterval

// lateinit
let countdownId: NodeJS.Timeout
let tray: Tray

export let optionsWindow: BrowserWindow | undefined = undefined

function openOptionsWindow(): void {
    if (!optionsWindow) {
        optionsWindow = createOptionsWindow()
    } else {
        optionsWindow.focus()
    }
}

function refreshSipIntervalInMillis(sipInterval: number): void {
    sipIntervalInMillis = new Date().getTime() + sipInterval
}

// play sound
function startPlaySoundCountdown(): NodeJS.Timeout {
    const sipInterval = Settings.get().sipInterval
    return setInterval(() => {
        playSound()
        showSipNotification()
        restartPlaySoundCountdown()
    }, sipInterval)
}

function restartPlaySoundCountdown(): void {
    clearInterval(countdownId)
    refreshSipIntervalInMillis(Settings.get().sipInterval)
    countdownId = startPlaySoundCountdown()
}

const menuTemplate: MenuTemplate = [
    {
        id: "nextSip", label: getNextSipLabel(getTimeLeft(sipIntervalInMillis)), type: 'normal', enabled: false
    },
    {
        label: 'Options', type: 'normal', click: openOptionsWindow
    },
    {
        label: 'Restart', type: 'normal', click: restartPlaySoundCountdown
    },
    {
        label: 'Quit', type: 'normal',
        click: () => {
            tray.destroy()
            app.quit()
        }
    },

]

app.whenReady().then(() => {
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {

        }
    })

    if (isDev) {
        menuTemplate.unshift({ label: 'Show notification', type: 'normal', click: showSipNotification })

        openOptionsWindow()
        optionsWindow!.webContents.openDevTools()
    }

    // tray
    tray = new Tray(Settings.get().trayIcon)
    tray.setToolTip("Stay Hydrated")
    const contextMenu = Menu.buildFromTemplate(menuTemplate)
    tray.setContextMenu(contextMenu)

    // start countdown
    countdownId = startPlaySoundCountdown()

    // update tray menu every second
    setInterval(() => {
        tray.setContextMenu(getUpdatedContextMenu(menuTemplate, getTimeLeft(sipIntervalInMillis)))
    }, 1000)

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
})

app.on('window-all-closed', () => {
    optionsWindow = undefined
})