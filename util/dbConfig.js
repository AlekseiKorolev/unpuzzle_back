require("dotenv").config("../.env");

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const devString = `prostgresql://${process.env.DB_DEV_USER}:${process.env.DB_DEV_PASSWORD}@${process.env.DB_DEV_HOST}:${process.env.DB_DEV_PORT}/${process.env.DB_DEV_DATABASE}`;
const prodString = `prostgresql://${process.env.DB_PROD_USER}:${process.env.DB_PROD_PASSWORD}@${process.env.DB_PROD_HOST}:${process.env.DB_PROD_PORT}/${process.env.DB_PROD_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? prodString : devString
});

module.exports = { pool };
