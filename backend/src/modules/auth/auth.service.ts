import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { AuthRepository } from "./auth.repository";

const authRepository = new AuthRepository();

function signToken(user: { id: string; email: string }) {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    ...options
  });
}

export class AuthService {
  async registerUser(input: { name: string; email: string; password: string }) {
    const existingUser = await authRepository.findUserByEmail(input.email);
    if (existingUser) throw new AppError(400, "Email is already registered");

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await authRepository.createUser({
      name: input.name,
      email: input.email,
      passwordHash
    });

    return { user, token: signToken(user) };
  }

  async loginUser(input: { email: string; password: string }) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) throw new AppError(401, "Invalid credentials");

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) throw new AppError(401, "Invalid credentials");

    return {
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      token: signToken(user)
    };
  }

  async getCurrentUser(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new AppError(404, "User not found");
    return user;
  }
}
