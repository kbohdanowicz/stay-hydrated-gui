import {BrowserWindow} from "electron"
import {getThisDirPathWith} from "./jsonIO"
import * as electronIsDev from "electron-is-dev"

export function createOptionsWindow(): BrowserWindow {
    const _window = new BrowserWindow({
        width: electronIsDev ? 1200 : 600,
        height: electronIsDev ? 900 : 500,
        title: "Stay Hydrated Options",
        webPreferences: {
            preload: getThisDirPathWith("renderer.js")
        },
        show: false,
        autoHideMenuBar: !electronIsDev,
    })
    _window.loadFile(getThisDirPathWith("../public/html/index.html"))
        .then(() => _window.show())
        .catch((err: any) => console.log(err))

    return _window
}
