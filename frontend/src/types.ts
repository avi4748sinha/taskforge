export type Role = "ADMIN" | "MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface ProjectMember {
  id: string;
  role: Role;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  members: ProjectMember[];
  tasks?: Task[];
  _count?: { tasks: number };
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  projectId: string;
  createdById: string;
  assignedToId?: string | null;
  project?: { id: string; name: string };
  assignedTo?: User | null;
  createdBy?: User;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
