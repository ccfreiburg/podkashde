import {Request, Response} from "express";
import * as fs from 'fs'
import { getRandomFileName } from "../tools/DataFiles";

const recorder = false

var loglevel = 2

export const deleteOldTempFiles = (directory: string, ageInMinutes: number) => {
    fs.readdirSync(directory).forEach(file => {
        const isOlder = fs.statSync(directory+file).ctime.getTime() < (Date.now() - ageInMinutes * 60000) 
        if (isOlder) {
          fs.unlinkSync(directory+file)
        } 
      
      })
}

export const logger = (level:number, message: string) => {
    if (level<=loglevel)
        console.log(new Date(), level+" "+message)
}

export function logResponse(response: Response, code: number, body: any) {
    logger(2, "response code: " +code+ " body " + JSON.stringify(body).substring(0, 50) + "  ... ")
    if (code>=200 && code<400 && recorder) {
        fs.writeFileSync('./data/responses/'+response.req.method+'-'+response.req.url.split('/')[2]+'-'+getRandomFileName()+".json", JSON.stringify(body))
        deleteOldTempFiles('./data/responses/',5)
    }
}

export function requestLoggerMiddleware(request: Request) {
    logger(2, request.method +" "+ request.url  + " " + request.headers.authorization?.substring(0,15)+ " " + JSON.stringify(request.cookies).substring(0,40))
    if (recorder) {
        const data = {
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: (request.url.startsWith('/api/upload')?'uploadData':request.body)
        }
        fs.writeFileSync('./data/requests/'+request.method+'-'+request.url.split('/')[2]+'-'+getRandomFileName()+".json", JSON.stringify(data))
        deleteOldTempFiles('./data/requests/',5)
    }
}