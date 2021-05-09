import {ISettings} from "./types";

declare global {
    interface Number {
        run(block: (it: number) => void): void
    }
    interface String {
        run(block: (it: string) => void): void
    }
    interface Boolean {
        run(block: (it: string) => void): void
    }
    interface Object {
        run(block: (it: object) => void): void
    }
    interface ISettings {
        run(block: (it: ISettings) => void): void
    }
}

Number.prototype.run = function (block: (it: number) => void): void {
    block(this)
}

String.prototype.run = function (block: (it: string) => void): void {
    block(this)
}

Boolean.prototype.run = function (block: (it: string) => void): void {
    block(this)
}

ISettings.prototype.run = function (block: (it: ISettings) => void): void {
    block(this)
}

export {}