import { H3Event } from "h3"
import jwt from "jsonwebtoken"
import { IUser } from "~~/base/types/IUser"
import getSecSettings from "./security"

export const generateAccessToken = (user: IUser) => {

    return jwt.sign({ userId: user.id }, getSecSettings().JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '10m'
    })
}

export const generateRefreshToken = (user: IUser) => {

    return jwt.sign({ userId: user.id }, getSecSettings().JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '4h'
    })
}

export const generateUrlToken = (username: string, purpose: string, expiry: string) => {

    return jwt.sign({ username, purpose }, getSecSettings().JWT_URL_TOKEN_SECRET, {
        expiresIn: expiry
    })
}

export const decodeUrlToken = (token: string) : Object | null => {
    try {
        return jwt.verify(token, getSecSettings().JWT_URL_TOKEN_SECRET)
    } catch (error) {
        return null
    }
}

export const decodeRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, getSecSettings().JWT_REFRESH_TOKEN_SECRET)
    } catch (error) {
        return null
    }
}

export const decodeAccessToken = (token: string) => {
    try {
        return jwt.verify(token, getSecSettings().JWT_ACCESS_TOKEN_SECRET)
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