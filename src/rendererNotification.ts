import "./extensions"
import {ipcRenderer} from "electron";

window.addEventListener("DOMContentLoaded", () => {
    const spanExit = document.getElementById("exit-button")!
    spanExit.addEventListener("click", () => {
        ipcRenderer.send("destroy-notification")
    })
})