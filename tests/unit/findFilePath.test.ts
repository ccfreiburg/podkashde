import { describe, expect, it } from "vitest";
import { findFile } from "../../server/findFilePath";

describe("DetailValidation", async () => {
  it.skip("Epmty dir returns empty string", () => {
    const actual = findFile("a", "tests/testdata/empty")
    expect(actual).toBe("");    
  })
  it("File in sub dir returns its path", () => {
    const actual = findFile("b.txt", "tests/testdata")
    expect(actual).toBe("tests/testdata/dir1/b.txt");    
  })
  it("File in deeply nested sub dir returns its path", () => {
    const actual = findFile("c.txt", "tests/testdata")
    expect(actual).toBe("tests/testdata/dir2/dir21/dir211/c.txt");    
  })
  it("File not in deeply nested sub dir empty string", () => {
    const actual = findFile("ct", "tests/testdata")
    expect(actual).toBe("");    
  })
})