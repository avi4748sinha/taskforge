import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validate";
import { AuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const controller = new AuthController();
export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), controller.registerUser);
authRoutes.post("/login", validate(loginSchema), controller.loginUser);
authRoutes.get("/me", authMiddleware, controller.getCurrentUser);
