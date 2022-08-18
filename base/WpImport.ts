import Enumerations, { EnumKey } from "./Enumerations";
import {ContentState} from "./types/ContentState"
import Episode, { getEpisode } from "~~/server/db/entities/Episode";
import Podcast, { setPodcast } from "~~/server/db/entities/Podcast";
import { strToDate } from "./Converters";
import IPodcast from "./types/IPodcast";
import IEpisode from "./types/IEpisode";
import IEnumerator from "./types/IEnumerator";
import ISerie from "./types/ISerie";

export function enumsfromWpMetadata(
  wpMetadataList,
  emumKey: EnumKey
): Array<IEnumerator> {
  var list = [] as Array<IEnumerator>;
  wpMetadataList.forEach((meta) => {
    list.push({
        displaytext: meta.name,
        shorttext: meta.slug,
        parentCategory: meta.taxonomy,
        enumkey_id: emumKey,
        enumvalue_id: meta.id,
      }
    );
  });
  return list;
}

export function seriesfromWpMetadata(wpMetadataList): Array<ISerie> {
  var list = [] as Array<ISerie>;
  wpMetadataList.forEach((meta) => {
    list.push({
        cover_file: meta.image,
        title: meta.name,
        slug: meta.slug,
        subtitle: meta.title,
        external_id: meta.id,
        description: '',
        state: ContentState.metadata,
      }
    );
  });
  return list;
}

export function allPodcastsFromWpMetadata(
  wpMetadataList,
  enumerations
): Array<IPodcast> {
  var list = [] as Array<IPodcast>;
  wpMetadataList.forEach((series) => {
    list.push(podcastFromWpMetadata(series,enumerations))
  })
  return list;
}

export function podcastFromWpMetadata(
  series,
  enumerations
): IPodcast {
  return {
        cover_file: series.image,
        title: series.name,
        slug: series.slug,
        subtitle: series.subtitle,
        author: series.author,
        summary: series.description,
        description: series.description,
        language_id: Enumerations.byShort(
          enumerations.languages,
          series.language
        ).enumvalue_id,
        category_id: Enumerations.byShort(
          enumerations.podcastGenres,
          series.category1.subcategory
        ).enumvalue_id,
        type_id: 1, //1=episodic,
        explicit: series.explicit_option != "",
        link: series.link,
        copyright: series.copyright,
        owner_name: series.owner_name,
        owner_email: series.owner_email,
        lastbuild: "0",
        state: ContentState.metadata,
        external_id: series.id,
      }
}


export function allEpisodesFromWpMetadata(
  wpMetadataList,
  wpPodcastId,
  podcastImage,
  enumerations
): Array<IEpisode> {
  var list = [] as Array<IEpisode>;
  wpMetadataList.forEach((episode) => {
    list.push(episodeFromWpMetadata(episode,wpPodcastId,podcastImage,enumerations))
  })
  return list;
}

export function episodeFromWpMetadata(
  episode,
  wpPodcastId,
  podcastImage,
  enumerations
): IEpisode {
    var seriesId = episode.series.find((serieId) => serieId != wpPodcastId);
    var pubdate = strToDate(episode.meta.date_recorded);
    var image = episode.meta.cover_image;
    if (image.length < 1) image = podcastImage;
    var postimage = image;
    if (
      episode.episode_featured_image &&
      episode.episode_featured_image.length > 0
    )
      postimage = episode.episode_featured_image;
    var keyword = Enumerations.byIdTextList(
      enumerations.tags,
      episode.tags.map((item) => item.id)
    );
    var creator = Enumerations.byIdOne(
      enumerations.authors,
      episode.speaker[0]
    ).displaytext;

    return {
        title: episode.title.rendered,
        slug: episode.slug,
        subtitle: episode.excerpt.rendered,
        summary: episode.excerpt.rendered,
        description: episode.content.rendered,
        explicit: episode.meta.explicit,
        block: episode.meta.block,
        link: episode.meta.audio_file,
        pubdate,
        duration: episode.meta.duration,
        image,
        postimage,
        rawsize: episode.meta.filesize_raw,
        state: 0,
        external_id: episode.id,
        ext_podcast_id: wpPodcastId,
        ext_series_id: seriesId,
        keyword,
        creator,
      }
}
