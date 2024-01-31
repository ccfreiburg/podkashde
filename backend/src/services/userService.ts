import { INVITE_TIME, INVITE_TOKEN, PWRESET_TIME } from '../tools/Configuration';
import * as jwt from '../jwt'
import { getExtQueryGen, getQueryGen, isUpdate, saveGen, updateGen } from './genericService';
import User from '../entities/User';

export async function getUserByEmail(email: string): Promise<User> {
    return getQueryGen(User , { email: email }) as Promise<User>;
}

export async function getUserByUserName(username: string): Promise<User> {
    return getQueryGen(User , { username: username } ) as Promise<User>;
}

export async function getUserById( id: number ): Promise<User> {
    return getQueryGen(User , { id: id }  )as Promise<User>;
}

export async function readUser(query): Promise<User> {
    var tmpQuery = {
    where: query,
    relations: ["sessions"],
    };
    var result = await getExtQueryGen(User, tmpQuery) as User;
    return result
}

export async function createUser(user: User) : Promise<User> {
    const id = await saveGen<User>(User, user);
    return { ...user, id } as User
}

export async function updateUser(user: User) : Promise<User> {
    const id = await updateGen<User>(User, user);
    return { ...user, id } as User
}


export async function createUserWithToken(data: User, type: string) : Promise<User> {
    var user = await getQueryGen(User, { username: data.username }) as User
    var id:number
    if (!user) {
        user = { ...data } as User;
        user.name = data.username
        user.email = ""
    }
    user.token = jwt.generateUrlToken( data.username, type, (type==INVITE_TOKEN?INVITE_TIME:PWRESET_TIME) )
    if (isUpdate(user))
        id = await updateGen<User>(User,user)
    else
        id = await saveGen<User>(User,user)
    return { ...user, id } as User
}

export function sanitizeUserForFrontend(user: User | undefined): User {

    if (!user) {
        return user
    }

    delete user.password
    delete user.sessions

    return user
}

