import "reflect-metadata";
import {createConnection} from "typeorm";
import {Request, Response} from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import {AppRoutes, AuthRoutes} from "./routes";
//import cors from 'cors';
import cors = require('cors');
import { logger, requestLoggerMiddleware } from "./services/loggerService";
import authMiddleware from "./authMiddleware";
import { NextFunction } from "express-serve-static-core";
import { initDataSource } from "./services/datasourceService";
const cookieParser = require('cookie-parser');
const proxy = require('express-http-proxy');

// create connection with database
initDataSource().then(() => {

    // create express app
    const app = express();
    app.use("/s", express.static('./public/s'));
    app.use("/img", express.static('./public/img'));
    app.use(bodyParser.json());
    app.use(cookieParser());
    
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.get('Origin') || 'http://localhost:3000');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Credentials, Authorization, Cookie, X-Requested-With, Range, refresh_token, Special-Request-Header');
        // if (req.method === 'OPTIONS') {
        //   return res.sendStatus(200);
        // } else {
        return next();
        // }
    });
    // register all application routes
    AppRoutes.forEach(route => {
        logger(3, "Adding free route " + route.method + " " + route.path)
        app[route.method](route.path, (request: Request, response: Response, next: NextFunction) => {
            requestLoggerMiddleware(request)
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    })
    AuthRoutes.forEach(route => {
        logger(3, "Adding restricted route " + route.method + " " + route.path)
        app[route.method](route.path, (request: Request, response: Response, next: NextFunction) => {
                requestLoggerMiddleware(request)
                authMiddleware(request,response, () => {
                    route.action(request, response)
                        .then(() => next)
                        .catch(err => next(err))
            });
        })
    })

    //app.use('/',proxy("http://localhost:3000"))

    // run app
    app.listen(3003);

    console.log("Express application is up and running on port 3003");

}).catch(error => console.log("TypeORM connection error: ", error));
