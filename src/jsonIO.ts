import * as Path from "path"

const fs = require("fs")

export function readJsonSync(path: string): any {
    return JSON.parse(fs.readFileSync(path))
}

export function writeJsonSync(path: string, obj: object): void {
    fs.writeFileSync(path, JSON.stringify(obj,null, 2))
}

export function readJsonAsync(path: string): any {
    return JSON.parse(fs.readFile(path))
}

export function writeJsonAsync(path: string, obj: object): void {
    fs.writeFile(path, JSON.stringify(obj,null, 2))
}

export function getThisDirPathWith(path: string): string {
    return Path.join(__dirname, path)
}