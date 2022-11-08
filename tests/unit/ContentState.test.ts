import { describe, expect, it } from "vitest";
import { ContentState, hasState, addState } from "../../base/types/ContentState";
describe("ContentState", () => {
  it("hasState of 0 has not Metadata", () => {
    expect(hasState(0, ContentState.metadata)).toBe(false);
  });
  it("hasState of metadata has Metadata", () => {
    expect(hasState(ContentState.metadata, ContentState.metadata)).toBe(true);
  });
  it("hasState of allmeta has Metadata", () => {
    expect(hasState(ContentState.allmeta, ContentState.metadata)).toBe(true);
  });
  it("hasState of metaandfiles does not have images", () => {
    expect(hasState(ContentState.metaandfiles, ContentState.image)).toBe(false);
  });
  it("hasState of all does have all", () => {
    expect(hasState(ContentState.all, ContentState.metadata)).toBe(true);
    expect(hasState(ContentState.all, ContentState.episodes)).toBe(true);
    expect(hasState(ContentState.all, ContentState.allmeta)).toBe(true);
    expect(hasState(ContentState.all, ContentState.image)).toBe(true);
    expect(hasState(ContentState.all, ContentState.metaandimage)).toBe(true);
    expect(hasState(ContentState.all, ContentState.files)).toBe(true);
    expect(hasState(ContentState.all, ContentState.metaandfiles)).toBe(true);
    expect(hasState(ContentState.all, ContentState.all)).toBe(true);
    expect(hasState(ContentState.all, ContentState.draft)).toBe(false);
    expect(hasState(ContentState.all, ContentState.published)).toBe(false);
  });
  it("hasState of draft does not have images", () => {
    expect(hasState(ContentState.draft, ContentState.image)).toBe(false);
  });
  it("addState of draft to 0 is draft", () => {
    expect(addState(0, ContentState.draft)).toBe(ContentState.draft);
  });
  it("addState 0 to draft is draft", () => {
    expect(addState(ContentState.draft, 0)).toBe(ContentState.draft);
  });
  it("addState image to allmeta is metaandimage", () => {
    expect(addState(ContentState.allmeta, ContentState.image)).toBe(ContentState.metaandimage);
  });
  it("addState of metadata to 0 is metadata", () => {
    expect(addState(0, ContentState.metadata)).toBe(ContentState.metadata);
  });
  it("addState allmeta to allmeta is allmeta", () => {
    expect(addState(ContentState.allmeta, ContentState.allmeta)).toBe(ContentState.allmeta);
  });

})
