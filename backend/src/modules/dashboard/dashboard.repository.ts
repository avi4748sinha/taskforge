import { TaskStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

export class DashboardRepository {
  async getDashboardStats(userId: string) {
    const now = new Date();
    const taskScope = {
      project: { members: { some: { userId } } }
    };

    const [totalTasks, completedTasks, overdueTasks] = await Promise.all([
      prisma.task.count({ where: taskScope }),
      prisma.task.count({ where: { ...taskScope, status: TaskStatus.DONE } }),
      prisma.task.count({
        where: { ...taskScope, dueDate: { lt: now }, status: { not: TaskStatus.DONE } }
      })
    ]);

    return {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      overdueTasks
    };
  }

  getOverdueTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        project: { members: { some: { userId } } },
        dueDate: { lt: new Date() },
        status: { not: TaskStatus.DONE }
      },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      },
      orderBy: { dueDate: "asc" },
      take: 10
    });
  }

  async getUserTasksSummary(userId: string) {
    const [todo, inProgress, done] = await Promise.all([
      prisma.task.count({ where: { assignedToId: userId, status: TaskStatus.TODO } }),
      prisma.task.count({ where: { assignedToId: userId, status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { assignedToId: userId, status: TaskStatus.DONE } })
    ]);

    return { todo, inProgress, done };
  }
}
