import "reflect-metadata";
import { DataSource } from "typeorm";
import Podcast from "./entities/Podcast";
import Enumerator from "./entities/Enumerator";
import Episode from "./entities/Episode";
import Serie from "./entities/Serie";
import User from "./entities/User";
import Session from "./entities/Session";

var defaultFilename = "public/s/data/podcasts.sqlite";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: defaultFilename,
    entities: [Podcast, Serie, Episode, Enumerator, User, Session],
    logging: false,
    synchronize: true,
  });
