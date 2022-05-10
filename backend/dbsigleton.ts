import "reflect-metadata";
import { DataSource } from "typeorm";
import  Podcast from "./entities/Podcast";
import  Enumerator from "./entities/Enumerator";
import  fillDefaultEnums from "./initdata";

var defaultFilename = "data/podcasts.sqlite"

var dataSource = new DataSource({
  type: "sqlite",
  database: defaultFilename,
  entities: [Podcast, Enumerator],
  logging: true,
  synchronize: true
});

export function setAnotherFilename(filename) {
  dataSource = new DataSource({
    type: "sqlite",
    database: filename,
    entities: [Podcast, Enumerator],
    logging: true,
    synchronize: true
  });
}

export default async function getDataSource(): Promise<DataSource> {
  if (dataSource.isInitialized)
    return dataSource;
  else {
    await dataSource.initialize();  
    const german = await dataSource.manager.findOneBy(Enumerator, {shorttext: "de-DE"})
    if (!german)
      await fillDefaultEnums(dataSource);
    return dataSource;
  }
}
