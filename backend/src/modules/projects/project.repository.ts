import { ProjectRole } from "@prisma/client";
import { prisma } from "../../config/prisma";

export class ProjectRepository {
  createProject(data: { name: string; description?: string; userId: string }) {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        members: { create: { userId: data.userId, role: ProjectRole.ADMIN } }
      },
      include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } }
    });
  }

  getProjectsByUser(userId: string, limit: number, offset: number) {
    return prisma.project.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: true,
        _count: { select: { tasks: true } }
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset
    });
  }

  countProjectsByUser(userId: string) {
    return prisma.project.count({ where: { members: { some: { userId } } } });
  }

  getProjectDetails(projectId: string) {
    return prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "asc" }
        },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true, email: true } },
            createdBy: { select: { id: true, name: true, email: true } }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  findMembership(userId: string, projectId: string) {
    return prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } }
    });
  }

  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  addMemberToProject(projectId: string, userId: string) {
    return prisma.projectMember.create({ data: { projectId, userId, role: ProjectRole.MEMBER } });
  }

  removeMemberFromProject(projectId: string, userId: string) {
    return prisma.projectMember.delete({ where: { userId_projectId: { userId, projectId } } });
  }
}
