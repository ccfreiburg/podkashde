import {Response} from "express";
import { logger } from "../services/loggerService";

export function respond( response: Response, code: number, body: any ) {
    const cod = code || 500
    var bod = (body || {}) 
    logger(2, "response code: " +cod+ " body " + JSON.stringify(bod).substring(0, 50) + "  ... ")
    response.status(cod).send(bod);
}

export function sendResponse( response: Response, body: any ) {
    respond(response,200,body)
}

export function sendResponseCode( response: Response, code: number ) {
    respond(response,code, {})
}