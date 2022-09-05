import { describe, expect, it } from "vitest";
import {ContentFile} from "../../base/ContentFile"

describe("ContentFile", () => {
    it ("isQualifiedUrl returns false on epty string", () => {
        expect(ContentFile.isQualifiedUrl("")).toBeFalsy()
    })
    it ("isQualifiedUrl returns false on null", () => {
        expect(ContentFile.isQualifiedUrl(null)).toBeFalsy()
    })
    it ("isQualifiedUrl returns false on arbitrary string", () => {
        expect(ContentFile.isQualifiedUrl("lidihkg adh")).toBeFalsy()
    })
    it ("isQualifiedUrl returns false on arbitrary string", () => {
        expect(ContentFile.isQualifiedUrl("lidihkg adh")).toBeFalsy()
    })
    it ("isQualifiedUrl returns true on string starting with http://", () => {
        expect(ContentFile.isQualifiedUrl("http://test")).toBeTruthy()
    })
    it ("isQualifiedUrl returns true on string starting with https://", () => {
        expect(ContentFile.isQualifiedUrl("https://test")).toBeTruthy()
    })
    it ("getFilename returns filename from url", () => {
        expect(ContentFile.getFilename("https://test.de/hallo.txt")).toBe("hallo.txt")
    })

})