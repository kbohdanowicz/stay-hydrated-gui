export class ISettings {
    sipInterval: number
    trayIcon: string
    soundCue: string
    soundsDirectory: string
    imagesDirectory: string
    volume: number
    isFirstRun: boolean
    notification: {
        image: string
        enabled: boolean
        positionX: string
        positionY: string
        duration: number
    }
}

export interface UpdateSettingsArgs {
    sipInterval?: number
    trayIcon?: string
    soundCue?: string
    soundsDirectory?: string
    imagesDirectory?: string
    volume?: number,
    isFirstRun?: boolean
    notification?: {
        image?: string
        enabled?: boolean
        positionX?: string
        positionY?: string
        duration?: number
    }
}