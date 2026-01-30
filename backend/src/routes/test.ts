import { Router } from "express";
import { query } from "../config/db";

const router = Router();

router.get("/db", async (req, res) => {
  try {
    const result = await query("SELECT 1 AS dbWorking");
    res.json({ message: "✅ Database connected!", result });
  } catch (err) {
    res.status(500).json({ message: "❌ DB connection failed", error: err });
  }
});

export default router;
