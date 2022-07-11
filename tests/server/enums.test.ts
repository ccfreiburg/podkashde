import { describe, expect, it, afterEach } from "vitest";
import fs from "fs";
import getDataSource, { setAnotherFilename } from "../../backend/dbsigleton";
import Enumerator from "../../backend/entities/Enumerator";

const dbFileName = "./data/testdb.sqlite";

describe("init database", async () => {
  afterEach(async () => {
    if (fs.existsSync(dbFileName)) fs.unlinkSync(dbFileName);
  });

  it("db file does not exist before init but after", async () => {
    setAnotherFilename(dbFileName);
    const existsBefore = fs.existsSync(dbFileName);
    expect(existsBefore).toBeFalsy();
    const db = await getDataSource();
    const existsAfter = fs.existsSync(dbFileName);
    expect(existsAfter).toBeTruthy();
  });

  it("initialized db file contains Enum Language de-DE", async () => {
    setAnotherFilename(dbFileName);
    const existsBefore = fs.existsSync(dbFileName);
    expect(existsBefore).toBeFalsy();
    const db = await getDataSource();
    const german = await db.manager.findOneBy(Enumerator, {
      shorttext: "de-DE",
    });
    expect(german).toBeTruthy();
  });

  it("initialize db file twice contains Enum Language de-DE only once", async () => {
    setAnotherFilename(dbFileName);
    const existsBefore = fs.existsSync(dbFileName);
    expect(existsBefore).toBeFalsy();
    var db = await getDataSource();
    db = await getDataSource();
    const repo = db.getRepository(Enumerator);
    const german = await repo.find({ where: { shorttext: "de-DE" } });
    expect(german.length).toBe(1);
  });
});
