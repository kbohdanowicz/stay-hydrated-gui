import * as Path from "path"

const fs = require("fs")

export function readJsonSync(path: string): any {
    return JSON.parse(fs.readFileSync(path))
}

export function writeJsonSync(path: string, obj: object): void {
    fs.writeFileSync(path, JSON.stringify(obj,null, 2))
}

export function writeJsonAsync(path: string, obj: object): void {
    fs.writeFile(path, JSON.stringify(obj,null, 2))
}

export function getScriptDirectory(postfix: string): string {
    //console.log(Path.join(__dirname, path))
    return Path.join(__dirname, postfix)
}