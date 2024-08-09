import Serie from "../entities/Serie";
import { setLastAndFirst } from "../services/serieService";
import { simpleSave } from "./All";
import {Request, Response} from "express";
import { respond } from "../tools/Controller";

export async function updateSerieAfterEpisodeChange(request: Request, response: Response) {
  try {
    const body = request.body as any;
    if (body.hasOwnProperty('id')) {
      if (body.hasOwnProperty('title')) {
        simpleSave<Serie>(Serie, request, response)
      } else {
        var slug = await setLastAndFirst(body.id)
        respond(response,200,slug)
      }
    } else
    return respond(response, 501, "nd data");
  } catch (err) {
    return respond(response, 500, err.message);
  }
}