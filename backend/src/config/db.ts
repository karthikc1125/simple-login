import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export let pool: mysql.Pool;
export let isDbConnected = false;

// In-memory fallback storage
export const memoryDb: Map<string, any> = new Map();

// Initialize with demo data
async function initializeMemoryDb() {
  // Demo users with bcrypt-hashed passwords
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);
  
  memoryDb.set("users", new Map([
    ["admin@example.com", { 
      id: "1", 
      email: "admin@example.com", 
      passwordHash: adminPassword, 
      name: "Admin", 
      role: "admin" 
    }],
    ["user@example.com", { 
      id: "2", 
      email: "user@example.com", 
      passwordHash: userPassword, 
      name: "User", 
      role: "user" 
    }],
  ]));
  memoryDb.set("cities", new Map());
  memoryDb.set("blogs", new Map());
  console.log("✅ In-memory database initialized with demo data");
}

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
  try {
    const [result] = await pool.query("SELECT 1 AS working");
    isDbConnected = true;
    console.log("✅ Database connected");
  } catch (error) {
    console.warn("⚠️  Database connection failed, using in-memory storage");
    console.warn("Error:", (error as Error).message);
    isDbConnected = false;
    await initializeMemoryDb();
  }
};

export const query = async <T = any>(sql: string, values?: any[]) => {
  if (!isDbConnected || !pool) {
    const users = memoryDb.get("users") as Map<string, any>;
    
    // Handle SELECT queries
    if (sql.includes("SELECT")) {
      if (sql.includes("WHERE email")) {
        const email = values?.[0];
        if (email && users?.has(email)) {
          return [users.get(email)] as T;
        }
        return [] as T;
      }
      return Array.from(users?.values() || []) as T;
    }
    
    // Handle UPDATE queries (password reset)
    if (sql.includes("UPDATE users SET password_hash")) {
      const passwordHash = values?.[0];
      const email = values?.[1];
      if (email && users?.has(email)) {
        const user = users.get(email);
        user.passwordHash = passwordHash;
        users.set(email, user);
        return [] as T;
      }
      throw new Error("User not found");
    }
    
    // Handle INSERT queries
    if (sql.includes("INSERT INTO users")) {
      const [id, email, passwordHash, name, role] = values || [];
      if (!users) throw new Error("Database not initialized");
      users.set(email, { id, email, passwordHash, name, role });
      return [] as T;
    }
    
    // For other queries, return empty array
    return [] as T;
  }
  const [rows] = await pool.query(sql, values);
  return rows as T;
};
