import axios from "axios";
import dotenv from "dotenv";

import { prisma } from "./db";

dotenv.config();

const YT_API_KEYS = process.env.YT_API_KEYS!.split(",");
const SEARCH_QUERY = process.env.SEARCH_QUERY || "official";
const FETCH_INTERVAL = parseInt(process.env.FETCH_INTERVAL || "10000"); // 10 seconds

let keyIndex = 0;
let lastPublishedAt = new Date(0);

export function startFetcher() {
  fetchAndStore();
  setInterval(fetchAndStore, FETCH_INTERVAL);
}

async function fetchAndStore() {
  const apiKey = YT_API_KEYS[keyIndex];
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: apiKey,
          q: SEARCH_QUERY,
          type: "video",
          part: "snippet",
          order: "date",
          publishedAfter: new Date(
            lastPublishedAt.getTime() + 1000
          ).toISOString(),
        },
      }
    );

    const items = response.data.items;
    console.log("Fetched videos:", items.length);
    const newVideos = items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: new Date(item.snippet.publishedAt),
      thumbnailUrl: item.snippet.thumbnails?.default?.url || "",
    }));

    for (const video of newVideos) {
      await prisma.video.upsert({
        where: { id: video.id },
        update: video,
        create: video,
      });
    }

    if (newVideos.length > 0) {
      lastPublishedAt = newVideos.reduce(
        (max: any, v: any) => (v.publishedAt > max ? v.publishedAt : max),
        lastPublishedAt
      );
    }
  } catch (err: any) {
    if (err.response?.data?.error?.errors?.[0]?.reason === "quotaExceeded") {
      keyIndex = (keyIndex + 1) % YT_API_KEYS.length;
      console.warn("Quota exceeded. Switching to next API key...");
    } else {
      console.error("Error fetching videos:", err.data || err.message);
    }
  }
}
