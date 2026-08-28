import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // TMDB Proxy Endpoints
  app.get("/api/tmdb/*", async (req, res) => {
    try {
      const endpoint = req.params[0];
      const queryParams = req.query;
      const apiKey = process.env.TMDB_API_KEY || "0a8bc15ab94b56a8244de54c87c8f661";

      const response = await axios.get(`https://api.themoviedb.org/3/${endpoint}`, {
        params: { ...queryParams, api_key: apiKey },
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("TMDB Proxy Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch from TMDB" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
