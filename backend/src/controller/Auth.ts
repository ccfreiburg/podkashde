import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import {
    createUserWithToken,
    getUserById,
  getUserByUserName,
  sanitizeUserForFrontend,
  updateUser,
} from "../services/userService";
import {
    decodeRefreshToken,
  decodeUrlToken,
  deleteRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  sendAuthToken,
  sendRefreshToken,
} from "../jwt";
import { createSession, getSessionByToken, removeOldSessions, removeSession } from "../services/sessionService";
import User from "../entities/User";
import { respond, sendResponse } from "../tools/Controller";

export async function getUserToken(request: Request, response: Response) {
    const user = await createUserWithToken({ username: request.query.username } as User, request.query.type as string);
    sendResponse( response, user.token)
}

export async function checkRefreshToken(request: Request, response: Response) {
  const refreshToken = request.body.refresh_token;
  if (!refreshToken)
    return respond(response, 400, {
      statusCode: 400,
      statusMessage: "No Refresh token",
    });

  const session = await getSessionByToken(refreshToken);

  if (!session) {
    return respond(response, 400, {
      statusCode: 400,
      statusMessage: "Refresh token is invalid",
    });
  }

  const token = decodeRefreshToken(refreshToken);
  if (!token) {
    const days = 14;
    const priorByDays = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    await removeOldSessions(priorByDays);
    deleteRefreshToken(response);

    return respond(response, 400, {
      statusCode: 403,
      statusMessage: "Session expired",
    });
  }

  try {
    const accessToken = generateAccessToken(token.userId);
    const user = sanitizeUserForFrontend(await getUserById(token.userId));
    user.token = accessToken;
    sendResponse( response, { refresh_token: refreshToken, access_token: accessToken, user });
  } catch (error) {
    return respond(response, 400, {
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
}

export async function setPassword(request: Request, response: Response) {
  var username: string = request.body.username;
  const password: string = request.body.password;
  const oldpassword: string = request.body.oldpassword;
  const token: string = request.body.token;
  var credentialValid = false;

  if (!((token && password) || (password && username && oldpassword))) {
    return respond(response, 400, {
      statusCode: 400,
      statusMessage: "Ivalid params",
    });
  }

  if (token) {
    const data = decodeUrlToken(token);
    username = data?.username;
    credentialValid = true;
  }

  const user = await getUserByUserName(username);
  if (!user) {
    return respond(response, 400, {
      statusCode: 400,
      statusMessage: "Username is invalid",
    });
  }

  if (!credentialValid && oldpassword)
    credentialValid = await bcrypt.compare(oldpassword, user.password);

  if (!credentialValid) {
    return respond(response, 400, {
      statusCode: 400,
      statusMessage: "Username or password is invalid",
    });
  }

  const salt = bcrypt.genSaltSync(5);
  user.password = bcrypt.hashSync(password, salt);
  await updateUser(user);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await createSession(refreshToken, user.id);
  sendRefreshToken(response, refreshToken);

  sendResponse( response, {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: sanitizeUserForFrontend(user),
  });
}

export async function checkToken(request: Request, response: Response) {
  const token = request.query.token as string;

  if (!token) {
    return respond(response, 400, {
      statusCode: 400,
      statusMessage: "Ivalid params",
    });
  }

  const data = decodeUrlToken(token);
  const user = await getUserByUserName(data?.username);

  if (!user) {
    return respond(response, 400, {
      statusCode: 400,
      statusMessage: "Username or password is invalid",
    });
  }

  return sendResponse( response, {
    access: data.purpose,
    user: sanitizeUserForFrontend(user),
  });
}

export async function login(request: Request, response: Response) : Promise<boolean> {
  const username: string = request.body.username;
  const password: string = request.body.password;

  if (!username || !password) {
    respond(response, 400, {
      statusCode: 400,
      statusMessage: "Ivalid params",
    });
    return false
  }

  const user = await getUserByUserName(username);

  if (!user) {
    respond(response, 400, {
      statusCode: 400,
      statusMessage: "Username or password is invalid",
    });
    return false;
  }
  const doesThePasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesThePasswordMatch) {
    respond(response, 400, {
      statusCode: 400,
      statusMessage: "Username or password is invalid",
    });
    return false;
  }

  const accessToken = generateAccessToken(user);
  user.token = accessToken;
  sendAuthToken(response, accessToken);
  
  const refreshToken = generateRefreshToken(user);
  await createSession(refreshToken, user.id);
  sendResponse( response, {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: sanitizeUserForFrontend(user),
  });
  return true;
}

export async function logout(request: Request, response: Response) {
    try {
        const refreshToken = request.body.refresh_token as string;
        await removeSession(refreshToken)
    } catch (error) { }

    return respond(response, 200,{ message: 'Done' })
}
