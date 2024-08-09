import { Express, Request, Response, NextFunction } from "express";
import {
  decodeAccessToken,
  decodeRefreshToken,
  decodeUrlToken,
  generateAccessToken,
  sendAuthToken,
} from "./jwt";
import { getUserById } from "./services/userService";
import { logger } from "./services/loggerService";
import { respond } from "./tools/Controller";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const dbg = 4
  var token = ""
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") && req.headers.authorization.length > 10 ) {
    logger( dbg, "Auth Middleware authorization " +  JSON.stringify(req.headers.authorization).substring(0,30));
    token = req.headers["authorization"]?.split(" ")[1];
    logger( dbg, "Auth Middleware token " +  JSON.stringify(token).substring(0,50) + ' ...')
  }
  var decoded = decodeAccessToken(token);
  logger( dbg, "Auth Middleware decoded token " + JSON.stringify(decoded?decoded:"decoding failed!").substring(0,30));
  if (!decoded && req.cookies) {
    logger( dbg, "Auth Middleware cookies " +  JSON.stringify(req.cookies).substring(0,50))
    token = req.cookies?.auth_token
    if (token)
      decoded = decodeAccessToken(token);
    logger( dbg, "Auth Middleware auth cookie decoded " + JSON.stringify(decoded?decoded:"decoding failed").substring(0,50));
  }
  if (!decoded && req.body) {
    token = req.body?.refresh_token
    if (token)
      decoded = decodeRefreshToken(token);
    logger( dbg, "Auth Middleware refresh token decoded " + JSON.stringify(decoded?decoded:"decoding failed").substring(0,50));
  }
  if (!decoded && req.query ) {
    logger( dbg, "Auth Middleware params " + JSON.stringify(req.query).substring(0,50));
    token = req.query.token as string
    if (token)
      decoded = decodeUrlToken(token);
  }
  if (!decoded && req.body ) {
    logger( dbg, "Auth Middleware params " + JSON.stringify(req.body).substring(0,50));
    token = req.body.token as string
    if (token)
      decoded = decodeUrlToken(token);
  }
  if (!decoded) {
    respond(res, 401, {
      statusCode: 401,
      message: "Unauthorized"
    })
  } else
    try {
      if (decoded.userId) {
        logger( dbg, "Auth Middleware try access " + JSON.stringify(decoded).substring(0,50));

        const userId = decoded.userId;
        logger( dbg, "Auth Middleware try get UserId " + JSON.stringify(userId).substring(0,30));

        const user = await getUserById(userId);
        logger( dbg, "Auth Middleware user " + JSON.stringify(user).substring(0,50));

        sendAuthToken(res, await generateAccessToken(user));
      }
      logger(4, "Auth... going on")
      next()
      return;
    } catch (error) {
      return respond(res, 401, {
        statusCode: 401,
        statusMessage: error.message,
      });
    }
}
