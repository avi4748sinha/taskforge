import type { Prisma, TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

const taskInclude = {
  project: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } }
} satisfies Prisma.TaskInclude;

export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
  search?: string;
}

export class TaskRepository {
  findTaskById(id: string) {
    return prisma.task.findUnique({ where: { id }, include: taskInclude });
  }

  findMembership(userId: string, projectId: string) {
    return prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } }
    });
  }

  createTask(data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: Date | null;
    assignedToId?: string | null;
    projectId: string;
    createdById: string;
  }) {
    return prisma.task.create({ data, include: taskInclude });
  }

  updateTask(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({ where: { id }, data, include: taskInclude });
  }

  deleteTask(id: string) {
    return prisma.task.delete({ where: { id } });
  }

  getTasksByProject(filters: TaskFilters, limit: number, offset: number) {
    return prisma.task.findMany({
      where: this.buildWhere(filters),
      include: taskInclude,
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset
    });
  }

  countTasksByProject(filters: TaskFilters) {
    return prisma.task.count({ where: this.buildWhere(filters) });
  }

  getTasksByUser(userId: string, limit: number, offset: number) {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: taskInclude,
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset
    });
  }

  countTasksByUser(userId: string) {
    return prisma.task.count({ where: { assignedToId: userId } });
  }

  private buildWhere(filters: TaskFilters): Prisma.TaskWhereInput {
    return {
      projectId: filters.projectId,
      status: filters.status,
      priority: filters.priority,
      assignedToId: filters.assignedToId,
      title: filters.search ? { contains: filters.search, mode: "insensitive" } : undefined
    };
  }
}
