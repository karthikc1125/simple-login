import { query } from "./config/db";

async function testDB() {
  const result = await query<any[]>("SELECT 1 AS working");
  console.log("✅ DB Test Result:", result);
}

testDB();
