/**
 * Server entry point. Starts the HTTP server and listens for requests.
 */
import app from "./app";
import { initializeDatabase } from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

startServer();
