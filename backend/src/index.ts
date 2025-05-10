import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import videosRouter from "./routes/video";
import { startFetcher } from "./utils/fetcher";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/videos", videosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  startFetcher();
});
