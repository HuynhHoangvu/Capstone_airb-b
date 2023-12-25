import dotenv from 'dotenv';
dotenv.config();

export default {
    secret_string: process.env.SECRET_STRING,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    PORT:process.env.PORT
};