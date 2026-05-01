import type { RequestHandler } from "express";
import { parsePagination } from "../../utils/pagination";
import { ProjectService } from "./project.service";

const projectService = new ProjectService();

export class ProjectController {
  createProject: RequestHandler = async (req, res, next) => {
    try {
      const project = await projectService.createProject(req.user!.id, req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  getProjectsByUser: RequestHandler = async (req, res, next) => {
    try {
      const { limit, offset } = parsePagination(req.query.limit as string, req.query.offset as string);
      const projects = await projectService.getProjectsByUser(req.user!.id, limit, offset);
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  };

  getProjectDetails: RequestHandler = async (req, res, next) => {
    try {
      const project = await projectService.getProjectDetails(req.user!.id, String(req.params.id));
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  };

  addMemberToProject: RequestHandler = async (req, res, next) => {
    try {
      const member = await projectService.addMemberToProject(req.user!.id, String(req.params.id), req.body.email);
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  };

  removeMemberFromProject: RequestHandler = async (req, res, next) => {
    try {
      await projectService.removeMemberFromProject(req.user!.id, String(req.params.id), req.body.email);
      res.status(200).json({ message: "Member removed" });
    } catch (error) {
      next(error);
    }
  };
}
