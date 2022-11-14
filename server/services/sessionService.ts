import { getUserById, sanitizeUserForFrontend } from '~~/server/services/userService';
import ISession from '~~/base/types/ISession';
import { IUser } from '~~/base/types/IUser';
import getDataSource from '../db/dbsigleton';
import Session, { getSession } from '../db/entities/Session';
import { generateAccessToken } from '../jwt';


export async function createSession( refreshToken: string, userId: number ) : Promise<ISession> {
    const user = await getUserById(userId)
    const session = getSession({ userId, refreshToken });
    const db = await getDataSource();
    await db.manager.save(session);
    return session as ISession;
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

export const removeSession = async (token: string) => {
    const db = await getDataSource();
    const repo = db.getRepository(Session);
    var tmpQuery = {
        where: {
            refreshToken: token
        }
    };
    const result = await repo.delete(tmpQuery)
}

export async function getSessionByToken(token: string): Promise<ISession> {
  return await readSession({refreshToken: token})
}

export async function makeSession(user: IUser, event: CompatibilityEvent): Promise<IUser> {
    const authToken = generateAccessToken(user)
    const refreshToken = generateAccessToken(user)
    const session = await createSession({ authToken, userId: user.id })
    const userId = session.userId

    if (userId) {
        setCookie(event, 'auth_token', authToken, { path: '/', httpOnly: true, sameSite: true })
        return getUserBySessionToken(authToken)
    }

    throw Error('Error Creating Session')
}

export async function getUserBySessionToken(authToken: string): Promise<IUser> {
    const session = await getSessionByAuthToken(authToken)
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
