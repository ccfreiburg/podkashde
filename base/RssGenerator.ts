import { Podcast } from 'podcast';
import { BASE_URL, FEED_SLUG, SERVER_IMG_PATH, SERVER_MP3_PATH } from './Constants';
import { ContentFile } from './ContentFile';
import IPodcast from './types/IPodcast';

function serverUrl( episodeLink: string ) : string {
  if (ContentFile.isQualifiedUrl(episodeLink))
    return episodeLink;

  return BASE_URL + episodeLink;
}

export function generateRss( podcast: IPodcast, enumFuncs: any) : string {
  const feedOptions = {
    title: podcast.title,
    author: podcast.author,
    siteUrl: podcast.link,
    feedUrl: BASE_URL+FEED_SLUG+podcast.slug+".xml",
    docs: BASE_URL+"/"+podcast.slug,
    description: podcast.description,
    language: enumFuncs.getLanguage(podcast.language_id).shorttext,
    copyright: podcast.copyright,
    imageUrl: BASE_URL+podcast.cover_file,
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
    itunesImage: BASE_URL+podcast.cover_file,
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
  const feed = new Podcast(feedOptions)

  if (podcast.episodes) {
    podcast.episodes.forEach( (episode) => {
      feed.addItem({
        title: episode.title,
        description: episode.description,
        url: BASE_URL+"/"+episode.slug,
        guid: BASE_URL+"/"+episode.slug,
        author: episode.creator,
        date: episode.pubdate,
        enclosure: {
          url: serverUrl(episode.link),
          size: episode.rawsize,
          type: "audio/mpeg"
        },
        content: episode.description,
        itunesAuthor: episode.creator,
        itunesKeywords: episode.keyword,
        itunesExplicit: episode.explicit,
        itunesSubtitle: episode.subtitle,
        itunesSummary: episode.summary,
        itunesDuration: episode.duration,
        itunesImage: serverUrl(episode.image),
        customElements: [
          {"itunes:block" : episode.block },
          {"googleplay:image" : [ 
            {
              _attr: {
                "href": serverUrl(episode.image)
              }
            }]}, 
          {"googleplay:description" : episode.description},
          {"googleplay:block" : (episode.block?"yes":"no")},
          {"googleplay:explicit" : (episode.explicit?"yes":"no")},
          {"image": [{
              "url": serverUrl(episode.image)},
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

function isQualifiedUrl(episodeLink: string) {
  throw new Error('Function not implemented.');
}
