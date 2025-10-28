import express from "express";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";
import cors from "cors"

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors())
// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route (fixes "Cannot GET /" issue)
app.get("/", (_req, res) => {
  res.send("✅ Medical Report AI backend is running");
});

// Register API routes
const startServer = async () => {
  try {
    const server = await registerRoutes(app);

    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();


