export interface User {
    username: string
    email: string
    profilePicture?: string
}

export interface HueBridge {
    id: string
    ip: string
    user: string
}