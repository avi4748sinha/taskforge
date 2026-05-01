import { AlertCircle, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "../components/StatCard";
import { TaskCard } from "../components/TaskCard";
import { api } from "../lib/api";
import type { Task } from "../types";

interface DashboardData {
  stats: { totalTasks: number; completedTasks: number; pendingTasks: number; overdueTasks: number };
  overdueTasks: Task[];
  userTasksSummary: { todo: number; inProgress: number; done: number };
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="panel">Loading dashboard...</div>;

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Team progress at a glance</h1>
        </div>
      </header>
      <section className="stats-grid">
        <StatCard label="Total tasks" value={data.stats.totalTasks} icon={ListChecks} />
        <StatCard label="Completed" value={data.stats.completedTasks} icon={CheckCircle2} />
        <StatCard label="Pending" value={data.stats.pendingTasks} icon={Clock} />
        <StatCard label="Overdue" value={data.stats.overdueTasks} icon={AlertCircle} />
      </section>
      <section className="two-column">
        <div className="panel">
          <h2>My task summary</h2>
          <div className="summary-bars">
            <span>Todo <strong>{data.userTasksSummary.todo}</strong></span>
            <span>In progress <strong>{data.userTasksSummary.inProgress}</strong></span>
            <span>Done <strong>{data.userTasksSummary.done}</strong></span>
          </div>
        </div>
        <div className="panel">
          <h2>Overdue tasks</h2>
          <div className="task-list compact">
            {data.overdueTasks.length === 0 ? <p className="muted">No overdue work.</p> : data.overdueTasks.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
