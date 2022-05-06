import "reflect-metadata";
import { DataSource } from "typeorm";
import { Podcast } from "./Podcast";

const dataSource = new DataSource({
    type: "sqlite",
    database: "data/podcasts.sqlite",
    entities: [Podcast],
    logging: true,
    synchronize: true
})

export default async function getDataSource() {
  if (dataSource.isInitialized)
    return dataSource;
  else {
    console.log("Initializing Data")
    return await dataSource.initialize();
  }
}
