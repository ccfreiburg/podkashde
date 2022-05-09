import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from "typeorm";

export async function fillDefaultEnums(db: DataSource) {   
    const list = [
        [   "deutsch",     "de-DE",    "language",  0,  1],
        [   "english",     "en-US",    "language",  0,  2],

        [   "Books",       "Books",    "Arts",     1,  1],
        [   "Design",      "Design",   "Arts",     1,  2],
        [   "Fashion & Beauty","Fashion & Beauty",    "Arts",     1,  3],
        [   "Food",       "Food",    "Arts",     1,  4],
        [   "Performing Arts",       "Performing Arts",    "Arts",     1,  5],
        [   "Visual Arts",       "Visual Arts",    "Arts",     1,  6],
        
        [   "Careers",       "Careers",    "Business",     1,  7],
        [   "Entrepreneurship",       "Entrepreneurship",    "Business",     1,  8],
        [   "Investing",       "Investing",    "Business",     1,  9],
        [   "Management",       "Management",    "Business",     1, 10],
        [   "Marketing",       "Marketing",    "Business",     1,  11],
        [   "Non-profit",       "Non-profit",    "Business",     1, 12],
        
        [   "Comedy Interviews",       "Comedy Interviews",    "Comedy",     1,  13],
        [   "Improv",       "Improv",    "Comedy",     1,  14],
        [   "Standup",       "Standup",    "Comedy",     1,  15],

        [   "Courses",       "Courses",    "Education",     1,  16],
        [   "How to",       "How to",    "Education",     1,  17],
        [   "Language Learning",       "Language Learning",    "Education",     1,  18],
        [   "Self Improvement",       "Self Improvement",    "Education",     1,  19],

        [   "Comedy Fiction",       "Comedy Fiction",    "Fiction",     1,  20],
        [   "Drama",       "Drama",    "Fiction",     1,  21],
        [   "Science Fiction",       "Science Fiction",    "Fiction",     1,  22],
    ];

    return await db.manager.transaction( async (manager) => { 
        await list.forEach(async (item) => {
            const enumerator = new Enumerator();
            enumerator.displaytext = item[0] as string;
            enumerator.shorttext = item[1] as string;
            enumerator.parentCategory = item[2] as string;
            enumerator.enum_id = item[3] as number;
            enumerator.order_id = item[4] as number;
            await manager.save(enumerator);
        })
    })
}

@Entity()
export class Enumerator extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    displaytext: string

    @Column("text")
    shorttext: string

    @Column("text")
    parentCategory: string

    @Column("int")
    enum_id: number

    @Column("int")
    order_id: number
}
