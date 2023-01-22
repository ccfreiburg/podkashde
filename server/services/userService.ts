import { I } from 'vitest/dist/global-fe52f84b';
import { INVITE_TIME, INVITE_TOKEN, PWRESET_TIME } from '~~/base/Constants';
import { IUser } from '~~/base/types/IUser';
import getDataSource from '../db/dbsigleton';
import User, { getUser } from '../db/entities/User';
import { generateUrlToken } from '../jwt';

export async function getUserByEmail(email: string): Promise<IUser> {
    return readUser( { email: email } );
}

export async function getUserByUserName(username: string): Promise<IUser> {
    return readUser( { username: username } );
}

export async function getUserById( id: number ): Promise<IUser> {
    return readUser( { id: id } );
}

export async function readUser(query): Promise<IUser> {
    const db = await getDataSource();
    const repo = db.getRepository(User);
    var tmpQuery = {
    where: query,
    relations: ["sessions"],
    };
    var result:Array<User> = await repo.find(tmpQuery);
    return result.pop()
}

export async function createUser(data: IUser) : Promise<IUser> {
    const user = getUser(data);
    const db = await getDataSource();
    await db.manager.save(user);
    return user;
}

export async function updateUser(data: User) {
    const db = await getDataSource();
    await db.manager.save(data);
}


export async function createUserWithToken(data: IUser, type: string) : Promise<IUser> {
    var user = await readUser({ username: data.username }) as User
    if (!user)
        user = getUser(data);
    user.token = generateUrlToken( data.username, type, (type==INVITE_TOKEN?INVITE_TIME:PWRESET_TIME) )
    const db = await getDataSource();
    await db.manager.save(user);
    return user;
}

export function sanitizeUserForFrontend(user: IUser | undefined): IUser {

    if (!user) {
        return user
    }

    delete user.password
    delete user.sessions

    return user
}

