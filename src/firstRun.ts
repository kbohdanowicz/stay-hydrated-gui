import { getThisDirPathWith } from "./jsonIO"
import Settings from "./settings"

// should run only once in production
export default function setDefaultSettings(): void {
    Settings.update({
        sipInterval: 900000,
        trayIcon: getThisDirPathWith("../resources/images/water-drop.png"),
        soundCue: getThisDirPathWith("../resources/sounds/slurp.wav"),
        soundsDirectory: getThisDirPathWith("../resources/sounds/"),
        imagesDirectory: getThisDirPathWith("../resources/images/"),
        volume: 0.2,
        isFirstRun: false,
        notification: {
            image: getThisDirPathWith("../resources/images/notification.png"),
            enabled: true,
            positionX: "left",
            positionY: "top",
            duration: 4000
        }
    })
}