import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { DashboardController } from "./dashboard.controller";

const controller = new DashboardController();
export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);
dashboardRoutes.get("/", controller.getDashboardStats);
