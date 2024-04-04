import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const db = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: 5432,
    ssl: true
});

export default db;