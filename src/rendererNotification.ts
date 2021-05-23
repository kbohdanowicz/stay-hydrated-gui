import "./extensions"
import {ipcRenderer} from "electron";
import Settings from "./Settings";

window.addEventListener("DOMContentLoaded", () => {
    const spanExit = document.getElementById("exit-button")!
    spanExit.addEventListener("click", () => {
        ipcRenderer.send("destroy-notification")
    })

    const img = document.createElement("img")
    img.setAttribute("src", Settings.get().notification.image)
    img.setAttribute("style", "border: solid gray;")
    document.body.appendChild(img)
})