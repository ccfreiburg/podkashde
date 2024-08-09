import { Request, Response } from "express";
import { migrateWpEpisode } from "../services/wpMigrationService";
import { respond } from "../tools/Controller";

export async function migrateEpisode(request: Request, response: Response) {
    try {
      const data = request.body;
      await migrateWpEpisode(data.episode, (data.podcastId?data.podcastId:0))
      respond(response, 201, { statusCode: 201, message: "Episode id=" + (data as any).id + " saved successfully" });
    } catch (err) {
      respond(response, 500, { statusCode: 500, message: err.message });
    }
  }