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
// src/routes/videos.ts
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;
    const [videos, total] = yield Promise.all([
        db_1.prisma.video.findMany({
            orderBy: { publishedAt: "desc" },
            skip,
            take: limit,
        }),
        db_1.prisma.video.count(),
    ]);
    res.json({ page, limit, total, videos });
}));
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = (req.query.q || "").toLowerCase();
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;
    const [videos, total] = yield Promise.all([
        db_1.prisma.video.findMany({
            where: {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            },
            orderBy: { publishedAt: "desc" },
            skip,
            take: limit,
        }),
        db_1.prisma.video.count({
            where: {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            },
        }),
    ]);
    res.json({ page, limit, total, videos });
}));
exports.default = router;
