const unhandled = require("electron-unhandled")

unhandled()

import initResourcePaths from "./resourcePath";
import playSound from "./playSound"
import { createOptionsWindow, getNextSipLabel, getTimeLeft, getUpdatedContextMenu, MenuTemplate } from "./functions"
import { app, BrowserWindow, Menu, Tray } from "electron"
import { getSettings } from "./jsonIO"


initResourcePaths()

let sipIntervalInMillis: number = new Date().getTime() + getSettings().sipInterval

// lateinit
let countdownId: NodeJS.Timeout
let tray: Tray

let optionsWindow: BrowserWindow | undefined = undefined

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
    const sipInterval = getSettings().sipInterval
    return setInterval(() => {
        playSound()
        restartPlaySoundCountdown()
    }, sipInterval)
}

function restartPlaySoundCountdown(): void {
    clearInterval(countdownId)
    refreshSipIntervalInMillis(getSettings().sipInterval)
    countdownId = startPlaySoundCountdown()
}

const menuTemplate: MenuTemplate = [
    {
        label: getNextSipLabel(getTimeLeft(sipIntervalInMillis)), type: 'normal', id: 'nextSip',  enabled: false
    },
    {
        label: 'Options', type: 'normal', click: () => { openOptionsWindow() }
    },
    {
        label: 'Restart', type: 'normal', click: () => { restartPlaySoundCountdown() }
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

    openOptionsWindow()

    // tray
    tray = new Tray(getSettings().trayIcon)
    tray.setToolTip("Stay Hydrated")
    const contextMenu = Menu.buildFromTemplate(menuTemplate)
    tray.setContextMenu(contextMenu)

    // start countdown
    countdownId = startPlaySoundCountdown()

    // update tray menu every second
    setInterval(() => {
        tray.setContextMenu(getUpdatedContextMenu(menuTemplate, getTimeLeft(sipIntervalInMillis)))
    }, 500)
})

app.on('window-all-closed', () => {
    optionsWindow = undefined
})
