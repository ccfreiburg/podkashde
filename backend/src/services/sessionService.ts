import {Request, Response} from "express";
import Session from '../entities/Session';
import User from '../entities/User';
import { generateAccessToken, sendAuthToken } from '../jwt';
import {MoreThan} from 'typeorm';
import { getUserById, sanitizeUserForFrontend } from './userService';
import { deleteGen, getExtQueryGen, saveGen } from './genericService';

export async function createSession( refreshToken: string, userId: number ) : Promise<Session> {
    const user = await getUserById(userId)
    const session = new Session()
    session.userId =  userId
    session.refreshToken = refreshToken
    session.user = user
    const id =  await saveGen<Session>(Session, session);
    return  { ...session, id } as Session
}

export async function readSession(query): Promise<Session> {
    var tmpQuery = {
        where: query,
        relations: ["user"],
    };
    return  await getExtQueryGen(Session,tmpQuery) as Session
}

export const removeSession = async (token: string) => {
    var tmpQuery = { refreshToken: token }
    return await deleteGen(Session,tmpQuery)
}
export const removeSessions = async (userId: number) => {
    var tmpQuery = { userId }
    return await deleteGen(Session, tmpQuery)
}
export const removeOldSessions = async (date: Date) => {
    var tmpQuery = { updatedAt: MoreThan(date) }
    return await deleteGen(Session, tmpQuery)
}

export async function getSessionByToken(token: string): Promise<Session> {
  return await readSession({refreshToken: token})
}

  
export async function makeSession(user: User, response: Response): Promise<User> {
    const authToken = generateAccessToken(user)
    const refreshToken = generateAccessToken(user)
    const session = await createSession(authToken, user.id)
    const userId = session.userId

    if (userId) {
        sendAuthToken( response, authToken )
        return getUserBySessionToken(authToken)
    }

    throw Error('Error Creating Session')
}

export async function getUserBySessionToken(authToken: string): Promise<User> {
    const session = await getSessionByToken(authToken)
    if (!session)
        return null
    return sanitizeUserForFrontend(session.user)
}

export async function checkAuthentication(authToken: string, maxAgeInMin) : Promise<boolean> {
    const session = await readSession({authToken: authToken})
    if (!session)
        return false;
    if (maxAgeInMin<1)
        return true;
    const creation = new Date(session.createdAt);
    const age = Date.now().valueOf() - creation.valueOf();
    return (age/60000) < maxAgeInMin;
}
