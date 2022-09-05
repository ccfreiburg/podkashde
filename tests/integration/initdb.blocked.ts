import { describe, expect, it, afterEach, beforeEach, beforeAll } from "vitest";
import fs from "fs";
import Enumerator from "../../server/db/entities/Enumerator";
import getDataSource, { setTestDataSource } from "../../server/db/dbsigleton";
import { DataSource } from "typeorm";

// Throws the following error and is therefore disabled
//
// FAIL  tests/integration/initdb.test.ts [ tests/integration/initdb.test.ts ]
// TypeError: Class extends value undefined is not a constructor or null
//  ❯ Object.<anonymous> node_modules/typeorm/connection/Connection.js:12:39
//  ❯ Object.<anonymous> src/index.ts:136:0
//  ❯ Object.<anonymous> node_modules/typeorm/driver/sap/SapDriver.js:4:13
//  ❯ Object.<anonymous> node_modules/typeorm/driver/DriverFactory.js:19:21
//  ❯ Object.<anonymous> node_modules/typeorm/data-source/DataSource.js:9:25
//  ❯ Object.<anonymous> node_modules/typeorm/connection/ConnectionManager.js:4:22
//  ❯ Object.<anonymous> node_modules/typeorm/globals.js:7:29
//  ❯ src/index.ts:9:0
//  ❯ async /home/alex/src/podkashde/node_modules/typeorm/index.mjs:1:256
//  ❯ async /home/alex/src/podkashde/server/db/entities/Enumerator.ts:12:31
//  ❯ async /home/alex/src/podkashde/tests/integration/initdb.test.ts:5:31
//
// it seems there is a problem initializing typeorm
// Observations:
//  - It seems to use SapDriver ???
//  - It happens at Enumerator entity - even when removing BaseEntity as base class
//  - It does not depend on where I init the Datasource
//  - It does not depend on refelct-metadata
//  - It worked in previous version 
//  - Articles indicate that the error has to do with circular refs (but it works in prod)

export const dbTestFileName = "test.sqlite"
export const TstDataSource = new DataSource({
    type: "sqlite",
    database: dbTestFileName,
    entities: [Enumerator],
    logging: true,
    synchronize: true,
  });

describe("init database", async () => {
  beforeAll(()=>{
    setTestDataSource(TstDataSource);
  })
  beforeEach(()=>{
    const existsBefore = fs.existsSync(dbTestFileName);
    expect(existsBefore).toBeFalsy();
  })
  afterEach(async () => {
    if (fs.existsSync(dbTestFileName)) fs.unlinkSync(dbTestFileName);
  });

  it("db file does not exist before init but after", async () => {
    const db = await getDataSource();
    const existsAfter = fs.existsSync(dbTestFileName);
    expect(existsAfter).toBeTruthy();
  });

  it("initialized db file contains Enum Language de-DE", async () => {
    const db = await getDataSource();
    const german = await db.manager.findOneBy(Enumerator, {
      shorttext: "de-DE",
    });
    expect(german).toBeTruthy();
  });

  it("initialize db file twice contains Enum Language de-DE only once", async () => {
    var db = await getDataSource();
    const repo = db.getRepository(Enumerator);
    const german = await repo.find({ where: { shorttext: "de-DE" } });
    expect(german.length).toBe(1);
  });
});
