import Settings from "./settings"
import {DROPDOWN_NO_SOUND} from "./constants"

const play = require("audio-play")
const load = require("audio-loader")

export default function playSound() {
    console.log("Playing sound...")
    const settings = Settings.get()
    if (!(settings.soundCue == DROPDOWN_NO_SOUND)) {
        load(settings.soundCue)
            .then((buffer: any) => {
                play(buffer, { volume: settings.volume })
            })
            .catch((err: any) => console.log(err))
    }
}
