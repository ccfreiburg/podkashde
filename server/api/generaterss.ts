import { defineEventHandler, sendError, createError, getQuery } from "h3";
import { useSettings } from "~~/composables/settingsdata";
import { generateFeed, readPodcast } from "../services/podcastService";
import getSettings from "../settings";

export default defineEventHandler( async (event) => {
  try {
    const query = getQuery(event);
    const podcast = await readPodcast(query)
    const settings = getSettings();
 
    generateFeed(podcast, settings.baseUrl)
    return true     
  } catch (error) {
    console.log("Hallo")
    sendError(event, createError({
      statusCode: 500,
      statusMessage: "Internal server error"}))
  }
});
  