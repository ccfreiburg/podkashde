import bcrypt from "bcrypt"
import { decodeUrlToken, generateAccessToken, generateRefreshToken, sendRefreshToken } from "../../jwt.js"
import { sendError } from "h3"
import { getUserByEmail, getUserByUserName, sanitizeUserForFrontend, updateUser } from "~~/server/services/userService.js"
import { createSession } from "~~/server/services/sessionService.js"
import User from "~~/server/db/entities/User.js"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    var username: string = body.username
    const password: string = body.password
    const oldpassword: string = body.oldpassword
    const token: string = body.token
    var credentialValid = false

    if (!((token && password) || (password && username && oldpassword))) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Ivalid params'
        }))
    }

    if (token) {
      const data = decodeUrlToken(token)
      username = data?.username
      credentialValid = true
    }

    const user = await getUserByUserName(username) as User
    if (!user) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Username is invalid'
        }))
    }

    if (!credentialValid && oldpassword)
      credentialValid = await bcrypt.compare(oldpassword, user.password)

    if (!credentialValid) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Username or password is invalid'
        }))
    }

    const salt = bcrypt.genSaltSync(5);
    user.password = bcrypt.hashSync(password, salt);
    await updateUser(user);
  
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    await createSession( refreshToken, user.id )
    sendRefreshToken(event, refreshToken)

    return {
        access_token: accessToken, user: sanitizeUserForFrontend(user)
    }
}) 