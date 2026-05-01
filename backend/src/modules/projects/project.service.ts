import { ProjectRole } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import { ProjectRepository } from "./project.repository";

const projectRepository = new ProjectRepository();

export class ProjectService {
  createProject(userId: string, input: { name: string; description?: string }) {
    return projectRepository.createProject({ ...input, userId });
  }

  async getProjectsByUser(userId: string, limit: number, offset: number) {
    const [items, total] = await Promise.all([
      projectRepository.getProjectsByUser(userId, limit, offset),
      projectRepository.countProjectsByUser(userId)
    ]);

    return { items, total, limit, offset };
  }

  async getProjectDetails(userId: string, projectId: string) {
    const membership = await projectRepository.findMembership(userId, projectId);
    if (!membership) throw new AppError(403, "You are not a member of this project");

    const project = await projectRepository.getProjectDetails(projectId);
    if (!project) throw new AppError(404, "Project not found");
    return project;
  }

  async addMemberToProject(adminId: string, projectId: string, email: string) {
    await this.assertAdmin(adminId, projectId);

    const user = await projectRepository.findUserByEmail(email);
    if (!user) throw new AppError(404, "User not found");

    const existing = await projectRepository.findMembership(user.id, projectId);
    if (existing) throw new AppError(400, "User is already a project member");

    return projectRepository.addMemberToProject(projectId, user.id);
  }

  async removeMemberFromProject(adminId: string, projectId: string, email: string) {
    await this.assertAdmin(adminId, projectId);

    const user = await projectRepository.findUserByEmail(email);
    if (!user) throw new AppError(404, "User not found");
    if (user.id === adminId) throw new AppError(400, "Admin cannot remove themselves");

    const membership = await projectRepository.findMembership(user.id, projectId);
    if (!membership) throw new AppError(404, "Project member not found");

    return projectRepository.removeMemberFromProject(projectId, user.id);
  }

  private async assertAdmin(userId: string, projectId: string) {
    const membership = await projectRepository.findMembership(userId, projectId);
    if (!membership) throw new AppError(403, "You are not a member of this project");
    if (membership.role !== ProjectRole.ADMIN) throw new AppError(403, "Only admins can modify members");
  }
}
