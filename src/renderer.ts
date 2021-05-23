import playSound from "./playSound"
import {ipcRenderer} from "electron"
import Settings from "./settings"
import * as fs from "fs"
import {DROPDOWN_NO_SOUND_CUE} from "./constants"

import "./extensions"

window.addEventListener("DOMContentLoaded", () => {

    const sixtySeconds = 1000 * 60

    // sip interval slider
    const sliderSipInterval = {
        ref: document.getElementById("slider-sip-interval") as HTMLInputElement,
        label: document.getElementById("label-sip-interval") as HTMLLabelElement
    }

    function updateSipInterval(): void {
        const minutes = Number(sliderSipInterval.ref.value)
        Settings.update({ sipInterval: sixtySeconds * minutes})
    }

    sliderSipInterval.ref.addEventListener("change", updateSipInterval)
    sliderSipInterval.ref.addEventListener("input", () => {
        sliderSipInterval.label.innerText = `${sliderSipInterval.ref.value} minutes`
    })

    // volume slider
    const sliderVolume = {
        ref: document.getElementById("slider-volume") as HTMLInputElement,
        label: document.getElementById("label-volume") as HTMLLabelElement
    }

    function updateVolume(): void {
        const volume = Number(sliderVolume.ref.value)
        Settings.update({ volume: volume / 100 })
    }

    sliderVolume.ref.addEventListener("change", updateVolume)
    sliderVolume.ref.addEventListener("input", () => {
        sliderVolume.label.innerText = String(sliderVolume.ref.value)
    })

    // buttons
    function changeButtonsClickabilityBasedOnDropdownValue(): void {
        btnRemoveSound.disabled = dropdownSounds.value == DROPDOWN_NO_SOUND_CUE
        btnPlaySound.disabled = dropdownSounds.value == DROPDOWN_NO_SOUND_CUE
    }

    const btnPlaySound = document.getElementById("btn-play-sound")  as HTMLButtonElement
    btnPlaySound.addEventListener("click", playSound)

    const btnRemoveSound = document.getElementById("btn-remove-sound") as HTMLButtonElement
    btnRemoveSound.addEventListener("click", () => {
        // todo: show "Are you sure?" dialog
        fs.rmSync(dropdownSounds.value)
        dropdownSounds.remove(dropdownSounds.selectedIndex)
        dropdownSounds.value = DROPDOWN_NO_SOUND_CUE
        Settings.update({ soundCue: DROPDOWN_NO_SOUND_CUE})
        changeButtonsClickabilityBasedOnDropdownValue()
    })

    const btnAddSound = document.getElementById("btn-add-sound")!
    btnAddSound.addEventListener("click", () => {
        ipcRenderer.send("open-sound-file-selection-dialog")
    })

    // dropdown sounds
    const dropdownSounds = document.getElementById("dropdown-sounds") as HTMLSelectElement

    dropdownSounds.addEventListener("change", () => {
        Settings.update({ soundCue: dropdownSounds.value })
        changeButtonsClickabilityBasedOnDropdownValue()
    })

    // notification:
    // - checkbox
    const checkboxNotification = document.getElementById("checkbox-show-notification") as HTMLInputElement

    checkboxNotification.addEventListener("input", () => {
        updateNotificationEnabled()
        sliderNotificationDuration.ref.disabled = !(checkboxNotification.checked)
    })

    function updateNotificationEnabled(): void {
        const checked = checkboxNotification.checked
        Settings.update({ notification: { enabled: checked } })
    }

    // - duration
    const sliderNotificationDuration = {
        ref: document.getElementById("slider-notification-duration") as HTMLInputElement,
        label: document.getElementById("label-notification-duration") as HTMLLabelElement
    }

    function updateNotificationDuration(): void {
        const duration = Number(sliderNotificationDuration.ref.value)
        Settings.update({ notification: { duration: duration * 1000 } })
    }

    sliderNotificationDuration.ref.addEventListener("change", updateNotificationDuration)
    sliderNotificationDuration.ref.addEventListener("input", () => {
        const duration = Number(sliderNotificationDuration.ref.value)
        sliderNotificationDuration.label.innerText = duration + (duration == 1 ? " second" : " seconds")
    })
    //

    // set initial values of sliders and labels
    {
        const settings = Settings.get()

        sliderVolume.ref.value = String(settings.volume * 100)
        sliderVolume.label.innerText = String(sliderVolume.ref.value)

        sliderSipInterval.ref.value = String(settings.sipInterval / sixtySeconds)
        sliderSipInterval.label.innerText = `${sliderSipInterval.ref.value} minutes`


        checkboxNotification.checked = settings.notification.enabled

        sliderNotificationDuration.ref.disabled = !(checkboxNotification.checked)
        sliderNotificationDuration.ref.value = String(settings.notification.duration / 1000)

        const duration = Number(sliderNotificationDuration.ref.value)
        sliderNotificationDuration.label.innerText = duration + (duration == 1 ? " second" : " seconds")

        const soundFileNames = fs.readdirSync(settings.soundsDirectory)
        for (const fileName of soundFileNames) {
            const absoluteFilePath = settings.soundsDirectory + fileName
            dropdownSounds.add(new Option(fileName, absoluteFilePath))
        }

        dropdownSounds.value = settings.soundCue
        changeButtonsClickabilityBasedOnDropdownValue()

        console.log("Initialized HTML values")
    }

    // IPC renderer
    ipcRenderer.on("update-selected-sound-label",
        (event, soundBaseName, selectedSoundPath) => {
            const optionLabels = Array.from(dropdownSounds.options).map(opt => opt.text)

            if (!(optionLabels.includes(soundBaseName))) {
                dropdownSounds.add(new Option(soundBaseName, selectedSoundPath))
                dropdownSounds.value = selectedSoundPath
                changeButtonsClickabilityBasedOnDropdownValue()
            } else {
                ipcRenderer.send("show-error-file-already-on-list")
            }
        }
    )
})