import { ProjectRole, TaskStatus, type Prisma, type TaskPriority } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import { TaskRepository, type TaskFilters } from "./task.repository";

const taskRepository = new TaskRepository();
const statusOrder = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

export class TaskService {
  async createTask(userId: string, input: {
    projectId: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: Date | null;
    assignedToId?: string | null;
  }) {
    await this.assertMember(userId, input.projectId);
    if (input.assignedToId) {
      await this.assertAdmin(userId, input.projectId);
      await this.assertMember(input.assignedToId, input.projectId);
    }

    return taskRepository.createTask({ ...input, createdById: userId });
  }

  async assignTask(userId: string, taskId: string, assignedToId: string | null) {
    const task = await this.getExistingTask(taskId);
    await this.assertAdmin(userId, task.projectId);
    if (assignedToId) await this.assertMember(assignedToId, task.projectId);

    return taskRepository.updateTask(taskId, {
      assignedTo: assignedToId ? { connect: { id: assignedToId } } : { disconnect: true }
    });
  }

  async updateTaskStatus(userId: string, taskId: string, status: TaskStatus) {
    const task = await this.getExistingTask(taskId);
    const membership = await this.assertMember(userId, task.projectId);
    const isAssigned = task.assignedToId === userId;
    const isAdmin = membership.role === ProjectRole.ADMIN;

    if (!isAssigned && !isAdmin) {
      throw new AppError(403, "Only the assignee or admin can update task status");
    }

    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = statusOrder.indexOf(status);
    if (nextIndex < currentIndex || nextIndex - currentIndex > 1) {
      throw new AppError(400, "Invalid task status flow");
    }

    return taskRepository.updateTask(taskId, { status });
  }

  async updateTaskDetails(userId: string, taskId: string, input: {
    title?: string;
    description?: string | null;
    priority?: TaskPriority;
    dueDate?: Date | null;
    assignedToId?: string | null;
  }) {
    const task = await this.getExistingTask(taskId);
    const membership = await this.assertMember(userId, task.projectId);
    const isAdmin = membership.role === ProjectRole.ADMIN;

    if (task.createdById !== userId && !isAdmin) {
      throw new AppError(403, "Only the creator or admin can edit task details");
    }

    const data: Prisma.TaskUpdateInput = {
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate
    };

    if (input.assignedToId !== undefined) {
      if (!isAdmin) throw new AppError(403, "Only admins can assign tasks");
      if (input.assignedToId) await this.assertMember(input.assignedToId, task.projectId);
      data.assignedTo = input.assignedToId ? { connect: { id: input.assignedToId } } : { disconnect: true };
    }

    return taskRepository.updateTask(taskId, data);
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.getExistingTask(taskId);
    const membership = await this.assertMember(userId, task.projectId);
    if (task.createdById !== userId && membership.role !== ProjectRole.ADMIN) {
      throw new AppError(403, "Only the creator or admin can delete this task");
    }

    await taskRepository.deleteTask(taskId);
  }

  async getTasksByProject(userId: string, filters: TaskFilters, limit: number, offset: number) {
    if (!filters.projectId) throw new AppError(400, "projectId is required");
    await this.assertMember(userId, filters.projectId);

    const [items, total] = await Promise.all([
      taskRepository.getTasksByProject(filters, limit, offset),
      taskRepository.countTasksByProject(filters)
    ]);

    return { items, total, limit, offset };
  }

  async getTasksByUser(userId: string, limit: number, offset: number) {
    const [items, total] = await Promise.all([
      taskRepository.getTasksByUser(userId, limit, offset),
      taskRepository.countTasksByUser(userId)
    ]);

    return { items, total, limit, offset };
  }

  private async getExistingTask(taskId: string) {
    const task = await taskRepository.findTaskById(taskId);
    if (!task) throw new AppError(404, "Task not found");
    return task;
  }

  private async assertMember(userId: string, projectId: string) {
    const membership = await taskRepository.findMembership(userId, projectId);
    if (!membership) throw new AppError(403, "User is not a project member");
    return membership;
  }

  private async assertAdmin(userId: string, projectId: string) {
    const membership = await this.assertMember(userId, projectId);
    if (membership.role !== ProjectRole.ADMIN) throw new AppError(403, "Only admins can assign tasks");
  }
}
