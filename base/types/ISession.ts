import { IUser } from "./IUser";

export default interface ISession {
    id?:        number;
    authToken: string;
    userId?:    number;       
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUser;
  }