import * as id3 from 'node-id3'
import * as fs from 'fs'
import { dateToIsoString, durationInSecToStr } from './Converters';
import { dataPath } from './DataFiles';
import Episode from '../entities/Episode';

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

function getTagsFromPodcast( episode: Episode ) : id3.Tags {
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

export default function writeTags( episode: Episode ) : true|Error {
  var tags = getTagsFromPodcast(episode)
  const imgpath = dataPath(episode.image)
  const mp3path = dataPath(episode.link)
  tags = embedCoverImage(tags, imgpath)
  try {
    const result = id3.write(tags, mp3path)
    return result
  } catch(err) {
    console.log(err)
    return err
  }
}