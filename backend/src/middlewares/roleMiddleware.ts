import type { RequestHandler } from "express";
import { ProjectRole } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export const requireProjectRole = (roles: ProjectRole[]): RequestHandler => {
  return async (req, _res, next) => {
    const userId = req.user?.id;
    const projectId = req.params.id || req.body.projectId || req.query.projectId;

    if (!userId) return next(new AppError(401, "Authentication required"));
    if (typeof projectId !== "string") return next(new AppError(400, "Project id is required"));

    const member = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } }
    });

    if (!member || !roles.includes(member.role)) {
      return next(new AppError(403, "Insufficient project permissions"));
    }

    return next();
  };
};
