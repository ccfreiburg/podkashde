import { beforeAll, describe, expect, it } from "vitest";
import { generateRss, setTesting } from "../../base/RssGenerator";
import type {IPodcast} from "~~/base/types/IPodcast";
import xml2js from "xml2js"
import { FEED_SLUG, SERVER_IMG_PATH, SERVER_MP3_PATH } from "../../base/Constants";
import type {IEpisode} from "~~/base/types/IEpisode";

const BASE_URL = 'http://localhost:3000';
setTesting()

describe("RssFileGenerator", async () => {
  const fields : IPodcast = {
    title: "a",
    subtitle: "s",
    author: "b",
    description: "d",
    summary: "s",
    slug: "c",
    owner_name: "h",
    cover_file: "/covers/i",
    language_id: 1,
    category_id: 80,
    type_id: 1,
    owner_email: "a@b.cd",
    link: "http://a.bc",
    copyright: "c",
    explicit: false,
    state: -1,
    lastbuild: '',
  }
  const pubdate = new Date(2022,6,15,8,30)
  const episode : IEpisode = {
    image: SERVER_IMG_PATH+"eim",
    title: "eti",
    slug: "esl",
    keyword: "eke",
    subtitle: "esu",
    creator: "ecr",
    summary: "esm",
    description: "ede",
    block: false,
    explicit: false,
    link: SERVER_MP3_PATH+"eli",
    duration: 72,
    pubdate: pubdate,
    state: -1,
    serie_id: -1,
    lastbuild: "",
    rawsize: 43,
  }

  var parser = new xml2js.Parser()
  const enumFuncs = {
    getLanguage: (id:number) => (id==1?{shorttext: "de-DE"}:{shorttext: "en-EN"}),
    getGenre: (id:number) => (id==80?{parentCategory: "Sports", displaytext:"Hockey"}:{parentCategory: "Science", displaytext:"Nature"}),
    getType: (id:number) => (id==1?{shorttext: "episodic"}:{shorttext: "series"})
  }

  it("generateRss generates the namespaces", () => {
    //"xmlns:wfw": "http://wellformedweb.org/CommentAPI/",
    const expectations = {
      "version": "2.0",
	    "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
	    "xmlns:dc": "http://purl.org/dc/elements/1.1/",
	    "xmlns:atom": "http://www.w3.org/2005/Atom",
	    "xmlns:sy": "http://purl.org/rss/1.0/modules/syndication/",
	    "xmlns:slash": "http://purl.org/rss/1.0/modules/slash/",
	    "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
	    "xmlns:googleplay": "http://www.google.com/schemas/play-podcasts/1.0",
	    "xmlns:podcast": "https://podcastindex.org/namespace/1.0"
    }
    const rss = generateRss(fields, BASE_URL, enumFuncs);
    return parser.parseStringPromise(rss)
            .then( (result)=> {
                const namespaces = result.rss["$"]
                for( const key in expectations ) {
                  const expected = (expectations[key]) as string
                  expect(namespaces).toHaveProperty(key)                  
                  expect(namespaces[key]).toBe(expected)                  
                }
            })      
  })

  it("generateRss adds podcast channel info", () => {
//  OPEN in channel:
// <itunes:new-feed-url>
//   https://newlocation.com/example.rss
// </itunes:new-feed-url>
// <podcast:locked owner="ccf@ccfreiburg.de">yes</podcast:locked>
// <podcast:guid>bd4f4ece-3d3d-5b3d-9f24-4a081ee0d63d</podcast:guid>
    const rss = generateRss(fields,BASE_URL, enumFuncs);
    return parser.parseStringPromise(rss)
            .then( (result)=> {
              const date = new Date()
              const channel = result.rss.channel[0]
              expect(channel.title[0]).toBe(fields.title);    
              expect(channel.author[0]).toBe(fields.author);    
              expect(channel.link[0]).toBe(fields.link);    
              expect(channel.description[0]).toBe(fields.description);    
              expect(channel.lastBuildDate[0]).toContain(date.getFullYear().toString());    
              expect(channel.language[0]).toBe("de-DE");    
              expect(channel.copyright[0]).toBe(fields.copyright);
              expect(channel["itunes:subtitle"][0]).toBe(fields.subtitle);    
              expect(channel["itunes:author"][0]).toBe(fields.author);    
              expect(channel["itunes:summary"][0]).toBe(fields.summary);    
              expect(channel["itunes:owner"][0]["itunes:name"][0]).toBe(fields.owner_name);    
              expect(channel["itunes:owner"][0]["itunes:email"][0]).toBe(fields.owner_email);    
              expect(channel["itunes:category"][0]["$"].text).toBe("Sports");    
              expect(channel["itunes:category"][0]["itunes:category"][0]["$"].text).toBe("Hockey");    
              expect(channel["itunes:explicit"][0]).toBe("false");
              expect(channel["atom:link"][0]["$"].href).toBe(BASE_URL+FEED_SLUG+fields.slug+".xml");
              expect(channel["itunes:type"][0]).toBe("episodic");
            }) 
  })

  it("generateRss adds episode", () => {
    const podcast = { ...fields }
    podcast.episodes = [ episode ]
    const rss = generateRss(podcast, BASE_URL, enumFuncs);
    return parser.parseStringPromise(rss)
      .then( (result)=> {
          const item = result.rss.channel[0].item[0]
          expect(item.title[0]).toBe(episode.title)
          expect(item.link[0]).toBe(BASE_URL+"/"+episode.slug)
          expect(new Date(item.pubDate[0]).toISOString()).toBe(pubdate.toISOString())
          expect(item["dc:creator"][0]).toBe(episode.creator)
          expect(item.guid[0]["_"]).toBe(BASE_URL+"/"+episode.slug)
          expect(item.description[0]).toBe(episode.description)
          expect(item["itunes:subtitle"][0]).toBe(episode.subtitle);    
          //expect(item["itunes:keywords"][0]).toBe(episode.keyword);    
          expect(item["content:encoded"][0]).toBe(episode.description);    
          expect(item["enclosure"][0]["$"].url).toBe(BASE_URL+episode.link);    
          expect(item["enclosure"][0]["$"].length).toBe(episode.rawsize.toString());    
          expect(item["enclosure"][0]["$"].type).toBe("audio/mpeg");    
          expect(item["itunes:summary"][0]).toBe(episode.summary);    
          expect(item["itunes:image"][0]["$"].href).toBe(BASE_URL+episode.image);    
          expect(item["itunes:explicit"][0]).toBe("false");    
          expect(item["itunes:block"][0]).toBe("false");    
          expect(item["itunes:duration"][0]).toBe("00:01:12");    
          expect(item["itunes:author"][0]).toBe(episode.creator);    
          expect(item["googleplay:explicit"][0]).toBe("no");    
          expect(item["googleplay:block"][0]).toBe("no");    
          expect(item["googleplay:image"][0]["$"].href).toBe(BASE_URL+episode.image);    
          expect(item.image[0].url[0]).toBe(BASE_URL+episode.image)
          expect(item.image[0].title[0]).toBe(episode.title)
      })
  })

  it("generateRss adds multiple episodes", () => {
    const podcast = { ...fields }
    const episode2 = { ...episode }
    episode2.title = "HeyHo"
    podcast.episodes = [ episode, episode2 ]
    const rss = generateRss(podcast, BASE_URL, enumFuncs);
    return parser.parseStringPromise(rss)
      .then( (result)=> {
        const items = result.rss.channel[0].item
        expect(items).toHaveLength(2)
        expect(items[0].title[0]).toBe(episode.title)
        expect(items[1].title[0]).toBe(episode2.title)
      })
  })
})
