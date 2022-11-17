import { H3Event } from "h3"
import jwt from "jsonwebtoken"
import { IUser } from "~~/base/types/IUser"


export const generateAccessToken = (user: IUser) => {
    const config = useRuntimeConfig()

    return jwt.sign({ userId: user.id }, config.jwtAccessSecret, {
        expiresIn: '10m'
    })
}

export const generateRefreshToken = (user: IUser) => {
    const config = useRuntimeConfig()

    return jwt.sign({ userId: user.id }, config.jwtRefreshSecret, {
        expiresIn: '4h'
    })
}

export const generateUrlToken = (username: string, purpose: string, expiry: string) => {
    const config = useRuntimeConfig()

    return jwt.sign({ username, purpose }, config.jwtUrlSecret, {
        expiresIn: expiry
    })
}

export const decodeUrlToken = (token: string) : Object | null => {
    const config = useRuntimeConfig()

    try {
        return jwt.verify(token, config.jwtUrlSecret)
    } catch (error) {
        return null
    }
}

export const decodeRefreshToken = (token: string) => {
    const config = useRuntimeConfig()

    try {
        return jwt.verify(token, config.jwtRefreshSecret)
    } catch (error) {
        return null
    }
}

export const decodeAccessToken = (token: string) => {
    const config = useRuntimeConfig()

    try {
        return jwt.verify(token, config.jwtAccessSecret)
    } catch (error) {
        return null
    }
}

export const sendRefreshToken = (event: H3Event, token: string) => {
    setCookie(event, "refresh_token", token, {
        httpOnly: true,
        sameSite: true
    })
} 