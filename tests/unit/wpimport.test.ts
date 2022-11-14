import { describe, expect, it } from "vitest";
import { autorFromDescription, linkFromDescription, verseFromDescription } from "../../base/WpImport";

const link1 = "https://youtu.be/ZDU-7IY0GeE"
const autor1 = "Samuel Garrard"
const input1 = "<p>Verschiedene Bibelstellen // "+autor1+" // <a href=\""+link1+"\">Video Version</a></p>\n"
const input2 = "<p>John 15:12-17 // Brandon Barger // <a href=\\\"https://www.youtube.com/watch?v=kAAEGFDNg_w\\\">Video Version</a></p>\n"
describe("ContentFile", () => {
  it ("linkFromDescription empty returns empty string", () => {
    let actual = linkFromDescription("")
    expect(actual).toBe("")
  })
  it ("linkFromDescription input1 returns link", () => {
    let actual = linkFromDescription(input1,"[Vv]ideo")
    expect(actual).toBe(link1)
  })
  it ("autorFromDescription input1 returns autor", () => {
    let actual = autorFromDescription(input1)
    expect(actual).toBe(autor1)
  })
  it ("linkFromDescription input2 returns link", () => {
    let actual = linkFromDescription(input2,"[Vv]ideo")
    expect(actual).toBe("https://www.youtube.com/watch?v=kAAEGFDNg_w")
  })
  it ("autorFromDescription input2 returns autor", () => {
    let actual = autorFromDescription(input2)
    expect(actual).toBe("Brandon Barger")
  })
  it ("verseFromDescription input1 returns empty", () => {
    let actual = verseFromDescription(input1)
    expect(actual.book).toBe("")
  })
  it ("verseFromDescription input1 returns empty", () => {
    let actual = verseFromDescription(input2)
    expect(actual.book).toBe("John")
    expect(actual.chapter).toBe(15)
    expect(actual.verse).toBe(12)
    expect(actual.to_verse).toBe(17)
    expect(actual.raw).toBe("John 15:12-17")
  })
  it ("verseFromDescription stupid string returns empty", () => {
    let actual = verseFromDescription("input2")
    expect(actual.book).toBe("")
  })
})
