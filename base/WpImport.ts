import { ContentState, Enumerations, EnumKey } from "~~/backend/Enumerations";
import { ENUMERATIONS_AP } from "./Constants";
import Episode, { getEpisode } from "./entities/Episode";
import Podcast, { getPodcast } from "./entities/Podcast";
import Serie, { getSerie } from "./entities/Serie";
import Enumerator, { getEnumerator } from "./entities/Enumerator";
import getDataSource from "./dbsigleton";
import { strToDate } from "./Converters";

export function enumsfromWpMetadata(
  wpMetadataList,
  emumKey: EnumKey
): Array<Enumerator> {
  var list = [] as Array<Enumerator>;
  wpMetadataList.forEach((meta) => {
    list.push(
      getEnumerator({
        displaytext: meta.name,
        shorttext: meta.slug,
        parentCategory: meta.taxonomy,
        enumkey_id: emumKey,
        enumvalue_id: meta.id,
      })
    );
  });
  return list;
}

export function seriesfromWpMetadata(wpMetadataList): Array<Serie> {
  var list = [] as Array<Serie>;
  wpMetadataList.forEach((meta) => {
    list.push(
      getSerie({
        cover_file: meta.image,
        title: meta.name,
        slug: meta.slug,
        subtitle: meta.title,
        external_id: meta.id,
        state: ContentState.metadata,
      })
    );
  });
  return list;
}

export function podcastsFromWpMetadata(
  wpMetadataList,
  enumerations
): Array<Podcast> {
  var list = [] as Array<Podcast>;
  wpMetadataList.forEach((series) => {
    list.push(
      getPodcast({
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
      })
    );
  });
  return list;
}

export function episodeFromWpMetadata(
  wpMetadataList,
  wpPodcastId,
  podcastImage,
  enumerations
): Array<Episode> {
  var list = [] as Array<Episode>;
  wpMetadataList.forEach((episode) => {
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

    list.push(
      getEpisode({
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
      })
    );
  });
  return list;
}
