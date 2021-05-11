import { getThisDirPathWith } from "./jsonIO"
import Settings from "./settings"

// should run only once in production
export default function initializeResourcePaths(): void {
    Settings.update({
        trayIcon: getThisDirPathWith("../resources/images/water-drop.png"),
        soundCue: getThisDirPathWith("../resources/sounds/Slurp-SoundBible.com-2051284741.wav"),
        soundsDirectory: getThisDirPathWith("../resources/sounds/"),
        isFirstRun: false
    })
}