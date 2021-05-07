import * as Path from "path";

const fs = require("fs")

export function readJson(path: string): any {
    return JSON.parse(fs.readFileSync(path))
}

export function writeJson(path: string, obj: object): void {
    fs.writeFileSync(path, JSON.stringify(obj,null, 2))
}

export function readJsonAsync(path: string): any {
    return JSON.parse(fs.readFile(path))
}

export function writeJsonAsync(path: string, obj: object): void {
    fs.writeFile(path, JSON.stringify(obj,null, 2))
}

export type Settings = {
    sipInterval: number,
    trayIcon: string,
    soundCue: string
}

export function getSettings(): Settings {
    return readJson("settings.json")
}

export function updateSettings(settings: Settings): void {
    writeJson(Path.join(__dirname, "../settings.json"), settings)
}