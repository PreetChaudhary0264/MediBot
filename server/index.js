import express from "express";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get directory path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
} else {
  // Root route for local dev
  app.get("/", (_req, res) => {
    res.send("✅ Medical Report AI backend is running (Dev mode)");
  });
}

const startServer = async () => {
  try {
    const server = await registerRoutes(app);
    const PORT = process.env.PORT || 5001;

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
