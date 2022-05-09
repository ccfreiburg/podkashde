import "reflect-metadata";
import { DataSource } from "typeorm";
import { Podcast } from "./entities/Podcast";
import { Enumerator, fillDefaultEnums } from "./entities/Enumerator";

var defaultFilename = "data/podcasts.sqlite"
var dataSource = undefined;

export default async function getDataSource(filename?) {
  if (!dataSource)
    var filepath = defaultFilename;
    if (filename)
      filepath = filename;
    dataSource = new DataSource({
      type: "sqlite",
      database: filepath,
      entities: [Podcast, Enumerator],
      logging: true,
      synchronize: true
    });
  if (dataSource.isInitialized)
    return dataSource;
  else {
    console.log("Initializing Data "+ JSON.stringify(dataSource.options));  
    var ds  = await dataSource.initialize();  
    const german = await ds.manager.findOneBy(Enumerator, {shorttext: "de-DE"})
    if (!german)
      await fillDefaultEnums(ds);
    return ds;
  }
}
