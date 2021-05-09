import playSound from "./playSound"
import {ipcRenderer} from "electron"
import Settings from "./settings"
import * as fs from "fs"
import "./extensions"
import {DROPDOWN_NO_SOUND} from "./constants"

window.addEventListener("DOMContentLoaded", () => {

    const sixtySeconds = 1000 * 60

    // sip interval slider
    const sipIntervalSlider = {
        ref: document.getElementById("sip-interval-slider") as HTMLInputElement,
        label: document.getElementById("sip-interval-slider-label")!
    }

    function updateSipInterval(): void {
        const minutes = Number(sipIntervalSlider.ref.value)
        Settings.update({ sipInterval: sixtySeconds * minutes})
    }

    sipIntervalSlider.ref.addEventListener("change", updateSipInterval)
    sipIntervalSlider.ref.addEventListener("input", () => {
        sipIntervalSlider.label.innerText = String(sipIntervalSlider.ref.value)
    })

    // volume slider
    const volumeSlider = {
        ref: document.getElementById("volume-slider") as HTMLInputElement,
        label: document.getElementById("volume-slider-label")!
    }

    function updateVolume(): void {
        const volume = Number(volumeSlider.ref.value)
        Settings.update({ volume: volume / 100 })
    }

    volumeSlider.ref.addEventListener("change", updateVolume)
    volumeSlider.ref.addEventListener("input", () => {
        volumeSlider.label.innerText = String(volumeSlider.ref.value)
    })

    // buttons
    function flipButtonsVisibilityIfNeeded(): void {
        btnRemoveSound.disabled = soundsDropdown.value == DROPDOWN_NO_SOUND
        btnPlaySound.disabled = soundsDropdown.value == DROPDOWN_NO_SOUND
    }

    const btnPlaySound = document.getElementById("btn-play-sound")  as HTMLButtonElement
    btnPlaySound.addEventListener("click", playSound)

    const btnRemoveSound = document.getElementById("btn-remove-sound") as HTMLButtonElement
    btnRemoveSound.addEventListener("click", () => {
        // todo: show "Are you sure?" dialog
        // todo?: replace dropdown with table with remove buttons on each row
        fs.rmSync(soundsDropdown.value)
        soundsDropdown.remove(soundsDropdown.selectedIndex)
        soundsDropdown.value = DROPDOWN_NO_SOUND
        flipButtonsVisibilityIfNeeded()
    })

    const btnAddSound = document.getElementById("btn-add-sound")!
    btnAddSound.addEventListener("click", () => ipcRenderer.send("open-sound-file-selection-dialog"))

    // sounds dropdown
    const soundsDropdown = document.getElementById("sounds-dropdown") as HTMLSelectElement

    soundsDropdown.addEventListener("change", () => {
        Settings.update({ soundCue: soundsDropdown.value })
        flipButtonsVisibilityIfNeeded()
    })

    // set initial values of sliders and labels
    {
        const settings = Settings.get()

        volumeSlider.ref.value = String(settings.volume * 100)
        volumeSlider.label.innerText = String(volumeSlider.ref.value)

        sipIntervalSlider.ref.value = String(settings.sipInterval / sixtySeconds)
        sipIntervalSlider.label.innerText = String(sipIntervalSlider.ref.value)

        const soundFileNames = fs.readdirSync(settings.soundsDirectory)
        for (const fileName of soundFileNames) {
            const absoluteFilePath = settings.soundsDirectory + fileName
            soundsDropdown.add(new Option(fileName, absoluteFilePath))
        }

        soundsDropdown.value = settings.soundCue
        flipButtonsVisibilityIfNeeded()

        console.log("Initialized HTML values")
    }

    ipcRenderer.on("update-selected-sound-label",
        (event, soundBaseName, selectedSoundPath) => {
            const optionLabels = Array.from(soundsDropdown.options).map(opt => opt.text)

            if (!(optionLabels.includes(soundBaseName))) {
                soundsDropdown.add(new Option(soundBaseName, selectedSoundPath))
                soundsDropdown.value = selectedSoundPath
                flipButtonsVisibilityIfNeeded()
            } else {
                // todo: show "File with that name is already on the list" dialog
            }
        }
    )
})