import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validate";
import { TaskController } from "./task.controller";
import { createTaskSchema, taskIdSchema, updateStatusSchema, updateTaskSchema } from "./task.validation";

const controller = new TaskController();
export const taskRoutes = Router();

taskRoutes.use(authMiddleware);
taskRoutes.post("/", validate(createTaskSchema), controller.createTask);
taskRoutes.get("/", controller.getTasksByProject);
taskRoutes.get("/user", controller.getTasksByUser);
taskRoutes.put("/:id", validate(updateTaskSchema), controller.updateTaskDetails);
taskRoutes.put("/:id/status", validate(updateStatusSchema), controller.updateTaskStatus);
taskRoutes.delete("/:id", validate(taskIdSchema), controller.deleteTask);
