import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME || "", DB_USER || "", DB_PASS || "", {
  host: DB_HOST,
  port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
  dialect: "postgres",
  logging: false, // or true if you want SQL logs in console
});

export default sequelize;
