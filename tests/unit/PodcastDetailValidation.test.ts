import { describe, expect, it } from "vitest";
import type {IPodcast} from "../../base/types/IPodcast";
import validation from "../../base/PodcastDetailValidation";
import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from '../../base/Constants';

describe("PodcastDetailValidation", async () => {
  const fields : Partial<IPodcast> = {
    title: "a",
    author: "b",
    slug: "c",
    owner_name: "h",
    cover_file: "i",
    language_id: 1,
    category_id: 1,
    type_id: 1,
    owner_email: "a@b.cd",
    link: "http://a.bc"
  }
  it("validation returns no errors when all is right", () => {
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
    "slug","author","title"])( 
    "validation returns errors on empty field object", 
    (fieldname) => {
      var fields_with_one_error = { ...fields }
      fields_with_one_error[fieldname] = "";
      const actual = validation(fields_with_one_error,REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
      expect(actual.length).toBe(1);    
      expect(actual[0].field).toEqual(fieldname);    
    });
    it.each([ 
      "adsadsfsdf", "a@", "b@c.d", "ab.de", "https://sgdas.de"
      ])( 
      "validation of emailwrongly formatted addresses", 
      (value) => {
        var fields_with_one_error = { ...fields }
        fields_with_one_error.owner_email = value;
        const actual = validation(fields_with_one_error,REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
        expect(actual.length).toBe(1);    
        expect(actual[0].field).toEqual("owner_email");    
      });
      it.each([ 
        "http://adf.d", "adsadsfsdf", "b@c.de", "http-dsagtd", "https-dsag.de", "https://"
        ])( 
        "validation of url wrongly formatted", 
        (value) => {
          var fields_with_one_error = { ...fields }
          fields_with_one_error.link = value;
          const actual = validation(fields_with_one_error,REQUIRED_IMG_WIDTH,REQUIRED_IMG_HEIGHT)
          expect(actual.length).toBe(1);    
          expect(actual[0].field).toEqual("link");    
        });
    
 });
