import { IUser } from '~~/base/types/IUser';
import getDataSource from '../db/dbsigleton';
import User, { getUser } from '../db/entities/User';

export async function getUserByEmail(email: string): Promise<IUser> {
    return readUser( { email: email } );
}

export async function getUserByUserName(username: string): Promise<IUser> {
    return readUser( { username: username } );
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

export async function createUser(data: IUser) {
    const user = getUser(data);
    const db = await getDataSource();
    await db.manager.save(user);
    return user;
}

export async function validateUser(data: IUser) {

    const errors = []

    if (errors.length > 0) {

        return { hasErrors: true, errors }
    }

    return { hasErrors: false }
}

export function sanitizeUserForFrontend(user: IUser | undefined): IUser {

    if (!user) {
        return user
    }

    delete user.password;

    return user
}

