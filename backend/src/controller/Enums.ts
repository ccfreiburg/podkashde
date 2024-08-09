import {Request, Response} from "express";
import Enumerator from "../entities/Enumerator";
import { sendResponse } from "../tools/Controller";
import getRepository from "../services/datasourceService";

export async function setEnums(request: Request, response: Response) {

    const repository = getRepository(Enumerator)

    repository.save<Enumerator>(request.body.map((item) => item));

    // load posts
    const enums = await repository.find();

    // return loaded posts
    sendResponse( response, { statusCode: 201, message: "enums saved"});
}
