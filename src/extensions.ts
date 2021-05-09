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

export {}