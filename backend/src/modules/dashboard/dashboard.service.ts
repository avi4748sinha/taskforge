import { DashboardRepository } from "./dashboard.repository";

const dashboardRepository = new DashboardRepository();

export class DashboardService {
  async getDashboardStats(userId: string) {
    const [stats, overdueTasks, userTasksSummary] = await Promise.all([
      dashboardRepository.getDashboardStats(userId),
      dashboardRepository.getOverdueTasks(userId),
      dashboardRepository.getUserTasksSummary(userId)
    ]);

    return { stats, overdueTasks, userTasksSummary };
  }
}
