import "reflect-metadata";
import { DataSource, Entity } from "typeorm";
import Podcast from "./entities/Podcast";
import Enumerator from "./entities/Enumerator";
import { fillDefaultEnums, addAdmin } from "./initdata";
import Episode from "./entities/Episode";
import Serie from "./entities/Serie";
import User from "./entities/User";
import Session from "./entities/Session";
import { AppDataSource } from "./datasource";

var dataSource = AppDataSource

export function setAnotherFilename(filename) {
  dataSource = new DataSource({
    type: "sqlite",
    database: filename,
    entities: [Podcast, Serie, Episode, Enumerator, User, Session],
    logging: true,
    synchronize: true,
  });
}

export default async function getDataSource(): Promise<DataSource> {
  if (dataSource.isInitialized) return dataSource;
  else {
    console.log("init db")
    await dataSource.initialize();
    console.log("db initialized")
    await dataSource.runMigrations();
    console.log("db migrated")
    const german = await dataSource.manager.findOneBy(Enumerator, {
      shorttext: "de-DE",
    });
    if (!german) {
      console.log("init enums")
      await fillDefaultEnums(dataSource);
    }
    addAdmin(dataSource);
    return dataSource;
  }
}
