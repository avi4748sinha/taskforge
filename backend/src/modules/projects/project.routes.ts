import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validate";
import { ProjectController } from "./project.controller";
import { createProjectSchema, memberSchema, projectIdSchema } from "./project.validation";

const controller = new ProjectController();
export const projectRoutes = Router();

projectRoutes.use(authMiddleware);
projectRoutes.post("/", validate(createProjectSchema), controller.createProject);
projectRoutes.get("/", controller.getProjectsByUser);
projectRoutes.get("/:id", validate(projectIdSchema), controller.getProjectDetails);
projectRoutes.post("/:id/add-member", validate(memberSchema), controller.addMemberToProject);
projectRoutes.delete("/:id/remove-member", validate(memberSchema), controller.removeMemberFromProject);
