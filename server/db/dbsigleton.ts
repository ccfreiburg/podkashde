import "reflect-metadata";
import { DataSource, Entity } from "typeorm";
import Podcast from "./entities/Podcast";
import Enumerator from "./entities/Enumerator";
import fillDefaultEnums from "./initdata";
import Episode from "./entities/Episode";
import Serie from "./entities/Serie";

var defaultFilename = "./server/db/data/podcasts.sqlite";

var dataSource = new DataSource({
  type: "sqlite",
  database: defaultFilename,
  entities: [Podcast, Serie, Episode, Enumerator],
  logging: true,
  synchronize: true,
});

export function setAnotherFilename(filename) {
  dataSource = new DataSource({
    type: "sqlite",
    database: filename,
    entities: [Podcast, Serie, Episode, Enumerator],
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
    const german = await dataSource.manager.findOneBy(Enumerator, {
      shorttext: "de-DE",
    });
    if (!german) {
      console.log("init enums")
      await fillDefaultEnums(dataSource);
    }
    return dataSource;
  }
}
