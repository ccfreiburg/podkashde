import {Request} from "express";

var loglevel = 3

export const logger = (level:number, message: string) => {
    if (level<=loglevel)
        console.log(new Date(), level+" "+message)
}

export function requestLoggerMiddleware(request: Request) {
    logger(2, request.method +" "+ request.url  + " " + request.headers.authorization?.substring(0,15)+ " " + JSON.stringify(request.cookies).substring(0,40))
}