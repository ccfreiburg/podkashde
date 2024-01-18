import "reflect-metadata";
import { DataSource } from "typeorm";
import Enumerator from "./entities/Enumerator";
import { fillDefaultEnums, addAdmin } from "./initdata";
import { AppDataSource } from "./datasource";

var dataSource: DataSource = null

export function setTestDataSource(TstDataSource: DataSource) {
  dataSource = TstDataSource
}

export default async function getDataSource(): Promise<DataSource> {
  if (!dataSource)
    dataSource = AppDataSource;
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
      console.log("init data")
      await fillDefaultEnums(dataSource);
    }
    addAdmin(dataSource);
    return dataSource;
  }
}

