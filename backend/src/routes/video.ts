import { Router } from "express";
import { getVideos, searchVideos, } from "../controllers/video";

const router = Router();

router.get("/", getVideos);
router.get("/search", searchVideos);

export default router;
