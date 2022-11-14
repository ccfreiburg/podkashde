import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from "../../jwt.js"
import { sendError } from "h3"
import { getUserByEmail, sanitizeUserForFrontend } from "~~/server/services/userService.js"
import { createSession } from "~~/server/services/sessionService.js"

export default defineEventHandler(async (event) => {
    const body = await useBody(event)
    const email: string = body.email
    const password: string = body.password
    
    if (!email || !password) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Ivalid params'
        }))
    }

    const user = await getUserByEmail(email)

    if (!user) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Username or password is invalid'
        }))
    }

    const doesThePasswordMatch = await bcrypt.compare(password, user.password)

    if (!doesThePasswordMatch) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Username or password is invalid'
        }))
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    console.log(refreshToken)
    await createSession( refreshToken, user.id )

    sendRefreshToken(event, refreshToken)

    return {
        access_token: "accessToken", user: sanitizeUserForFrontend(user)
    }

}) 