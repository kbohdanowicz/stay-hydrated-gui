import { BrowserWindow, screen } from "electron"
import Settings from "./Settings"
import {destroyWindowAfterSeconds} from "./helpers";
import {getScriptDirectory} from "./jsonIO";

export function createNotificationWindow(): BrowserWindow {
    const display = screen.getPrimaryDisplay()
    const displayWidth = display.bounds.width
    const displayHeight = display.bounds.height

    // todo: toolbar size as a const from settings
    const windowsToolbar = {
        position: "left",
        width: 50
    }
    //
    const windowWidth = 374 + 6
    const windowHeight = 149 + 6
    const offsetX = 70
    const offsetY = 70

    // Settings.get().notificationPosition
    const left = offsetX
    const right = displayWidth - windowWidth - offsetX

    const top = offsetY
    const bottom = displayHeight - windowHeight - offsetY

    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: left,
        y: bottom,
        frame: false,
        resizable: false,
        titleBarStyle: "hidden",
        show: false,
        alwaysOnTop: true,
        webPreferences: {
            preload: getScriptDirectory("rendererNotification.js")
        },
    })
    win.loadFile("public/html/notification.html")
        .then(() => {
            win.showInactive()
        })
        .catch((err: any) => console.log(err))

    return win
}