import { ObjectLiteral, UpdateResult } from "typeorm";
import getRepository, { getDbManager } from "./datasourceService";
import { logger } from "./loggerService";



export async function getAllGen(T: any) : Promise<ObjectLiteral> {

    const repository = getRepository(T);
    return await repository.find();
}

export async function getExtManyGen(T: any, extQuery: any) : Promise<ObjectLiteral> {

    // get a post repository to perform operations with post
    const repository = getRepository(T);

    // load posts
    return await repository.find(extQuery);
}

export async function getExtQueryGen(T: any, extQuery: any) : Promise<ObjectLiteral> {

    // get a post repository to perform operations with post
    const repository = getRepository(T);

    // load posts
    return await repository.findOne(extQuery);
}

export async function getExtQueryAllGen(T: any, extQuery: any) : Promise<Array<ObjectLiteral>> {

    // get a post repository to perform operations with post
    const repository = getRepository(T);

    // load posts
    return await repository.find(extQuery);
}


export async function getQueryGen(T: any, query: any) : Promise<ObjectLiteral> {

    // get a post repository to perform operations with post
    const repository = getRepository(T);

    // load posts
    return await repository.findOne({ where: query});
}

export async function getByIdGen(T: any, id: number) : Promise<ObjectLiteral> {

    // get a post repository to perform operations with post
    const repository = getRepository(T);

    // load posts
    return await repository.findOne({ where: { id }});
}

export async function deleteIdGen(T: any, id: number) : Promise<Boolean> {

    const manager = getDbManager();
    const result = await manager.softDelete(T, id);
    return (result && result.affected == 1)
}

export async function deleteGen(T: any, query: ObjectLiteral) : Promise<Boolean> {
    const manager = getDbManager();
    const result = await manager.softDelete(T,query);
    return (result && result.affected >= 1)
}

export function isUpdate(podcastObject: any): Boolean {
    if (!podcastObject) return false;
    var isupdate: Boolean = 'id' in podcastObject;
    if (isupdate) isupdate = podcastObject.id as number > 0;
    return isupdate;
};

export async function saveGen<T>( T: any, object: T ): Promise<number|undefined> {
    var entity = getDbManager().create(T, object ) as T
    const res = await getDbManager().insert(T,entity);
    return (res.identifiers && res.identifiers[0]?res.identifiers[0].id:undefined)
};
  
  export async function updateGen<T>(T: any, object: T) : Promise<number | undefined> {
    const res = await getDbManager().update(T, (object as any).id, object);
    return (res.affected && res.affected==1?(object as any).id:undefined)
};

