import id3 from 'node-id3'
import fs from 'fs'
import { dateToIsoString, durationInSecToStr } from '~~/base/Converters';
import IEpisode from '~~/base/types/IEpisode';
import IPodcast from '~~/base/types/IPodcast';
import ISerie from '~~/base/types/ISerie';
import { nuxtPath } from './services/podcastService';



function embedCoverImage (tags: id3.Tags, file: string) : id3.Tags {
  const buffer = fs.readFileSync(file)
  tags.image = {
    mime: "image/jpg",
    type: {
      id: 3,
      name: "front cover",
    },
    description: file,
    imageBuffer: buffer,
  }
  return tags
}

function getTagsFromPodcast( episode: IEpisode ) : id3.Tags {
  var tags: id3.Tags = {
    title: episode.title,
    artist: episode.creator,
    album: episode.serie?.title,
    partOfSet: episode.keyword,
    //genre: 'Christian',
    performerInfo: episode.podcast?.title,
    copyright: episode.podcast?.copyright,
    date: dateToIsoString(episode.pubdate),
    length: durationInSecToStr(episode.duration),
    size: episode.rawsize.toString(),
    comment: { language: '',  text: episode.description },
    publisherUrl: episode.podcast?.link,
    originalFilename: episode.slug,
  }
  return tags
}

export default function writeTags( episode: IEpisode ) : true|Error {
  var tags = getTagsFromPodcast(episode)
  tags = embedCoverImage(tags, nuxtPath(episode.image))
  try {
    const result = id3.write(tags, nuxtPath(episode.link))
    return result
  } catch(err) {
    console.log(err)
    return err
  }
}