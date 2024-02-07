import {Response} from "express";
import { logResponse, logger } from "../services/loggerService";

export function respond( response: Response, code: number, body: any ) {
    const cod = code || 500
    var bod = (body || {}) 
    response.status(cod).send(bod);
    logResponse(cod, bod)
}

export function sendResponse( response: Response, body: any ) {
    respond(response,200,body)
}

export function sendResponseCode( response: Response, code: number ) {
    respond(response,code, {})
}