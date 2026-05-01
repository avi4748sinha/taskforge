import type { UserRolePayload } from "./shared";

declare global {
  namespace Express {
    interface Request {
      user?: UserRolePayload;
    }
  }
}
