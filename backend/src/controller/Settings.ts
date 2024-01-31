import * as fs from 'fs';
import { Request, Response } from "express";
import { DATA_PATH } from "../tools/Configuration";
import { sendResponse } from '../tools/Controller';

export async function getMetadata(request: Request, response: Response) {
    const meta = JSON.parse(fs.readFileSync(DATA_PATH + '/meta-de.json',{encoding:'utf8', flag:'r'}));
    const ext = JSON.parse(fs.readFileSync(DATA_PATH + '/menu-ext-de.json',{encoding:'utf8', flag:'r'}));
    meta.menu = ext.menu;
    sendResponse( response, meta)
}