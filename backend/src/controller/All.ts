import {Request, Response} from "express";
import { deleteGen, deleteIdGen, getAllGen, getExtManyGen, getExtQueryAllGen, getExtQueryGen, isUpdate, saveGen, updateGen } from "../services/genericService";
import { respond, sendResponse } from "../tools/Controller";

/**
 * Loads all posts from the database.
 */

export async function getExtMany(T: any, relations: Array<string>, request: Request, response: Response) {
    var tmpQuery = {
        where: request.query,
        relations: relations,
    };
    sendResponse( response, await getExtManyGen(T, tmpQuery));
}

export async function getAll(T: any, request: Request, response: Response) {
    sendResponse( response, await getAllGen(T));
}

export async function getExtQuery(T: any, extQuery: any, request: Request, response: Response) {
    sendResponse( response, await getExtQueryGen(T, extQuery));
}

export async function getExtQueryAll(T: any, extQuery: any, request: Request, response: Response) {
    sendResponse( response, await getExtQueryAllGen(T, extQuery));
}


export async function getQuery(T: any, relations: Array<string>, request: Request, response: Response) {

    var tmpQuery = {
        where: request.query,
        relations: relations,
      };
    sendResponse( response, await getExtQueryGen(T, tmpQuery));
}

export async function deleteQuery(T: any,request: Request, response: Response) {

    if (await deleteGen(T, request.body))
        respond(response, 201, {statusCode: 201, message: JSON.stringify(request.body) +" deleted successfully"})
    else 
        respond(response, 500, {statusCode: 500, message: "Delete did not work"});
}

export async function saveOne<T>(T: any, data: any ) : Promise<number | undefined> {
    var id: number | undefined = undefined
    if( isUpdate(data) )
        id = await updateGen(T, data)
    else 
        id = await saveGen<T>(T, data)
    return id
}

export async function simpleSave<T>(T: any, request: Request, response: Response) {
    try {
        var data = {... request.body} as T;
        const id = await saveOne<T>(T,data)
        if (id)
            respond(response, 201, {statusCode: 201, message: "id="+id+" saved successfully", id})
        else
            respond(response, 500, {statusCode: 500, message: "id="+id+" problem", id})
    } catch(err) {
        respond(response, 500, {statusCode: 500, message: err.message});
    }
}

export async function simpleSaveMultiple<T>(T: any, request: Request, response: Response) {
    try {
        var data = request.body as Array<T>;
        const len = data.length
        var ids = new Array<number>()
        for await (const item of data) {
            const id = await saveOne<T>(T,item)
            if (id)
                ids.push(id)
        }
        if (ids.length==len)
            respond(response, 201, {statusCode: 201, message: JSON.stringify(ids) + " ids saved successfully"})
        else
            respond(response, 500, {statusCode: 500, message: "Not all ids saved"})
    } catch(err) {
        respond(response, 500, {statusCode: 500, message: err.message});
    }
}