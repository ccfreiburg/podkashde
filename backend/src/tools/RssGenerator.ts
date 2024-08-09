import { Podcast as Podclass } from 'podcast';
import Podcast from '../entities/Podcast';
import { serverUrl } from './Urls';

var testing = false;
export function setTesting() { testing = true }


export function generateRss( podcast: Podcast, baseUrl: string, feedSlug: string, enumFuncs: any) : string {
  const feedOptions = {
    title: podcast.title,
    author: podcast.author,
    siteUrl: podcast.link,
    feedUrl: baseUrl+feedSlug+podcast.slug+".xml",
    docs: baseUrl+"/"+podcast.slug,
    description: podcast.description,
    language: enumFuncs.getLanguage(podcast.language_id).shorttext,
    copyright: podcast.copyright,
    imageUrl: baseUrl+podcast.cover_file,
    itunesSubtitle: podcast.subtitle,
    itunesAuthor: podcast.author,
    itunesSummary: podcast.summary,
    itunesOwner: { name: podcast.owner_name, email: podcast.owner_email },
    itunesExplicit: podcast.explicit,
    itunesCategory: [{
        text: enumFuncs.getGenre(podcast.category_id).parentCategory,
        subcats: [{
          text: enumFuncs.getGenre(podcast.category_id).displaytext
        }]
    }],
    itunesImage: baseUrl+podcast.cover_file,
    itunesType: enumFuncs.getType(podcast.type_id).shorttext,
    generator: "https://github.com/ccfreiburg/podkashde",
    customElements: [{
      "podcast:locked" : "yes",
      "podcast:guid": "bd4f4ece-3d3d-5b3d-9f24-4a081ee0d63d"
    }],
    customNamespaces: { 
      "sy": "http://purl.org/rss/1.0/modules/syndication/",
      "slash": "http://purl.org/rss/1.0/modules/slash/",
      "googleplay": "http://www.google.com/schemas/play-podcasts/1.0"
    }
  }
  const feed = new Podclass(feedOptions)

  if (podcast.episodes) {
    podcast.episodes.forEach( (episode) => {
      feed.addItem({
        title: episode.title,
        description: episode.description,
        url: baseUrl+"/"+episode.slug,
        guid: baseUrl+"/"+episode.slug,
        author: episode.creator,
        date: episode.pubdate,
        enclosure: {
          url: serverUrl(episode.link, baseUrl),
          size: episode.rawsize,
          type: "audio/mpeg"
        },
        content: episode.description,
        itunesAuthor: episode.creator,
        //itunesKeywords: episode.keyword,
        itunesExplicit: episode.explicit,
        itunesSubtitle: episode.subtitle,
        itunesSummary: episode.summary,
        itunesDuration: episode.duration,
        itunesImage: serverUrl(episode.image, baseUrl),
        customElements: [
          {"itunes:block" : episode.block },
          {"googleplay:image" : [ 
            {
              _attr: {
                "href": serverUrl(episode.image, baseUrl)
              }
            }]}, 
          {"googleplay:description" : episode.description},
          {"googleplay:block" : (episode.block?"yes":"no")},
          {"googleplay:explicit" : (episode.explicit?"yes":"no")},
          {"image": [{
              "url": serverUrl(episode.image, baseUrl)},
              {"title": episode.title
          }]}
          ]
        // itunesSeason:
        // itunesEpisode:
        // itunesNewFeedUrl:
      })
    })
  }

  return feed.buildXml(); 
}