import {Request, Response} from "express";
import Episode from "../entities/Episode";
import Serie from "../entities/Serie";
import { Not } from "typeorm";
import { getDbManager } from "../services/datasourceService";
import { sendResponse } from "../tools/Controller";
import Podcast from "../entities/Podcast";

/**
 * Loads all posts from the database.
 */
export async function count(request: Request, response: Response) {
    const query = Object.assign({},request.query)
    var result = 0;
    const q = {} 
    if (query?.hasOwnProperty('excludeId')) {
        const id = query['excludeId']
        q['id'] = Not(id)
    }
    if (query?.hasOwnProperty('id')) {
        q['id'] = query.id
    }
    if (query?.hasOwnProperty('slug')) {
        q['slug'] = query.slug
    }
    const manager = getDbManager()
    if (query?.hasOwnProperty('serie')) 
        result = await manager.countBy(Serie, q);
    else if (query?.hasOwnProperty('podcast')) 
        result = await manager.countBy(Podcast, q);
    else 
        result = await manager.countBy(Episode, q);
    return sendResponse( response, result.toString());
}