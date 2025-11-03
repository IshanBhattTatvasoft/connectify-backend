import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '10'),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    migrationsTableName: 'migrations',
    synchronize: process.env.DB_SYNC === 'true',
    migrations: [
        __dirname + '/../migrations/**/*.ts',
        __dirname + '/../seeders/**/*.ts',
    ],
    logging: process.env.DB_LOGGING === 'true',
    subscribers: [],
    schema: 'connectify_schema'
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;