import { Request, Response } from "express";

import { prisma } from "../utils/db";

export const getVideos = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.video.count(),
    ]);

    res.json({ page, limit, total, videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchVideos = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").trim();
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const offset = (page - 1) * limit;

    const query = `
      SELECT *,
        ts_rank(
          to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')),
          websearch_to_tsquery('english', $1)
        ) AS rank
      FROM "Video"
      WHERE
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) @@ websearch_to_tsquery('english', $1)
        OR title ILIKE '%' || $1 || '%'
        OR description ILIKE '%' || $1 || '%'
      ORDER BY rank DESC NULLS LAST
      LIMIT $2 OFFSET $3;
    `;

    const totalQuery = `
      SELECT COUNT(*) as count
      FROM "Video"
      WHERE
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) @@ websearch_to_tsquery('english', $1)
        OR title ILIKE '%' || $1 || '%'
        OR description ILIKE '%' || $1 || '%';
    `;

    const videos = await prisma.$queryRawUnsafe(query, q, limit, offset);
    const result: any = await prisma.$queryRawUnsafe(totalQuery, q);
    const total = parseInt(result[0]?.count || "0");

    res.status(200).json({ page, limit, total, videos });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
