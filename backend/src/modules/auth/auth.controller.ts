import type { RequestHandler } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  registerUser: RequestHandler = async (req, res, next) => {
    try {
      const result = await authService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  loginUser: RequestHandler = async (req, res, next) => {
    try {
      const result = await authService.loginUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser: RequestHandler = async (req, res, next) => {
    try {
      const result = await authService.getCurrentUser(req.user!.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
