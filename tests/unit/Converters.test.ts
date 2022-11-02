import { describe, expect, it } from "vitest";
import {
  durationInSecToStr,
  strToDurationInSec,
} from "../../base/Converters";

describe("Converters", async () => {
  it("strToDurationInSec -1 on empty string", () => {
    const actual = strToDurationInSec("");
    expect(actual).toBe(-1);
  });
  it("strToDurationInSec 0 on string containing 0", () => {
    const actual = strToDurationInSec("0");
    expect(actual).toBe(0);
  });
  it("strToDurationInSec with leading zero 0:12 returns sec", () => {
    const actual = strToDurationInSec("0:12");
    expect(actual).toBe(12);
  });
  it("strToDurationInSec with leading zero 0:12 returns sec", () => {
    const actual = strToDurationInSec("10:00");
    expect(actual).toBe(600);
  });
  it("strToDurationInSec with leading 2 2:12 returns sec + 2*60", () => {
    const actual = strToDurationInSec("2:12");
    expect(actual).toBe(132);
  });
  it("strToDurationInSec with hours 1:02:12 returns sec + 3600 + 2*60", () => {
    const actual = strToDurationInSec("1:02:12");
    expect(actual).toBe(3732);
  });
  it("strToDurationInSec with hours 1:00:12 returns sec + 3600 + 2*60", () => {
    const actual = strToDurationInSec("1:00:12");
    expect(actual).toBe(3612);
  });
  it("strToDurationInSec with hours 0 00:10:12 returns 612", () => {
    const actual = strToDurationInSec("0:10:12");
    expect(actual).toBe(612);
  });
  it("strToDurationInSec with hours 0 00:00:12 returns 12", () => {
    const actual = strToDurationInSec("0:00:12");
    expect(actual).toBe(12);
  });
  it("durationInSecToStr with -1 returns empty string", () => {
    const actual = durationInSecToStr(-1);
    expect(actual).toBe("0:00");
  });
  it("durationInSecToStr with 0 returns string 0:00", () => {
    const actual = durationInSecToStr(0);
    expect(actual).toBe("0:00");
  });
  it("durationInSecToStr with 59 returns string 0:59", () => {
    const actual = durationInSecToStr(59);
    expect(actual).toBe("0:59");
  });
  it("durationInSecToStr with 65 returns string 1:05", () => {
    const actual = durationInSecToStr(65);
    expect(actual).toBe("1:05");
  });
  it("durationInSecToStr with 3732 returns string 1:02:12", () => {
    const actual = durationInSecToStr(3732);
    expect(actual).toBe("1:02:12");
  });
  it("durationInSecToStr with 3552 returns string 59:12", () => {
    const actual = durationInSecToStr(3552);
    expect(actual).toBe("59:12");
  });
});
