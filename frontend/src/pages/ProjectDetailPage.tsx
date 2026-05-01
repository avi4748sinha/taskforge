import { Plus, Search, Trash2, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskCard } from "../components/TaskCard";
import { api } from "../lib/api";
import { useAuth } from "../state/AuthContext";
import type { Project, Task, TaskPriority, TaskStatus } from "../types";

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

export function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [error, setError] = useState("");

  const role = useMemo(() => project?.members.find((member) => member.user.id === user?.id)?.role, [project, user]);
  const isAdmin = role === "ADMIN";

  async function load() {
    if (!id) return;
    const [projectResponse, taskResponse] = await Promise.all([
      api.project(id),
      api.tasks({
        projectId: id,
        search,
        status: status as TaskStatus | undefined,
        priority: priority as TaskPriority | undefined
      })
    ]);
    setProject(projectResponse);
    setTasks(taskResponse.items);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, [id, search, status, priority]);

  async function handleAddMember(event: FormEvent) {
    event.preventDefault();
    if (!id) return;
    await api.addMember(id, memberEmail);
    setMemberEmail("");
    await load();
  }

  async function handleRemoveMember(email: string) {
    if (!id) return;
    await api.removeMember(id, email);
    await load();
  }

  async function handleCreateTask(event: FormEvent) {
    event.preventDefault();
    if (!id) return;
    await api.createTask({
      projectId: id,
      title: taskTitle,
      priority: "MEDIUM",
      assignedToId: assignedToId || null
    });
    setTaskTitle("");
    setAssignedToId("");
    await load();
  }

  async function advanceTask(task: Task) {
    const nextStatus = task.status === "TODO" ? "IN_PROGRESS" : "DONE";
    await api.updateStatus(task.id, nextStatus);
    await load();
  }

  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="panel">Loading project...</div>;

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Project</span>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
      </header>
      <section className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}
          </select>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">All priorities</option>
            {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>
      <section className="two-column">
        <div className="panel">
          <h2>Create task</h2>
          <form className="form" onSubmit={handleCreateTask}>
            <input placeholder="Task title" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} required />
            <select value={assignedToId} onChange={(event) => setAssignedToId(event.target.value)} disabled={!isAdmin}>
              <option value="">Unassigned</option>
              {project.members.map((member) => <option key={member.user.id} value={member.user.id}>{member.user.name}</option>)}
            </select>
            <button className="primary-button"><Plus size={16} /> Add task</button>
          </form>
        </div>
        <div className="panel">
          <h2>Members</h2>
          {isAdmin && (
            <form className="inline-form" onSubmit={handleAddMember}>
              <input type="email" placeholder="Member email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} required />
              <button className="primary-button"><UserPlus size={16} /> Add</button>
            </form>
          )}
          <div className="member-list">
            {project.members.map((member) => (
              <div key={member.id} className="member-row">
                <span>{member.user.name}<small>{member.user.email}</small></span>
                <strong>{member.role}</strong>
                {isAdmin && member.user.id !== user?.id && (
                  <button className="icon-button" onClick={() => handleRemoveMember(member.user.email)} aria-label="Remove member" title="Remove member">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="board">
        {statuses.map((column) => (
          <div className="board-column" key={column}>
            <h2>{column.replace("_", " ")}</h2>
            <div className="task-list">
              {tasks.filter((task) => task.status === column).map((task) => <TaskCard key={task.id} task={task} onAdvance={advanceTask} />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
