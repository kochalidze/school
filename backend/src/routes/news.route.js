import {Router} from "express";
import {getAllNews, getNewsById, createNews, updateNews, deleteNews} from "../controllers/news.controller.js";
import {requireAuth, requireAdmin} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.post("/", requireAuth, requireAdmin, createNews);
router.patch("/:id", requireAuth, requireAdmin, updateNews);
router.delete("/:id", requireAuth, requireAdmin, deleteNews);

export default router;