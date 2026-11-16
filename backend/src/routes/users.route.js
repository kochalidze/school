import { Router } from "express";
import { getMe, updateMe, deleteMe } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// ყველა ქვემოთ მოცემული როუტი დაცულია ავტორიზაციით
router.use(requireAuth);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.delete("/me", deleteMe);

export default router;