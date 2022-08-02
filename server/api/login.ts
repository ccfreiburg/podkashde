import { getUserByEmail, sanitizeUserForFrontend } from '~~/server/services/userService';
import bcrypt from 'bcrypt'
import { CompatibilityEvent, sendError } from "h3"
import { makeSession } from '~~/server/services/sessionService';
import { returnCode } from '../returncode';

export default defineEventHandler( async (event) => {
  const body = await useBody(event)
  const email: string = body.email
  const password: string = body.password
  const user = await getUserByEmail(email)

  if (user === null) {
    return returnCode( 401, 'Unauthenticated' )
  }

  const isPasswordCorrect = bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return returnCode( 401, 'Unauthenticated' )
  }


  await makeSession(user, event)

  return sanitizeUserForFrontend(user)
})
