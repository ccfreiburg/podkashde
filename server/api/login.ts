import { getUserByEmail, sanitizeUserForFrontend } from '~~/server/services/userService';
import bcrypt from 'bcrypt'
import { sendError } from "h3"
import { makeSession } from '~~/server/services/sessionService';

export default defineEventHandler( async (event) => {
  const body = await useBody(event)
  const email: string = body.email
  const password: string = body.password
  const user = await getUserByEmail(email)

  if (user === null) {
    sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthenticated' }))
  }

  const isPasswordCorrect = bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthenticated' }))
  }


  await makeSession(user, event)

  return sanitizeUserForFrontend(user)
})
