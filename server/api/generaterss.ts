import { defineEventHandler, sendError, createError, getQuery } from "h3";
import { generateFeed, readPodcast } from "../services/podcastService";

export default defineEventHandler( async (event) => {
  try {
    const query = getQuery(event);
    const podcast = await readPodcast(query)
    generateFeed(podcast)
    return true     
  } catch (error) {
    console.log("Hallo")
    sendError(event, createError({
      statusCode: 500,
      statusMessage: "Internal server error"}))
  }
});
  