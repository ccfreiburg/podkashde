import { readUser, sanitizeUserForFrontend } from '~~/server/services/userService';
import { CompatibilityEvent } from "h3"
import { v4 as uuidv4 } from 'uuid'
import ISession from '~~/base/types/ISession';
import { IUser } from '~~/base/types/IUser';
import getDataSource from '../db/dbsigleton';
import Session, { getSession } from '../db/entities/Session';


export async function createSession(data: ISession) {
    var dto = { ... data }
    if (data.userId) 
        dto.user = await readUser({ id: data.userId })
    const session = getSession(dto);
    const db = await getDataSource();
    await db.manager.save(session);
    return session;
}

export async function readSession(query): Promise<ISession> {
    const db = await getDataSource();
    const repo = db.getRepository(Session);
    var tmpQuery = {
        where: query,
        relations: ["user"],
    };
    var result:Array<ISession> = await repo.find(tmpQuery);
    return result.pop()
}

export async function getSessionByAuthToken(authToken: string): Promise<ISession> {
  const session = await readSession({authToken: authToken})

  return { authToken, user: session.user }
}

export async function makeSession(user: IUser, event: CompatibilityEvent): Promise<IUser> {
    const regex = /-/g;
    const authToken = uuidv4().replace(regex, '')
    const session = await createSession({ authToken, userId: user.id })
    const userId = session.userId

    if (userId) {
        setCookie(event, 'auth_token', authToken, { path: '/', httpOnly: true })
        return getUserBySessionToken(authToken)
    }

    throw Error('Error Creating Session')
}

export async function getUserBySessionToken(authToken: string): Promise<IUser> {
    const session = await getSessionByAuthToken(authToken)
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