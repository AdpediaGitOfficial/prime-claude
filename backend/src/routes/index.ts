import { Router } from "express";
import publicRoutes from "./public.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/api/admin", adminRoutes);
router.use("/", publicRoutes);

export default router;
