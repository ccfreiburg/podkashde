import { Response} from "express";
import * as jwt from "jsonwebtoken"
import User from "./entities/User"
import { getTokenSecret } from "./tools/Configuration";

export const generateAccessToken = (user: User) => {

    return jwt.sign({ userId: user.id }, getTokenSecret( "ACCESS" ), {
        expiresIn: '10m'
    })
}

export const generateRefreshToken = (user: User) => {

    return jwt.sign({ userId: user.id }, getTokenSecret( "REFRESH" ), {
        expiresIn: '2d'
    })
}

export const generateUrlToken = (username: string, purpose: string, expiry: string) => {

    return jwt.sign({ username, purpose }, getTokenSecret( "URL" ), {
        expiresIn: expiry
    })
}

export const decodeUrlToken = (token: string) : { purpose: string, username: string } | null => {
    try {
        return jwt.verify(token, getTokenSecret( "URL" ))
    } catch (error) {
        return null
    }
}

export const decodeRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, getTokenSecret( "REFRESH" ))
    } catch (error) {
        return null
    }
}

export const decodeAccessToken = (token: string) => {
    try {
        return jwt.verify(token, getTokenSecret( "ACCESS" ))
    } catch (error) {
        return null
    }
}

export const sendRefreshToken = (response: Response, token: string) => {
    response.cookie('refresh_token', token, { path: '/', httpOnly: true, sameSite: true, domain: 'localhost:3003' })
} 

export const deleteRefreshToken = (response: Response) => {
    response.clearCookie('refresh_token')
} 

export const sendAuthToken = (response: Response, token: string) => {
    response.cookie('auth_token', token, { path: '/', httpOnly: true, sameSite: true, domain: 'localhost:3003' })
} 

export const deleteAuthToken = (response: Response) => {
    response.clearCookie('auth_token')
} 

