import { describe, expect, it } from "vitest";
import IEpisode from "../../base/types/IEpisode";
import IPodcast from "../../base/types/IPodcast";
import ISerie from "../../base/types/ISerie";
import validation from "../../base/DetailValidation";
import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from '../../base/Constants';

describe("DetailValidation", async () => {
  const fields = {
    title: "a",
    slug: "c",
    cover_file: "sdf"
  }
  it("validation returns no errors when title, slug and cover are non-emtpy and image size is right", () => {
    const actual = validation<ISerie>(fields,"serie",REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
    expect(actual.length).toBe(0);    
  })
  it("validation returns error when title is empty on serie", () => {
    const f = {
      slug: "c",
      cover_file: "sdf"
    }
    const actual = validation<ISerie>(f,"serie",REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
    expect(actual.length).toBe(1);    
    expect(actual[0].text).toBe("serie.validation.title");    
  })
  it("validation returns error when title is empty on podcast", () => {
    const f = {
      slug: "c",
      cover_file: "sdf"
    }
    const actual = validation<IPodcast>(f,"podcast",REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
    expect(actual.find((e)=>e.field=="title").text).toBe("podcast.validation.title");    
  })
  it("validation returns error when title is empty on episode", () => {
    const f = {
      slug: "c",
      cover_file: "sdf"
    }
    const actual = validation<IEpisode>(f,"episode",REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
    expect(actual.find((e)=>e.field=="title").text).toBe("episode.validation.title");    
  })


 });
