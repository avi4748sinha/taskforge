import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import type { UserRolePayload } from "../types/shared";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(new AppError(401, "Authentication token is required"));
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as UserRolePayload;
    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
};
