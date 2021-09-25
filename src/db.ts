import pgPromise from "pg-promise";
import { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise();
const connParam: IConnectionParameters = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 3,
}
const db = pgp(connParam);
export {db};