import type { Paginated, Project, Task, TaskPriority, TaskStatus, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const TOKEN_KEY = "taskforge_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "Request failed");
  return data as T;
}

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<{ user: User; token: string }>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ user: User; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<User>("/auth/me"),
  dashboard: () =>
    request<{
      stats: { totalTasks: number; completedTasks: number; pendingTasks: number; overdueTasks: number };
      overdueTasks: Task[];
      userTasksSummary: { todo: number; inProgress: number; done: number };
    }>("/dashboard"),
  projects: (limit = 20, offset = 0) => request<Paginated<Project>>(`/projects?limit=${limit}&offset=${offset}`),
  createProject: (payload: { name: string; description?: string }) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify(payload) }),
  project: (id: string) => request<Project>(`/projects/${id}`),
  addMember: (projectId: string, email: string) =>
    request(`/projects/${projectId}/add-member`, { method: "POST", body: JSON.stringify({ email }) }),
  removeMember: (projectId: string, email: string) =>
    request(`/projects/${projectId}/remove-member`, { method: "DELETE", body: JSON.stringify({ email }) }),
  tasks: (query: {
    projectId: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedToId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => request<Paginated<Task>>(`/tasks?${new URLSearchParams(cleanQuery(query)).toString()}`),
  userTasks: () => request<Paginated<Task>>("/tasks/user"),
  createTask: (payload: {
    projectId: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string | null;
    assignedToId?: string | null;
  }) => request<Task>("/tasks", { method: "POST", body: JSON.stringify(payload) }),
  updateTask: (id: string, payload: Partial<{ title: string; description: string; priority: TaskPriority; dueDate: string | null; assignedToId: string | null }>) =>
    request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: TaskStatus) =>
    request<Task>(`/tasks/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteTask: (id: string) => request(`/tasks/${id}`, { method: "DELETE" })
};

function cleanQuery(query: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => [key, String(value)])
  );
}
