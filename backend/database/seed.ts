import bcrypt from "bcrypt";
import { initializeDatabase, query } from "../src/config/db";

async function seedAdmin() {
  await initializeDatabase();

  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const adminName = "Admin User";
  const adminRole = "admin";

  try {
    // ✅ if already exists, skip
    const existing = await query<any[]>(
      "SELECT id FROM users WHERE email = ?",
      [adminEmail]
    );

    if (existing.length > 0) {
      console.log("✅ Admin already exists. Skipping seed.");
      return;
    }

    const id = "ADMIN_UUID";
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await query(
      "INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)",
      [id, adminEmail, passwordHash, adminName, adminRole]
    );

    console.log("✅ Admin seeded successfully!");
    console.log("📌 Email:", adminEmail);
    console.log("📌 Password:", adminPassword);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  }
}

seedAdmin();
