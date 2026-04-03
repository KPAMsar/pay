import {Sequelize} from "sequelize-typescript";
import dotenv from 'dotenv';
import models from "@sojipay/models";

dotenv.config();

const dbConnection = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    models: [...models],    
});

export default dbConnection;