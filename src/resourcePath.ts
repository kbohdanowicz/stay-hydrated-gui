import { getThisDirPathWith } from "./jsonIO"
import Settings from "./settings"

//todo: run only once in production
export default function initResourcePaths(): void {
    if (Settings.get().isFirstRun) {
        Settings.update({
            trayIcon: getThisDirPathWith("../resources/images/water-drop.png"),
            soundCue: getThisDirPathWith("../resources/sounds/Slurp-SoundBible.com-2051284741.wav"),
            soundsDirectory: getThisDirPathWith("../resources/sounds/"),
            isFirstRun: false
        })
    }
}