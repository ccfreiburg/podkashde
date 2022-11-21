import { defineEventHandler } from "h3";
import IPodcast from "../../base/types/IPodcast";
import Episode from "../db/entities/Episode";
import Podcast from "../db/entities/Podcast";
import { readPodcast, readPodcasts } from "../services/podcastService";


function mockreadPodcasts(query) : Array<IPodcast> {
    const d = new Date();
    var ret = new Podcast()
    ret.id = 1,
    ret.cover_file = "";
    ret.title = "Title test ";
    ret.author = "Author";
    ret.slug = "test";
    ret.category_id = 7;
    ret.language_id = 1;
    ret.episodes = [ new Episode() ];
    ret.episodes[0].title = "Episode Title";
    ret.episodes[0].pubdate = d;
    var ret2 = { ...ret }
    ret2.title = "Title 2 test ";
    ret2.slug = "test2";
    return [ret, ret2]
}

export default defineEventHandler((event) => {
    return readPodcasts();
    //return mockreadPodcasts(query)
  });
  