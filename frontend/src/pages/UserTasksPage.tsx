import { useEffect, useState } from "react";
import { TaskCard } from "../components/TaskCard";
import { api } from "../lib/api";
import type { Task } from "../types";

export function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const response = await api.userTasks();
    setTasks(response.items);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function advanceTask(task: Task) {
    const nextStatus = task.status === "TODO" ? "IN_PROGRESS" : "DONE";
    await api.updateStatus(task.id, nextStatus);
    await load();
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Tasks</span>
          <h1>Assigned to me</h1>
        </div>
      </header>
      {error && <div className="error">{error}</div>}
      <section className="task-list">
        {tasks.length === 0 ? <div className="panel">No assigned tasks yet.</div> : tasks.map((task) => <TaskCard key={task.id} task={task} onAdvance={advanceTask} />)}
      </section>
    </div>
  );
}
