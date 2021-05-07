import { getSettings, updateSettings } from "./jsonIO"

window.addEventListener("DOMContentLoaded", () => {

    const slider = (document.getElementById("slider") as HTMLInputElement)
    const sliderValueLabel = document.getElementById("sliderValueLabel")!

    const sixtySeconds = 1000 * 60

    function updateSipInterval(): void {
        const minutes = Number(slider.value)
        const settings = getSettings()
        settings.sipInterval = sixtySeconds * minutes
        updateSettings(settings)

    }

    slider.addEventListener("change", updateSipInterval)
    slider.addEventListener("input", () => {
        sliderValueLabel.innerText = String(slider.value)
    })
    slider.value = String(getSettings().sipInterval / sixtySeconds)
})