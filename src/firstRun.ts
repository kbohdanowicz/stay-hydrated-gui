import { getScriptDirectory } from "./jsonIO"
import Settings from "./settings"

// should run only once in production
export default function setDefaultSettings(): void {
    Settings.update({
        sipInterval: 900000,
        trayIcon: getScriptDirectory("../resources/images/water-drop.png"),
        soundCue: getScriptDirectory("../resources/sounds/slurp.wav"),
        soundsDirectory: getScriptDirectory("../resources/sounds/"),
        imagesDirectory: getScriptDirectory("../resources/images/"),
        volume: 0.4,
        isFirstRun: false,
        notification: {
            image: getScriptDirectory("../resources/images/notification.png"),
            enabled: false,
            positionX: "left",
            positionY: "top",
            duration: 4000
        }
    })
}