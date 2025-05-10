"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFetcher = startFetcher;
// src/fetcher.ts
const axios_1 = __importDefault(require("axios"));
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const YT_API_KEYS = process.env.YT_API_KEYS.split(",");
const SEARCH_QUERY = process.env.SEARCH_QUERY || "official";
const FETCH_INTERVAL = 10000;
let keyIndex = 0;
let lastPublishedAt = new Date(0);
function startFetcher() {
    fetchAndStore();
    setInterval(fetchAndStore, FETCH_INTERVAL);
}
function fetchAndStore() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const apiKey = YT_API_KEYS[keyIndex];
        try {
            const response = yield axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    key: apiKey,
                    q: SEARCH_QUERY,
                    type: "video",
                    part: "snippet",
                    order: "date",
                    publishedAfter: lastPublishedAt.toISOString(),
                },
            });
            const items = response.data.items;
            console.log(`Fetched ${items.length} videos`);
            const newVideos = items.map((item) => {
                var _a, _b;
                return ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    publishedAt: new Date(item.snippet.publishedAt),
                    thumbnailUrl: ((_b = (_a = item.snippet.thumbnails) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.url) || "",
                });
            });
            // Upsert videos
            for (const video of newVideos) {
                yield db_1.prisma.video.upsert({
                    where: { id: video.id },
                    update: video,
                    create: video,
                });
            }
            if (newVideos.length > 0) {
                lastPublishedAt = newVideos[0].publishedAt;
            }
        }
        catch (err) {
            if (((_e = (_d = (_c = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.reason) === "quotaExceeded") {
                keyIndex = (keyIndex + 1) % YT_API_KEYS.length;
                console.warn("Quota exceeded. Switching to next API key...");
            }
            else {
                console.error("Error fetching videos:", err.data || err.message);
            }
        }
    });
}
