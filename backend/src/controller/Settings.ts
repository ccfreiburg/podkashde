import * as fs from 'fs';
import { Request, Response } from "express";
import { DATA_PATH } from "../tools/Configuration";
import { sendResponse } from '../tools/Controller';

export async function getMetadata(request: Request, response: Response) {
    const locale = request.query.locale
    const meta = JSON.parse(fs.readFileSync(DATA_PATH + '/meta-'+locale+'.json',{encoding:'utf8', flag:'r'}));
    sendResponse( response, meta)
}