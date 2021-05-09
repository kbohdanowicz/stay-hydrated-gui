export class ISettings {
    sipInterval: number
    trayIcon: string
    soundCue: string
    soundsDirectory: string
    volume: number
    isFirstRun: boolean
    notification: {
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
    volume?: number,
    isFirstRun?: boolean
    notification?: {
        enabled?: boolean
        positionX?: string
        positionY?: string
        duration?: number
    }
}