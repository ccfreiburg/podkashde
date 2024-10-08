import { Request, Response } from "express";
import { moveEpisode, saveEpisode } from "../services/episodeService";
import { respond } from "../tools/Controller";

export async function saveEpisodeAction(request: Request, response: Response) {
  try {
    const episode = await saveEpisode(request.body);
    respond(response, 201, { statusCode: 201, message: "Episode id=" + episode.id + " saved successfully", id: episode.id });
  } catch (err) {
    respond(response, 500, {  statusCode: 500, message: err.message });
  }
}

export async function moveEpisodeAction(request: Request, response: Response) {
  try {
    const { episode, podcast, serie } = request.body;
    const result = await moveEpisode(episode, podcast, serie);
    if (!result) respond(response, 500, { message: (result as any).message });
    respond(response, 201, { statusCode: 201, message: "Episode id=" + episode.id + " saved successfully" });
  } catch (err) {
    console.log(err)
    respond(response, 500, { statusCode: 500, message: err.message });
  }
}

