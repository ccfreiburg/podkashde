import { DataSource } from "typeorm";
import Enumerator, { getEnumerator } from "../entities/Enumerator";
import * as bcrypt from "bcrypt"
import User from "../entities/User";
import { logger } from "./loggerService";
import { DATABASE_FILE, DATABASE_PATH } from "../tools/Configuration";

export default function getRepository(T) { return dataSource.getRepository(T) }
export function getDbManager() { return dataSource.manager }

const appDataSource = new DataSource({
	"type": "sqlite",
	"database": DATABASE_PATH + "/" + DATABASE_FILE,
	"synchronize": true,
	"logging": false,
	"entities": [
		"src/entities/**/*.ts"
	],
	"migrations": [
		"src/migrations/**/*.ts"
	],
	"subscribers": [
		"src/subscribers/**/*.ts"
	],
	// "cli": {
	// 	"entitiesDir": "src/entity",
	// 	"migrationsDir": "src/migration",
	// 	"subscribersDir": "src/subscriber"
	// }
})

export function setTestDataSource(TstDataSource: DataSource) {
    dataSource = TstDataSource
}

var dataSource: DataSource = null

export async function initDataSource(): Promise<DataSource> {
    if (!dataSource)
      dataSource = appDataSource;
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
      await addAdmin(dataSource);
      return dataSource;
    }
  }

async function addAdmin(db: DataSource) {
  const user = await db.manager.find(User, { where: { username: process.env.ADMIN_USER || "Admin" }})
  if (user.length>0)
    return;
  const adminuser = new User();
  adminuser.username= process.env.ADMIN_USER ?? "Admin";
  adminuser.name='Administrator'
  adminuser.email=''
  const salt = bcrypt.genSaltSync(5);
  adminuser.password = bcrypt.hashSync(process.env.ADMIN_PASSWORD ?? "AdminPassword", salt);
  const ret = await db.manager.save(adminuser);
  logger(3,"Created Admin " + adminuser.username)
  return ret
}

async function fillDefaultEnums(db: DataSource) {
  const list = [
    ["deutsch", "de-DE", "language", 0, 1],
    ["english", "en-US", "language", 0, 2],

    ["Books", "Books", "Arts", 1, 1],
    ["Design", "Design", "Arts", 1, 2],
    ["Fashion & Beauty", "Fashion & Beauty", "Arts", 1, 3],
    ["Food", "Food", "Arts", 1, 4],
    ["Performing Arts", "Performing Arts", "Arts", 1, 5],
    ["Visual Arts", "Visual Arts", "Arts", 1, 6],

    ["Careers", "Careers", "Business", 1, 7],
    ["Entrepreneurship", "Entrepreneurship", "Business", 1, 8],
    ["Investing", "Investing", "Business", 1, 9],
    ["Management", "Management", "Business", 1, 10],
    ["Marketing", "Marketing", "Business", 1, 11],
    ["Non-profit", "Non-profit", "Business", 1, 12],

    ["Comedy Interviews", "Comedy Interviews", "Comedy", 1, 13],
    ["Improv", "Improv", "Comedy", 1, 14],
    ["Standup", "Standup", "Comedy", 1, 15],

    ["Courses", "Courses", "Education", 1, 16],
    ["How to", "How to", "Education", 1, 17],
    ["Language Learning", "Language Learning", "Education", 1, 18],
    ["Self Improvement", "Self Improvement", "Education", 1, 19],

    ["Comedy Fiction", "Comedy Fiction", "Fiction", 1, 20],
    ["Drama", "Drama", "Fiction", 1, 21],
    ["Science Fiction", "Science Fiction", "Fiction", 1, 22],

    ["Government", "Government", "Government", 1, 23],
    ["History", "History", "History ", 1, 24],
    ["Alternative Health", "Alternative Health", "Health & Fitness", 1, 25],
    ["Fitness", "Fitness", "Health & Fitness", 1, 26],
    ["Medicine", "Medicine", "Health & Fitness", 1, 27],
    ["Mental Health", "Mental Health", "Health & Fitness", 1, 28],
    ["Nutrition", "Nutrition", "Health & Fitness", 1, 29],
    ["Sexuality", "Sexuality", "Health & Fitness", 1, 30],
    ["Education for Kids", "Education for Kids", "Kids & Family", 1, 31],
    ["Parenting", "Parenting", "Kids & Family", 1, 32],
    ["Pets & Animals", "Pets & Animals", "Kids & Family", 1, 33],
    ["Stories for Kids", "Stories for Kids", "Kids & Family", 1, 34],
    ["Animation & Manga", "Animation & Manga", "Leisure", 1, 35],
    ["Automotive", "Automotive", "Leisure", 1, 36],
    ["Aviation", "Aviation", "Leisure", 1, 37],
    ["Crafts", "Crafts", "Leisure", 1, 38],
    ["Games", "Games", "Leisure", 1, 39],
    ["Hobbies", "Hobbies", "Leisure", 1, 40],
    ["Home & Garden", "Home & Garden", "Leisure", 1, 41],
    ["Video Games", "Video Games", "Leisure", 1, 42],
    ["Music Commentary", "Music Commentary", "Music", 1, 43],
    ["Music History", "Music History", "Music", 1, 44],
    ["Music Interviews", "Music Interviews", "Music", 1, 45],
    ["Business News", "Business News", "News", 1, 46],
    ["Daily News", "Daily News", "News", 1, 47],
    ["Entertainment News", "Entertainment News", "News", 1, 48],
    ["News Commentary", "News Commentary", "News", 1, 49],
    ["Politics", "Politics", "News", 1, 50],
    ["Sports News", "Sports News", "News", 1, 51],
    ["Tech News", "Tech News", "News", 1, 52],
    ["Buddhism", "Buddhism", "Religion & Spirituality", 1, 53],
    ["Christianity", "Christianity", "Religion & Spirituality", 1, 54],
    ["Hinduism", "Hinduism", "Religion & Spirituality", 1, 55],
    ["Islam", "Islam", "Religion & Spirituality", 1, 56],
    ["Judaism", "Judaism", "Religion & Spirituality", 1, 57],
    ["Religion", "Religion", "Religion & Spirituality", 1, 58],
    ["Spirituality", "Spirituality", "Religion & Spirituality", 1, 59],
    ["Astronomy", "Astronomy", "Science", 1, 60],
    ["Chemistry", "Chemistry", "Science", 1, 61],
    ["Earth Sciences", "Earth Sciences", "Science", 1, 62],
    ["Life Sciences", "Life Sciences", "Science", 1, 63],
    ["Mathematics", "Mathematics", "Science", 1, 64],
    ["Natural Sciences", "Natural Sciences", "Science", 1, 65],
    ["Nature", "Nature", "Science", 1, 66],
    ["Physics", "Physics", "Science", 1, 67],
    ["Social Sciences", "Social Sciences", "Science", 1, 68],
    ["Documentary", "Documentary", "Society & Culture", 1, 69],
    ["Personal Journals", "Personal Journals", "Society & Culture", 1, 70],
    ["Philosophy", "Philosophy", "Society & Culture", 1, 71],
    ["Places & Travel", "Places & Travel", "Society & Culture", 1, 72],
    ["Relationships", "Relationships", "Society & Culture", 1, 73],
    ["Baseball", "Baseball", "Sports", 1, 74],
    ["Basketball", "Basketball", "Sports", 1, 75],
    ["Cricket", "Cricket", "Sports", 1, 76],
    ["Fantasy Sports", "Fantasy Sports", "Sports", 1, 77],
    ["Football", "Football", "Sports", 1, 78],
    ["Golf", "Golf", "Sports", 1, 79],
    ["Hockey", "Hockey", "Sports", 1, 80],
    ["Rugby", "Rugby", "Sports", 1, 81],
    ["Running", "Running", "Sports", 1, 82],
    ["Soccer", "Soccer", "Sports", 1, 83],
    ["Swimming", "Swimming", "Sports", 1, 84],
    ["Tennis", "Tennis", "Sports", 1, 85],
    ["Volleyball", "Volleyball", "Sports", 1, 86],
    ["Wilderness", "Wilderness", "Sports", 1, 87],
    ["Wrestling", "Wrestling", "Sports", 1, 88],
    ["Technology", "Technology", "Technology", 1, 89],
    ["True Crime", "True Crime", "True Crime ", 1, 90],
    ["After Shows", "After Shows", "TV & Film", 1, 91],
    ["Film History", "Film History", "TV & Film", 1, 92],
    ["Film Interviews", "Film Interviews", "TV & Film", 1, 93],
    ["Film Reviews", "Film Reviews", "TV & Film", 1, 94],
    ["TV Reviews", "TV Reviews", "TV & Film", 1, 95],

    ["episodic", "episodic", "Type", 2, 1],
    ["series", "series", "Type", 2, 2],

    ["Metadata migrated", "metadata", "State", 3, 1],
    ["Dependent Series migrated", "series", "State", 3, 2],
    ["Dependent Episodes migrated", "episodes", "State", 3, 3],
    ["Metadata and Images migrated", "image", "State", 3, 4],
    ["Metadata and Files migrated", "files", "State", 3, 5],
    ["Draft", "draft", "State", 3, 6],
    ["Published", "published", "State", 3, 7],
  ];

  return await db.manager.transaction(async (manager) => {
    return await manager.save(
      list.map<Enumerator>((item) => {
        logger(3, "Init db Enum "+JSON.stringify(item).substring(0,50))
        return getEnumerator({
          displaytext: item[0] as string,
          shorttext: item[1] as string,
          parentCategory: item[2] as string,
          enumkey_id: item[3] as number,
          enumvalue_id: item[4] as number,
        });
      })
    );
  });
}
