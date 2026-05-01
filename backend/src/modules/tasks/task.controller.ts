import { TaskPriority, TaskStatus } from "@prisma/client";
import type { RequestHandler } from "express";
import { parsePagination } from "../../utils/pagination";
import { TaskService } from "./task.service";

const taskService = new TaskService();

export class TaskController {
  createTask: RequestHandler = async (req, res, next) => {
    try {
      const task = await taskService.createTask(req.user!.id, req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  getTasksByProject: RequestHandler = async (req, res, next) => {
    try {
      const { limit, offset } = parsePagination(req.query.limit as string, req.query.offset as string);
      const tasks = await taskService.getTasksByProject(
        req.user!.id,
        {
          projectId: req.query.projectId as string,
          status: req.query.status as TaskStatus | undefined,
          priority: req.query.priority as TaskPriority | undefined,
          assignedToId: req.query.assignedToId as string | undefined,
          search: req.query.search as string | undefined
        },
        limit,
        offset
      );
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  getTasksByUser: RequestHandler = async (req, res, next) => {
    try {
      const { limit, offset } = parsePagination(req.query.limit as string, req.query.offset as string);
      const tasks = await taskService.getTasksByUser(req.user!.id, limit, offset);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  updateTaskDetails: RequestHandler = async (req, res, next) => {
    try {
      const task = await taskService.updateTaskDetails(req.user!.id, String(req.params.id), req.body);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  updateTaskStatus: RequestHandler = async (req, res, next) => {
    try {
      const task = await taskService.updateTaskStatus(req.user!.id, String(req.params.id), req.body.status);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  deleteTask: RequestHandler = async (req, res, next) => {
    try {
      await taskService.deleteTask(req.user!.id, String(req.params.id));
      res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      next(error);
    }
  };
}
