import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Connected to Nanotech PostgreSQL DB'))
  .catch((err) => console.error('DB connection error', err.stack));

export default client;
