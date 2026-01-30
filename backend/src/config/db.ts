import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export let pool: mysql.Pool;

export const initializeDatabase = async () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "user",
    waitForConnections: true,
    connectionLimit: 10,
  });

  // ✅ test connection
  const [result] = await pool.query("SELECT 1 AS working");
  console.log("✅ Database connected:", result);
};

export const query = async <T = any>(sql: string, values?: any[]) => {
  const [rows] = await pool.query(sql, values);
  return rows as T;
};
