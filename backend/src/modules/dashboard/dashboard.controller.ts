import type { RequestHandler } from "express";
import { DashboardService } from "./dashboard.service";

const dashboardService = new DashboardService();

export class DashboardController {
  getDashboardStats: RequestHandler = async (req, res, next) => {
    try {
      const dashboard = await dashboardService.getDashboardStats(req.user!.id);
      res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  };
}
