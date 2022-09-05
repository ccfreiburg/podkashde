import { describe, expect, it } from "vitest";
import IEpisode from "../../base/types/IEpisode";
import validation from "../../base/EpisodeDetailValidation";
import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from '../../base/Constants';

describe("EpisodeDetailValidation", async () => {
  const fields : Partial<IEpisode> = {
    title: "a",
    creator: "b",
    slug: "c",
    duration: 0
  }
  it("validation returns no errors when title, creator, slug are non-emtpy and image size is right", () => {
    const actual = validation(fields,REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
    expect(actual.length).toBe(0);    
  })
  it("validation returns errors image size is wrong", () => {
    const actual = validation(fields, 0,REQUIRED_IMG_HEIGHT)
    expect(actual.length).toBe(1);    
  })
  it("validation returns errors image size is wrong", () => {
    const actual = validation(fields, REQUIRED_IMG_WIDTH, 0)
    expect(actual.length).toBe(1);    
  })
  it("validation returns errors on empty field object", () => {
    const actual = validation({},0,0)
    expect(actual.length).not.toBe(0);    
  })
  it.each([ 
    "slug","creator","title"])( 
    "validation returns errors on empty field object", 
    (fieldname) => {
      var fields_with_one_error = { ...fields }
      fields_with_one_error[fieldname] = "";
      const actual = validation(fields_with_one_error,REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
      expect(actual.length).toBe(1);    
      expect(actual[0].field).toEqual(fieldname);    
    });
 });
