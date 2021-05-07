import { getSettings } from "./jsonIO";

const play = require("audio-play")
const load = require("audio-loader")

export default function playSound() {
    console.log("Playing sound...")
    load(getSettings().soundCue)
        .then((buffer: any) => {
            play(buffer, { volume: 0.2 })
        })
}
