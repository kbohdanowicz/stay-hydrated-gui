import Settings from "./settings"
import {DROPDOWN_NO_SOUND_CUE} from "./constants"

const play = require("audio-play")
const load = require("audio-loader")

export default function playSound() {
    const settings = Settings.get()
	 try {	
    	if (!(settings.soundCue == DROPDOWN_NO_SOUND_CUE)) {
	      console.log("Playing sound...")
			load(settings.soundCue)
            .then((buffer: any) => {
               play(buffer, { volume: settings.volume })
            })
            .catch((err: any) => {
					console.log(err)
				})
    	}
	} catch (error) {
		console.log(error)
	}
}
