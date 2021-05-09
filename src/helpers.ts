import { getThisDirPathWith } from "./jsonIO"
import { BrowserWindow, Menu } from "electron"
const isDev = require("electron-is-dev")

export function createOptionsWindow(): BrowserWindow {
    const _window = new BrowserWindow({
        width: isDev ? 1200 : 500,
        height: isDev ? 900 : 300,
        title: "Stay Hydrated Options",
        webPreferences: {
            preload: getThisDirPathWith("renderer.js")
        },
        show: false,
        autoHideMenuBar: !isDev,
    })
    _window.loadFile("public/html/index.html")
        .then(() => _window.show())
        .catch((err: any) => console.log(err))

    return _window
}

// todo improve time units (35 min not 34)
export function getNextSipLabel(newTime: string): string {
    const tempTime = newTime.split(":")
    const minutes = Number(tempTime[0])
    const seconds = Number(tempTime[1])

    let time: string
    let timeUnit: string

    if (minutes > 0) {
        time = `about ${minutes + 1}`
        if (minutes == 1) {
            timeUnit = "minute"
        } else {
            timeUnit = "minutes"
        }
    } else {
        time = String(seconds)
        if (seconds == 1) {
            timeUnit = "second"
        } else {
            timeUnit = "seconds"
        }
    }
    return `Next Sip in ${time} ${timeUnit}`
}

export function getTimeLeft(timeInMillis: number): string {
    const now = new Date().getTime()
    const distance = timeInMillis - now

    const minutes = Math.floor((distance % (1000 * 60 * 90)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    return minutes + ":" + seconds
}

export type MenuTemplate = Electron.MenuItemConstructorOptions[]

export function getUpdatedContextMenu(originalMenu: MenuTemplate, newTime: string): Electron.Menu {
    // copy menu template array
    const newMenuTemplate = [...originalMenu]
    const nextSipOption = newMenuTemplate.find((el) => el.id == "nextSip")!
    nextSipOption.label = getNextSipLabel(newTime)
    return Menu.buildFromTemplate(newMenuTemplate)
}